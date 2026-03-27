export function landingPageHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Magpie MCP Server</title>
<meta name="description" content="Connect AI agents to Magpie Payment Platform APIs via the Model Context Protocol. Process payments, create checkouts, send invoices, and manage payment links through natural conversation.">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#0b3a8f">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0d1117;
    --bg-raised: #161b22;
    --bg-code: #1c2128;
    --border: #30363d;
    --text: #e6edf3;
    --text-dim: #8b949e;
    --text-dimmer: #6e7681;
    --accent: #7c3aed;
    --accent-soft: rgba(124, 58, 237, 0.15);
    --green: #3fb950;
    --green-soft: rgba(63, 185, 80, 0.15);
    --blue: #58a6ff;
    --orange: #d29922;
    --pink: #f778ba;
    --mono: 'SF Mono', 'Cascadia Code', 'Fira Code', 'JetBrains Mono', Consolas, monospace;
    --sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  body {
    font-family: var(--sans);
    background: var(--bg);
    color: var(--text);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  a { color: var(--blue); text-decoration: none; }
  a:hover { text-decoration: underline; }

  .container { max-width: 860px; margin: 0 auto; padding: 0 24px; }

  /* Hero */
  .hero {
    padding: 80px 0 48px;
    text-align: center;
  }
  .hero-logo {
    width: 80px;
    height: 80px;
    border-radius: 20px;
    margin-bottom: 20px;
  }
  .hero-badge {
    display: inline-block;
    font-family: var(--mono);
    font-size: 0.75rem;
    color: var(--accent);
    background: var(--accent-soft);
    padding: 4px 12px;
    border-radius: 20px;
    margin-bottom: 20px;
    letter-spacing: 0.05em;
  }
  .hero h1 {
    font-size: 2.5rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    margin-bottom: 12px;
  }
  @media (max-width: 600px) { .hero h1 { font-size: 1.8rem; } }
  .hero p {
    font-size: 1.15rem;
    color: var(--text-dim);
    max-width: 580px;
    margin: 0 auto 32px;
  }
  .hero-links {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .hero-links a {
    font-family: var(--mono);
    font-size: 0.85rem;
    color: var(--text-dim);
    padding: 8px 16px;
    border: 1px solid var(--border);
    border-radius: 8px;
    transition: border-color 0.15s, color 0.15s;
  }
  .hero-links a:hover {
    border-color: var(--text-dim);
    color: var(--text);
    text-decoration: none;
  }

  /* Sections */
  section { padding: 40px 0; }
  section h2 {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 20px;
    color: var(--text);
  }
  section h2 .dim { color: var(--text-dimmer); font-weight: 400; }

  /* Code block */
  .code-block {
    position: relative;
    background: var(--bg-code);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
  }
  .code-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    border-bottom: 1px solid var(--border);
    font-family: var(--mono);
    font-size: 0.75rem;
    color: var(--text-dimmer);
  }
  .copy-btn {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-dim);
    padding: 4px 10px;
    border-radius: 6px;
    font-family: var(--mono);
    font-size: 0.7rem;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }
  .copy-btn:hover { border-color: var(--text-dim); color: var(--text); }
  .code-body {
    padding: 16px;
    overflow-x: auto;
    font-family: var(--mono);
    font-size: 0.85rem;
    line-height: 1.6;
    tab-size: 2;
  }
  .code-body pre { margin: 0; }

  /* Syntax colors */
  .syn-key { color: var(--blue); }
  .syn-str { color: #a5d6ff; }
  .syn-punc { color: var(--text-dimmer); }
  .syn-comment { color: var(--text-dimmer); font-style: italic; }

  /* Steps */
  .steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    margin-top: 8px;
  }
  .step {
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 20px;
  }
  .step-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--accent-soft);
    color: var(--accent);
    font-family: var(--mono);
    font-size: 0.8rem;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .step h3 { font-size: 0.95rem; font-weight: 600; margin-bottom: 6px; }
  .step p { font-size: 0.85rem; color: var(--text-dim); line-height: 1.5; }

  /* Tools table */
  .tools-grid {
    display: grid;
    gap: 12px;
  }
  .tool-category {
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
  }
  .tool-category-header {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    font-weight: 600;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .tool-count {
    font-family: var(--mono);
    font-size: 0.7rem;
    color: var(--text-dimmer);
    background: var(--bg);
    padding: 2px 8px;
    border-radius: 10px;
  }
  .tool-list {
    padding: 8px 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .tool-tag {
    font-family: var(--mono);
    font-size: 0.75rem;
    color: var(--text-dim);
    background: var(--bg);
    padding: 4px 10px;
    border-radius: 6px;
    border: 1px solid var(--border);
  }

  /* Payment methods matrix */
  .matrix-wrap { overflow-x: auto; }
  .matrix {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
  }
  .matrix th, .matrix td {
    padding: 10px 14px;
    border: 1px solid var(--border);
    text-align: center;
  }
  .matrix th {
    background: var(--bg-raised);
    font-weight: 600;
    font-size: 0.8rem;
    color: var(--text-dim);
  }
  .matrix td:first-child {
    text-align: left;
    font-weight: 500;
    white-space: nowrap;
  }
  .matrix .yes {
    color: var(--green);
    font-family: var(--mono);
    font-size: 0.8rem;
  }
  .matrix .no {
    color: var(--text-dimmer);
    font-size: 0.75rem;
  }

  /* Self-hosted section */
  .alt-install {
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 20px;
    margin-top: 16px;
  }
  .alt-install h3 { font-size: 0.95rem; margin-bottom: 8px; }
  .alt-install p { font-size: 0.85rem; color: var(--text-dim); margin-bottom: 12px; }
  .inline-code {
    font-family: var(--mono);
    font-size: 0.8rem;
    background: var(--bg-code);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 12px 16px;
    display: block;
    color: var(--text);
    overflow-x: auto;
  }

  /* FAQ */
  .faq-list { display: grid; gap: 12px; }
  .faq-item {
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
  }
  .faq-q {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.9rem;
    color: var(--text);
    user-select: none;
    transition: background 0.1s;
  }
  .faq-q:hover { background: var(--bg-code); }
  .faq-q::before {
    content: '+';
    font-family: var(--mono);
    font-size: 1rem;
    color: var(--text-dimmer);
    flex-shrink: 0;
    width: 20px;
    text-align: center;
    transition: transform 0.15s;
  }
  .faq-item.open .faq-q::before { content: '\\2212'; }
  .faq-a {
    display: none;
    padding: 0 16px 16px 46px;
    font-size: 0.85rem;
    color: var(--text-dim);
    line-height: 1.6;
  }
  .faq-item.open .faq-a { display: block; }
  .faq-a code {
    font-family: var(--mono);
    font-size: 0.8em;
    background: var(--bg-code);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 2px 6px;
  }
  .faq-a pre {
    background: var(--bg-code);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 12px 14px;
    margin: 8px 0;
    font-family: var(--mono);
    font-size: 0.8rem;
    overflow-x: auto;
    line-height: 1.5;
  }
  .faq-a p { margin-bottom: 8px; }
  .faq-a p:last-child { margin-bottom: 0; }

  /* Footer */
  footer {
    padding: 40px 0;
    border-top: 1px solid var(--border);
    margin-top: 40px;
  }
  .footer-links {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
    justify-content: center;
    font-family: var(--mono);
    font-size: 0.8rem;
  }
  .footer-links a { color: var(--text-dimmer); }
  .footer-links a:hover { color: var(--text); text-decoration: none; }
  .footer-note {
    text-align: center;
    font-size: 0.75rem;
    color: var(--text-dimmer);
    margin-top: 16px;
  }
</style>
</head>
<body>

<div class="container">
  <!-- Hero -->
  <div class="hero">
    <img src="/logo.png" alt="Magpie" class="hero-logo">
    <br>
    <div class="hero-badge">MODEL CONTEXT PROTOCOL</div>
    <h1>Magpie MCP Server</h1>
    <p>Connect AI agents to the Magpie Payment Platform. Process payments, create checkouts, send invoices, and manage payment links through natural conversation.</p>
    <div class="hero-links">
      <a href="https://github.com/domdanao/magpie-mcp-server">GitHub</a>
      <a href="https://www.npmjs.com/package/magpie-mcp-server">npm</a>
      <a href="/.well-known/oauth-authorization-server">OAuth Metadata</a>
      <a href="/health">Health</a>
    </div>
  </div>

  <!-- Quick Start -->
  <section>
    <h2>Quick Start</h2>
    <p style="color: var(--text-dim); font-size: 0.9rem; margin-bottom: 16px;">Add this to your Claude Desktop config and restart. No installation needed.</p>
    <div class="code-block">
      <div class="code-header">
        <span>claude_desktop_config.json</span>
        <button class="copy-btn" onclick="copyConfig(this)">Copy</button>
      </div>
      <div class="code-body"><pre><span class="syn-punc">{</span>
  <span class="syn-key">"mcpServers"</span><span class="syn-punc">:</span> <span class="syn-punc">{</span>
    <span class="syn-key">"magpie"</span><span class="syn-punc">:</span> <span class="syn-punc">{</span>
      <span class="syn-key">"command"</span><span class="syn-punc">:</span> <span class="syn-str">"npx"</span><span class="syn-punc">,</span>
      <span class="syn-key">"args"</span><span class="syn-punc">:</span> <span class="syn-punc">[</span><span class="syn-str">"mcp-remote"</span><span class="syn-punc">,</span> <span class="syn-str">"https://mcp.magpie.im/mcp"</span><span class="syn-punc">]</span>
    <span class="syn-punc">}</span>
  <span class="syn-punc">}</span>
<span class="syn-punc">}</span></pre></div>
    </div>
    <p style="color: var(--text-dimmer); font-size: 0.8rem; margin-top: 10px; font-family: var(--mono);">Requires Node.js 18+ for npx / mcp-remote</p>
  </section>

  <!-- How it works -->
  <section>
    <h2>How It Works</h2>
    <div class="steps">
      <div class="step">
        <div class="step-num">1</div>
        <h3>Connect</h3>
        <p>Add the config above and restart Claude Desktop. The <code style="font-family:var(--mono);font-size:0.8em;color:var(--blue)">mcp-remote</code> bridge connects to the server automatically.</p>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <h3>Authorize</h3>
        <p>Your browser opens to an OAuth flow. Enter your Magpie API keys from the <a href="https://dashboard.magpie.im" target="_blank">Magpie Dashboard</a>. This only happens once.</p>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <h3>Use</h3>
        <p>Ask Claude to process payments, create checkout sessions, send invoices, or manage payment links. 33 tools are available.</p>
      </div>
    </div>
  </section>

  <!-- Available Tools -->
  <section>
    <h2>Available Tools <span class="dim">/ 33 tools across 6 categories</span></h2>
    <div class="tools-grid">
      <div class="tool-category">
        <div class="tool-category-header">Payment Sources <span class="tool-count">2</span></div>
        <div class="tool-list">
          <span class="tool-tag">create_source</span>
          <span class="tool-tag">get_source</span>
        </div>
      </div>
      <div class="tool-category">
        <div class="tool-category-header">Customers <span class="tool-count">6</span></div>
        <div class="tool-list">
          <span class="tool-tag">create_customer</span>
          <span class="tool-tag">get_customer</span>
          <span class="tool-tag">update_customer</span>
          <span class="tool-tag">get_customer_by_email</span>
          <span class="tool-tag">attach_source_to_customer</span>
          <span class="tool-tag">detach_source_from_customer</span>
        </div>
      </div>
      <div class="tool-category">
        <div class="tool-category-header">Charges <span class="tool-count">7</span></div>
        <div class="tool-list">
          <span class="tool-tag">create_charge</span>
          <span class="tool-tag">get_charge</span>
          <span class="tool-tag">list_charges</span>
          <span class="tool-tag">capture_charge</span>
          <span class="tool-tag">void_charge</span>
          <span class="tool-tag">refund_charge</span>
          <span class="tool-tag">verify_charge</span>
        </div>
      </div>
      <div class="tool-category">
        <div class="tool-category-header">Checkout Sessions <span class="tool-count">5</span></div>
        <div class="tool-list">
          <span class="tool-tag">create_checkout_session</span>
          <span class="tool-tag">get_checkout_session</span>
          <span class="tool-tag">list_checkout_sessions</span>
          <span class="tool-tag">expire_checkout_session</span>
          <span class="tool-tag">capture_checkout_session</span>
        </div>
      </div>
      <div class="tool-category">
        <div class="tool-category-header">Payment Requests <span class="tool-count">5</span></div>
        <div class="tool-list">
          <span class="tool-tag">create_payment_request</span>
          <span class="tool-tag">get_payment_request</span>
          <span class="tool-tag">list_payment_requests</span>
          <span class="tool-tag">void_payment_request</span>
          <span class="tool-tag">resend_payment_request</span>
        </div>
      </div>
      <div class="tool-category">
        <div class="tool-category-header">Payment Links <span class="tool-count">6</span></div>
        <div class="tool-list">
          <span class="tool-tag">create_payment_link</span>
          <span class="tool-tag">get_payment_link</span>
          <span class="tool-tag">list_payment_links</span>
          <span class="tool-tag">update_payment_link</span>
          <span class="tool-tag">activate_payment_link</span>
          <span class="tool-tag">deactivate_payment_link</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Utility Tools -->
  <section>
    <h2>Utility Tools <span class="dim">/ 2 tools</span></h2>
    <div class="tools-grid">
      <div class="tool-category">
        <div class="tool-category-header">Account <span class="tool-count">2</span></div>
        <div class="tool-list">
          <span class="tool-tag">get_me</span>
          <span class="tool-tag">get_magpie_api_reference</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Payment Methods -->
  <section>
    <h2>Supported Payment Methods</h2>
    <div class="matrix-wrap">
      <table class="matrix">
        <thead>
          <tr>
            <th style="text-align:left">Method</th>
            <th>Payments</th>
            <th>Checkout</th>
            <th>Requests</th>
            <th>Links</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Card</td><td class="yes">&#10003;</td><td class="yes">&#10003;</td><td class="yes">&#10003;</td><td class="yes">&#10003;</td></tr>
          <tr><td>GCash</td><td class="yes">&#10003;</td><td class="yes">&#10003;</td><td class="yes">&#10003;</td><td class="yes">&#10003;</td></tr>
          <tr><td>Maya</td><td class="yes">&#10003;</td><td class="yes">&#10003;</td><td class="yes">&#10003;</td><td class="yes">&#10003;</td></tr>
          <tr><td>GrabPay</td><td class="yes">&#10003;</td><td class="yes">&#10003;</td><td class="no">&mdash;</td><td class="no">&mdash;</td></tr>
          <tr><td>BPI</td><td class="yes">&#10003;</td><td class="yes">&#10003;</td><td class="no">&mdash;</td><td class="no">&mdash;</td></tr>
          <tr><td>Alipay</td><td class="yes">&#10003;</td><td class="yes">&#10003;</td><td class="no">&mdash;</td><td class="no">&mdash;</td></tr>
          <tr><td>UnionPay</td><td class="yes">&#10003;</td><td class="yes">&#10003;</td><td class="no">&mdash;</td><td class="no">&mdash;</td></tr>
          <tr><td>WeChat Pay</td><td class="yes">&#10003;</td><td class="yes">&#10003;</td><td class="no">&mdash;</td><td class="no">&mdash;</td></tr>
          <tr><td>QR PH</td><td class="yes">&#10003;</td><td class="no">&mdash;</td><td class="no">&mdash;</td><td class="no">&mdash;</td></tr>
          <tr><td>InstaPay</td><td class="yes">&#10003;</td><td class="no">&mdash;</td><td class="no">&mdash;</td><td class="no">&mdash;</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- Self-hosted -->
  <section>
    <h2>Self-Hosted <span class="dim">/ run it yourself</span></h2>
    <div class="alt-install">
      <h3>Install from npm</h3>
      <p>Run the MCP server locally. Provide your API keys as environment variables instead of using the hosted OAuth flow.</p>
      <code class="inline-code">npm install -g magpie-mcp-server</code>
    </div>
    <div class="alt-install" style="margin-top: 12px;">
      <h3>Claude Desktop config (self-hosted)</h3>
      <p>Point Claude Desktop at the local server with your Magpie credentials:</p>
      <div class="code-block" style="margin: 0;">
        <div class="code-body"><pre><span class="syn-punc">{</span>
  <span class="syn-key">"mcpServers"</span><span class="syn-punc">:</span> <span class="syn-punc">{</span>
    <span class="syn-key">"magpie"</span><span class="syn-punc">:</span> <span class="syn-punc">{</span>
      <span class="syn-key">"command"</span><span class="syn-punc">:</span> <span class="syn-str">"npx"</span><span class="syn-punc">,</span>
      <span class="syn-key">"args"</span><span class="syn-punc">:</span> <span class="syn-punc">[</span><span class="syn-str">"-y"</span><span class="syn-punc">,</span> <span class="syn-str">"magpie-mcp-server"</span><span class="syn-punc">]</span><span class="syn-punc">,</span>
      <span class="syn-key">"env"</span><span class="syn-punc">:</span> <span class="syn-punc">{</span>
        <span class="syn-key">"MAGPIE_PUBLIC_KEY"</span><span class="syn-punc">:</span> <span class="syn-str">"your_public_key"</span><span class="syn-punc">,</span>
        <span class="syn-key">"MAGPIE_SECRET_KEY"</span><span class="syn-punc">:</span> <span class="syn-str">"your_secret_key"</span>
      <span class="syn-punc">}</span>
    <span class="syn-punc">}</span>
  <span class="syn-punc">}</span>
<span class="syn-punc">}</span></pre></div>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section>
    <h2>FAQ</h2>
    <div class="faq-list">
      <div class="faq-item">
        <div class="faq-q" onclick="this.parentElement.classList.toggle('open')">"Failed to spawn process: No such file or directory"</div>
        <div class="faq-a">
          <p>Claude Desktop is a GUI app and doesn't inherit your shell's <code>PATH</code>. If you use a Node version manager (NVM, fnm, Volta, Herd), the bare <code>npx</code> command won't be found.</p>
          <p>Fix: use the <strong>full path</strong> to <code>npx</code> and add its directory to <code>env.PATH</code>:</p>
<pre>{
  "mcpServers": {
    "magpie": {
      "command": "/full/path/to/npx",
      "args": ["mcp-remote", "https://mcp.magpie.im/mcp"],
      "env": {
        "PATH": "/full/path/to/node/bin:/usr/local/bin:/usr/bin:/bin"
      }
    }
  }
}</pre>
          <p>Find your path by running <code>which npx</code> in a terminal.</p>
        </div>
      </div>
      <div class="faq-item">
        <div class="faq-q" onclick="this.parentElement.classList.toggle('open')">How do I re-authorize or switch API keys?</div>
        <div class="faq-a">
          <p>The <code>mcp-remote</code> bridge caches OAuth tokens locally. To force a fresh authorization flow, delete the cache and restart Claude Desktop:</p>
<pre>rm -rf ~/.mcp-auth/</pre>
          <p>The next time Claude Desktop connects, your browser will open the authorization page where you can enter new API keys.</p>
        </div>
      </div>
      <div class="faq-item">
        <div class="faq-q" onclick="this.parentElement.classList.toggle('open')">Where are my API keys stored?</div>
        <div class="faq-a">
          <p>Your Magpie API keys are stored <strong>server-side</strong> in an encrypted PostgreSQL database, associated with your OAuth client. They never leave the server.</p>
          <p>Your local machine only stores an OAuth access token (in <code>~/.mcp-auth/</code>) which authenticates requests to the MCP server. The access token expires after 1 hour and is automatically refreshed.</p>
        </div>
      </div>
      <div class="faq-item">
        <div class="faq-q" onclick="this.parentElement.classList.toggle('open')">Do I need to install anything?</div>
        <div class="faq-a">
          <p>You need <strong>Node.js 18+</strong> installed (for the <code>npx</code> and <code>mcp-remote</code> commands). No other installation is required&mdash;the hosted server handles everything else.</p>
          <p>If you prefer to self-host, you can install the server from npm with <code>npm install -g magpie-mcp-server</code> and provide your own API keys as environment variables.</p>
        </div>
      </div>
      <div class="faq-item">
        <div class="faq-q" onclick="this.parentElement.classList.toggle('open')">What can I ask Claude to do with Magpie?</div>
        <div class="faq-a">
          <p>Anything the Magpie API supports. Examples:</p>
          <p>&bull; "Charge 500 PHP to the customer's GCash"<br>
          &bull; "Create a checkout session for 1,200 PHP with card and Maya"<br>
          &bull; "Send a payment request for 3,000 PHP to juan@example.com"<br>
          &bull; "Create a reusable payment link for 250 PHP"<br>
          &bull; "Show me all charges from today"<br>
          &bull; "Refund charge ch_abc123"</p>
        </div>
      </div>
    </div>
  </section>
</div>

<!-- Footer -->
<footer>
  <div class="container">
    <div class="footer-links">
      <a href="https://github.com/domdanao/magpie-mcp-server">GitHub</a>
      <a href="https://www.npmjs.com/package/magpie-mcp-server">npm</a>
      <a href="https://dashboard.magpie.im">Magpie Dashboard</a>
      <a href="/.well-known/oauth-authorization-server">OAuth Metadata</a>
      <a href="/health">Health</a>
    </div>
    <p class="footer-note">MIT License &middot; Built for the Model Context Protocol</p>
  </div>
</footer>

<script>
function copyConfig(btn) {
  var config = JSON.stringify({
    mcpServers: {
      magpie: {
        command: "npx",
        args: ["mcp-remote", "https://mcp.magpie.im/mcp"]
      }
    }
  }, null, 2);
  navigator.clipboard.writeText(config).then(function() {
    btn.textContent = 'Copied!';
    setTimeout(function() { btn.textContent = 'Copy'; }, 2000);
  });
}
</script>
</body>
</html>`;
}
