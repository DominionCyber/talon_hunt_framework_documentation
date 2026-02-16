---
title: FAQ
description: Frequently asked questions about Talon Hunt Framework
---

<style>
.faq-section {
  margin-bottom: 36px;
}

.faq-section-label {
  font-family: monospace;
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
  margin-bottom: 12px;
  padding-left: 2px;
}

.faq-section details {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin-bottom: 8px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
  transition: border-color 0.25s ease;
}

.faq-section details:hover {
  border-color: var(--vp-c-brand-2);
}

.faq-section details[open] {
  border-color: var(--vp-c-brand-1);
}

.faq-section details summary {
  padding: 16px 20px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--vp-c-text-1);
  transition: color 0.2s;
}

.faq-section details summary:hover {
  color: var(--vp-c-brand-1);
}

.faq-section details summary::-webkit-details-marker {
  display: none;
}

.faq-section details summary::after {
  content: '+';
  font-family: monospace;
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-3);
  transition: all 0.25s ease;
}

.faq-section details[open] summary::after {
  content: '−';
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.faq-section details .faq-answer {
  padding: 0 24px 18px 24px;
  font-size: 0.92rem;
  color: var(--vp-c-text-2);
  line-height: 1.8;
}

.faq-section details .faq-answer p {
  margin: 0 0 10px 0;
}

.faq-section details .faq-answer p:last-child {
  margin-bottom: 0;
}

.faq-section details .faq-answer code {
  font-size: 0.84rem;
  color: var(--vp-c-brand-1);
}

.faq-section details .faq-answer ul {
  margin: 8px 0;
  padding-left: 24px;
}

.faq-section details .faq-answer ul li {
  margin-bottom: 6px;
}

.faq-tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 10px 0;
  padding: 0;
  list-style: none;
}

.faq-tag-list li {
  font-family: monospace;
  font-size: 0.8rem;
  background: var(--vp-c-bg-mute);
  border: 1px solid var(--vp-c-divider);
  padding: 3px 10px;
  border-radius: 5px;
  color: var(--vp-c-text-3);
  margin: 0 !important;
}
</style>

# Frequently Asked Questions

Everything you need to know about deploying and using Talon with CrowdStrike Falcon.

<div class="faq-section">
<div class="faq-section-label">General</div>

<details>
<summary>What is Talon Hunt Framework?</summary>
<div class="faq-answer">
<p>Talon Hunt Framework is a curated collection of CrowdStrike Query Language (CQL) saved searches that can be natively imported into CrowdStrike Falcon. It supports threat hunting, detection engineering, and incident response workflows with zero external dependencies.</p>
</div>
</details>

<details>
<summary>Who maintains Talon?</summary>
<div class="faq-answer">
<p>Talon is developed and maintained by <strong>Dominion Cyber</strong>.</p>
</div>
</details>

<details>
<summary>Is Talon free to use?</summary>
<div class="faq-answer">
<p>Yes. Talon Hunt Framework is open source and free to use. Refer to the repository license file for usage and distribution terms.</p>
</div>
</details>

<details>
<summary>Is Talon Hunt Framework Enterprise available?</summary>
<div class="faq-answer">
<p>Yes. Enterprise support and additional offerings are available. Contact <a href="mailto:talon@dominioncyber.net">talon@dominioncyber.net</a> for more information.</p>
</div>
</details>

</div>

<div class="faq-section">
<div class="faq-section-label">Compatibility</div>

<details>
<summary>Which CrowdStrike modules does Talon support?</summary>
<div class="faq-answer">
<p>Talon is designed primarily for Falcon Insight (EDR) and the Event Search / Investigate workflow. Some content may also apply to Falcon OverWatch and Falcon Discover depending on licensing and telemetry availability.</p>
</div>
</details>

<details>
<summary>Does Talon work with other EDR platforms?</summary>
<div class="faq-answer">
<p>No. Talon is purpose-built for CrowdStrike Falcon and relies on CrowdStrike Query Language (CQL). It is not directly portable to other platforms without significant rewriting.</p>
</div>
</details>

