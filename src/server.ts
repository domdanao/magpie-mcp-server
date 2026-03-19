import * as path from 'path';
import * as fs from 'fs';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { MagpieClient } from './client/magpie-client.js';
import { createMagpieTools } from './tools/index.js';
import { createMagpieResources } from './resources/index.js';
import { MagpieConfig } from './types/index.js';

export interface CreateServerResult {
  server: Server;
  magpieClient: MagpieClient;
}

export function loadMagpieConfig(): MagpieConfig {
  const config: MagpieConfig = {
    publicKey: process.env.MAGPIE_PUBLIC_KEY || '',
    secretKey: process.env.MAGPIE_SECRET_KEY || '',
    testMode: process.env.MAGPIE_TEST_MODE === 'true',
    paymentsBaseUrl: process.env.MAGPIE_PAYMENTS_BASE_URL || 'https://api.magpie.im',
    checkoutBaseUrl: process.env.MAGPIE_CHECKOUT_BASE_URL || 'https://api.pay.magpie.im',
    requestsBaseUrl: process.env.MAGPIE_REQUESTS_BASE_URL || 'https://request.magpie.im/api',
    linksBaseUrl: process.env.MAGPIE_LINKS_BASE_URL || 'https://buy.magpie.im/api',
  };

  if (!config.publicKey || !config.secretKey) {
    console.error('Error: MAGPIE_PUBLIC_KEY and MAGPIE_SECRET_KEY environment variables are required');
    process.exit(1);
  }

  return config;
}

export function createMagpieServer(config: MagpieConfig): CreateServerResult {
  const server = new Server(
    {
      name: 'magpie-mcp-server',
      version: '1.0.0',
    },
    {
      capabilities: {
        resources: {},
        tools: {},
      },
    }
  );

  const magpieClient = new MagpieClient(config);

  // Resolve api-reference path relative to this file's compiled location (dist/)
  const apiRefDir = path.resolve(__dirname, '..', 'api-reference');

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const tools = createMagpieTools();
    return { tools };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      return await handleToolCall(magpieClient, name, args || {});
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Error calling tool ${name}: ${errorMessage}`,
          },
        ],
      };
    }
  });

  // List available resources
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    const resources = createMagpieResources();
    return { resources };
  });

  // Handle resource reads
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;

    try {
      return await handleResourceRead(apiRefDir, uri);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        contents: [
          {
            uri,
            mimeType: 'text/plain',
            text: `Error reading resource: ${errorMessage}`,
          },
        ],
      };
    }
  });

  return { server, magpieClient };
}

async function handleToolCall(magpieClient: MagpieClient, name: string, args: any) {
  const formatResult = (data: any) => ({
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
  });

  switch (name) {
    // Payment Sources
    case 'create_source':
      return formatResult(await magpieClient.createSource(args));
    case 'get_source':
      return formatResult(await magpieClient.getSource(args.sourceId));

    // Payment Charges
    case 'create_charge':
      return formatResult(await magpieClient.createCharge(args));
    case 'get_charge':
      return formatResult(await magpieClient.getCharge(args.chargeId));
    case 'list_charges':
      return formatResult(await magpieClient.listCharges(args.startAfter));
    case 'capture_charge':
      return formatResult(await magpieClient.captureCharge(args.chargeId, { amount: args.amount }));
    case 'void_charge':
      return formatResult(await magpieClient.voidCharge(args.chargeId));
    case 'refund_charge':
      return formatResult(await magpieClient.refundCharge(args.chargeId, { amount: args.amount }));
    case 'verify_charge':
      return formatResult(await magpieClient.verifyCharge(args.chargeId, { confirmation_id: args.confirmation_id, otp: args.otp }));

    // Customers
    case 'create_customer':
      return formatResult(await magpieClient.createCustomer(args));
    case 'get_customer':
      return formatResult(await magpieClient.getCustomer(args.customerId));
    case 'update_customer': {
      const { customerId, ...updateData } = args;
      return formatResult(await magpieClient.updateCustomer(customerId, updateData));
    }
    case 'get_customer_by_email':
      return formatResult(await magpieClient.getCustomerByEmail(args.email));
    case 'attach_source_to_customer':
      return formatResult(await magpieClient.attachSource(args.customerId, { source: args.source }));
    case 'detach_source_from_customer':
      return formatResult(await magpieClient.detachSource(args.customerId, args.sourceId));

    // Checkout Sessions
    case 'create_checkout_session':
      return formatResult(await magpieClient.createCheckoutSession(args));
    case 'get_checkout_session':
      return formatResult(await magpieClient.getCheckoutSession(args.sessionId));
    case 'list_checkout_sessions':
      return formatResult(await magpieClient.listCheckoutSessions());
    case 'expire_checkout_session':
      return formatResult(await magpieClient.expireCheckoutSession(args.sessionId));
    case 'capture_checkout_session':
      return formatResult(await magpieClient.captureCheckoutSession(args.sessionId));

    // Payment Requests
    case 'create_payment_request':
      return formatResult(await magpieClient.createPaymentRequest(args));
    case 'get_payment_request':
      return formatResult(await magpieClient.getPaymentRequest(args.requestId));
    case 'list_payment_requests':
      return formatResult(await magpieClient.listPaymentRequests(args));
    case 'void_payment_request':
      return formatResult(await magpieClient.voidPaymentRequest(args.requestId, { reason: args.reason }));
    case 'resend_payment_request':
      return formatResult(await magpieClient.resendPaymentRequest(args.requestId));

    // Payment Links
    case 'create_payment_link':
      return formatResult(await magpieClient.createPaymentLink(args));
    case 'get_payment_link':
      return formatResult(await magpieClient.getPaymentLink(args.linkId));
    case 'list_payment_links':
      return formatResult(await magpieClient.listPaymentLinks(args));
    case 'update_payment_link':
      return formatResult(await magpieClient.updatePaymentLink(args.linkId, args));
    case 'activate_payment_link':
      return formatResult(await magpieClient.activatePaymentLink(args.linkId));
    case 'deactivate_payment_link':
      return formatResult(await magpieClient.deactivatePaymentLink(args.linkId));

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function handleResourceRead(apiRefDir: string, uri: string) {
  if (!uri.startsWith('magpie://api/')) {
    throw new Error(`Invalid resource URI: ${uri}`);
  }

  const resourceType = uri.replace('magpie://api/', '');

  const schemaMap: Record<string, { file: string; mimeType: string }> = {
    'payments/schema': { file: 'payments.yaml', mimeType: 'application/x-yaml' },
    'checkout/schema': { file: 'checkout.yaml', mimeType: 'application/x-yaml' },
    'requests/schema': { file: 'requests.yaml', mimeType: 'application/x-yaml' },
    'links/schema': { file: 'links.yaml', mimeType: 'application/x-yaml' },
  };

  const schema = schemaMap[resourceType];
  if (!schema) {
    throw new Error(`Unknown resource: ${uri}`);
  }

  const content = fs.readFileSync(path.join(apiRefDir, schema.file), 'utf8');
  return {
    contents: [
      {
        uri,
        mimeType: schema.mimeType,
        text: content,
      },
    ],
  };
}
