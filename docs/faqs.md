# Frequently Asked Questions

## General

### What is Talon Hunt Framework?

Talon Hunt Framework is a curated collection of CrowdStrike Query Language (CQL) saved searches that can be natively imported into CrowdStrike Falcon. It supports threat hunting, detection engineering, and incident response workflows with zero external dependencies.

### Who maintains Talon?

Talon is developed and maintained by [Dominion Cyber](https://github.com/DominionCyber).

### Is Talon free to use?

Yes. Talon Hunt Framework is open source and free to use. See the repository's license file for details.

---

## Compatibility

### Which CrowdStrike modules does Talon support?

Talon is designed primarily for use with **Falcon Insight** (EDR) and the **Event Search** / **Investigate** capabilities. Some queries may also be applicable to **Falcon OverWatch** and **Falcon Discover** depending on your subscription.

### Does Talon work with other EDR platforms?

No. Talon is purpose-built for CrowdStrike Falcon and uses CrowdStrike Query Language (CQL). It is not compatible with other EDR platforms without significant modification.

### What Falcon permissions do I need?

You'll need permissions to create and manage saved searches within your Falcon tenant. Typically this requires the **Falcon Analyst** or **Falcon Admin** role, depending on your organization's RBAC configuration.

---

## Usage

### How do I import Talon searches into Falcon?

See the [Getting Started](/getting-started) guide for step-by-step import instructions.

### Can I modify the queries?

Absolutely. Talon is designed to be a starting point. You're encouraged to customize queries to fit your environment, telemetry, and operational requirements.

### How are queries organized?

Queries follow a consistent naming convention: `[CATEGORY]-[MITRE_TACTIC]-[SHORT_DESCRIPTION]`. They are organized into folders by workflow type (hunts, detections, response, compliance). See [About Talon Hunt Framework](/about) for more details.

### Can I use Talon in a CI/CD pipeline?

Yes. Talon is designed with version control and CI/CD in mind. You can integrate the repository into your existing detection-as-code workflows using Git and your preferred CI/CD tooling.

---

## Troubleshooting

### A query isn't returning results. What should I check?

- **Data availability:** Ensure your Falcon tenant is collecting the relevant event types (e.g., `ProcessRollup2`, `NetworkConnect`).
- **Time range:** Widen your search window — some events may be infrequent.
- **Field names:** CrowdStrike occasionally updates field names across sensor versions. Verify field names match your current sensor version.
- **Permissions:** Confirm your account has access to the data sources referenced in the query.

### I'm getting a syntax error on import.

Ensure you're importing the correct file format expected by your Falcon module. If copying queries manually, check for encoding issues or trailing whitespace that may have been introduced during copy-paste.

---

## Contributing

### How can I contribute?

We welcome contributions! Please review the `CONTRIBUTING.md` file in the repository for submission guidelines, coding standards, and the pull request process.

### I found a bug or have a feature request.

Please open an [issue on GitHub](https://github.com/DominionCyber/talon_hunt_framework_documentation/issues) with a clear description and, if applicable, steps to reproduce.
