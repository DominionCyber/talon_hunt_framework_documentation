# Talon Hunt Framework Schema Specification

This document defines the high-level schema and structural components of the **Talon Hunt Framework**. It describes the standardized format and organization of saved searches, lookup resources, and modular building blocks ("cradles") that collectively support the framework’s detection, enrichment, and investigative pipeline.

- **Version:** 1.0.0  
- **Release Date:** 2026-02-16  

---

## Core Saved Queries

Core saved queries represent foundational schema components within the Talon Hunt Framework. These queries are not intended to be executed as standalone hunts. Instead, they provide platform-agnostic normalization, enrichment, and linkage logic that is consistently invoked by downstream detection and investigative searches.

Core queries are categorized into two functional groups:

- **Converters**
- **Utilities**

---

### Converters

Converters perform deterministic transformations of machine-oriented fields into operator-friendly representations. These conversions improve analyst readability by translating raw telemetry values (for example, epoch timestamps or byte counts) into standardized human-readable formats.

**Example:** `talon_convert_time_utc`

```
// =====================================================
// CONVERSION
// =====================================================
| utc_time := timestamp
| formatTime(
    format="%m-%d-%Y %H:%M:%S",
    field=utc_time,
    locale=en_US,
    timezone=Z,
    as=utc_time
)
```

This converter normalizes sensor-provided epoch time into a formatted UTC timestamp suitable for consistent presentation across Talon hunts and reporting outputs.

---

### Utilities

Utilities provide reusable functional fields and enrichment-ready event structures. These queries are designed to generate stable identifiers and schema-consistent fields that downstream searches can reference without requiring repeated field-specific logic.

Utilities commonly integrate with the native `$falcon/helper:enrich` mechanism, enabling enrichment operations to be applied uniformly across eligible fields. This approach reduces query duplication, minimizes hunt complexity, and lowers the knowledge overhead required for analysts to leverage enrichment capabilities.

**Example:** `talon_utility_falcon_pid`

```
// =====================================================
// UTILITY
// =====================================================
| falconPID := coalesce([ContextProcessId, RpcClientProcessId, WritingProcessId])
```

This utility generates a normalized `falconPID` identifier by selecting the first available process identifier from the event context. The resulting field is used to correlate multiple independent telemetry events into a unified process-level investigative view presented to the analyst.
