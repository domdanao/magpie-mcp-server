export function installPageHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Install — Magpie MCP Server</title>
<meta name="description" content="Install the Magpie MCP Server in Cursor, VS Code, Claude Desktop, Claude Code, Windsurf, ChatGPT, and more.">
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

  .section-desc {
    font-size: 0.9rem;
    color: var(--text-dim);
    margin-bottom: 20px;
  }

  .section-desc code {
    font-family: var(--mono);
    font-size: 0.85em;
    color: var(--blue);
    background: var(--bg-code);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 2px 6px;
  }

  /* Badge */
  .badge {
    display: inline-block;
    font-family: var(--mono);
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: var(--green-soft);
    color: var(--green);
    border-radius: 10px;
    padding: 2px 8px;
    vertical-align: middle;
    margin-left: 8px;
  }

  .badge-accent {
    background: var(--accent-soft);
    color: var(--accent);
  }

  /* Client cards */
  .clients-grid {
    display: grid;
    gap: 16px;
  }

  .client-card {
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
  }

  .client-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    border-bottom: 1px solid var(--border);
    flex-wrap: wrap;
    gap: 8px;
  }

  .client-name {
    font-size: 0.95rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .client-icon {
    width: 26px;
    height: 26px;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
  }

  .client-note {
    font-size: 0.8rem;
    color: var(--text-dimmer);
  }

  .client-body {
    padding: 16px 20px;
  }

  /* Buttons */
  .btn-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 14px;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    font-family: var(--mono);
    text-decoration: none;
    transition: all 0.12s;
    cursor: pointer;
    border: none;
    letter-spacing: 0.02em;
  }

  .btn-primary {
    background: var(--accent);
    color: #fff;
  }

  .btn-primary:hover {
    background: #6d28d9;
    text-decoration: none;
  }

  .btn-outline {
    background: transparent;
    color: var(--text-dim);
    border: 1px solid var(--border);
  }

  .btn-outline:hover {
    border-color: var(--text-dim);
    color: var(--text);
    text-decoration: none;
  }

  /* Code blocks */
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
    font-size: 0.82rem;
    line-height: 1.6;
    tab-size: 2;
  }

  .code-body pre { margin: 0; }

  /* Syntax */
  .syn-key { color: var(--blue); }
  .syn-str { color: #a5d6ff; }
  .syn-punc { color: var(--text-dimmer); }
  .syn-comment { color: var(--text-dimmer); font-style: italic; }
  .syn-cmd { color: var(--text); }

  /* Manual instructions */
  .manual-hint {
    font-size: 0.8rem;
    color: var(--text-dimmer);
    margin-bottom: 8px;
  }

  .manual-hint code {
    font-family: var(--mono);
    font-size: 0.9em;
    color: var(--blue);
  }

  /* Tabs */
  .tab-row {
    display: flex;
    gap: 0;
    border-bottom: 1px solid var(--border);
    padding: 0 20px;
  }

  .tab {
    padding: 8px 16px;
    font-family: var(--mono);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.03em;
    cursor: pointer;
    color: var(--text-dimmer);
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: all 0.1s;
    user-select: none;
  }

  .tab:hover { color: var(--text-dim); }
  .tab.active { color: var(--accent); border-bottom-color: var(--accent); }

  .tab-panel { display: none; }
  .tab-panel.active { display: block; }

  /* Inline steps for ChatGPT */
  .inline-steps {
    font-size: 0.9rem;
    color: var(--text-dim);
    line-height: 1.8;
  }

  .inline-steps strong { color: var(--text); }

  .inline-steps code {
    font-family: var(--mono);
    font-size: 0.85em;
    color: var(--blue);
    background: var(--bg-code);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 2px 6px;
  }

  /* Tools compact */
  .tools-compact {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
  }

  .tools-compact-item {
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px 14px;
  }

  .tools-compact-domain {
    font-family: var(--mono);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 4px;
  }

  .tools-compact-names {
    font-size: 0.8rem;
    color: var(--text-dim);
    line-height: 1.5;
  }

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
    <div class="hero-badge">INSTALL GUIDE</div>
    <h1>Install Magpie MCP Server</h1>
    <p>Connect your AI agent to the <a href="https://magpie.im">Magpie Payment Platform</a>. 33 tools covering payments, customers, checkout, invoices, and payment links.</p>
    <div class="hero-links">
      <a href="/">Home</a>
      <a href="https://github.com/domdanao/magpie-mcp-server">GitHub</a>
      <a href="https://www.npmjs.com/package/magpie-mcp-server">npm</a>
    </div>
  </div>

  <!-- ======= OPTION A: HOSTED ======= -->
  <section>
    <h2>Hosted Server <span class="badge">Recommended</span></h2>
    <p class="section-desc">
      No installation required. Connect via OAuth at <code>https://mcp.magpie.im/mcp</code> &mdash; your API keys are stored securely on the server.
    </p>

    <div class="clients-grid">

      <!-- Cursor (hosted) -->
      <div class="client-card">
        <div class="client-header">
          <div class="client-name">
            <span class="client-icon" style="background:#21262d;">&#9000;&#65039;</span>
            Cursor
          </div>
        </div>
        <div class="client-body">
          <div class="btn-row">
            <a class="btn btn-primary" href="cursor://anysphere.cursor-deeplink/mcp/install?name=Magpie&config=eyJ1cmwiOiJodHRwczovL21jcC5tYWdwaWUuaW0vbWNwIn0=">Install in Cursor</a>
          </div>
          <div class="manual-hint">Or add manually to <code>~/.cursor/mcp.json</code></div>
          <div class="code-block">
            <div class="code-header">
              <span>~/.cursor/mcp.json</span>
              <button class="copy-btn" onclick="copyBlock(this)">Copy</button>
            </div>
            <div class="code-body"><pre><span class="syn-punc">{</span>
  <span class="syn-key">"mcpServers"</span><span class="syn-punc">:</span> <span class="syn-punc">{</span>
    <span class="syn-key">"magpie"</span><span class="syn-punc">:</span> <span class="syn-punc">{</span>
      <span class="syn-key">"url"</span><span class="syn-punc">:</span> <span class="syn-str">"https://mcp.magpie.im/mcp"</span>
    <span class="syn-punc">}</span>
  <span class="syn-punc">}</span>
<span class="syn-punc">}</span></pre></div>
          </div>
        </div>
      </div>

      <!-- VS Code (hosted) -->
      <div class="client-card">
        <div class="client-header">
          <div class="client-name">
            <span class="client-icon" style="background:#1a2035;">&#128311;</span>
            VS Code
          </div>
        </div>
        <div class="client-body">
          <div class="btn-row">
            <a class="btn btn-primary" href="vscode:mcp/install?name=Magpie&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fmcp.magpie.im%2Fmcp%22%7D">Install in VS Code</a>
          </div>
          <div class="manual-hint">Or add manually to <code>.vscode/mcp.json</code></div>
          <div class="code-block">
            <div class="code-header">
              <span>.vscode/mcp.json</span>
              <button class="copy-btn" onclick="copyBlock(this)">Copy</button>
            </div>
            <div class="code-body"><pre><span class="syn-punc">{</span>
  <span class="syn-key">"servers"</span><span class="syn-punc">:</span> <span class="syn-punc">{</span>
    <span class="syn-key">"magpie"</span><span class="syn-punc">:</span> <span class="syn-punc">{</span>
      <span class="syn-key">"type"</span><span class="syn-punc">:</span> <span class="syn-str">"http"</span><span class="syn-punc">,</span>
      <span class="syn-key">"url"</span><span class="syn-punc">:</span> <span class="syn-str">"https://mcp.magpie.im/mcp"</span>
    <span class="syn-punc">}</span>
  <span class="syn-punc">}</span>
<span class="syn-punc">}</span></pre></div>
          </div>
        </div>
      </div>

      <!-- Claude Desktop & Claude Code (hosted) -->
      <div class="client-card">
        <div class="client-header">
          <div class="client-name">
            <span class="client-icon" style="background:#21262d;">&#129302;</span>
            Claude Desktop &amp; Claude Code
          </div>
        </div>
        <div class="tab-row">
          <div class="tab active" onclick="switchTab(this,'hosted-claude-desktop')">Desktop</div>
          <div class="tab" onclick="switchTab(this,'hosted-claude-code')">Code</div>
        </div>
        <div class="tab-panel active" id="tab-hosted-claude-desktop">
          <div class="client-body">
            <div class="manual-hint">Add to <code>claude_desktop_config.json</code></div>
            <div class="code-block">
              <div class="code-header">
                <span>claude_desktop_config.json</span>
                <button class="copy-btn" onclick="copyBlock(this)">Copy</button>
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
          </div>
        </div>
        <div class="tab-panel" id="tab-hosted-claude-code">
          <div class="client-body">
            <div class="manual-hint">Run in your terminal</div>
            <div class="code-block">
              <div class="code-header">
                <span>Terminal</span>
                <button class="copy-btn" onclick="copyBlock(this)">Copy</button>
              </div>
              <div class="code-body"><pre><span class="syn-cmd">claude mcp add --transport http magpie https://mcp.magpie.im/mcp</span></pre></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Windsurf (hosted) -->
      <div class="client-card">
        <div class="client-header">
          <div class="client-name">
            <span class="client-icon" style="background:#0d1a20;">&#127940;</span>
            Windsurf
          </div>
        </div>
        <div class="client-body">
          <div class="code-block">
            <div class="code-header">
              <span>~/.codeium/windsurf/mcp_config.json</span>
              <button class="copy-btn" onclick="copyBlock(this)">Copy</button>
            </div>
            <div class="code-body"><pre><span class="syn-punc">{</span>
  <span class="syn-key">"mcpServers"</span><span class="syn-punc">:</span> <span class="syn-punc">{</span>
    <span class="syn-key">"magpie"</span><span class="syn-punc">:</span> <span class="syn-punc">{</span>
      <span class="syn-key">"serverUrl"</span><span class="syn-punc">:</span> <span class="syn-str">"https://mcp.magpie.im/mcp"</span>
    <span class="syn-punc">}</span>
  <span class="syn-punc">}</span>
<span class="syn-punc">}</span></pre></div>
          </div>
        </div>
      </div>

      <!-- ChatGPT (hosted) -->
      <div class="client-card">
        <div class="client-header">
          <div class="client-name">
            <span class="client-icon" style="background:#21262d;">&#128172;</span>
            ChatGPT
          </div>
          <span class="client-note">Pro / Plus / Business / Enterprise</span>
        </div>
        <div class="client-body">
          <div class="inline-steps">
            Go to <strong>Settings &rarr; Connectors &rarr; Add custom connector</strong><br>
            Server URL: <code>https://mcp.magpie.im/mcp</code><br>
            Auth: <strong>OAuth</strong>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- ======= OPTION B: SELF-HOSTED ======= -->
  <section>
    <h2>Self-Hosted <span class="dim">/ run it yourself</span></h2>
    <p class="section-desc">
      Your API keys stay on your machine. Requires Node.js 18+.
    </p>

    <div class="clients-grid">

      <!-- Cursor (self-hosted) -->
      <div class="client-card">
        <div class="client-header">
          <div class="client-name">
            <span class="client-icon" style="background:#21262d;">&#9000;&#65039;</span>
            Cursor
          </div>
        </div>
        <div class="client-body">
          <div class="btn-row">
            <a class="btn btn-outline" href="cursor://anysphere.cursor-deeplink/mcp/install?name=Magpie&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIm1hZ3BpZS1tY3Atc2VydmVyIl19">Install in Cursor</a>
          </div>
          <div class="code-block">
            <div class="code-header">
              <span>~/.cursor/mcp.json</span>
              <button class="copy-btn" onclick="copyBlock(this)">Copy</button>
            </div>
            <div class="code-body"><pre><span class="syn-punc">{</span>
  <span class="syn-key">"mcpServers"</span><span class="syn-punc">:</span> <span class="syn-punc">{</span>
    <span class="syn-key">"magpie"</span><span class="syn-punc">:</span> <span class="syn-punc">{</span>
      <span class="syn-key">"command"</span><span class="syn-punc">:</span> <span class="syn-str">"npx"</span><span class="syn-punc">,</span>
      <span class="syn-key">"args"</span><span class="syn-punc">:</span> <span class="syn-punc">[</span><span class="syn-str">"-y"</span><span class="syn-punc">,</span> <span class="syn-str">"magpie-mcp-server"</span><span class="syn-punc">]</span><span class="syn-punc">,</span>
      <span class="syn-key">"env"</span><span class="syn-punc">:</span> <span class="syn-punc">{</span>
        <span class="syn-key">"MAGPIE_PUBLIC_KEY"</span><span class="syn-punc">:</span> <span class="syn-str">"pk_live_..."</span><span class="syn-punc">,</span>
        <span class="syn-key">"MAGPIE_SECRET_KEY"</span><span class="syn-punc">:</span> <span class="syn-str">"sk_live_..."</span>
      <span class="syn-punc">}</span>
    <span class="syn-punc">}</span>
  <span class="syn-punc">}</span>
<span class="syn-punc">}</span></pre></div>
          </div>
        </div>
      </div>

      <!-- VS Code (self-hosted with input prompts) -->
      <div class="client-card">
        <div class="client-header">
          <div class="client-name">
            <span class="client-icon" style="background:#1a2035;">&#128311;</span>
            VS Code
            <span class="badge badge-accent">prompts for keys</span>
          </div>
        </div>
        <div class="client-body">
          <div class="btn-row">
            <a class="btn btn-outline" href="vscode:mcp/install?name=Magpie&inputs=%5B%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22magpie-public-key%22%2C%22description%22%3A%22Magpie%20Public%20Key%20(pk_live_...)%22%2C%22password%22%3Afalse%7D%2C%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22magpie-secret-key%22%2C%22description%22%3A%22Magpie%20Secret%20Key%20(sk_live_...)%22%2C%22password%22%3Atrue%7D%5D&config=%7B%22type%22%3A%22stdio%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22magpie-mcp-server%22%5D%2C%22env%22%3A%7B%22MAGPIE_PUBLIC_KEY%22%3A%22%24%7Binput%3Amagpie-public-key%7D%22%2C%22MAGPIE_SECRET_KEY%22%3A%22%24%7Binput%3Amagpie-secret-key%7D%22%7D%7D">Install in VS Code</a>
          </div>
          <div class="manual-hint">VS Code will prompt you for your API keys on first launch.</div>
          <div class="code-block">
            <div class="code-header">
              <span>.vscode/mcp.json</span>
              <button class="copy-btn" onclick="copyBlock(this)">Copy</button>
            </div>
            <div class="code-body"><pre><span class="syn-punc">{</span>
  <span class="syn-key">"inputs"</span><span class="syn-punc">:</span> <span class="syn-punc">[</span>
    <span class="syn-punc">{</span> <span class="syn-key">"type"</span><span class="syn-punc">:</span> <span class="syn-str">"promptString"</span><span class="syn-punc">,</span> <span class="syn-key">"id"</span><span class="syn-punc">:</span> <span class="syn-str">"pub"</span><span class="syn-punc">,</span> <span class="syn-key">"description"</span><span class="syn-punc">:</span> <span class="syn-str">"Magpie Public Key"</span> <span class="syn-punc">}</span><span class="syn-punc">,</span>
    <span class="syn-punc">{</span> <span class="syn-key">"type"</span><span class="syn-punc">:</span> <span class="syn-str">"promptString"</span><span class="syn-punc">,</span> <span class="syn-key">"id"</span><span class="syn-punc">:</span> <span class="syn-str">"sec"</span><span class="syn-punc">,</span> <span class="syn-key">"description"</span><span class="syn-punc">:</span> <span class="syn-str">"Magpie Secret Key"</span><span class="syn-punc">,</span> <span class="syn-key">"password"</span><span class="syn-punc">:</span> <span class="syn-str">true</span> <span class="syn-punc">}</span>
  <span class="syn-punc">]</span><span class="syn-punc">,</span>
  <span class="syn-key">"servers"</span><span class="syn-punc">:</span> <span class="syn-punc">{</span>
    <span class="syn-key">"magpie"</span><span class="syn-punc">:</span> <span class="syn-punc">{</span>
      <span class="syn-key">"type"</span><span class="syn-punc">:</span> <span class="syn-str">"stdio"</span><span class="syn-punc">,</span>
      <span class="syn-key">"command"</span><span class="syn-punc">:</span> <span class="syn-str">"npx"</span><span class="syn-punc">,</span>
      <span class="syn-key">"args"</span><span class="syn-punc">:</span> <span class="syn-punc">[</span><span class="syn-str">"-y"</span><span class="syn-punc">,</span> <span class="syn-str">"magpie-mcp-server"</span><span class="syn-punc">]</span><span class="syn-punc">,</span>
      <span class="syn-key">"env"</span><span class="syn-punc">:</span> <span class="syn-punc">{</span>
        <span class="syn-key">"MAGPIE_PUBLIC_KEY"</span><span class="syn-punc">:</span> <span class="syn-str">"\${input:pub}"</span><span class="syn-punc">,</span>
        <span class="syn-key">"MAGPIE_SECRET_KEY"</span><span class="syn-punc">:</span> <span class="syn-str">"\${input:sec}"</span>
      <span class="syn-punc">}</span>
    <span class="syn-punc">}</span>
  <span class="syn-punc">}</span>
<span class="syn-punc">}</span></pre></div>
          </div>
        </div>
      </div>

      <!-- Claude Desktop (self-hosted) -->
      <div class="client-card">
        <div class="client-header">
          <div class="client-name">
            <span class="client-icon" style="background:#21262d;">&#129302;</span>
            Claude Desktop
          </div>
        </div>
        <div class="client-body">
          <div class="code-block">
            <div class="code-header">
              <span>claude_desktop_config.json</span>
              <button class="copy-btn" onclick="copyBlock(this)">Copy</button>
            </div>
            <div class="code-body"><pre><span class="syn-punc">{</span>
  <span class="syn-key">"mcpServers"</span><span class="syn-punc">:</span> <span class="syn-punc">{</span>
    <span class="syn-key">"magpie"</span><span class="syn-punc">:</span> <span class="syn-punc">{</span>
      <span class="syn-key">"command"</span><span class="syn-punc">:</span> <span class="syn-str">"npx"</span><span class="syn-punc">,</span>
      <span class="syn-key">"args"</span><span class="syn-punc">:</span> <span class="syn-punc">[</span><span class="syn-str">"-y"</span><span class="syn-punc">,</span> <span class="syn-str">"magpie-mcp-server"</span><span class="syn-punc">]</span><span class="syn-punc">,</span>
      <span class="syn-key">"env"</span><span class="syn-punc">:</span> <span class="syn-punc">{</span>
        <span class="syn-key">"MAGPIE_PUBLIC_KEY"</span><span class="syn-punc">:</span> <span class="syn-str">"pk_live_..."</span><span class="syn-punc">,</span>
        <span class="syn-key">"MAGPIE_SECRET_KEY"</span><span class="syn-punc">:</span> <span class="syn-str">"sk_live_..."</span>
      <span class="syn-punc">}</span>
    <span class="syn-punc">}</span>
  <span class="syn-punc">}</span>
<span class="syn-punc">}</span></pre></div>
          </div>
        </div>
      </div>

      <!-- Global npm install -->
      <div class="client-card">
        <div class="client-header">
          <div class="client-name">
            <span class="client-icon" style="background:#21262d;">&#128230;</span>
            Global npm install
          </div>
          <span class="client-note">faster startup &middot; offline use</span>
        </div>
        <div class="client-body">
          <div class="code-block">
            <div class="code-header">
              <span>Terminal</span>
              <button class="copy-btn" onclick="copyBlock(this)">Copy</button>
            </div>
            <div class="code-body"><pre><span class="syn-cmd">npm install -g magpie-mcp-server</span></pre></div>
          </div>
          <p style="font-size: 0.8rem; color: var(--text-dimmer); margin-top: 12px;">
            Then replace <code style="font-family:var(--mono);font-size:0.9em;color:var(--blue);background:var(--bg-code);border:1px solid var(--border);border-radius:4px;padding:1px 5px;">npx -y magpie-mcp-server</code> with <code style="font-family:var(--mono);font-size:0.9em;color:var(--blue);background:var(--bg-code);border:1px solid var(--border);border-radius:4px;padding:1px 5px;">magpie-mcp-server</code> in any config above.
          </p>
        </div>
      </div>

    </div>
  </section>

  <!-- ======= OPENCLAW ======= -->
  <section>
    <h2>OpenClaw</h2>
    <div class="clients-grid">
      <div class="client-card">
        <div class="client-header">
          <div class="client-name">
            <span class="client-icon" style="background:var(--accent-soft);">&#129438;</span>
            OpenClaw Agent
          </div>
        </div>
        <div class="tab-row">
          <div class="tab active" onclick="switchTab(this,'openclaw-hosted')">Hosted</div>
          <div class="tab" onclick="switchTab(this,'openclaw-self')">Self-Hosted</div>
        </div>
        <div class="tab-panel active" id="tab-openclaw-hosted">
          <div class="client-body">
            <div class="manual-hint">Add to <code>~/.openclaw/openclaw.json</code></div>
            <div class="code-block">
              <div class="code-header">
                <span>~/.openclaw/openclaw.json</span>
                <button class="copy-btn" onclick="copyBlock(this)">Copy</button>
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
          </div>
        </div>
        <div class="tab-panel" id="tab-openclaw-self">
          <div class="client-body">
            <div class="manual-hint">Add to <code>~/.openclaw/openclaw.json</code></div>
            <div class="code-block">
              <div class="code-header">
                <span>~/.openclaw/openclaw.json</span>
                <button class="copy-btn" onclick="copyBlock(this)">Copy</button>
              </div>
              <div class="code-body"><pre><span class="syn-punc">{</span>
  <span class="syn-key">"mcpServers"</span><span class="syn-punc">:</span> <span class="syn-punc">{</span>
    <span class="syn-key">"magpie"</span><span class="syn-punc">:</span> <span class="syn-punc">{</span>
      <span class="syn-key">"command"</span><span class="syn-punc">:</span> <span class="syn-str">"npx"</span><span class="syn-punc">,</span>
      <span class="syn-key">"args"</span><span class="syn-punc">:</span> <span class="syn-punc">[</span><span class="syn-str">"-y"</span><span class="syn-punc">,</span> <span class="syn-str">"magpie-mcp-server"</span><span class="syn-punc">]</span><span class="syn-punc">,</span>
      <span class="syn-key">"env"</span><span class="syn-punc">:</span> <span class="syn-punc">{</span>
        <span class="syn-key">"MAGPIE_PUBLIC_KEY"</span><span class="syn-punc">:</span> <span class="syn-str">"pk_live_..."</span><span class="syn-punc">,</span>
        <span class="syn-key">"MAGPIE_SECRET_KEY"</span><span class="syn-punc">:</span> <span class="syn-str">"sk_live_..."</span>
      <span class="syn-punc">}</span>
    <span class="syn-punc">}</span>
  <span class="syn-punc">}</span>
<span class="syn-punc">}</span></pre></div>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-dimmer); margin-top: 12px;">
              After updating, restart the OpenClaw gateway: <code style="font-family:var(--mono);font-size:0.9em;color:var(--blue);">openclaw gateway restart</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ======= TOOLS REFERENCE ======= -->
  <section>
    <h2>Available Tools <span class="dim">/ 33 tools</span></h2>
    <div class="tools-compact">
      <div class="tools-compact-item">
        <div class="tools-compact-domain">Sources</div>
        <div class="tools-compact-names">create_source &middot; get_source</div>
      </div>
      <div class="tools-compact-item">
        <div class="tools-compact-domain">Customers</div>
        <div class="tools-compact-names">create &middot; get &middot; update<br>find &middot; attach &middot; detach</div>
      </div>
      <div class="tools-compact-item">
        <div class="tools-compact-domain">Charges</div>
        <div class="tools-compact-names">create &middot; get &middot; list<br>capture &middot; void &middot; refund &middot; verify</div>
      </div>
      <div class="tools-compact-item">
        <div class="tools-compact-domain">Checkout</div>
        <div class="tools-compact-names">create &middot; get &middot; list<br>expire &middot; capture</div>
      </div>
      <div class="tools-compact-item">
        <div class="tools-compact-domain">Payment Requests</div>
        <div class="tools-compact-names">create &middot; get &middot; list<br>void &middot; resend</div>
      </div>
      <div class="tools-compact-item">
        <div class="tools-compact-domain">Payment Links</div>
        <div class="tools-compact-names">create &middot; get &middot; list<br>update &middot; activate &middot; deactivate</div>
      </div>
    </div>
  </section>
</div>

<!-- Footer -->
<footer>
  <div class="container">
    <div class="footer-links">
      <a href="/">Home</a>
      <a href="https://github.com/domdanao/magpie-mcp-server">GitHub</a>
      <a href="https://www.npmjs.com/package/magpie-mcp-server">npm</a>
      <a href="https://dashboard.magpie.im">Magpie Dashboard</a>
      <a href="/health">Health</a>
    </div>
    <p class="footer-note">MIT License &middot; Built for the Model Context Protocol</p>
  </div>
</footer>

<script>
function copyBlock(btn) {
  var body = btn.closest('.code-block').querySelector('.code-body');
  var text = body.innerText.trim();
  navigator.clipboard.writeText(text).then(function() {
    btn.textContent = 'Copied!';
    setTimeout(function() { btn.textContent = 'Copy'; }, 2000);
  });
}

function switchTab(tab, panelId) {
  var card = tab.closest('.client-card');
  card.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
  card.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.remove('active'); });
  tab.classList.add('active');
  document.getElementById('tab-' + panelId).classList.add('active');
}
</script>
</body>
</html>`;
}
