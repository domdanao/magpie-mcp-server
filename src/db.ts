import { Pool } from 'pg';

export function createPool(databaseUrl: string): Pool {
  return new Pool({
    connectionString: databaseUrl,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });
}

export async function initSchema(pool: Pool): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS oauth_clients (
      client_id TEXT PRIMARY KEY,
      client_data JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS merchant_keys (
      client_id TEXT PRIMARY KEY REFERENCES oauth_clients(client_id),
      public_key TEXT NOT NULL,
      secret_key TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS authorization_codes (
      code TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      code_challenge TEXT NOT NULL,
      redirect_uri TEXT NOT NULL,
      scopes TEXT[] DEFAULT '{}',
      resource TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS access_tokens (
      token TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      scopes TEXT[] DEFAULT '{}',
      expires_at BIGINT NOT NULL,
      resource TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS refresh_tokens (
      token TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      scopes TEXT[] DEFAULT '{}',
      expires_at BIGINT NOT NULL,
      resource TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}

/**
 * Starts a background job to clean up expired tokens and stale authorization codes.
 * Runs every 60 seconds by default. With 30-day access tokens and 90-day refresh tokens,
 * this prevents the database from accumulating stale credentials.
 */
export function startTokenCleanup(pool: Pool, intervalMs: number = 60_000): NodeJS.Timeout {
  return setInterval(async () => {
    const now = Math.floor(Date.now() / 1000);
    try {
      await pool.query('DELETE FROM access_tokens WHERE expires_at < $1', [now]);
      await pool.query('DELETE FROM refresh_tokens WHERE expires_at < $1', [now]);
      await pool.query(`DELETE FROM authorization_codes WHERE created_at < NOW() - INTERVAL '10 minutes'`);
    } catch {
      // ignore cleanup errors — pool may be shutting down
    }
  }, intervalMs);
}
