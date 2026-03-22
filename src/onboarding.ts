export function onboardingHTML(issuerUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Magpie MCP Server — Merchant Setup</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f7fa; color: #1a1a2e; line-height: 1.6; }
  .container { max-width: 680px; margin: 0 auto; padding: 40px 20px; }
  h1 { font-size: 1.8rem; margin-bottom: 8px; }
  .subtitle { color: #666; margin-bottom: 32px; }
  .step { background: #fff; border-radius: 12px; padding: 24px; margin-bottom: 16px; border: 1px solid #e2e8f0; }
  .step.locked { opacity: 0.5; pointer-events: none; }
  .step.done { border-color: #22c55e; }
  .step-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .step-number { width: 32px; height: 32px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; flex-shrink: 0; }
  .step.done .step-number { background: #22c55e; color: #fff; }
  .step-title { font-weight: 600; font-size: 1.1rem; }
  label { display: block; font-weight: 500; font-size: 0.9rem; margin-bottom: 4px; color: #444; }
  input[type="text"], input[type="url"], input[type="password"] {
    width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px;
    font-size: 0.95rem; margin-bottom: 12px; font-family: inherit;
  }
  input:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
  button {
    background: #6366f1; color: #fff; border: none; padding: 10px 20px; border-radius: 8px;
    font-size: 0.95rem; font-weight: 500; cursor: pointer; transition: background 0.15s;
  }
  button:hover { background: #4f46e5; }
  button:disabled { background: #9ca3af; cursor: not-allowed; }
  .result { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-top: 12px; font-size: 0.9rem; display: none; }
  .result.error { background: #fef2f2; border-color: #fecaca; }
  .field { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
  .field code { flex: 1; background: #f1f5f9; padding: 6px 10px; border-radius: 6px; font-size: 0.85rem; word-break: break-all; }
  .copy-btn { background: #e2e8f0; color: #444; padding: 6px 12px; font-size: 0.8rem; border-radius: 6px; }
  .copy-btn:hover { background: #cbd5e1; }
  .info { font-size: 0.85rem; color: #666; margin-top: 8px; }
  .links { margin-top: 32px; text-align: center; font-size: 0.85rem; color: #888; }
  .links a { color: #6366f1; text-decoration: none; }
  .links a:hover { text-decoration: underline; }
  .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid #fff; border-top-color: transparent; border-radius: 50%; animation: spin 0.6s linear infinite; vertical-align: middle; margin-right: 6px; }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
</head>
<body>
<div class="container">
  <h1>Magpie MCP Server</h1>
  <p class="subtitle">Set up your merchant account to connect AI agents to Magpie payments.</p>

  <!-- Step 1: Register -->
  <div class="step" id="step1">
    <div class="step-header">
      <div class="step-number">1</div>
      <div class="step-title">Register your application</div>
    </div>
    <label for="clientName">Application name</label>
    <input type="text" id="clientName" placeholder="My Payment Bot" value="">
    <label for="redirectUri">Redirect URI</label>
    <input type="url" id="redirectUri" placeholder="${issuerUrl}" value="${issuerUrl}">
    <button id="registerBtn" onclick="doRegister()">Register</button>
    <div class="result" id="registerResult"></div>
  </div>

  <!-- Step 2: Authorize -->
  <div class="step locked" id="step2">
    <div class="step-header">
      <div class="step-number">2</div>
      <div class="step-title">Authorize</div>
    </div>
    <p class="info" style="margin-bottom:12px">Click below to start the OAuth flow. You'll be redirected back with an authorization code.</p>
    <button id="authorizeBtn" onclick="doAuthorize()">Start Authorization</button>
    <div class="result" id="authorizeResult"></div>
  </div>

  <!-- Step 3: Get Token -->
  <div class="step locked" id="step3">
    <div class="step-header">
      <div class="step-number">3</div>
      <div class="step-title">Get access token</div>
    </div>
    <p class="info" style="margin-bottom:12px">Exchange the authorization code for an access token.</p>
    <button id="tokenBtn" onclick="doTokenExchange()">Exchange Code for Token</button>
    <div class="result" id="tokenResult"></div>
  </div>

  <!-- Step 4: Set Magpie Keys -->
  <div class="step locked" id="step4">
    <div class="step-header">
      <div class="step-number">4</div>
      <div class="step-title">Set your Magpie API keys</div>
    </div>
    <p class="info" style="margin-bottom:12px">Enter the API keys from your <a href="https://dashboard.magpie.im" target="_blank">Magpie Dashboard</a>.</p>
    <label for="publicKey">Public Key</label>
    <input type="text" id="publicKey" placeholder="pk_live_...">
    <label for="secretKey">Secret Key</label>
    <input type="password" id="secretKey" placeholder="sk_live_...">
    <button id="keysBtn" onclick="doSetKeys()">Save &amp; Validate Keys</button>
    <div class="result" id="keysResult"></div>
  </div>

  <div class="links">
    <a href="/.well-known/oauth-authorization-server">OAuth Metadata</a> &middot;
    <a href="/health">Health Check</a> &middot;
    <a href="https://github.com/domdanao/magpie-mcp-server" target="_blank">Documentation</a>
  </div>
</div>

<script>
const BASE = '';
let state = {
  clientId: '', clientSecret: '', redirectUri: '',
  codeVerifier: '', codeChallenge: '', authCode: '',
  accessToken: '', refreshToken: ''
};

// Restore state from URL (after OAuth redirect) or sessionStorage
(function init() {
  const saved = sessionStorage.getItem('magpie_onboard');
  if (saved) {
    try { Object.assign(state, JSON.parse(saved)); } catch {}
  }
  const params = new URLSearchParams(window.location.search);
  if (params.get('code')) {
    state.authCode = params.get('code');
    save();
    window.history.replaceState({}, '', window.location.pathname);
  }
  updateUI();
})();

function save() {
  sessionStorage.setItem('magpie_onboard', JSON.stringify(state));
}

function updateUI() {
  // Unlock steps based on state
  if (state.clientId) {
    markDone('step1');
    unlock('step2');
    showRegisterResult();
  }
  if (state.authCode) {
    markDone('step2');
    unlock('step3');
    showAuthorizeResult();
  }
  if (state.accessToken) {
    markDone('step3');
    unlock('step4');
    showTokenResult();
  }
}

function unlock(id) { document.getElementById(id).classList.remove('locked'); }
function markDone(id) { document.getElementById(id).classList.add('done'); }

function showResult(id, html, isError) {
  const el = document.getElementById(id);
  el.innerHTML = html;
  el.className = 'result' + (isError ? ' error' : '');
  el.style.display = 'block';
}

function fieldHTML(label, value) {
  const escaped = value.replace(/&/g,'&amp;').replace(/</g,'&lt;');
  return '<div class="field"><strong>' + label + ':</strong> <code>' + escaped + '</code>'
    + '<button class="copy-btn" onclick="navigator.clipboard.writeText(\\''+value.replace(/'/g,"\\\\'")+'\\')">Copy</button></div>';
}

function showRegisterResult() {
  showResult('registerResult',
    fieldHTML('Client ID', state.clientId)
    + fieldHTML('Client Secret', state.clientSecret)
    + '<p class="info">Save these credentials securely. You will need them to refresh tokens.</p>'
  );
}

function showAuthorizeResult() {
  showResult('authorizeResult', fieldHTML('Authorization Code', state.authCode));
}

function showTokenResult() {
  showResult('tokenResult',
    fieldHTML('Access Token', state.accessToken)
    + fieldHTML('Refresh Token', state.refreshToken)
  );
}

// Step 1: Register
async function doRegister() {
  const btn = document.getElementById('registerBtn');
  const name = document.getElementById('clientName').value.trim();
  const uri = document.getElementById('redirectUri').value.trim();
  if (!name) { showResult('registerResult', 'Please enter an application name.', true); return; }
  if (!uri) { showResult('registerResult', 'Please enter a redirect URI.', true); return; }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Registering...';
  try {
    const res = await fetch(BASE + '/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_name: name,
        redirect_uris: [uri],
        grant_types: ['authorization_code'],
        response_types: ['code'],
        token_endpoint_auth_method: 'client_secret_post',
        scope: 'mcp:tools mcp:resources'
      })
    });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error_description || e.error || res.statusText); }
    const data = await res.json();
    state.clientId = data.client_id;
    state.clientSecret = data.client_secret;
    state.redirectUri = uri;
    save();
    updateUI();
  } catch (err) {
    showResult('registerResult', 'Registration failed: ' + err.message, true);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Register';
  }
}

// Step 2: Authorize (PKCE)
async function doAuthorize() {
  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);
  state.codeVerifier = verifier;
  state.codeChallenge = challenge;
  save();

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: state.clientId,
    redirect_uri: state.redirectUri,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    scope: 'mcp:tools mcp:resources'
  });
  // Redirect to authorize — will come back with ?code=...
  window.location.href = BASE + '/authorize?' + params.toString();
}

function generateCodeVerifier() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return btoa(String.fromCharCode(...arr)).replace(/\\+/g,'-').replace(/\\//g,'_').replace(/=+$/,'');
}

async function generateCodeChallenge(verifier) {
  const data = new TextEncoder().encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash))).replace(/\\+/g,'-').replace(/\\//g,'_').replace(/=+$/,'');
}

// Step 3: Token Exchange
async function doTokenExchange() {
  const btn = document.getElementById('tokenBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Exchanging...';
  try {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: state.authCode,
      redirect_uri: state.redirectUri,
      client_id: state.clientId,
      client_secret: state.clientSecret,
      code_verifier: state.codeVerifier
    });
    const res = await fetch(BASE + '/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error_description || e.error || res.statusText); }
    const data = await res.json();
    state.accessToken = data.access_token;
    state.refreshToken = data.refresh_token || '';
    save();
    updateUI();
  } catch (err) {
    showResult('tokenResult', 'Token exchange failed: ' + err.message, true);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Exchange Code for Token';
  }
}

// Step 4: Set Magpie Keys
async function doSetKeys() {
  const btn = document.getElementById('keysBtn');
  const pk = document.getElementById('publicKey').value.trim();
  const sk = document.getElementById('secretKey').value.trim();
  if (!pk || !sk) { showResult('keysResult', 'Please enter both keys.', true); return; }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Validating &amp; saving...';
  try {
    const res = await fetch(BASE + '/merchant/keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + state.accessToken
      },
      body: JSON.stringify({ public_key: pk, secret_key: sk })
    });
    const data = await res.json();
    if (!res.ok) { throw new Error(data.error || res.statusText); }
    markDone('step4');
    showResult('keysResult',
      '<strong>Keys saved and validated!</strong><br>'
      + '<p class="info" style="margin-top:8px">Your AI agent can now connect to this MCP server using your access token. '
      + 'All Magpie API calls will use your merchant keys.</p>'
    );
  } catch (err) {
    showResult('keysResult', 'Failed: ' + err.message, true);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Save & Validate Keys';
  }
}
</script>
</body>
</html>`;
}

export function authSuccessHTML(redirectUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Magpie MCP Server — Authorized</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f7fa; color: #1a1a2e; line-height: 1.6; }
  .container { max-width: 520px; margin: 0 auto; padding: 80px 20px; text-align: center; }
  .card { background: #fff; border-radius: 12px; padding: 40px 32px; border: 1px solid #e2e8f0; }
  .icon { font-size: 3rem; margin-bottom: 16px; }
  h1 { font-size: 1.5rem; margin-bottom: 8px; color: #16a34a; }
  .message { color: #666; margin-bottom: 24px; font-size: 0.95rem; }
  .redirect-info { font-size: 0.85rem; color: #999; }
  .redirect-info a { color: #6366f1; text-decoration: none; }
  .redirect-info a:hover { text-decoration: underline; }
  .close-hint { margin-top: 20px; font-size: 0.85rem; color: #999; padding: 12px; background: #f8fafc; border-radius: 8px; }
</style>
</head>
<body>
<div class="container">
  <div class="card">
    <div class="icon">&#10003;</div>
    <h1>Authorization Successful</h1>
    <p class="message">Your Magpie API keys have been saved and validated. The application is now authorized.</p>
    <p class="redirect-info" id="redirectMsg">Redirecting back to the application...</p>
    <p class="close-hint" id="closeHint" style="display:none">
      The redirect could not reach the application. This is normal — your authorization is complete.<br>
      You can <strong>close this tab</strong> and return to your app.
    </p>
  </div>
</div>
<script>
(function() {
  var url = ${JSON.stringify(redirectUrl)};
  // Try to redirect via fetch first to detect if the local server is up
  var img = new Image();
  var timer = setTimeout(function() {
    // After 3 seconds, redirect anyway
    window.location.href = url;
  }, 1500);

  // Redirect immediately
  window.location.href = url;

  // If we're still here after 2s, the redirect target is probably down
  setTimeout(function() {
    document.getElementById('redirectMsg').textContent = 'If you are not redirected, click the link below:';
    var link = document.createElement('a');
    link.href = url;
    link.textContent = 'Click here to continue';
    link.style.display = 'block';
    link.style.marginTop = '8px';
    document.getElementById('redirectMsg').appendChild(link);
    document.getElementById('closeHint').style.display = 'block';
  }, 3000);
})();
</script>
</body>
</html>`;
}

export function authorizeSetupHTML(params: {
  clientId: string;
  clientName?: string;
  redirectUri: string;
  codeChallenge: string;
  codeChallengeMethod?: string;
  state?: string;
  scope?: string;
  resource?: string;
}): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Magpie MCP Server — Authorize</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f7fa; color: #1a1a2e; line-height: 1.6; }
  .container { max-width: 520px; margin: 0 auto; padding: 60px 20px; }
  .card { background: #fff; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0; }
  h1 { font-size: 1.5rem; margin-bottom: 4px; }
  .subtitle { color: #666; margin-bottom: 24px; font-size: 0.95rem; }
  .app-name { font-weight: 600; color: #6366f1; }
  label { display: block; font-weight: 500; font-size: 0.9rem; margin-bottom: 4px; color: #444; }
  input[type="text"], input[type="password"] {
    width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px;
    font-size: 0.95rem; margin-bottom: 16px; font-family: inherit;
  }
  input:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
  button {
    width: 100%; background: #6366f1; color: #fff; border: none; padding: 12px 20px; border-radius: 8px;
    font-size: 1rem; font-weight: 500; cursor: pointer; transition: background 0.15s;
  }
  button:hover { background: #4f46e5; }
  button:disabled { background: #9ca3af; cursor: not-allowed; }
  .error { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px; margin-bottom: 16px; font-size: 0.9rem; color: #b91c1c; display: none; }
  .info { font-size: 0.85rem; color: #666; margin-bottom: 20px; }
  .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid #fff; border-top-color: transparent; border-radius: 50%; animation: spin 0.6s linear infinite; vertical-align: middle; margin-right: 6px; }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
</head>
<body>
<div class="container">
  <div class="card">
    <h1>Authorize Access</h1>
    <p class="subtitle"><span class="app-name">${esc(params.clientName || params.clientId)}</span> wants to connect to Magpie payments.</p>
    <p class="info">Enter your Magpie API keys from your <a href="https://dashboard.magpie.im" target="_blank">Magpie Dashboard</a> to authorize this application.</p>
    <div class="error" id="errorMsg"></div>
    <form id="authForm" method="POST" action="/setup-and-authorize">
      <input type="hidden" name="client_id" value="${esc(params.clientId)}">
      <input type="hidden" name="redirect_uri" value="${esc(params.redirectUri)}">
      <input type="hidden" name="code_challenge" value="${esc(params.codeChallenge)}">
      <input type="hidden" name="code_challenge_method" value="${esc(params.codeChallengeMethod || 'S256')}">
      ${params.state ? `<input type="hidden" name="state" value="${esc(params.state)}">` : ''}
      ${params.scope ? `<input type="hidden" name="scope" value="${esc(params.scope)}">` : ''}
      ${params.resource ? `<input type="hidden" name="resource" value="${esc(params.resource)}">` : ''}
      <label for="public_key">Public Key</label>
      <input type="text" id="public_key" name="public_key" placeholder="pk_live_..." required>
      <label for="secret_key">Secret Key</label>
      <input type="password" id="secret_key" name="secret_key" placeholder="sk_live_..." required>
      <button type="submit" id="submitBtn">Authorize &amp; Save Keys</button>
    </form>
  </div>
</div>
<script>
document.getElementById('authForm').addEventListener('submit', function() {
  var btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Validating keys...';
});
// Show error from query param if redirected back with one
var err = new URLSearchParams(window.location.search).get('setup_error');
if (err) {
  var errEl = document.getElementById('errorMsg');
  errEl.textContent = decodeURIComponent(err);
  errEl.style.display = 'block';
}
</script>
</body>
</html>`;
}
