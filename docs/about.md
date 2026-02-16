# About Talon Hunt Framework

## Overview

Talon Hunt Framework is developed and maintained by **Dominion Cyber**, a cybersecurity company focused on delivering practical, operator-driven tools for modern security operations.

## Framework Architecture

Talon is organized into logical categories that map to common security operations workflows:

### Saved Search Categories

- **Threat Hunting** — Proactive queries designed to surface suspicious activity, anomalies, and indicators of compromise across your Falcon telemetry.
- **Detection Engineering** — Production-grade detection rules that can be deployed as custom detections or integrated into CI/CD pipelines.
- **Incident Response** — Targeted queries for rapid triage, scoping, and investigation during active incidents.
- **Compliance & Audit** — Queries supporting policy enforcement, configuration validation, and audit trail review.

### File Structure

```
talon_hunt_framework_documentation/
├── hunts/              # Threat hunting saved searches
│   ├── persistence/
│   ├── lateral-movement/
│   ├── exfiltration/
│   └── ...
├── detections/         # Detection engineering rules
│   ├── malware/
│   ├── credential-access/
│   └── ...
├── response/           # Incident response queries
│   ├── triage/
│   ├── scoping/
│   └── ...
├── compliance/         # Compliance & audit queries
└── docs/               # This documentation site
```

## Naming Convention

All saved searches follow a consistent naming scheme:

```
[CATEGORY]-[MITRE_TACTIC]-[SHORT_DESCRIPTION]
```

**Examples:**

- `HUNT-TA0003-scheduled-task-creation`
- `DETECT-TA0006-mimikatz-indicators`
- `IR-TRIAGE-process-tree-by-host`

## MITRE ATT&CK Mapping

Talon queries are mapped to the [MITRE ATT&CK Framework](https://attack.mitre.org/) where applicable, making it easy to identify coverage gaps and align with industry-standard threat models.

## Contributing

Contributions are welcome. If you'd like to submit new queries, fix bugs, or improve documentation, please see the repository's `CONTRIBUTING.md` for guidelines.
