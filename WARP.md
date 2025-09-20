# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This repository contains a **Model Context Protocol (MCP) server** for the Magpie Payment Platform APIs. The MCP server exposes all four Magpie payment APIs as tools and resources that AI agents can use to process payments, create checkout sessions, manage payment requests, and handle payment links.

The project is built using TypeScript and includes:

1. **MCP Server Implementation** (`src/`) - TypeScript-based MCP server
2. **API Client** (`src/client/`) - HTTP client for Magpie APIs with authentication
3. **OpenAPI Specifications** (`api-reference/`) - YAML specs for all four APIs:
   - **Checkout API** (`checkout.yaml`) - Handles checkout sessions for payment collection
   - **Payments API** (`payments.yaml`) - Core payment processing with sources and charges
   - **Payment Requests API** (`requests.yaml`) - Invoice-based payment requests
   - **Payment Links API** (`links.yaml`) - Shareable payment links

## API Architecture

### Core Payment Flow
The Magpie payment system follows a two-step process:
1. **Create a Source** - Wraps payment method details (card, wallet, bank account)
2. **Create a Charge** - Uses the source to process the actual payment

### Payment Modes
- **Payment Mode** - One-time payments
- **Setup Mode** - Authorize now, capture later (cards only)
- **Subscription Mode** - Recurring payment setup (cards only)
- **Save Card Mode** - Card vaulting without immediate charge

### Supported Payment Methods
- **card** - Credit/debit cards with 3DS authentication
- **gcash** - GCash digital wallet (Philippines)
- **maya/paymaya** - Maya digital wallet (Philippines)  
- **bpi** - BPI online banking
- **alipay** - Alipay international
- **unionpay** - UnionPay international
- **wechat** - WeChat Pay

## Common Development Tasks

### Building the MCP Server
```bash
# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build

# Start the MCP server in development
npm run dev

# Start the built server
npm start

# Watch mode for development
npm run watch
```

### Environment Configuration
```bash
# Copy example environment file
cp .env.example .env

# Edit environment variables
export MAGPIE_API_KEY="your_api_key"
export MAGPIE_SECRET_KEY="your_secret_key"
export MAGPIE_TEST_MODE="true"
```

### Testing the MCP Server
```bash
# Test MCP server locally (requires MCP client)
echo '{"method": "tools/list"}' | node dist/index.js

# Test with Claude Desktop (add to configuration file)
# ~/Library/Application Support/Claude/claude_desktop_config.json
```

### Validating OpenAPI Specifications
```bash
# Install OpenAPI validator (if not installed)
npm install -g @apidevtools/swagger-cli

# Validate individual API specs
swagger-cli validate api-reference/checkout.yaml
swagger-cli validate api-reference/payments.yaml
swagger-cli validate api-reference/requests.yaml
swagger-cli validate api-reference/links.yaml

# Validate all specs
find api-reference -name "*.yaml" -exec swagger-cli validate {} \;
```

### Linting YAML Files
```bash
# Install yamllint
pip install yamllint

# Lint all YAML files
yamllint api-reference/

# Lint specific file
yamllint api-reference/checkout.yaml
```

## Key API Concepts

### Authentication
All APIs use HTTP Basic Authentication with API keys:
```yaml
security:
  - HTTPBasic: []
```

### Currency Handling
- All amounts are in smallest currency units (e.g., cents for PHP)
- PHP 18.89 = 1889 in API calls
- Supported currency: PHP (Philippine Peso)

### Response Objects
- **Sources**: Represent payment method details (`src_*` prefix)
- **Charges**: Represent payment transactions (`ch_*` prefix)  
- **Sessions**: Represent checkout sessions (`cs_*` prefix)
- **Requests**: Represent payment requests (`pr_*` prefix)
- **Links**: Represent payment links (`plink_*` prefix)

### Status Management
- **Charges**: `pending` → `succeeded` / `failed`
- **Sessions**: `unpaid` → `paid` / `authorized` / `expired`
- **Requests**: `open` → `paid` / `voided`

## Development Guidelines

### Modifying API Specifications
1. Always validate schema changes before committing
2. Ensure backward compatibility when updating existing endpoints
3. Update examples when modifying request/response schemas
4. Test payment flows end-to-end after API changes

### Adding New Payment Methods
When adding support for new payment methods:
1. Update `PaymentMethodType` enum in relevant schemas
2. Add new examples for the payment method
3. Update documentation describing method-specific requirements
4. Consider regional availability and compliance requirements

### Schema Consistency
- Use consistent naming patterns across APIs
- Maintain uniform error response formats
- Keep example data realistic and up-to-date
- Ensure required fields are properly marked

## File Structure

```
.
├── api-reference/           # OpenAPI specifications
│   ├── checkout.yaml       # Checkout Sessions API
│   ├── payments.yaml       # Core Payments API (Sources & Charges)
│   ├── requests.yaml       # Payment Requests API
│   └── links.yaml          # Payment Links API
├── src/                     # TypeScript source code
│   ├── client/             # HTTP client for Magpie APIs
│   │   └── magpie-client.ts
│   ├── tools/              # MCP tool definitions
│   │   └── index.ts
│   ├── resources/          # MCP resource definitions
│   │   └── index.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   └── openapi-parser.ts
│   └── index.ts            # Main MCP server
├── dist/                   # Compiled JavaScript output
├── package.json            # NPM package configuration
├── tsconfig.json           # TypeScript configuration
├── .env.example            # Example environment variables
├── README.md               # Project documentation
└── WARP.md                 # This file
```

### Key Components

- **MCP Server** (`src/index.ts`) - Main server implementation handling MCP protocol
- **API Client** (`src/client/`) - HTTP client with authentication for all Magpie APIs
- **Tools** (`src/tools/`) - MCP tool definitions for each API endpoint
- **Resources** (`src/resources/`) - MCP resources exposing API schemas
- **Types** (`src/types/`) - TypeScript interfaces for all API request/response objects

## Testing Considerations

### Test Data Requirements
- Valid Philippine phone numbers (+639XXXXXXXXX format)
- Test card numbers (4012001037141112 for Visa testing)
- Valid Philippine addresses for billing/shipping
- Realistic merchant and customer information

### Environment Management
- **Test Mode**: `livemode: false` for development/testing
- **Live Mode**: `livemode: true` for production transactions
- Always use test credentials during development