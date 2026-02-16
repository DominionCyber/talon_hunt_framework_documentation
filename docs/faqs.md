---
title: FAQs
---

# Frequently Asked Questions

<div class="faq-section">

## General

<details class="faq-item">
<summary>What is Talon Hunt Framework?</summary>

Talon Hunt Framework is a curated collection of CrowdStrike Query Language (CQL) saved searches that can be natively imported into CrowdStrike Falcon. It supports threat hunting, detection engineering, and incident response workflows with zero external dependencies.

</details>

<details class="faq-item">
<summary>Who maintains Talon?</summary>

Talon is developed and maintained by **Dominion Cyber**.

</details>

<details class="faq-item">
<summary>Is Talon free to use?</summary>

Yes. Talon Hunt Framework is open source and free to use. Refer to the repository license file for usage and distribution terms.

</details>

<details class="faq-item">
<summary>Is Talon Hunt Framework Enterprise available?</summary>

Yes. Enterprise support and additional offerings are available. Contact [talon@dominioncyber.net](mailto:talon@dominioncyber.net) for more information.

</details>

</div>

<div class="faq-section">

## Compatibility

<details class="faq-item">
<summary>Which CrowdStrike modules does Talon support?</summary>

Talon is designed primarily for Falcon Insight (EDR) and the Event Search / Investigate workflow. Some content may also apply to Falcon OverWatch and Falcon Discover depending on licensing and telemetry availability.

</details>

<details class="faq-item">
<summary>Does Talon work with other EDR platforms?</summary>

No. Talon is purpose-built for CrowdStrike Falcon and relies on CrowdStrike Query Language (CQL). It is not directly portable to other platforms without significant rewriting.

</details>

<details class="faq-item">
<summary>What Falcon permissions do I need?</summary>

At minimum, users must have permissions to create and manage saved searches within their Falcon tenant. This is commonly granted through Falcon Analyst or Falcon Admin roles, depending on RBAC configuration.

If deploying content via the API, additional permissions and API scopes are required, including:

- **NGSIEM Saved Queries** — write access
- **NGSIEM Lookup Files** — write access, if deploying lookup tables

</details>

</div>

<div class="faq-section">

## Usage

<details class="faq-item">
<summary>How do I import Talon searches into Falcon?</summary>

Refer to the [Getting Started](/getting-started) guide for documented installation paths, including Web GUI and API-based deployment.

</details>

<details class="faq-item">
<summary>Can I modify the queries?</summary>

Yes. Talon is intended as a baseline framework. Organizations are encouraged to tailor queries to their environment, telemetry, and operational requirements.

</details>

<details class="faq-item">
<summary>How are queries organized?</summary>

Queries follow a consistent naming convention:

```
[CATEGORY]-[MITRE_TACTIC]-[SHORT_DESCRIPTION]
```

Content is organized into functional groupings such as:

- Core searches
- Transforms
- Lookups
- Cradles (building blocks)

</details>

<details class="faq-item">
<summary>Can I use Talon in a CI/CD pipeline?</summary>

Yes. Talon is designed to support detection-as-code workflows. The repository can be integrated into CI/CD pipelines for review, version control, and automated deployment.

</details>

</div>

<div class="faq-section">

## Troubleshooting

<details class="faq-item">
<summary>A query is not returning results. What should I check?</summary>

- **Data availability** — Confirm your tenant is ingesting the required event types (e.g. `ProcessRollup2`, `NetworkConnect`).
- **Time range** — Expand the search window for low-frequency activity.
- **Field validity** — CrowdStrike event schemas may vary across sensor versions.
- **Permissions** — Ensure your account has access to the relevant datasets.

</details>

<details class="faq-item">
<summary>I am getting a syntax error on import.</summary>

Ensure the query syntax is valid CQL and matches the expected import format. When copying queries manually, confirm that no encoding or formatting issues were introduced.

If uploading via YAML, validate that the file adheres to the LogScale schema specification:

[https://schemas.humio.com/query/v0.6.0](https://schemas.humio.com/query/v0.6.0)

</details>

</div>

<div class="faq-section">

## Contributing

<details class="faq-item">
<summary>How can I contribute?</summary>

Contributions are welcome. If a contributing guide is published in the repository, follow the documented submission and pull request workflow.

If you do not have a contributing URL available yet, consider adding a `CONTRIBUTING.md` file at the repository root.

</details>

<details class="faq-item">
<summary>I found a bug or have a feature request.</summary>

Please open an issue on GitHub with a clear description and, if applicable, steps to reproduce:

[github.com/DominionCyber/talon_hunt_framework/issues](https://github.com/DominionCyber/talon_hunt_framework/issues)

</details>

</div>
