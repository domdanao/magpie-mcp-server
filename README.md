# Magpie MCP Server

A Model Context Protocol (MCP) server that gives AI agents access to Magpie Payment Platform APIs. Connect your Magpie account to Claude Desktop, OpenClaw, or any MCP-compatible AI agent to process payments, create checkout sessions, send invoices, and manage payment links through natural conversation.

## Overview

The Magpie MCP Server exposes all four Magpie APIs as AI-ready tools:

| API | What it does |
|-----|-------------|
| **Payments** | Create payment sources, process charges, manage refunds |
| **Checkout Sessions** | Create hosted checkout pages for collecting payments |
| **Payment Requests** | Send invoice-style payment requests via email or SMS |
| **Payment Links** | Create and manage shareable payment links |

### Supported Payment Methods

- **Card** — Credit/debit cards with 3D Secure authentication
- **GCash** — GCash digital wallet (Philippines)
- **Maya / PayMaya** — Maya digital wallet (Philippines)
- **QR PH** — QR PH unified QR code payments (Philippines)
- **Alipay** — Alipay international
- **UnionPay** — UnionPay international
- **WeChat Pay** — WeChat Pay

> Not all payment methods are available on all APIs. See [Payment Methods by API](#payment-methods-by-api) for details.

## Getting Started

There are two ways to connect to the Magpie MCP Server:

### Option A: Hosted Server (Recommended)

Connect to Magpie's hosted MCP server. No installation required — your Magpie API keys are set up securely through an OAuth flow in your browser.

**Requirements:** Node.js 18+ (for `mcp-remote`)

**Claude Desktop configuration:**

Edit your config file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "magpie": {
      "command": "npx",
      "args": ["mcp-remote", "https://magpie-mcp-server.fly.dev/mcp"]
    }
  }
}
```

Restart Claude Desktop. On first launch, your browser will open to complete setup:

1. **Register** — your AI client registers with the server automatically
2. **Enter Magpie API Keys** — paste your Public Key and Secret Key
3. **Authorize** — grant the AI agent access to your Magpie account

That's it. Your keys are stored securely on the server. On future launches, the connection is automatic.

### Option B: Self-Hosted

Run the MCP server locally on your machine. Your API keys are provided as environment variables.

**Requirements:** Node.js 18+, Magpie API credentials

**Claude Desktop configuration:**

```json
{
  "mcpServers": {
    "magpie": {
      "command": "npx",
      "args": ["-y", "magpie-mcp-server"],
      "env": {
        "MAGPIE_PUBLIC_KEY": "your_public_key_here",
        "MAGPIE_SECRET_KEY": "your_secret_key_here"
      }
    }
  }
}
```

Restart Claude Desktop. The server starts automatically.

#### Alternative: Global Install

For faster startup or offline use:

```bash
npm install -g magpie-mcp-server
```

Then use this config:

```json
{
  "mcpServers": {
    "magpie": {
      "command": "magpie-mcp-server",
      "env": {
        "MAGPIE_PUBLIC_KEY": "your_public_key_here",
        "MAGPIE_SECRET_KEY": "your_secret_key_here"
      }
    }
  }
}
```

## Authentication

Magpie uses a dual-key authentication system:

- **Public Key** (`MAGPIE_PUBLIC_KEY`) — Used only for creating payment sources. Safe for client-side use.
- **Secret Key** (`MAGPIE_SECRET_KEY`) — Used for all other operations (charges, checkout, invoices, links). Must be kept secure.

The MCP server automatically uses the right key for each operation.

**Hosted mode:** Your keys are entered once through the browser-based OAuth flow and stored securely on the server. No keys in config files.

**Self-hosted mode:** Keys are provided as environment variables in your Claude Desktop config or a `.env` file.

## Available Tools

The server provides 33 tools organized across 6 categories.

### Payment Sources

| Tool | Description |
|------|-------------|
| `create_source` | Create a payment source (card, gcash, maya, bpi, alipay, unionpay, wechat) |
| `get_source` | Retrieve payment source details by ID |

### Customers

| Tool | Description |
|------|-------------|
| `create_customer` | Create a customer record for recurring charges |
| `get_customer` | Retrieve customer details by ID |
| `update_customer` | Update customer details (mobile, description, metadata) |
| `get_customer_by_email` | Look up a customer by email address |
| `attach_source_to_customer` | Attach a payment source to a customer |
| `detach_source_from_customer` | Remove a payment source from a customer |

### Payment Charges

| Tool | Description |
|------|-------------|
| `create_charge` | Create a payment charge using a source. Amount in cents (e.g., 5000 = PHP 50.00) |
| `get_charge` | Retrieve charge details by ID |
| `list_charges` | List all charges with pagination |
| `capture_charge` | Capture a previously authorized charge |
| `void_charge` | Void an authorized charge before capture |
| `refund_charge` | Refund a captured charge (full or partial) |
| `verify_charge` | Verify a charge using confirmation ID and OTP |

### Checkout Sessions

| Tool | Description |
|------|-------------|
| `create_checkout_session` | Create a hosted checkout page with line items and payment methods |
| `get_checkout_session` | Retrieve checkout session details |
| `list_checkout_sessions` | List all checkout sessions |
| `expire_checkout_session` | Manually expire an active session |
| `capture_checkout_session` | Capture an authorized checkout session |

### Payment Requests

| Tool | Description |
|------|-------------|
| `create_payment_request` | Create an invoice-style payment request sent via email or SMS |
| `get_payment_request` | Retrieve payment request details |
| `list_payment_requests` | List payment requests with status filters (open, paid, voided) |
| `void_payment_request` | Void a payment request with a reason |
| `resend_payment_request` | Resend a payment request to the customer |

### Payment Links

| Tool | Description |
|------|-------------|
| `create_payment_link` | Create a shareable payment link with line items |
| `get_payment_link` | Retrieve payment link details |
| `list_payment_links` | List payment links with status filters (active, deactivated) |
| `update_payment_link` | Update payment link settings |
| `activate_payment_link` | Reactivate a deactivated payment link |
| `deactivate_payment_link` | Deactivate an active payment link |

## Available Resources

The server provides API documentation and OpenAPI schemas that AI agents can read for context:

| URI | Description |
|-----|-------------|
| `magpie://api/payments/schema` | Payments API OpenAPI specification |
| `magpie://api/checkout/schema` | Checkout Sessions API OpenAPI specification |
| `magpie://api/requests/schema` | Payment Requests API OpenAPI specification |
| `magpie://api/links/schema` | Payment Links API OpenAPI specification |
| `magpie://api/documentation` | Comprehensive documentation for all Magpie APIs |

