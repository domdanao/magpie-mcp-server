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

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
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

class MagpieMCPServer {
  private server: Server;
  private magpieClient: MagpieClient;
  
  constructor() {
    this.server = new Server(
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

    // Initialize Magpie client with environment variables
    const config: MagpieConfig = {
      publicKey: process.env.MAGPIE_PUBLIC_KEY || '',
      secretKey: process.env.MAGPIE_SECRET_KEY || '',
      testMode: process.env.MAGPIE_TEST_MODE === 'true', // Defaults to false (production)
      paymentsBaseUrl: process.env.MAGPIE_PAYMENTS_BASE_URL || 'https://api.magpie.im',
      checkoutBaseUrl: process.env.MAGPIE_CHECKOUT_BASE_URL || 'https://api.pay.magpie.im',
      requestsBaseUrl: process.env.MAGPIE_REQUESTS_BASE_URL || 'https://request.magpie.im/api',
      linksBaseUrl: process.env.MAGPIE_LINKS_BASE_URL || 'https://buy.magpie.im/api',
    };

    if (!config.publicKey || !config.secretKey) {
      console.error('Error: MAGPIE_PUBLIC_KEY and MAGPIE_SECRET_KEY environment variables are required');
      console.error('');
      console.error('Please ensure these environment variables are set in your Claude Desktop configuration:');
      console.error('');
      console.error('{');
      console.error('  "mcpServers": {');
      console.error('    "magpie": {');
      console.error('      "command": "magpie-mcp-server",');
      console.error('      "env": {');
      console.error('        "MAGPIE_PUBLIC_KEY": "your_public_key_here",');
      console.error('        "MAGPIE_SECRET_KEY": "your_secret_key_here",');
      console.error('        "MAGPIE_TEST_MODE": "false"');
      console.error('      }');
      console.error('    }');
      console.error('  }');
      console.error('}');
      console.error('');
      console.error('Make sure to restart Claude Desktop after updating the configuration.');
      process.exit(1);
    }

    this.magpieClient = new MagpieClient(config);
    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = createMagpieTools();
      return { tools };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      try {
        return await this.handleToolCall(name, args || {});
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
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      const resources = createMagpieResources();
      return { resources };
    });

    // Handle resource reads
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;
      
      try {
        return await this.handleResourceRead(uri);
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
  }

  private async handleToolCall(name: string, args: any) {
    switch (name) {
      // Payment Sources
      case 'create_source':
        const createSourceResult = await this.magpieClient.createSource(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(createSourceResult, null, 2),
            },
          ],
        };

      case 'get_source':
        const getSourceResult = await this.magpieClient.getSource(args.sourceId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(getSourceResult, null, 2),
            },
          ],
        };

      // Payment Charges
      case 'create_charge':
        const createChargeResult = await this.magpieClient.createCharge(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(createChargeResult, null, 2),
            },
          ],
        };

      case 'get_charge':
        const getChargeResult = await this.magpieClient.getCharge(args.chargeId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(getChargeResult, null, 2),
            },
          ],
        };

      case 'list_charges':
        const listChargesResult = await this.magpieClient.listCharges(args.startAfter);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(listChargesResult, null, 2),
            },
          ],
        };

      case 'capture_charge':
        const captureChargeResult = await this.magpieClient.captureCharge(args.chargeId, { amount: args.amount });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(captureChargeResult, null, 2),
            },
          ],
        };

      case 'void_charge':
        const voidChargeResult = await this.magpieClient.voidCharge(args.chargeId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(voidChargeResult, null, 2),
            },
          ],
        };

      case 'refund_charge':
        const refundChargeResult = await this.magpieClient.refundCharge(args.chargeId, { amount: args.amount });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(refundChargeResult, null, 2),
            },
          ],
        };

      // Checkout Sessions
      case 'create_checkout_session':
        const createCheckoutResult = await this.magpieClient.createCheckoutSession(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(createCheckoutResult, null, 2),
            },
          ],
        };

      case 'get_checkout_session':
        const getCheckoutResult = await this.magpieClient.getCheckoutSession(args.sessionId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(getCheckoutResult, null, 2),
            },
          ],
        };

      case 'list_checkout_sessions':
        const listCheckoutResult = await this.magpieClient.listCheckoutSessions();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(listCheckoutResult, null, 2),
            },
          ],
        };

      case 'expire_checkout_session':
        const expireCheckoutResult = await this.magpieClient.expireCheckoutSession(args.sessionId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(expireCheckoutResult, null, 2),
            },
          ],
        };

      case 'capture_checkout_session':
        const captureCheckoutResult = await this.magpieClient.captureCheckoutSession(args.sessionId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(captureCheckoutResult, null, 2),
            },
          ],
        };

      // Payment Requests
      case 'create_payment_request':
        const createRequestResult = await this.magpieClient.createPaymentRequest(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(createRequestResult, null, 2),
            },
          ],
        };

      case 'get_payment_request':
        const getRequestResult = await this.magpieClient.getPaymentRequest(args.requestId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(getRequestResult, null, 2),
            },
          ],
        };

      case 'list_payment_requests':
        const listRequestsResult = await this.magpieClient.listPaymentRequests(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(listRequestsResult, null, 2),
            },
          ],
        };

      case 'void_payment_request':
        const voidRequestResult = await this.magpieClient.voidPaymentRequest(args.requestId, { reason: args.reason });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(voidRequestResult, null, 2),
            },
          ],
        };

      case 'resend_payment_request':
        const resendRequestResult = await this.magpieClient.resendPaymentRequest(args.requestId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(resendRequestResult, null, 2),
            },
          ],
        };

      // Payment Links
      case 'create_payment_link':
        const createLinkResult = await this.magpieClient.createPaymentLink(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(createLinkResult, null, 2),
            },
          ],
        };

      case 'get_payment_link':
        const getLinkResult = await this.magpieClient.getPaymentLink(args.linkId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(getLinkResult, null, 2),
            },
          ],
        };

      case 'list_payment_links':
        const listLinksResult = await this.magpieClient.listPaymentLinks(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(listLinksResult, null, 2),
            },
          ],
        };

      case 'update_payment_link':
        const updateLinkResult = await this.magpieClient.updatePaymentLink(args.linkId, args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(updateLinkResult, null, 2),
            },
          ],
        };

      case 'activate_payment_link':
        const activateLinkResult = await this.magpieClient.activatePaymentLink(args.linkId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(activateLinkResult, null, 2),
            },
          ],
        };

      case 'deactivate_payment_link':
        const deactivateLinkResult = await this.magpieClient.deactivatePaymentLink(args.linkId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(deactivateLinkResult, null, 2),
            },
          ],
        };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  private async handleResourceRead(uri: string) {
    if (uri.startsWith('magpie://api/')) {
      const resourceType = uri.replace('magpie://api/', '');
      const fs = await import('fs');
      
      switch (resourceType) {
        case 'payments/schema':
          const paymentsSchema = fs.readFileSync('./api-reference/payments.yaml', 'utf8');
          return {
            contents: [
              {
                uri,
                mimeType: 'application/x-yaml',
                text: paymentsSchema,
              },
            ],
          };
        
        case 'checkout/schema':
          const checkoutSchema = fs.readFileSync('./api-reference/checkout.yaml', 'utf8');
          return {
            contents: [
              {
                uri,
                mimeType: 'application/x-yaml',
                text: checkoutSchema,
              },
            ],
          };
        
        case 'requests/schema':
          const requestsSchema = fs.readFileSync('./api-reference/requests.yaml', 'utf8');
          return {
            contents: [
              {
                uri,
                mimeType: 'application/x-yaml',
                text: requestsSchema,
              },
            ],
          };
        
        case 'links/schema':
          const linksSchema = fs.readFileSync('./api-reference/links.yaml', 'utf8');
          return {
            contents: [
              {
                uri,
                mimeType: 'application/x-yaml',
                text: linksSchema,
              },
            ],
          };
        
        default:
          throw new Error(`Unknown resource: ${uri}`);
      }
    }
    
    throw new Error(`Invalid resource URI: ${uri}`);
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Magpie MCP Server running on stdio');
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.error('Received SIGINT, shutting down gracefully');
  process.exit(0);
});

// Start the server
const server = new MagpieMCPServer();
server.run().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});