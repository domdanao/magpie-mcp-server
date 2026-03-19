import crypto from 'crypto';
import { Pool } from 'pg';
import { OAuthRegisteredClientsStore } from '@modelcontextprotocol/sdk/server/auth/clients.js';
import { OAuthClientInformationFull } from '@modelcontextprotocol/sdk/shared/auth.js';
import { MerchantKeys } from './clients.js';

export class PgClientsStore implements OAuthRegisteredClientsStore {
  constructor(private pool: Pool) {}

  async getClient(clientId: string): Promise<OAuthClientInformationFull | undefined> {
    const { rows } = await this.pool.query(
      'SELECT client_data FROM oauth_clients WHERE client_id = $1',
      [clientId]
    );
    if (rows.length === 0) return undefined;
    return rows[0].client_data as OAuthClientInformationFull;
  }

  async registerClient(
    client: Omit<OAuthClientInformationFull, 'client_id' | 'client_id_issued_at'>
  ): Promise<OAuthClientInformationFull> {
    const clientId = crypto.randomUUID();
    const clientSecret = crypto.randomBytes(32).toString('hex');

    const fullClient: OAuthClientInformationFull = {
      ...client,
      client_id: clientId,
      client_secret: clientSecret,
      client_id_issued_at: Math.floor(Date.now() / 1000),
      client_secret_expires_at: 0,
    };

    await this.pool.query(
      'INSERT INTO oauth_clients (client_id, client_data) VALUES ($1, $2)',
      [clientId, JSON.stringify(fullClient)]
    );

    return fullClient;
  }

  async setMerchantKeys(clientId: string, keys: MerchantKeys): Promise<void> {
    await this.pool.query(
      `INSERT INTO merchant_keys (client_id, public_key, secret_key)
       VALUES ($1, $2, $3)
       ON CONFLICT (client_id) DO UPDATE SET public_key = $2, secret_key = $3, updated_at = NOW()`,
      [clientId, keys.publicKey, keys.secretKey]
    );
  }

  async getMerchantKeys(clientId: string): Promise<MerchantKeys | undefined> {
    const { rows } = await this.pool.query(
      'SELECT public_key, secret_key FROM merchant_keys WHERE client_id = $1',
      [clientId]
    );
    if (rows.length === 0) return undefined;
    return { publicKey: rows[0].public_key, secretKey: rows[0].secret_key };
  }
}
