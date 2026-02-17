# Talon Hunt Framework — Schema Specification

This document defines the complete schema for the Talon Hunt Framework, covering all saved searches, lookup files, and building-block cradles that compose the framework's detection and enrichment pipeline.

- Version 1.0.0
- Release date 2026-02-16

---

## Table of Contents

- [1. Core](#_1-core)
- [2. Transforms](#_2-transforms)
  - [2a. Normalizers](#_2a-normalizers)
  - [2b. Deconflict Transforms](#_2b-deconflict-transforms)
  - [2c. Formatters](#_2c-formatters)
- [3. Lookups](#_3-lookups)
- [4. Cradles](#_4-cradles)
  - [4a. Query Cradles](#_4a-query-cradles)
  - [4b. Match Cradles](#_4b-match-cradles)

---

## 1. Core {#_1-core}

Core searches are foundational components that are never executed as standalone hunts. They provide normalization, enrichment, and linking logic that all downstream searches invoke to ensure consistent data representation across the framework. Core searches are organized into **Converters** and **Utilities**.

All core searches target `https://schemas.humio.com/query/v0.6.0` and default to a 15-minute non-live time interval.

### Converters

Converters transform raw telemetry values into normalized, human-readable representations.

<details>
<summary><code>talon_convert_file_size</code> — Byte-to-human-readable file size conversion</summary>

| Property | Value |
|----------|-------|
| **Labels** | `talon_hunt_framework`, `asset`, `convert`, `file_size` |

Converts raw byte values into human-readable file size strings using cascading thresholds. Coalesces `ModuleSize` and `Size` into a single `ByteSize` value, then applies unit conversion based on magnitude.

| Threshold | Output |
|-----------|--------|
| ≥ 1 TB | `X.XX TB` |
| ≥ 1 GB | `X.XX GB` |
| ≥ 1 MB | `X.XX MB` |
| > 1 KB | `X.XXX KB` |
| Fallback | `X Bytes` |

**Input Fields:** `ModuleSize`, `Size` (coalesced) · **Output Field:** `CommonSize`

</details>

<details>
<summary><code>talon_convert_time_utc</code> — Timestamp-to-UTC string conversion</summary>

| Property | Value |
|----------|-------|
| **Labels** | `talon_hunt_framework`, `asset`, `convert`, `time` |

Converts the event `@timestamp` into a standardized UTC time string for consistent display and cross-event temporal correlation. Uses the `en_US` locale with an explicit UTC (`Z`) timezone.

**Output Format:** `MM-DD-YYYY HH:MM:SS` · **Output Field:** `utc_time`

</details>
