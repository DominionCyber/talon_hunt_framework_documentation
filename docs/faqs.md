<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Talon Hunt Framework — FAQ</title>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Outfit:wght@300;500;700&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #0c0e13;
    --surface: #13161d;
    --surface-hover: #1a1e28;
    --border: #23283488;
    --border-active: #e84142;
    --text: #c8cdd8;
    --text-muted: #6b7280;
    --heading: #f0f2f5;
    --accent: #e84142;
    --accent-dim: #e8414220;
    --code-bg: #1a1e28;
    --radius: 10px;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Outfit', sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.7;
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* Subtle grid background */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 60px 60px;
    opacity: 0.3;
    pointer-events: none;
    z-index: 0;
  }

  /* Glow blob */
  body::after {
    content: '';
    position: fixed;
    top: -200px;
    right: -200px;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, var(--accent-dim) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .container {
    position: relative;
    z-index: 1;
    max-width: 780px;
    margin: 0 auto;
    padding: 60px 24px 100px;
  }

  /* Header */
  .header {
    margin-bottom: 56px;
    animation: fadeUp 0.6s ease both;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--accent);
    background: var(--accent-dim);
    border: 1px solid #e8414130;
    padding: 5px 14px;
    border-radius: 100px;
    margin-bottom: 20px;
  }

  .badge::before {
    content: '';
    width: 6px;
    height: 6px;
    background: var(--accent);
    border-radius: 50%;
    animation: pulse 2s ease infinite;
  }

  h1 {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 700;
    color: var(--heading);
    letter-spacing: -0.5px;
    line-height: 1.15;
    margin-bottom: 12px;
  }

  .subtitle {
    font-size: 1.05rem;
    color: var(--text-muted);
    font-weight: 300;
    max-width: 540px;
  }

  /* Section groups */
  .section {
    margin-bottom: 40px;
    animation: fadeUp 0.6s ease both;
  }

  .section:nth-child(2) { animation-delay: 0.08s; }
  .section:nth-child(3) { animation-delay: 0.16s; }
  .section:nth-child(4) { animation-delay: 0.24s; }
  .section:nth-child(5) { animation-delay: 0.32s; }
  .section:nth-child(6) { animation-delay: 0.40s; }

  .section-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 14px;
    padding-left: 2px;
  }

  /* Accordion items */
  .faq-item {
    border: 1px solid var(--border);
    border-radius: var(--radius);
    margin-bottom: 8px;
    background: var(--surface);
    transition: border-color 0.25s ease, box-shadow 0.25s ease;
    overflow: hidden;
  }

  .faq-item:hover {
    border-color: #333a4a;
  }

  .faq-item.active {
    border-color: var(--border-active);
    box-shadow: 0 0 20px var(--accent-dim), inset 0 0 0 1px #e8414110;
  }

  .faq-question {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    width: 100%;
    padding: 18px 22px;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    font-family: 'Outfit', sans-serif;
    font-size: 0.98rem;
    font-weight: 500;
    color: var(--heading);
    line-height: 1.5;
    transition: color 0.2s;
  }

  .faq-question:hover { color: #fff; }

  .faq-icon {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    background: var(--code-bg);
    transition: transform 0.3s ease, background 0.3s ease;
  }

  .faq-icon svg {
    width: 14px;
    height: 14px;
    stroke: var(--text-muted);
    transition: stroke 0.3s ease;
  }

  .faq-item.active .faq-icon {
    transform: rotate(45deg);
    background: var(--accent-dim);
  }

  .faq-item.active .faq-icon svg {
    stroke: var(--accent);
  }

  .faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
    opacity: 0;
  }

  .faq-item.active .faq-answer {
    opacity: 1;
  }

  .faq-answer-inner {
    padding: 0 22px 20px;
    font-size: 0.92rem;
    color: var(--text);
    font-weight: 300;
    line-height: 1.8;
  }

  .faq-answer-inner p {
    margin-bottom: 10px;
  }

  .faq-answer-inner p:last-child { margin-bottom: 0; }

  .faq-answer-inner code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.82rem;
    background: var(--code-bg);
    border: 1px solid var(--border);
    padding: 2px 8px;
    border-radius: 5px;
    color: var(--accent);
  }

  .faq-answer-inner a {
    color: var(--accent);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s;
  }

  .faq-answer-inner a:hover {
    border-bottom-color: var(--accent);
  }

  .faq-answer-inner ul {
    list-style: none;
    margin: 10px 0;
    padding: 0 0 0 6px;
  }

  .faq-answer-inner ul li {
    position: relative;
    padding-left: 22px;
    margin-bottom: 8px;
  }

  .faq-answer-inner ul li::before {
    content: '';
    position: absolute;
    left: 4px;
    top: 11px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--accent);
    opacity: 0.6;
  }

  .inline-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 10px 0;
  }

  .inline-list span {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.78rem;
    background: var(--code-bg);
    border: 1px solid var(--border);
    padding: 3px 10px;
    border-radius: 5px;
    color: var(--text-muted);
  }

  /* Footer */
  .footer {
    margin-top: 56px;
    padding-top: 28px;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    font-size: 0.82rem;
    color: var(--text-muted);
    animation: fadeUp 0.6s ease 0.5s both;
  }

  .footer a {
    color: var(--accent);
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.2s;
  }

  .footer a:hover { opacity: 0.8; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  @media (max-width: 600px) {
    .container { padding: 40px 16px 80px; }
    .faq-question { padding: 16px 18px; font-size: 0.93rem; }
    .faq-answer-inner { padding: 0 18px 18px; }
  }
</style>
</head>
<body>
<div class="container">

  <div class="header">
    <div class="badge">Talon Hunt Framework</div>
    <h1>Frequently Asked<br>Questions</h1>
    <p class="subtitle">Everything you need to know about deploying and using Talon with CrowdStrike Falcon.</p>
  </div>

  <!-- GENERAL -->
  <div class="section">
    <div class="section-label">General</div>

    <div class="faq-item">
      <button class="faq-question" onclick="toggle(this)">
        What is Talon Hunt Framework?
        <span class="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
      </button>
      <div class="faq-answer"><div class="faq-answer-inner">
        <p>Talon Hunt Framework is a curated collection of CrowdStrike Query Language (CQL) saved searches that can be natively imported into CrowdStrike Falcon. It supports threat hunting, detection engineering, and incident response workflows with zero external dependencies.</p>
      </div></div>
    </div>

    <div class="faq-item">
      <button class="faq-question" onclick="toggle(this)">
        Who maintains Talon?
        <span class="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
      </button>
      <div class="faq-answer"><div class="faq-answer-inner">
        <p>Talon is developed and maintained by <strong style="color:var(--heading)">Dominion Cyber</strong>.</p>
      </div></div>
    </div>

    <div class="faq-item">
      <button class="faq-question" onclick="toggle(this)">
        Is Talon free to use?
        <span class="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
      </button>
      <div class="faq-answer"><div class="faq-answer-inner">
        <p>Yes. Talon Hunt Framework is open source and free to use. Refer to the repository license file for usage and distribution terms.</p>
      </div></div>
    </div>

    <div class="faq-item">
      <button class="faq-question" onclick="toggle(this)">
        Is Talon Hunt Framework Enterprise available?
        <span class="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
      </button>
      <div class="faq-answer"><div class="faq-answer-inner">
        <p>Yes. Enterprise support and additional offerings are available. Contact <a href="/cdn-cgi/l/email-protection#5327323f3c3d13373c3e3a3d3a3c3d302a3136217d3d3627"><span class="__cf_email__" data-cfemail="4c382d2023220c28232125222523222f352e293e62222938">[email&#160;protected]</span></a> for more information.</p>
      </div></div>
    </div>
  </div>

  <!-- COMPATIBILITY -->
  <div class="section">
    <div class="section-label">Compatibility</div>

    <div class="faq-item">
      <button class="faq-question" onclick="toggle(this)">
        Which CrowdStrike modules does Talon support?
        <span class="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
      </button>
      <div class="faq-answer"><div class="faq-answer-inner">
        <p>Talon is designed primarily for Falcon Insight (EDR) and the Event Search / Investigate workflow. Some content may also apply to Falcon OverWatch and Falcon Discover depending on licensing and telemetry availability.</p>
      </div></div>
    </div>

    <div class="faq-item">
      <button class="faq-question" onclick="toggle(this)">
        Does Talon work with other EDR platforms?
        <span class="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
      </button>
      <div class="faq-answer"><div class="faq-answer-inner">
        <p>No. Talon is purpose-built for CrowdStrike Falcon and relies on CrowdStrike Query Language (CQL). It is not directly portable to other platforms without significant rewriting.</p>
      </div></div>
    </div>

    <div class="faq-item">
      <button class="faq-question" onclick="toggle(this)">
        What Falcon permissions do I need?
        <span class="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
      </button>
      <div class="faq-answer"><div class="faq-answer-inner">
        <p>At minimum, users must have permissions to create and manage saved searches within their Falcon tenant. This is commonly granted through Falcon Analyst or Falcon Admin roles, depending on RBAC configuration.</p>
        <p>If deploying content via the API, additional permissions and API scopes are required:</p>
        <ul>
          <li>NGSIEM Saved Queries — write access</li>
          <li>NGSIEM Lookup Files — write access (if deploying lookup tables)</li>
        </ul>
      </div></div>
    </div>
  </div>

  <!-- USAGE -->
  <div class="section">
    <div class="section-label">Usage</div>

    <div class="faq-item">
      <button class="faq-question" onclick="toggle(this)">
        How do I import Talon searches into Falcon?
        <span class="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
      </button>
      <div class="faq-answer"><div class="faq-answer-inner">
        <p>Refer to the Getting Started guide for documented installation paths, including Web GUI and API-based deployment.</p>
      </div></div>
    </div>

    <div class="faq-item">
      <button class="faq-question" onclick="toggle(this)">
        Can I modify the queries?
        <span class="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
      </button>
      <div class="faq-answer"><div class="faq-answer-inner">
        <p>Yes. Talon is intended as a baseline framework. Organizations are encouraged to tailor queries to their environment, telemetry, and operational requirements.</p>
      </div></div>
    </div>

    <div class="faq-item">
      <button class="faq-question" onclick="toggle(this)">
        How are queries organized?
        <span class="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
      </button>
      <div class="faq-answer"><div class="faq-answer-inner">
        <p>Queries follow a consistent naming convention:</p>
        <p><code>[CATEGORY]-[MITRE_TACTIC]-[SHORT_DESCRIPTION]</code></p>
        <p>Content is organized into functional groupings:</p>
        <div class="inline-list">
          <span>Core searches</span>
          <span>Transforms</span>
          <span>Lookups</span>
          <span>Cradles</span>
        </div>
      </div></div>
    </div>

    <div class="faq-item">
      <button class="faq-question" onclick="toggle(this)">
        Can I use Talon in a CI/CD pipeline?
        <span class="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
      </button>
      <div class="faq-answer"><div class="faq-answer-inner">
        <p>Yes. Talon is designed to support detection-as-code workflows. The repository can be integrated into CI/CD pipelines for review, version control, and automated deployment.</p>
      </div></div>
    </div>
  </div>

  <!-- TROUBLESHOOTING -->
  <div class="section">
    <div class="section-label">Troubleshooting</div>

    <div class="faq-item">
      <button class="faq-question" onclick="toggle(this)">
        A query is not returning results. What should I check?
        <span class="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
      </button>
      <div class="faq-answer"><div class="faq-answer-inner">
        <ul>
          <li><strong style="color:var(--heading)">Data availability</strong> — Confirm your tenant is ingesting the required event types (e.g. <code>ProcessRollup2</code>, <code>NetworkConnect</code>).</li>
          <li><strong style="color:var(--heading)">Time range</strong> — Expand the search window for low-frequency activity.</li>
          <li><strong style="color:var(--heading)">Field validity</strong> — CrowdStrike event schemas may vary across sensor versions.</li>
          <li><strong style="color:var(--heading)">Permissions</strong> — Ensure your account has access to the relevant datasets.</li>
        </ul>
      </div></div>
    </div>

    <div class="faq-item">
      <button class="faq-question" onclick="toggle(this)">
        I'm getting a syntax error on import.
        <span class="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
      </button>
      <div class="faq-answer"><div class="faq-answer-inner">
        <p>Ensure the query syntax is valid CQL and matches the expected import format. When copying queries manually, confirm that no encoding or formatting issues were introduced.</p>
        <p>If uploading via YAML, validate that the file adheres to the <a href="https://schemas.humio.com/query/v0.6.0" target="_blank">LogScale schema specification</a>.</p>
      </div></div>
    </div>
  </div>

  <!-- CONTRIBUTING -->
  <div class="section">
    <div class="section-label">Contributing</div>

    <div class="faq-item">
      <button class="faq-question" onclick="toggle(this)">
        How can I contribute?
        <span class="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
      </button>
      <div class="faq-answer"><div class="faq-answer-inner">
        <p>Contributions are welcome. If a contributing guide is published in the repository, follow the documented submission and pull request workflow. If not yet available, consider adding a <code>CONTRIBUTING.md</code> file at the repository root.</p>
      </div></div>
    </div>

    <div class="faq-item">
      <button class="faq-question" onclick="toggle(this)">
        I found a bug or have a feature request.
        <span class="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
      </button>
      <div class="faq-answer"><div class="faq-answer-inner">
        <p>Please open an issue on GitHub with a clear description and, if applicable, steps to reproduce:</p>
        <p><a href="https://github.com/DominionCyber/talon_hunt_framework/issues" target="_blank">github.com/DominionCyber/talon_hunt_framework/issues</a></p>
      </div></div>
    </div>
  </div>

  <div class="footer">
    <span>Maintained by <a href="/cdn-cgi/l/email-protection#1662777a79785672797b7f787f7978756f74736438787362">Dominion Cyber</a></span>
    <a href="https://github.com/DominionCyber/talon_hunt_framework" target="_blank">GitHub ↗</a>
  </div>

</div>

<script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script><script>
function toggle(btn) {
  const item = btn.parentElement;
  const answer = item.querySelector('.faq-answer');
  const isActive = item.classList.contains('active');

  // Close all
  document.querySelectorAll('.faq-item.active').forEach
