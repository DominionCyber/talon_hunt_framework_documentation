# Frequently Asked Questions

## General

### What is Talon Hunt Framework?

Talon Hunt Framework is a curated collection of CrowdStrike Query Language (CQL) saved searches that can be natively imported into CrowdStrike Falcon. It supports threat hunting, detection engineering, and incident response workflows with zero external dependencies.

### Who maintains Talon?

Talon is developed and maintained by Dominion Cyber.

### Is Talon free to use?

Yes. Talon Hunt Framework is open source and free to use. Refer to the repository license file for usage and distribution terms.

### Is Talon Hunt Framework Enterprise available?

Yes. Enterprise support and additional offerings are available. Contact talon@dominioncyber.net for more information.

## Compatibility

### Which CrowdStrike modules does Talon support?

Talon is designed primarily for Falcon Insight (EDR) and the Event Search / Investigate workflow. Some content may also apply to Falcon OverWatch and Falcon Discover depending on licensing and telemetry availability.

### Does Talon work with other EDR platforms?

No. Talon is purpose-built for CrowdStrike Falcon and relies on CrowdStrike Query Language (CQL). It is not directly portable to other platforms without significant rewriting.

### What Falcon permissions do I need?

At minimum, users must have permissions to create and manage saved searches within their Falcon tenant. This is commonly granted through Falcon Analyst or Falcon Admin roles, depending on RBAC configuration.

If deploying content via the API, additional permissions and API scopes are required, including:

- NGSIEM Saved Queries (write access)
- NGSIEM Lookup Files (write access, if deploying lookup tables)

## Usage

### How do I import Talon searches into Falcon?

Refer to the Getting Started guide for documented installation paths, including Web GUI and API-based deployment.

### Can I modify the queries?

Yes. Talon is intended as a baseline framework. Organizations are encouraged to tailor queries to their environment, telemetry, and operational requirements.

### How are queries organized?

Queries follow a consistent naming convention:

```
[CATEGORY]-[MITRE_TACTIC]-[SHORT_DESCRIPTION]
```

Content is organized into functional groupings such as:

- Core searches
- Transforms
- Lookups
- Cradles (building blocks)

### Can I use Talon in a CI/CD pipeline?

Yes. Talon is designed to support detection-as-code workflows. The repository can be integrated into CI/CD pipelines for review, version control, and automated deployment.

## Troubleshooting

### A query is not returning results. What should I check?

- Data availability: Confirm your tenant is ingesting the required event types (example: ProcessRollup2, NetworkConnect).
- Time range: Expand the search window for low-frequency activity.
- Field validity: CrowdStrike event schemas may vary across sensor versions.
- Permissions: Ensure your account has access to the relevant datasets.

### I am getting a syntax error on import.

Ensure the query syntax is valid CQL and matches the expected import format. When copying queries manually, confirm that no encoding or formatting issues were introduced.

If uploading via YAML, validate that the file adheres to the LogScale schema specification:

https://schemas.humio.com/query/v0.6.0

## Contributing

### How can I contribute?

Contributions are welcome. If a contributing guide is published in the repository, follow the documented submission and pull request workflow.

If you do not have a contributing URL available yet, consider adding a CONTRIBUTING.md file at the repository root.

### I found a bug or have a feature request.

Please open an issue on GitHub with a clear description and, if applicable, steps to reproduce:

https://github.com/DominionCyber/talon_hunt_framework/issues
