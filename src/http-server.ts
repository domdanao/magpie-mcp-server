#!/usr/bin/env node

import * as dotenv from 'dotenv';
dotenv.config();

import crypto from 'crypto';
import path from 'path';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { mcpAuthRouter } from '@modelcontextprotocol/sdk/server/auth/router.js';
import { requireBearerAuth } from '@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js';
import { JSONRPCMessage } from '@modelcontextprotocol/sdk/types.js';
import { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';

import { createMagpieServer } from './server.js';
import { MagpieOAuthProvider } from './auth/provider.js';
import { PgOAuthProvider } from './auth/pg-provider.js';
import { createPool, initSchema, startTokenCleanup } from './db.js';
import { MagpieConfig } from './types/index.js';
import { MagpieClient } from './client/magpie-client.js';
import { landingPageHTML } from './landing.js';
import { Pool } from 'pg';

// ---------------------------------------------------------------------------
// In-memory EventStore for Streamable HTTP resumability
// ---------------------------------------------------------------------------
interface StoredEvent {
  streamId: string;
  eventId: string;
  message: JSONRPCMessage;
}

class InMemoryEventStore {
  private events: StoredEvent[] = [];

  async storeEvent(streamId: string, message: JSONRPCMessage): Promise<string> {
    const eventId = `${streamId}_${crypto.randomUUID()}`;
    this.events.push({ streamId, eventId, message });
    return eventId;
  }

  async replayEventsAfter(
    lastEventId: string,
    { send }: { send: (eventId: string, message: JSONRPCMessage) => Promise<void> }
  ): Promise<string> {
    // Find the stream ID from the last event ID
    const lastIdx = this.events.findIndex((e) => e.eventId === lastEventId);
    if (lastIdx === -1) {
      throw new Error(`Unknown event ID: ${lastEventId}`);
    }

    const streamId = this.events[lastIdx].streamId;

    // Replay events after the last known one on the same stream
    for (let i = lastIdx + 1; i < this.events.length; i++) {
      if (this.events[i].streamId === streamId) {
        await send(this.events[i].eventId, this.events[i].message);
      }
    }

    return streamId;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const issuerUrl = new URL(process.env.MCP_AUTH_ISSUER_URL || `http://localhost:${PORT}`);
  const tokenExpiry = parseInt(process.env.MCP_AUTH_TOKEN_EXPIRY || '3600', 10);

  // OAuth provider — use PostgreSQL if DATABASE_URL is set, otherwise in-memory
  const databaseUrl = process.env.DATABASE_URL;
  let pool: Pool | undefined;
  let cleanupTimer: NodeJS.Timeout | undefined;
  let oauthProvider: MagpieOAuthProvider | PgOAuthProvider;

  if (databaseUrl) {
    pool = createPool(databaseUrl);
    await initSchema(pool);
    oauthProvider = new PgOAuthProvider(pool, tokenExpiry);
    cleanupTimer = startTokenCleanup(pool);
    console.log('Using PostgreSQL for OAuth storage');
  } else {
    oauthProvider = new MagpieOAuthProvider(tokenExpiry);
    console.log('Using in-memory OAuth storage (no DATABASE_URL set)');
  }

  // Express app
  const app = express();

  // Trust the first proxy (Fly.io) so express-rate-limit reads X-Forwarded-For correctly
  app.set('trust proxy', 1);

  // CORS — expose Mcp-Session-Id for browser-based clients
  app.use(
    cors({
      exposedHeaders: ['Mcp-Session-Id'],
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Static assets (logo, etc.)
  const publicDir = path.resolve(__dirname, '..', 'public');
  app.get('/logo.png', (_req: Request, res: Response) => {
    res.sendFile(path.join(publicDir, 'logo.png'));
  });

  // Landing page
  app.get('/', (_req: Request, res: Response) => {
    res.type('html').send(landingPageHTML());
  });

  // ---------------------------------------------------------------------------
  // Setup & Authorize — handles form submission from the key setup page
  // ---------------------------------------------------------------------------
  app.post('/setup-and-authorize', async (req: Request, res: Response) => {
    const { client_id, public_key, secret_key, redirect_uri, code_challenge, code_challenge_method, state, scope, resource } = req.body;

    // Build the original authorize URL for error redirects
    function redirectWithError(error: string) {
      const authorizeUrl = new URL('/authorize', issuerUrl);
      authorizeUrl.searchParams.set('response_type', 'code');
      authorizeUrl.searchParams.set('client_id', client_id || '');
      authorizeUrl.searchParams.set('redirect_uri', redirect_uri || '');
      authorizeUrl.searchParams.set('code_challenge', code_challenge || '');
      authorizeUrl.searchParams.set('code_challenge_method', code_challenge_method || 'S256');
      if (state) authorizeUrl.searchParams.set('state', state);
      if (scope) authorizeUrl.searchParams.set('scope', scope);
      if (resource) authorizeUrl.searchParams.set('resource', resource);
      authorizeUrl.searchParams.set('setup_error', error);
      res.redirect(authorizeUrl.toString());
    }

    if (!client_id || !public_key || !secret_key || !redirect_uri || !code_challenge) {
      redirectWithError('Missing required fields');
      return;
    }

    // Validate the client exists
    const client = await oauthProvider.clientsStore.getClient(client_id);
    if (!client) {
      redirectWithError('Invalid client');
      return;
    }

    // Validate Magpie API keys
    const testClient = new MagpieClient({
      publicKey: public_key,
      secretKey: secret_key,
      testMode: process.env.MAGPIE_TEST_MODE === 'true',
      paymentsBaseUrl: process.env.MAGPIE_PAYMENTS_BASE_URL || 'https://api.magpie.im',
      checkoutBaseUrl: process.env.MAGPIE_CHECKOUT_BASE_URL || 'https://api.pay.magpie.im',
      requestsBaseUrl: process.env.MAGPIE_REQUESTS_BASE_URL || 'https://request.magpie.im/api',
      linksBaseUrl: process.env.MAGPIE_LINKS_BASE_URL || 'https://buy.magpie.im/api',
    });
    const testResult = await testClient.listCheckoutSessions();
    if (!testResult.success) {
      redirectWithError('Invalid Magpie API keys. Could not authenticate with the Magpie API.');
      return;
    }

    // Save the merchant keys
    await oauthProvider.merchantClientsStore.setMerchantKeys(client_id, {
      publicKey: public_key,
      secretKey: secret_key,
    });

    // Complete the OAuth authorization flow
    const params = {
      redirectUri: redirect_uri,
      codeChallenge: code_challenge,
      state: state || undefined,
      scopes: scope ? scope.split(' ') : [],
      resource: resource ? new URL(resource) : undefined,
    };

    await (oauthProvider as any).generateCodeAndRedirect(client, params, res);
  });

  // Mount OAuth authorization server endpoints at the root
  app.use(
    mcpAuthRouter({
      provider: oauthProvider,
      issuerUrl,
      serviceDocumentationUrl: new URL('https://github.com/domdanao/magpie-mcp-server#readme'),
      scopesSupported: ['mcp:tools', 'mcp:resources'],
      resourceName: 'Magpie MCP Server',
    })
  );

  // Bearer auth middleware for protected MCP endpoints
  const auth = requireBearerAuth({ verifier: oauthProvider });

  // Merchant clients store (for looking up per-merchant Magpie keys)
  const merchantStore = oauthProvider.merchantClientsStore;

  // Helper: build MagpieConfig from a merchant's stored keys
  async function getMerchantConfig(clientId: string): Promise<MagpieConfig | null> {
    const keys = await merchantStore.getMerchantKeys(clientId);
    if (!keys) return null;
    return {
      publicKey: keys.publicKey,
      secretKey: keys.secretKey,
      testMode: process.env.MAGPIE_TEST_MODE === 'true',
      paymentsBaseUrl: process.env.MAGPIE_PAYMENTS_BASE_URL || 'https://api.magpie.im',
      checkoutBaseUrl: process.env.MAGPIE_CHECKOUT_BASE_URL || 'https://api.pay.magpie.im',
      requestsBaseUrl: process.env.MAGPIE_REQUESTS_BASE_URL || 'https://request.magpie.im/api',
      linksBaseUrl: process.env.MAGPIE_LINKS_BASE_URL || 'https://buy.magpie.im/api',
    };
  }

  // ---------------------------------------------------------------------------
  // Merchant keys endpoint — POST /merchant/keys
  // ---------------------------------------------------------------------------
  app.post('/merchant/keys', auth, async (req: Request, res: Response) => {
    const clientId = (req as any).auth?.clientId;
    if (!clientId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { public_key, secret_key } = req.body;
    if (!public_key || !secret_key) {
      res.status(400).json({ error: 'public_key and secret_key are required' });
      return;
    }

    // Validate keys by making a test API call to Magpie
    const testClient = new MagpieClient({
      publicKey: public_key,
      secretKey: secret_key,
      testMode: process.env.MAGPIE_TEST_MODE === 'true',
      paymentsBaseUrl: process.env.MAGPIE_PAYMENTS_BASE_URL || 'https://api.magpie.im',
      checkoutBaseUrl: process.env.MAGPIE_CHECKOUT_BASE_URL || 'https://api.pay.magpie.im',
      requestsBaseUrl: process.env.MAGPIE_REQUESTS_BASE_URL || 'https://request.magpie.im/api',
      linksBaseUrl: process.env.MAGPIE_LINKS_BASE_URL || 'https://buy.magpie.im/api',
    });
    const testResult = await testClient.listCheckoutSessions();
    if (!testResult.success) {
      res.status(400).json({ error: 'Invalid Magpie API keys. Could not authenticate with the Magpie API.' });
      return;
    }

    await merchantStore.setMerchantKeys(clientId, {
      publicKey: public_key,
      secretKey: secret_key,
    });

    res.json({ status: 'ok', validated: true });
  });

  // ---------------------------------------------------------------------------
  // Merchant status endpoint — GET /merchant/status
  // ---------------------------------------------------------------------------
  app.get('/merchant/status', auth, async (req: Request, res: Response) => {
    const clientId = (req as any).auth?.clientId;
    if (!clientId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const keys = await merchantStore.getMerchantKeys(clientId);
    const client = await merchantStore.getClient(clientId);

    res.json({
      client_id: clientId,
      client_name: client?.client_name || null,
      keys_configured: !!keys,
    });
  });

  // ---------------------------------------------------------------------------
  // Session management — shared between both transports
  // ---------------------------------------------------------------------------
  const transports = new Map<string, Transport>();

  function registerTransport(sessionId: string, transport: Transport) {
    transports.set(sessionId, transport);
    transport.onclose = () => {
      transports.delete(sessionId);
    };
  }

  // ---------------------------------------------------------------------------
  // Streamable HTTP transport — POST/GET/DELETE /mcp
  // ---------------------------------------------------------------------------
  app.post('/mcp', auth, async (req: Request, res: Response) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;

    // Reuse existing transport for same session
    if (sessionId && transports.has(sessionId)) {
      const transport = transports.get(sessionId)!;
      if (!(transport instanceof StreamableHTTPServerTransport)) {
        res.status(400).json({ error: 'Session is using a different transport protocol' });
        return;
      }
      await transport.handleRequest(req, res, req.body);
      return;
    }

    // Look up merchant's Magpie keys
    const clientId = (req as any).auth?.clientId;
    const config = await getMerchantConfig(clientId);
    if (!config) {
      res.status(403).json({ error: 'Magpie API keys not configured. POST /merchant/keys first.' });
      return;
    }

    // New session — initialize transport
    const eventStore = new InMemoryEventStore();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => crypto.randomUUID(),
      eventStore,
      onsessioninitialized: (newSessionId) => {
        registerTransport(newSessionId, transport);
      },
    });

    // Create a fresh MCP server with this merchant's keys
    const { server } = createMagpieServer(config);
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  });

  app.get('/mcp', auth, async (req: Request, res: Response) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    if (!sessionId || !transports.has(sessionId)) {
      res.status(400).json({ error: 'Invalid or missing session ID' });
      return;
    }

    const transport = transports.get(sessionId)!;
    if (!(transport instanceof StreamableHTTPServerTransport)) {
      res.status(400).json({ error: 'Session is using a different transport protocol' });
      return;
    }

    await transport.handleRequest(req, res);
  });

  app.delete('/mcp', auth, async (req: Request, res: Response) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    if (!sessionId || !transports.has(sessionId)) {
      res.status(400).json({ error: 'Invalid or missing session ID' });
      return;
    }

    const transport = transports.get(sessionId)!;
    if (!(transport instanceof StreamableHTTPServerTransport)) {
      res.status(400).json({ error: 'Session is using a different transport protocol' });
      return;
    }

    await transport.handleRequest(req, res);
  });

  // ---------------------------------------------------------------------------
  // SSE transport (legacy) — GET /sse + POST /messages
  // ---------------------------------------------------------------------------
  app.get('/sse', auth, async (req: Request, res: Response) => {
    // Look up merchant's Magpie keys
    const clientId = (req as any).auth?.clientId;
    const config = await getMerchantConfig(clientId);
    if (!config) {
      res.status(403).json({ error: 'Magpie API keys not configured. POST /merchant/keys first.' });
      return;
    }

    const transport = new SSEServerTransport('/messages', res);

    registerTransport(transport.sessionId, transport);

    const { server } = createMagpieServer(config);
    await server.connect(transport);
    await transport.start();
  });

  app.post('/messages', auth, async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string | undefined;
    if (!sessionId || !transports.has(sessionId)) {
      res.status(400).json({ error: 'Invalid or missing session ID' });
      return;
    }

    const transport = transports.get(sessionId)!;
    if (!(transport instanceof SSEServerTransport)) {
      res.status(400).json({ error: 'Session is using a different transport protocol' });
      return;
    }

    await transport.handlePostMessage(req, res, req.body);
  });

  // ---------------------------------------------------------------------------
  // Health check
  // ---------------------------------------------------------------------------
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', transport: ['streamable-http', 'sse'] });
  });

  // ---------------------------------------------------------------------------
  // Start server
  // ---------------------------------------------------------------------------
  app.listen(PORT, () => {
    console.log(`Magpie MCP Server (HTTP) listening on port ${PORT}`);
    console.log(`  Streamable HTTP: POST/GET/DELETE http://localhost:${PORT}/mcp`);
    console.log(`  SSE (legacy):    GET http://localhost:${PORT}/sse`);
    console.log(`  OAuth metadata:  http://localhost:${PORT}/.well-known/oauth-authorization-server`);
    console.log(`  Health check:    http://localhost:${PORT}/health`);
  });

  // Graceful shutdown
  const shutdown = async () => {
    console.log('Shutting down...');
    if (cleanupTimer) clearInterval(cleanupTimer);
    for (const [id, transport] of transports) {
      try {
        await transport.close();
      } catch {
        // ignore errors during shutdown
      }
    }
    transports.clear();
    if (pool) await pool.end();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
