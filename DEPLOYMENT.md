# Magpie MCP Server Deployment Guide

This guide explains how to deploy and use the Magpie MCP Server with various AI clients.

## 🔍 **Understanding MCP Architecture**

The Magpie MCP Server is **NOT a web server**. Instead, it:

- Communicates directly with AI clients (like Claude Desktop) via stdio
- Runs as a child process when the AI client needs it
- Does not require continuous hosting or web server infrastructure
- Operates locally on your machine or server

## 🚀 **Deployment Options**

### **Option 1: Local Installation (Recommended)**

This is the most common approach for integrating with AI clients like Claude Desktop.

#### **Step 1: Build the Server**

```bash
# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build

# Verify the build
ls dist/  # Should show compiled JavaScript files
```

#### **Step 2: Set Up Environment Variables**

Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` with your Magpie API credentials:

```env
MAGPIE_API_KEY=your_actual_api_key_here
MAGPIE_SECRET_KEY=your_actual_secret_key_here
MAGPIE_TEST_MODE=true
```

#### **Step 3: Test the Server Locally**

```bash
# Test with sample MCP request
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node dist/index.js

# Expected response should list all available Magpie payment tools
```

#### **Step 4: Configure Claude Desktop**

1. **Find your Claude Desktop config directory:**
   - **macOS:** `~/Library/Application Support/Claude/`
   - **Windows:** `%APPDATA%\Claude\`
   - **Linux:** `~/.config/Claude/`

2. **Create or edit `claude_desktop_config.json`:**

```json
{
  "mcpServers": {
    "magpie-payments": {
      "command": "node",
      "args": [
        "/Users/dominickdanao/Projects/ai-magpie-mcp/dist/index.js"
      ],
      "env": {
        "MAGPIE_API_KEY": "your_magpie_api_key_here",
        "MAGPIE_SECRET_KEY": "your_magpie_secret_key_here",
        "MAGPIE_TEST_MODE": "true"
      }
    }
  }
}
```

**Important:** Replace the path with the absolute path to your project's `dist/index.js`.

3. **Restart Claude Desktop** - The MCP server will now be available in Claude!

---

### **Option 2: Global Installation**

For easier access from anywhere on your system:

```bash
# Install globally from your project directory
npm install -g .

# Now you can use it from anywhere
magpie-mcp-server

# Update Claude Desktop config to use the global command
{
  "mcpServers": {
    "magpie-payments": {
      "command": "magpie-mcp-server",
      "env": {
        "MAGPIE_API_KEY": "your_magpie_api_key_here",
        "MAGPIE_SECRET_KEY": "your_magpie_secret_key_here",
        "MAGPIE_TEST_MODE": "true"
      }
    }
  }
}
```

---

### **Option 3: Docker Container (Advanced)**

For containerized deployments or CI/CD:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
COPY api-reference/ ./api-reference/
CMD ["node", "dist/index.js"]
```

---

### **Option 4: NPM Package Publication**

To share with others or deploy to npm registry:

```bash
# Update package.json version
npm version patch  # or minor/major

# Login to npm (if not already logged in)
npm login

# Publish to npm registry
npm publish

# Others can then install it globally
npm install -g magpie-mcp-server
```

---

## 🧪 **Testing Your Installation**

### **1. Test MCP Protocol Response**

```bash
# Test tools listing
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node dist/index.js

# Test resources listing  
echo '{"jsonrpc": "2.0", "id": 2, "method": "resources/list"}' | node dist/index.js
```

### **2. Test with Claude Desktop**

1. Open Claude Desktop
2. Type a payment-related query like: "Show me the available Magpie payment tools"
3. Claude should respond with a list of available payment operations

### **3. Test a Payment Operation**

Try creating a test payment source:

```
Create a credit card payment source with the card number 4012001037141112, 
expiry date 12/25, CVC 123, and cardholder name "John Doe"
```

---

## 🔧 **Troubleshooting**

### **Common Issues**

1. **"Command not found" Error**
   - Ensure the path in `claude_desktop_config.json` is absolute and correct
   - Verify the `dist/index.js` file exists after building

2. **"MAGPIE_API_KEY required" Error**
   - Check that environment variables are set in the Claude Desktop config
   - Ensure API keys are valid and not expired

3. **"Module not found" Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Rebuild the project with `npm run build`

4. **Claude Desktop Not Recognizing Server**
   - Restart Claude Desktop after config changes
   - Check the config file syntax is valid JSON
   - Verify the config file is in the correct location

### **Debug Mode**

Add debug logging to see what's happening:

```bash
# Add NODE_ENV=development to see debug output
NODE_ENV=development node dist/index.js
```

---

## 🌍 **Environment Variables**

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MAGPIE_API_KEY` | Yes | Your Magpie API key | `pk_test_...` |
| `MAGPIE_SECRET_KEY` | Yes | Your Magpie secret key | `sk_test_...` |
| `MAGPIE_TEST_MODE` | No | Use test mode (default: true) | `true` or `false` |

---

## 📦 **What's Next?**

Once deployed, you can:

1. **Use in Claude Desktop** - Ask Claude to help with payment operations
2. **Integrate with other MCP clients** - Any MCP-compatible AI client can use your server
3. **Extend functionality** - Add more payment methods or custom business logic
4. **Monitor usage** - Add logging and monitoring as needed

---

## 🔐 **Security Notes**

- **Never commit API keys** to version control
- **Use test mode** for development and testing
- **Store production keys securely** using environment variables or secret management
- **Validate** that you're using the correct API environment (test vs production)