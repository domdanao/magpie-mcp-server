#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const magpie_client_js_1 = require("./client/magpie-client.js");
const index_js_2 = require("./tools/index.js");
const index_js_3 = require("./resources/index.js");
class MagpieMCPServer {
    constructor() {
        this.server = new index_js_1.Server({
            name: 'magpie-mcp-server',
            version: '1.0.0',
        }, {
            capabilities: {
                resources: {},
                tools: {},
            },
        });
        // Initialize Magpie client with environment variables
        const config = {
            apiKey: process.env.MAGPIE_API_KEY || '',
            secretKey: process.env.MAGPIE_SECRET_KEY || '',
            testMode: process.env.MAGPIE_TEST_MODE === 'true',
        };
        if (!config.apiKey || !config.secretKey) {
            console.error('Error: MAGPIE_API_KEY and MAGPIE_SECRET_KEY environment variables are required');
            process.exit(1);
        }
        this.magpieClient = new magpie_client_js_1.MagpieClient(config);
        this.setupHandlers();
    }
    setupHandlers() {
        // List available tools
        this.server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
            const tools = (0, index_js_2.createMagpieTools)();
            return { tools };
        });
        // Handle tool calls
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                return await this.handleToolCall(name, args || {});
            }
            catch (error) {
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
        this.server.setRequestHandler(types_js_1.ListResourcesRequestSchema, async () => {
            const resources = (0, index_js_3.createMagpieResources)();
            return { resources };
        });
        // Handle resource reads
        this.server.setRequestHandler(types_js_1.ReadResourceRequestSchema, async (request) => {
            const { uri } = request.params;
            try {
                return await this.handleResourceRead(uri);
            }
            catch (error) {
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
    async handleToolCall(name, args) {
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
    async handleResourceRead(uri) {
        if (uri.startsWith('magpie://api/')) {
            const resourceType = uri.replace('magpie://api/', '');
            const fs = await Promise.resolve().then(() => __importStar(require('fs')));
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
    async run() {
        const transport = new stdio_js_1.StdioServerTransport();
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
//# sourceMappingURL=index.js.map