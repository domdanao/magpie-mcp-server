#!/usr/bin/env node

// Load environment variables from .env file if it exists
import * as dotenv from 'dotenv';

// Configure dotenv to be completely silent to avoid interfering with MCP JSON protocol
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalStdoutWrite = process.stdout.write;
const originalStderrWrite = process.stderr.write;

// Temporarily silence all output during dotenv config
console.log = () => {};
console.error = () => {};
process.stdout.write = () => true;
process.stderr.write = () => true;

dotenv.config({ debug: false });

// Restore all output methods
console.log = originalConsoleLog;
console.error = originalConsoleError;
process.stdout.write = originalStdoutWrite;
process.stderr.write = originalStderrWrite;

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMagpieServer, loadMagpieConfig } from './server.js';

async function main(): Promise<void> {
  const config = loadMagpieConfig();
  const { server } = createMagpieServer(config);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Magpie MCP Server running on stdio');
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.error('Received SIGINT, shutting down gracefully');
  process.exit(0);
});

// Start the server
main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
