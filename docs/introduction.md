# Introduction to Talon

Dominion Cyber’s Talon Hunt Framework is a curated library of CrowdStrike Falcon saved searches, packaged for native import into Falcon. It is designed to accelerate threat hunting, detection engineering, and incident response without requiring external tooling or dependencies.

Talon is built on CrowdStrike Query Language (CQL) and provides a consistent structure for authoring, organizing, and maintaining detection and hunt content. By standardizing query patterns and naming conventions across teams, Talon enables repeatable, reviewable, and version-controlled workflows—supporting mature detection-as-code and hunting-as-code practices within CI/CD pipelines.

## The Problem

Security teams commonly encounter challenges such as:

- Inconsistent query syntax and style across analysts and engineers
- Limited or ad hoc version control for detection logic and hunt queries
- Difficulty reproducing hunts reliably across Falcon environments and teams
- Time-consuming interpretation of complex or poorly documented telemetry
- Friction translating platform-agnostic detection logic into functional CQL

## The Talon Solution

Talon provides a unified, import-ready framework of CQL searches that can be deployed into any CrowdStrike Falcon environment. The framework reduces variability in how queries are authored and maintained, enabling teams to operationalize consistent hunting and detection workflows more quickly and with fewer translation errors.

### Key Capabilities

1. Standardization: Provides consistent query structure and conventions to simplify authoring and reduce drift across teams.
2. CI/CD Integration: Supports detection-as-code and hunting-as-code workflows, enabling code review, versioning, and controlled promotion into production.
3. Performance: Queries are designed to be efficient and scalable, supporting high-volume datasets and large environments.

## Getting Started

To begin using Talon, ensure you have access to your CrowdStrike Falcon instance and review the [Getting Started](/getting-started) page.
