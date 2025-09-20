# Magpie MCP Server

A Model Context Protocol (MCP) server that provides AI agents with access to Magpie Payment Platform APIs. This server exposes all four core Magpie APIs as MCP tools and resources.

## Overview

The Magpie MCP Server enables AI agents to integrate with Magpie's comprehensive payment processing system, supporting various payment methods including cards, digital wallets (GCash, Maya), and international payment methods (Alipay, UnionPay, WeChat Pay).

### Supported APIs

1. **Payments API** - Core payment processing with sources and charges
2. **Checkout Sessions API** - Hosted checkout sessions for payment collection
3. **Payment Requests API** - Invoice-based payment requests
4. **Payment Links API** - Shareable payment links

## Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Magpie API credentials (API Key and Secret Key)

### Install from npm (when published)

```bash
npm install -g magpie-mcp-server
```

### Build from source

```bash
git clone https://github.com/your-org/magpie-mcp-server
cd magpie-mcp-server
npm install
npm run build
```

## Configuration

The server requires Magpie API credentials to be provided via environment variables:

```bash
export MAGPIE_API_KEY="your_api_key_here"
export MAGPIE_SECRET_KEY="your_secret_key_here"
export MAGPIE_TEST_MODE="true"  # Optional: Use test mode (default: false)
```

### Using with Claude Desktop

Add the server to your Claude Desktop configuration file:

#### macOS
Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "magpie": {
      "command": "magpie-mcp-server",
      "env": {
        "MAGPIE_API_KEY": "your_api_key_here",
        "MAGPIE_SECRET_KEY": "your_secret_key_here",
        "MAGPIE_TEST_MODE": "true"
      }
    }
  }
}
```

#### Windows
Edit `%APPDATA%\\Claude\\claude_desktop_config.json` with the same configuration.

## Available Tools

The MCP server provides the following tools for AI agents:

### Payment Sources
- `create_source` - Create payment sources (cards, wallets, bank accounts)
- `get_source` - Retrieve payment source details

### Payment Charges
- `create_charge` - Create payment charges using sources
- `get_charge` - Retrieve charge details
- `list_charges` - List all charges with pagination
- `capture_charge` - Capture authorized charges
- `void_charge` - Void authorized charges
- `refund_charge` - Refund captured charges

### Checkout Sessions
- `create_checkout_session` - Create hosted checkout sessions
- `get_checkout_session` - Retrieve session details
- `list_checkout_sessions` - List all checkout sessions
- `expire_checkout_session` - Manually expire sessions
- `capture_checkout_session` - Capture authorized sessions

### Payment Requests
- `create_payment_request` - Create invoice-style payment requests
- `get_payment_request` - Retrieve payment request details
- `list_payment_requests` - List payment requests with filters
- `void_payment_request` - Void payment requests
- `resend_payment_request` - Resend payment requests to customers

### Payment Links
- `create_payment_link` - Create shareable payment links
- `get_payment_link` - Retrieve payment link details
- `list_payment_links` - List payment links with filters
- `update_payment_link` - Update payment link settings
- `activate_payment_link` - Activate deactivated links
- `deactivate_payment_link` - Deactivate active links

## Available Resources

The server also provides access to API documentation and schemas:

- `magpie://api/payments/schema` - Payments API OpenAPI specification
- `magpie://api/checkout/schema` - Checkout API OpenAPI specification  
- `magpie://api/requests/schema` - Payment Requests API OpenAPI specification
- `magpie://api/links/schema` - Payment Links API OpenAPI specification

## Example Usage

Once configured, AI agents can use the Magpie tools naturally. Here are some example scenarios:

### Creating a Simple Payment

```
Agent: I need to create a payment for $50.00 using a credit card.

1. First, I'll create a source with the card details
2. Then create a charge using that source
```

### Setting up a Checkout Session

```
Agent: I need to create a checkout session for selling a product worth $25.00.

I'll create a checkout session with the product details and payment methods.
```

### Managing Payment Requests

```
Agent: I need to send an invoice to a customer for $100.00.

I'll create a payment request and send it via email.
```

## Development

### Project Structure

```
src/
├── client/          # HTTP client for Magpie APIs
├── tools/           # MCP tool definitions
├── resources/       # MCP resource definitions  
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── index.ts         # Main server implementation
```

### Development Commands

```bash
# Development mode with hot reload
npm run dev

# Build the project
npm run build

# Start the built server
npm start

# Watch mode for development
npm run watch
```

### API Reference

All tools follow the patterns defined in the Magpie API documentation. Amounts are specified in cents (e.g., 5000 for $50.00 PHP), and all APIs use HTTP Basic Authentication with API keys.

### Payment Methods

The server supports all Magpie payment methods:
- `card` - Credit/debit cards with 3DS authentication
- `gcash` - GCash digital wallet (Philippines)
- `maya` / `paymaya` - Maya digital wallet (Philippines)
- `bpi` - BPI online banking
- `alipay` - Alipay international
- `unionpay` - UnionPay international  
- `wechat` - WeChat Pay

### Error Handling

The server provides comprehensive error handling with structured error responses that include:
- Error type (api_error, network_error, validation_error)
- Human-readable error messages
- HTTP status codes when applicable

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues with the MCP server, please file a GitHub issue. For Magpie API questions, contact Magpie support at support@magpie.im.