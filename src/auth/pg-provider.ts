import crypto from 'crypto';
import { Pool } from 'pg';
import { Response } from 'express';
import {
  OAuthServerProvider,
  AuthorizationParams,
} from '@modelcontextprotocol/sdk/server/auth/provider.js';
import { InvalidTokenError } from '@modelcontextprotocol/sdk/server/auth/errors.js';
import { OAuthRegisteredClientsStore } from '@modelcontextprotocol/sdk/server/auth/clients.js';
import {
  OAuthClientInformationFull,
  OAuthTokens,
  OAuthTokenRevocationRequest,
} from '@modelcontextprotocol/sdk/shared/auth.js';
import { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import { PgClientsStore } from './pg-clients.js';
import { authorizeSetupHTML, authSuccessHTML } from '../onboarding.js';

export class PgOAuthProvider implements OAuthServerProvider {
  private _clientsStore: PgClientsStore;
  private tokenExpirySeconds: number;

  constructor(private pool: Pool, tokenExpirySeconds: number = 3600) {
    this._clientsStore = new PgClientsStore(pool);
    this.tokenExpirySeconds = tokenExpirySeconds;
  }

  get clientsStore(): OAuthRegisteredClientsStore {
    return this._clientsStore;
  }

  get merchantClientsStore(): PgClientsStore {
    return this._clientsStore;
  }

  async authorize(
    client: OAuthClientInformationFull,
    params: AuthorizationParams,
    res: Response
  ): Promise<void> {
    // Check if this client has Magpie keys configured
    const keys = await this._clientsStore.getMerchantKeys(client.client_id);
    if (!keys) {
      // Show key setup page — user must enter Magpie keys before authorizing
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

    await this.generateCodeAndRedirect(client, params, res);
  }

  async generateCodeAndRedirect(
    client: OAuthClientInformationFull,
    params: AuthorizationParams,
    res: Response
  ): Promise<void> {
    const code = crypto.randomBytes(32).toString('hex');

    await this.pool.query(
      `INSERT INTO authorization_codes (code, client_id, code_challenge, redirect_uri, scopes, resource)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        code,
        client.client_id,
        params.codeChallenge,
        params.redirectUri,
        params.scopes || [],
        params.resource?.toString() || null,
      ]
    );

    const redirectUrl = new URL(params.redirectUri);
    redirectUrl.searchParams.set('code', code);
    if (params.state) {
      redirectUrl.searchParams.set('state', params.state);
    }

    res.type('html').send(authSuccessHTML(redirectUrl.toString()));
  }

  async challengeForAuthorizationCode(
    _client: OAuthClientInformationFull,
    authorizationCode: string
  ): Promise<string> {
    const { rows } = await this.pool.query(
      'SELECT code_challenge FROM authorization_codes WHERE code = $1',
      [authorizationCode]
    );
    if (rows.length === 0) {
      throw new Error('Invalid authorization code');
    }
    return rows[0].code_challenge;
  }

  async exchangeAuthorizationCode(
    client: OAuthClientInformationFull,
    authorizationCode: string,
    _codeVerifier?: string,
    _redirectUri?: string,
    resource?: URL
  ): Promise<OAuthTokens> {
    const { rows } = await this.pool.query(
      'DELETE FROM authorization_codes WHERE code = $1 RETURNING client_id, scopes, resource',
      [authorizationCode]
    );
    if (rows.length === 0) {
      throw new Error('Invalid authorization code');
    }

    const record = rows[0];
    if (record.client_id !== client.client_id) {
      throw new Error('Client mismatch');
    }

    const tokenResource = resource || (record.resource ? new URL(record.resource) : undefined);
    return this.issueTokens(client.client_id, record.scopes, tokenResource);
  }

  async exchangeRefreshToken(
    client: OAuthClientInformationFull,
    refreshToken: string,
    scopes?: string[],
    resource?: URL
  ): Promise<OAuthTokens> {
    const { rows } = await this.pool.query(
      'DELETE FROM refresh_tokens WHERE token = $1 RETURNING client_id, scopes, resource',
      [refreshToken]
    );
    if (rows.length === 0) {
      throw new Error('Invalid refresh token');
    }

    const record = rows[0];
    if (record.client_id !== client.client_id) {
      throw new Error('Client mismatch');
    }

    const tokenScopes = scopes || record.scopes;
    const tokenResource = resource || (record.resource ? new URL(record.resource) : undefined);
    return this.issueTokens(client.client_id, tokenScopes, tokenResource);
  }

  async verifyAccessToken(token: string): Promise<AuthInfo> {
    const { rows } = await this.pool.query(
      'SELECT client_id, scopes, expires_at, resource FROM access_tokens WHERE token = $1',
      [token]
    );
    if (rows.length === 0) {
      throw new InvalidTokenError('Invalid access token');
    }

    const record = rows[0];
    const expiresAt = Number(record.expires_at);

    if (Date.now() / 1000 > expiresAt) {
      await this.pool.query('DELETE FROM access_tokens WHERE token = $1', [token]);
      throw new InvalidTokenError('Access token expired');
    }

    return {
      token,
      clientId: record.client_id,
      scopes: record.scopes,
      expiresAt,
      resource: record.resource ? new URL(record.resource) : undefined,
    };
  }

  async revokeToken(
    _client: OAuthClientInformationFull,
    request: OAuthTokenRevocationRequest
  ): Promise<void> {
    await this.pool.query('DELETE FROM access_tokens WHERE token = $1', [request.token]);
    await this.pool.query('DELETE FROM refresh_tokens WHERE token = $1', [request.token]);
  }

  private async issueTokens(clientId: string, scopes: string[], resource?: URL): Promise<OAuthTokens> {
    const accessToken = crypto.randomBytes(32).toString('hex');
    const refreshToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = Math.floor(Date.now() / 1000) + this.tokenExpirySeconds;
    // Refresh tokens last 3x longer than access tokens (90 days if access is 30 days)
    const refreshExpiresAt = expiresAt + this.tokenExpirySeconds * 2;
    const resourceStr = resource?.toString() || null;

    await this.pool.query(
      'INSERT INTO access_tokens (token, client_id, scopes, expires_at, resource) VALUES ($1, $2, $3, $4, $5)',
      [accessToken, clientId, scopes, expiresAt, resourceStr]
    );

    await this.pool.query(
      'INSERT INTO refresh_tokens (token, client_id, scopes, expires_at, resource) VALUES ($1, $2, $3, $4, $5)',
      [refreshToken, clientId, scopes, refreshExpiresAt, resourceStr]
    );

    return {
      access_token: accessToken,
      token_type: 'bearer',
      expires_in: this.tokenExpirySeconds,
      refresh_token: refreshToken,
      scope: scopes.join(' '),
    };
  }
}
