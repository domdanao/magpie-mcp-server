import crypto from 'crypto';
import { Response } from 'express';
import {
  OAuthServerProvider,
  AuthorizationParams,
} from '@modelcontextprotocol/sdk/server/auth/provider.js';
import { OAuthRegisteredClientsStore } from '@modelcontextprotocol/sdk/server/auth/clients.js';
import {
  OAuthClientInformationFull,
  OAuthTokens,
  OAuthTokenRevocationRequest,
} from '@modelcontextprotocol/sdk/shared/auth.js';
import { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import { InMemoryClientsStore } from './clients.js';
import { authorizeSetupHTML } from '../onboarding.js';

interface AuthorizationRecord {
  clientId: string;
  codeChallenge: string;
  redirectUri: string;
  scopes: string[];
  resource?: URL;
}

interface TokenRecord {
  clientId: string;
  scopes: string[];
  expiresAt: number;
  resource?: URL;
}

/**
 * In-memory OAuth 2.0 provider implementing the MCP authorization server.
 * For production use, replace in-memory Maps with a persistent store.
 */
export class MagpieOAuthProvider implements OAuthServerProvider {
  private _clientsStore: InMemoryClientsStore;
  private authorizationCodes = new Map<string, AuthorizationRecord>();
  private accessTokens = new Map<string, TokenRecord>();
  private refreshTokens = new Map<string, TokenRecord>();
  private tokenExpirySeconds: number;

  constructor(tokenExpirySeconds: number = 3600) {
    this._clientsStore = new InMemoryClientsStore();
    this.tokenExpirySeconds = tokenExpirySeconds;
  }

  get clientsStore(): OAuthRegisteredClientsStore {
    return this._clientsStore;
  }

  get merchantClientsStore(): InMemoryClientsStore {
    return this._clientsStore;
  }

  async authorize(
    client: OAuthClientInformationFull,
    params: AuthorizationParams,
    res: Response
  ): Promise<void> {
    // Check if this client has Magpie keys configured
    const keys = this._clientsStore.getMerchantKeys(client.client_id);
    if (!keys) {
      res.type('html').send(authorizeSetupHTML({
        clientId: client.client_id,
        clientName: client.client_name,
        redirectUri: params.redirectUri,
        codeChallenge: params.codeChallenge,
        state: params.state,
        scope: params.scopes?.join(' '),
        resource: params.resource?.toString(),
      }));
      return;
    }

    this.generateCodeAndRedirect(client, params, res);
  }

  generateCodeAndRedirect(
    client: OAuthClientInformationFull,
    params: AuthorizationParams,
    res: Response
  ): void {
    const code = crypto.randomBytes(32).toString('hex');

    this.authorizationCodes.set(code, {
      clientId: client.client_id,
      codeChallenge: params.codeChallenge,
      redirectUri: params.redirectUri,
      scopes: params.scopes || [],
      resource: params.resource,
    });

    // Build redirect URL with authorization code
    const redirectUrl = new URL(params.redirectUri);
    redirectUrl.searchParams.set('code', code);
    if (params.state) {
      redirectUrl.searchParams.set('state', params.state);
    }

    res.redirect(redirectUrl.toString());
  }

  async challengeForAuthorizationCode(
    _client: OAuthClientInformationFull,
    authorizationCode: string
  ): Promise<string> {
    const record = this.authorizationCodes.get(authorizationCode);
    if (!record) {
      throw new Error('Invalid authorization code');
    }
    return record.codeChallenge;
  }

  async exchangeAuthorizationCode(
    client: OAuthClientInformationFull,
    authorizationCode: string,
    _codeVerifier?: string,
    _redirectUri?: string,
    resource?: URL
  ): Promise<OAuthTokens> {
    const record = this.authorizationCodes.get(authorizationCode);
    if (!record) {
      throw new Error('Invalid authorization code');
    }
    if (record.clientId !== client.client_id) {
      throw new Error('Client mismatch');
    }

    // Consume the authorization code (one-time use)
    this.authorizationCodes.delete(authorizationCode);

    return this.issueTokens(client.client_id, record.scopes, resource || record.resource);
  }

  async exchangeRefreshToken(
    client: OAuthClientInformationFull,
    refreshToken: string,
    scopes?: string[],
    resource?: URL
  ): Promise<OAuthTokens> {
    const record = this.refreshTokens.get(refreshToken);
    if (!record) {
      throw new Error('Invalid refresh token');
    }
    if (record.clientId !== client.client_id) {
      throw new Error('Client mismatch');
    }

    // Consume the old refresh token
    this.refreshTokens.delete(refreshToken);

    const tokenScopes = scopes || record.scopes;
    return this.issueTokens(client.client_id, tokenScopes, resource || record.resource);
  }

  async verifyAccessToken(token: string): Promise<AuthInfo> {
    const record = this.accessTokens.get(token);
    if (!record) {
      throw new Error('Invalid access token');
    }

    if (Date.now() / 1000 > record.expiresAt) {
      this.accessTokens.delete(token);
      throw new Error('Access token expired');
    }

    return {
      token,
      clientId: record.clientId,
      scopes: record.scopes,
      expiresAt: record.expiresAt,
      resource: record.resource,
    };
  }

  async revokeToken(
    _client: OAuthClientInformationFull,
    request: OAuthTokenRevocationRequest
  ): Promise<void> {
    this.accessTokens.delete(request.token);
    this.refreshTokens.delete(request.token);
  }

  private issueTokens(clientId: string, scopes: string[], resource?: URL): OAuthTokens {
    const accessToken = crypto.randomBytes(32).toString('hex');
    const refreshToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = Math.floor(Date.now() / 1000) + this.tokenExpirySeconds;

    this.accessTokens.set(accessToken, {
      clientId,
      scopes,
      expiresAt,
      resource,
    });

    this.refreshTokens.set(refreshToken, {
      clientId,
      scopes,
      expiresAt: expiresAt + this.tokenExpirySeconds * 24, // refresh token lasts 24x longer
      resource,
    });

    return {
      access_token: accessToken,
      token_type: 'bearer',
      expires_in: this.tokenExpirySeconds,
      refresh_token: refreshToken,
      scope: scopes.join(' '),
    };
  }
}
