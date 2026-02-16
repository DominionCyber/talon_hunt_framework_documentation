# Introduction

## What is Talon Hunt Framework?

Talon Hunt Framework is a collection of saved searches designed for native import into **CrowdStrike Falcon**, enabling streamlined threat hunting, detection engineering, and incident response activities with **zero external dependencies**.

Talon leverages the power of **CrowdStrike Query Language (CQL)** to provide analysts and engineers with a standardized framework for building, organizing, and maintaining detection content.

## Why Talon?

Security teams often face challenges when scaling their threat hunting and detection capabilities:

- **Inconsistent queries** across team members lead to gaps in coverage.
- **No version control** means detection logic is lost or duplicated.
- **External tool dependencies** create unnecessary complexity and maintenance overhead.
- **Ad-hoc workflows** make it difficult to establish repeatable, auditable processes.

Talon addresses these challenges by establishing a **common language** across security teams, supporting proper CI/CD pipelines for hunt and detection workflows. Queries remain consistent, version-controlled, and production-ready.

## Who is Talon For?

Talon is built for security professionals who operate within the CrowdStrike Falcon ecosystem:

- **Threat Hunters** who need reliable, repeatable queries for proactive investigation.
- **Detection Engineers** building and maintaining detection-as-code pipelines.
- **SOC Analysts** performing triage and incident response using saved searches.
- **Security Leaders** looking to standardize and scale their team's detection capabilities.

## Core Principles

| Principle | Description |
|---|---|
| **Native First** | Everything runs inside CrowdStrike Falcon — no external tooling required. |
| **CQL Standard** | All content is written in CrowdStrike Query Language for consistency. |
| **Version Controlled** | Designed for Git-based workflows and CI/CD integration. |
| **Team Oriented** | A shared framework that scales across analysts and engineers. |
| **Production Ready** | Every query is tested, documented, and deployment-ready. |