<details>
<summary>What Falcon permissions do I need?</summary>
<div class="faq-answer">
<p>At minimum, users must have permissions to create and manage saved searches within their Falcon tenant. This is commonly granted through Falcon Analyst or Falcon Admin roles, depending on RBAC configuration.</p>
<p>If deploying content via the API, additional permissions and API scopes are required:</p>
<ul>
<li><strong>NGSIEM Saved Queries</strong> — write access</li>
<li><strong>NGSIEM Lookup Files</strong> — write access (if deploying lookup tables)</li>
</ul>
</div>
</details>

</div>

<div class="faq-section">
<div class="faq-section-label">Usage</div>

<details>
<summary>How do I import Talon searches into Falcon?</summary>
<div class="faq-answer">
<p>Refer to the Getting Started guide for documented installation paths, including Web GUI and API-based deployment.</p>
</div>
</details>

<details>
<summary>Can I modify the queries?</summary>
<div class="faq-answer">
<p>Yes. Talon is intended as a baseline framework. Organizations are encouraged to tailor queries to their environment, telemetry, and operational requirements.</p>
</div>
</details>

<details>
<summary>How are queries organized?</summary>
<div class="faq-answer">
<p>Queries follow a consistent naming convention:</p>
<p><code>[CATEGORY]-[MITRE_TACTIC]-[SHORT_DESCRIPTION]</code></p>
<p>Content is organized into functional groupings:</p>
<ul class="faq-tag-list">
<li>Core searches</li>
<li>Transforms</li>
<li>Lookups</li>
<li>Cradles</li>
</ul>
</div>
</details>

<details>
<summary>Can I use Talon in a CI/CD pipeline?</summary>
<div class="faq-answer">
<p>Yes. Talon is designed to support detection-as-code workflows. The repository can be integrated into CI/CD pipelines for review, version control, and automated deployment.</p>
</div>
</details>

</div>

<div class="faq-section">
<div class="faq-section-label">Troubleshooting</div>

<details>
<summary>A query is not returning results. What should I check?</summary>
<div class="faq-answer">
<ul>
<li><strong>Data availability</strong> — Confirm your tenant is ingesting the required event types (e.g. <code>ProcessRollup2</code>, <code>NetworkConnect</code>).</li>
<li><strong>Time range</strong> — Expand the search window for low-frequency activity.</li>
<li><strong>Field validity</strong> — CrowdStrike event schemas may vary across sensor versions.</li>
<li><strong>Permissions</strong> — Ensure your account has access to the relevant datasets.</li>
</ul>
</div>
</details>

<details>
<summary>I'm getting a syntax error on import.</summary>
<div class="faq-answer">
<p>Ensure the query syntax is valid CQL and matches the expected import format. When copying queries manually, confirm that no encoding or formatting issues were introduced.</p>
<p>If uploading via YAML, validate that the file adheres to the <a href="https://schemas.humio.com/query/v0.6.0" target="_blank" rel="noreferrer">LogScale schema specification</a>.</p>
</div>
</details>

</div>

<div class="faq-section">
<div class="faq-section-label">Contributing</div>

<details>
<summary>How can I contribute?</summary>
<div class="faq-answer">
<p>Contributions are welcome. If a contributing guide is published in the repository, follow the documented submission and pull request workflow. If not yet available, consider adding a <code>CONTRIBUTING.md</code> file at the repository root.</p>
</div>
</details>

<details>
<summary>I found a bug or have a feature request.</summary>
<div class="faq-answer">
<p>Please open an issue on GitHub with a clear description and, if applicable, steps to reproduce:</p>
<p><a href="https://github.com/DominionCyber/talon_hunt_framework/issues" target="_blank" rel="noreferrer">github.com/DominionCyber/talon_hunt_framework/issues</a></p>
</div>
</details>

</div>