## Payment Methods by API

Not all payment methods are available on every API:

| Method | Payments | Checkout | Requests | Links |
|--------|----------|----------|----------|-------|
| Card | Yes | Yes | Yes | Yes |
| GCash | Yes | Yes | Yes | Yes |
| Maya / PayMaya | Yes | Yes | Yes | Yes |
| BPI | Yes | Yes | — | — |
| Alipay | Yes | Yes | — | — |
| UnionPay | Yes | Yes | — | — |
| WeChat Pay | Yes | Yes | — | — |
| QR PH | Yes | — | — | — |

## Example Usage

Once connected, you can interact with Magpie through natural conversation with your AI agent:

### Create a Checkout Session

> "Create a checkout session for a product called 'Premium Plan' at PHP 999.00. Accept GCash and card payments. Redirect to https://mysite.com/success on completion."

The AI agent will call `create_checkout_session` with the right parameters and return the checkout URL.

### Send a Payment Request

> "Send an invoice to customer@email.com for PHP 2,500.00 for 'Website Design Services'. Send it via email."

The agent will call `create_payment_request` with email delivery and return the payment request details.

### Create a Payment Link

> "Create a payment link for 'Monthly Subscription' at PHP 499.00 per month. Accept card and Maya."

The agent will call `create_payment_link` and return the shareable URL.

### Check Payment Status

> "What's the status of charge chr_abc123?"

The agent will call `get_charge` and report whether the charge is pending, paid, refunded, etc.

### Refund a Payment

> "Refund PHP 200.00 from charge chr_abc123."

The agent will call `refund_charge` with a partial refund amount.

## Configuration Reference

For self-hosted mode, the following environment variables are available:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MAGPIE_PUBLIC_KEY` | Yes | — | Magpie public API key |
| `MAGPIE_SECRET_KEY` | Yes | — | Magpie secret API key |
| `MAGPIE_TEST_MODE` | No | `false` | Enable test mode |
| `MAGPIE_PAYMENTS_BASE_URL` | No | `https://api.magpie.im` | Payments API base URL |
| `MAGPIE_CHECKOUT_BASE_URL` | No | `https://api.pay.magpie.im` | Checkout API base URL |
| `MAGPIE_REQUESTS_BASE_URL` | No | `https://request.magpie.im/api` | Payment Requests API base URL |
| `MAGPIE_LINKS_BASE_URL` | No | `https://buy.magpie.im/api` | Payment Links API base URL |

You can also create a `.env` file in your project directory with these values.

## Troubleshooting

### Claude Desktop doesn't show Magpie tools

- Make sure you restarted Claude Desktop **completely** after updating the config
- Check that the config JSON syntax is valid (no trailing commas, proper quoting)
- For npx: ensure you have internet connectivity on first run
- Check Claude Desktop logs for error messages

### "Command not found" errors

- Verify Node.js 18+ is installed: `node --version`
- For npx issues, try the global install approach instead
- On macOS with NVM, use the full path to npx in the config:
  ```json
  {
    "command": "/Users/yourname/.nvm/versions/node/v22.16.0/bin/npx",
    "args": ["-y", "magpie-mcp-server"],
    "env": {
      "PATH": "/Users/yourname/.nvm/versions/node/v22.16.0/bin:/usr/bin:/bin"
    }
  }
  ```

### Hosted server: OAuth flow not completing

- Delete the cached auth state and retry: `rm -rf ~/.mcp-auth/`
- Check that your browser isn't blocking popups from `localhost`
- Try a different browser if the redirect isn't working

### API authentication errors

- Verify your Magpie API credentials are valid and active
- Check that you're using the correct test/live mode
- For hosted mode: re-enter your keys by deleting `~/.mcp-auth/` and reconnecting

### Payment processing errors

- Amounts are in **cents** (e.g., 5000 = PHP 50.00)
- Check that the payment method is supported for the API you're using
- Enable test mode for development testing
- Review the error message — the server returns specific details from Magpie's API

## License

MIT License — see LICENSE file for details.

## Support

- **MCP Server issues**: [GitHub Issues](https://github.com/domdanao/magpie-mcp-server/issues)
- **Magpie API questions**: [support@magpie.im](mailto:support@magpie.im)
