import crypto from 'crypto';
import { OAuthRegisteredClientsStore } from '@modelcontextprotocol/sdk/server/auth/clients.js';
import { OAuthClientInformationFull } from '@modelcontextprotocol/sdk/shared/auth.js';

export interface MerchantKeys {
  publicKey: string;
  secretKey: string;
}

/**
 * In-memory OAuth client registration store with merchant key storage.
 * For production use, replace with a persistent store (database, Redis, etc.).
 */
export class InMemoryClientsStore implements OAuthRegisteredClientsStore {
  private clients = new Map<string, OAuthClientInformationFull>();
  private merchantKeys = new Map<string, MerchantKeys>();

  getClient(clientId: string): OAuthClientInformationFull | undefined {
    return this.clients.get(clientId);
  }

  registerClient(
    client: Omit<OAuthClientInformationFull, 'client_id' | 'client_id_issued_at'>
  ): OAuthClientInformationFull {
    const clientId = crypto.randomUUID();
    const clientSecret = crypto.randomBytes(32).toString('hex');

    const fullClient: OAuthClientInformationFull = {
      ...client,
      client_id: clientId,
      client_secret: clientSecret,
      client_id_issued_at: Math.floor(Date.now() / 1000),
      client_secret_expires_at: 0, // never expires
    };

    this.clients.set(clientId, fullClient);
    return fullClient;
  }

  setMerchantKeys(clientId: string, keys: MerchantKeys): void {
    this.merchantKeys.set(clientId, keys);
  }

  getMerchantKeys(clientId: string): MerchantKeys | undefined {
    return this.merchantKeys.get(clientId);
  }
}
