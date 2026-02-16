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

### Utilities

Utilities provide platform-specific enrichment, field resolution, and deep-link construction for CrowdStrike Falcon telemetry.

<details>
<summary><code>talon_utility_falcon_pid</code> — Unified Falcon process ID resolution</summary>

| Property | Value |
|----------|-------|
| **Labels** | `talon_hunt_framework`, `asset`, `utility`, `falconpid`, `global` |

Resolves a unified Falcon process identifier from multiple possible source fields. Different event types store the originating process ID under different field names; this utility normalizes them into a single field.

**Resolution Order (coalesce):** `ContextProcessId` → `RpcClientProcessId` → `WritingProcessId`

**Output Field:** `falconPID`

</details>

<details>
<summary><code>talon_utility_falcon_helper</code> — Falcon console field enrichment macro</summary>

| Property | Value |
|----------|-------|
| **Labels** | `talon_hunt_framework`, `asset`, `utility`, `enrichment`, `global` |

Enriches CrowdStrike Falcon telemetry by translating numeric or coded field values into human-readable descriptions via the `$falcon/helper:enrich()` macro. Uses a cascading `case` statement to detect which enrichable field is present in a given event and applies the appropriate enrichment call.

Covers **113 distinct fields** across identity & authentication, Active Directory, network & connectivity, process & execution, file system, registry, DNS, HTTP, Kerberos, LDAP, cloud & SSO, drivers & modules, ASEP persistence, services, signing & certificates, sensor & platform, container, named pipes & RPC, policy & exclusions, and endpoint intelligence categories.

Only the first matching field per event triggers enrichment. The terminal wildcard (`*`) acts as a no-op fallback.

</details>

---

## 2. Transforms {#_2-transforms}

Transforms sit between raw event ingestion and hunt queries. They standardize, deconflict, and format raw CrowdStrike Falcon telemetry so that downstream queries operate against clean, human-readable, and join-safe field values. Transforms are organized into three categories: **Normalizers**, **Deconflict Transforms**, and **Formatters**.

### 2a. Normalizers {#_2a-normalizers}

Normalizers translate raw numeric or coded telemetry values into descriptive, human-readable strings. They use two primary techniques: `case` statements for simple value-to-label mappings, and `bitfield:extractFlagsAsString()` for bitmask decomposition.

#### Windows Normalizers

<details>
<summary><code>talon_win_normalize_processrollup2</code> — Process execution normalization</summary>

| Property | Value |
|----------|-------|
| **Labels** | `normalize`, `processrollup2`, `windows` |

Translates `ImageSubsystem` to PE subsystem names (e.g., `WINDOWS_GUI`, `WINDOWS_CUI`, `WSL`), `IntegrityLevel` to token integrity labels (`UNTRUSTED` through `PROTECTED`), `SessionId` to `SYSTEM` or `USER`, and `CreateProcessType` to process creation method names. Decomposes `ProcessCreateFlags`, `ProcessParameterFlags`, `ProcessSxsFlags`, and `SignInfoFlags` bitmasks into named flag lists.

</details>

<details>
<summary><code>talon_win_normalize_networkconnectip4</code> — Network connection normalization</summary>

| Property | Value |
|----------|-------|
| **Labels** | `normalize`, `networkconnectip4`, `windows` |

Maps `Protocol` codes to standard names (`TCP`, `UDP`, `ICMP`, `GRE`, etc.), `ConnectionDirection` to directional labels (`INBOUND`, `OUTBOUND`, `NEITHER`), and decomposes `ConnectionFlags` into named flags such as `RAW_SOCKET`, `PROMISCUOUS_MODE_*`, and `IS_LOOPBACK`.

</details>

<details>
<summary><code>talon_win_normalize_dnsrequest</code> — DNS query normalization</summary>

| Property | Value |
|----------|-------|
| **Labels** | `normalize`, `dnsrequest`, `windows` |

Translates `RequestType` numeric codes to DNS record type names (`A`, `AAAA`, `CNAME`, `MX`, `TXT`, `NS`, `PTR`, `ANY`), `DnsResponseType` to source labels (`CACHE`, `WIRE`), and `QueryStatus` to descriptive error strings.

</details>

<details>
<summary><code>talon_win_normalize_pefilewritten</code> — PE file write normalization</summary>

| Property | Value |
|----------|-------|
| **Labels** | `normalize`, `pefilewritten`, `windows` |

Maps `CallStackModuleNamesVersion`, `ImageSubsystem`, and `FileCategory` to readable labels. Decomposes six bitmask fields: `FileEcpBitmask`, `SuspectStackFlag`, `ModuleCharacteristics`, `SignInfoFlags`, and `DllCharacteristics` into named flag lists for deep-dive analysis of file provenance and signing status.

</details>

<details>
<summary><code>talon_win_normalize_classifiedmoduleload</code> — Module load classification normalization</summary>

| Property | Value |
|----------|-------|
| **Labels** | `normalize`, `classifiedmoduleload`, `windows` |

Translates `MappedFromUserMode` to `KERNEL` or `USER`, maps `ImageSignatureType` and `ImageSignatureLevel` to descriptive labels, and decomposes `ModuleLoadTelemetryClassification`, `ModuleCharacteristics`, and `SignInfoFlags` bitmasks.

</details>

<details>
<summary><code>talon_win_normalize_imagehash</code> — Image hash normalization</summary>

| Property | Value |
|----------|-------|
| **Labels** | `normalize`, `imagehash`, `windows` |

Maps `PrimaryModule`, `MappedFromUserMode`, and `FileKnownStatus` to readable labels. Decomposes `ModuleCharacteristics` and `ModuleLoadTelemetryClassification` bitmasks.

</details>

<details>
<summary><code>talon_win_normalize_unsignedmoduleload</code> — Unsigned module load normalization</summary>

| Property | Value |
|----------|-------|
| **Labels** | `normalize`, `unsignedmoduleload`, `windows` |

Maps `MappedFromUserMode` to `KERNEL`/`USER` and decomposes the `ModuleCharacteristics` bitmask into PE characteristic flags.

</details>

<details>
<summary><code>talon_win_normalize_createservice</code> — Service creation normalization</summary>

| Property | Value |
|----------|-------|
| **Labels** | `normalize`, `createservice`, `windows` |

Translates `ServiceStart`, `ServiceErrorControl`, `ServiceType`, and `ServiceServiceSidType` to descriptive constants. Produces `NormalizedServiceDisplayName` and `NormalizedServiceImagePath` by lowercasing and stripping dynamic segments (GUIDs, version numbers, user-specific path components) to enable frequency-based stacking.

</details>

<details>
<summary><code>talon_win_normalize_asepvalueupdate</code> — ASEP persistence normalization</summary>

| Property | Value |
|----------|-------|
| **Labels** | `normalize`, `asepvalueupdate`, `windows` |

Maps `AsepFlags`, `RegType`, `RegOperationType` (including anti-tamper variants), `AsepValueType`, and `AsepClass` to descriptive labels spanning system startup, user logon, services, COM registration, and boot configuration categories.

</details>

<details>
<summary><code>talon_win_normalize_regsystemconfigvalueupdate</code> — Registry system config normalization</summary>

| Property | Value |
|----------|-------|
| **Labels** | `normalize`, `regsystemconfigvalueupdate`, `windows` |

Maps `RegOperationType`, `RegClassification` (extended set including security config, firewall, authentication policy, browser security, and generic suspicious categories), `RegClassificationFlags`, and `RegType` to descriptive labels.

</details>

<details>
<summary><code>talon_win_normalize_scheduledtaskregistered</code> — Scheduled task normalization</summary>

| Property | Value |
|----------|-------|
| **Labels** | `normalize`, `scheduledtaskregistered`, `windows` |

Resolves the `InterfaceGuid` to a human-readable RPC interface source name (e.g., `SAMR`, `SVCCTL`, `ITASKSCHEDULERSERVICE`, `WINREG`, `IWBEMSERVICES`) to identify which management interface registered the task.

</details>

<details>
<summary><code>talon_win_normalize_directorycreate</code> — Directory creation normalization</summary>

| Property | Value |
|----------|-------|
| **Labels** | `normalize`, `directorycreate`, `windows` |

Maps the `Status` field to descriptive NTSTATUS and CrowdStrike-specific status strings covering ~40 known values from `STATUS_SUCCESS` through custom Falcon codes. Decomposes `FileEcpBitmask`.

</details>

<details>
<summary><code>talon_win_normalize_newexecutablewritten</code> — New executable write normalization</summary>

| Property | Value |
|----------|-------|
| **Labels** | `normalize`, `newexecutablewritten`, `windows` |

Applies the same comprehensive `Status` code mapping as `DirectoryCreate` and decomposes `FileEcpBitmask`.

</details>

<details>
<summary><code>talon_win_normalize_dllinjection</code> — DLL injection normalization</summary>

| Property | Value |
|----------|-------|
| **Labels** | `normalize`, `dllinjection`, `windows` |

Decomposes the `InjectedThreadFlag` bitmask into named flags identifying injection characteristics such as `PREV_MODE_KERNEL`, `START_ADDRESS_IN_NAMED_PE`, and `START_ADDRESS_PRIVATE_MEM`.

</details>

<details>
<summary><code>talon_win_normalize_reflectivedotnetmoduleload</code> — Reflective .NET module normalization</summary>

| Property | Value |
|----------|-------|
| **Labels** | `normalize`, `reflectivedotnetmoduleload`, `windows` |

Maps `AssemblyFlags`, `DotnetModuleFlags`, and `EtwProviderType` to descriptive labels covering domain neutrality, dynamic loading, native images, and ETW provider types.

</details>

<details>
<summary><code>talon_win_normalize_scriptcontrolscantelemetry</code> — Script scan telemetry normalization</summary>

| Property | Value |
|----------|-------|
| **Labels** | `normalize`, `scriptcontrolscantelemetry`, `windows` |

Maps `HostProcessType` (PowerShell, WScript, CScript, Office, etc.) and `ScriptingLanguageId` (PowerShell, VBA, VBScript, JScript, .NET, Excel) to readable labels. Decomposes `SuspectStackFlag`.

</details>

<details>
<summary><code>talon_win_normalize_browserextensioninstalled</code> — Browser extension installation normalization</summary>

| Property | Value |
|----------|-------|
| **Labels** | `normalize`, `browserextensioninstalled`, `windows` |

Maps `BrowserExtensionInstallMethod` (browser, webstore, GPO, sideloaded), `BrowserName` (Firefox, Chrome, Edge, Safari and variants), `UpdateFlag`, and `BrowserExtensionArchitecture` (Manifest V2, V3, Safari App) to descriptive labels.

</details>

<details>
<summary><code>talon_win_normalize_motwwritten</code> — Mark of the Web normalization</summary>

| Property | Value |
|----------|-------|
| **Labels** | `normalize`, `motwwritten`, `windows` |

Maps `ZoneIdentifier` to Windows security zone names: `LOCAL_MACHINE`, `INTRANET`, `TRUSTED_SITES`, `INTERNET`, `RESTRICTED_SITES`.

</details>

<details>
<summary><code>talon_win_normalize_packedexecutablewritten</code> — Packed executable normalization</summary>

| Property | Value |
|----------|-------|
| **Labels** | `normalize`, `packedexecutablewritten`, `windows` |

Maps `FileSubType` to known packer names (`PE_PACKER_ASPACK`, `PE_PACKER_UPX`, `PE_PACKER_VMPROTECT`, etc.) and registry hive types.

</details>

<details>
<summary><code>talon_win_normalize_lnkfilewritten</code> — LNK file write normalization</summary>

| Property | Value |
|----------|-------|
| **Labels** | `normalize`, `lnkfilewritten`, `windows` |

Decomposes `FileEcpBitmask` and `FileWrittenFlags` bitmasks. Maps `FileCategory` to content type labels and `IsOnRemovableDisk` to `Yes`/`No`.

</details>

<details>
<summary><code>talon_win_normalize_newscriptwritten</code> — New script write normalization</summary>

| Property | Value |
|----------|-------|
| **Labels** | `normalize`, `newscriptwritten`, `windows` |

Maps `FileCategory` to content type labels (archives, office documents, source code, executables, etc.).

</details>

<details>
<summary><code>talon_win_normalize_webscriptfilewritten</code> — Web script file write normalization</summary>

| Property | Value |
|----------|-------|
| **Labels** | `normalize`, `webscriptfilewritten`, `windows` |

Decomposes `FileEcpBitmask` and `FileWrittenFlags` bitmasks. Maps `FileCategory` to content type labels.

</details>

<details>
<summary><code>talon_win_normalize_scriptfilewritteninfo</code> — Script file content scan normalization</summary>

| Property | Value |
|----------|-------|
| **Labels** | `normalize`, `scriptfilewritteninfo`, `windows` |

Maps `CscStatus` to descriptive result labels covering success, file access errors, transcoding failures, regex errors, and content sizing conditions.

</details>

<details>
<summary><code>talon_win_normalize_nt_authority_system_user</code> — Machine account username normalization</summary>

| Property | Value |
|----------|-------|
| **Labels** | `normalize`, `username`, `windows` |

Detects usernames ending with `$` (machine accounts) and rewrites them to `NT AUTHORITY\SYSTEM` for consistent filtering and grouping.

</details>

<details>
<summary><code>talon_win_normalize_file_path</code> — Device path prefix normalization</summary>

| Property | Value |
|----------|-------|
| **Labels** | `normalize`, `filepath`, `windows` |

Replaces `\Device\HarddiskVolumeN` prefixes with `HDD` and `\Device\Mup` (UNC redirector) prefixes with `UNC`. Operates on a parameterized `?TargetField`.

</details>

#### Linux Normalizers

<details>
<summary><code>talon_lin_normalize_processrollup2</code> — Linux process capability normalization</summary>

| Property | Value |
|----------|-------|
| **Labels** | `normalize`, `processrollup2`, `linux` |

Decomposes the `CapPrm` (permitted capabilities) bitmask into the full set of 41 Linux capability names, from `CAP_CHOWN` through `CAP_CHECKPOINT_RESTORE`. Enables quick identification of elevated capability grants such as `CAP_SYS_ADMIN`, `CAP_NET_RAW`, or `CAP_SYS_PTRACE`.

</details>

<details>
<summary><code>talon_lin_normalize_networkconnectip4</code> — Linux network connection normalization</summary>

| Property | Value |
|----------|-------|
| **Labels** | `normalize`, `networkconnectip4`, `linux` |

Provides the same `Protocol`, `ConnectionDirection`, and `ConnectionFlags` mappings as the Windows equivalent.

</details>

<details>
<summary><code>talon_lin_normalize_dnsrequest</code> — Linux DNS query normalization</summary>

| Property | Value |
|----------|-------|
| **Labels** | `normalize`, `dnsrequest`, `linux` |

Provides the same `RequestType`, `DnsResponseType`, and `QueryStatus` mappings as the Windows equivalent.

</details>

---

### 2b. Deconflict Transforms {#_2b-deconflict-transforms}

When a hunt query joins multiple event types, common field names like `FileName`, `FilePath`, and `SHA256HashData` collide. Deconflict transforms alias these fields to event-type-prefixed names so that each event type's data is preserved in its own column after a join.

**Naming Convention:** `{EventTypePrefix}{OriginalFieldName}` — e.g., `FileName` from `PEFileWritten` becomes `PeFileName`.

#### Windows Deconflict

<details>
<summary><code>talon_win_deconflict_processrollup2</code> — Prefix: <code>Child</code></summary>

| Original Field | Deconflicted Field |
|----------------|-------------------|
| `FileName` | `ChildFileName` |
| `FilePath` | `ChildFilePath` |
| `CommandLine` | `ChildCommandLine` |
| `SHA256HashData` | `ChildSHA256HashData` |
| `OriginalFilename` | `ChildOriginalFilename` |

</details>

<details>
<summary><code>talon_win_deconflict_classifiedmoduleload</code> — Prefix: <code>ClassifiedModule</code></summary>

| Original Field | Deconflicted Field |
|----------------|-------------------|
| `FileName` | `ClassifiedModuleFileName` |
| `FilePath` | `ClassifiedModuleFilePath` |
| `SHA256HashData` | `ClassifiedModuleSHA256HashData` |
| `OriginalFilename` | `ClassifiedModuleOriginalFilename` |

</details>

<details>
<summary><code>talon_win_deconflict_imagehash</code> — Prefix: <code>ImageHash</code></summary>

| Original Field | Deconflicted Field |
|----------------|-------------------|
| `FileName` | `ImageHashFileName` |
| `FilePath` | `ImageHashFilePath` |
| `SHA256HashData` | `ImageHashSHA256HashData` |
| `Size` | `ImageHashSize` |

</details>

<details>
<summary><code>talon_win_deconflict_unsignedmoduleload</code> — Prefix: <code>UnsignedModule</code></summary>

| Original Field | Deconflicted Field |
|----------------|-------------------|
| `FileName` | `UnsignedModuleFileName` |
| `FilePath` | `UnsignedModuleFilePath` |
| `SHA256HashData` | `UnsignedModuleSHA256HashData` |

</details>

<details>
<summary><code>talon_win_deconflict_reflectivedotnetmoduleload</code> — Prefix: <code>ReflectiveDotNETModule</code></summary>

| Original Field | Deconflicted Field |
|----------------|-------------------|
| `FileName` | `ReflectiveDotNETModuleFileName` |
| `FilePath` | `ReflectiveDotNETModuleFilePath` |
| `SHA256HashData` | `ReflectiveDotNETModuleSHA256HashData` |

</details>

<details>
<summary><code>talon_win_deconflict_pefilewritten</code> — Prefix: <code>Pe</code></summary>

| Original Field | Deconflicted Field |
|----------------|-------------------|
| `FileName` | `PeFileName` |
| `FilePath` | `PeFilePath` |
| `Size` | `PeFileSize` |
| `TargetFileName` | `PeTargetFileName` |

</details>

<details>
<summary><code>talon_win_deconflict_newexecutablewritten</code> — Prefix: <code>NewExecutable</code></summary>

| Original Field | Deconflicted Field |
|----------------|-------------------|
| `FileName` | `NewExecutableFileName` |
| `FilePath` | `NewExecutableFilePath` |
| `TargetFileName` | `NewExecutableTargetFileName` |

</details>

<details>
<summary><code>talon_win_deconflict_newscriptwritten</code> — Prefix: <code>NewScript</code></summary>

| Original Field | Deconflicted Field |
|----------------|-------------------|
| `FileName` | `NewScriptFileName` |
| `FilePath` | `NewScriptFilePath` |
| `TargetFileName` | `NewScriptTargetFileName` |

</details>

<details>
<summary><code>talon_win_deconflict_lnkfilewritten</code> — Prefix: <code>Lnk</code></summary>

| Original Field | Deconflicted Field |
|----------------|-------------------|
| `FileName` | `LnkFileName` |
| `FilePath` | `LnkFilePath` |
| `TargetFileName` | `LnkTargetFileName` |
| `Size` | `LnkFileSize` |

</details>

<details>
<summary><code>talon_win_deconflict_motwwritten</code> — Prefix: <code>Motw</code></summary>

| Original Field | Deconflicted Field |
|----------------|-------------------|
| `FileName` | `MotwFileName` |
| `FilePath` | `MotwFilePath` |
| `TargetFilePath` | `MotwTargetFilePath` |

</details>

<details>
<summary><code>talon_win_deconflict_directorycreate</code> — Prefix: <code>Directory</code></summary>

| Original Field | Deconflicted Field |
|----------------|-------------------|
| `FileName` | `DirectoryFileName` |
| `FilePath` | `DirectoryFilePath` |
| `TargetFileName` | `DirectoryTargetFileName` |

</details>

<details>
<summary><code>talon_win_deconflict_webscriptfilewritten</code> — Prefix: <code>WebScript</code></summary>

| Original Field | Deconflicted Field |
|----------------|-------------------|
| `FileName` | `WebScriptFileName` |
| `FilePath` | `WebScriptFilePath` |
| `TargetFileName` | `WebScriptTargetFileName` |
| `Size` | `WebScriptFileSize` |

</details>

<details>
<summary><code>talon_win_deconflict_scriptfilewritteninfo</code> — Prefix: <code>Script</code></summary>

| Original Field | Deconflicted Field |
|----------------|-------------------|
| `FileName` | `ScriptFileName` |
| `FilePath` | `ScriptFilePath` |
| `TargetFileName` | `ScriptTargetFileName` |

</details>

<details>
<summary><code>talon_win_deconflict_scheduledtaskregistered</code> — Prefix: <code>Task</code></summary>

| Original Field | Deconflicted Field |
|----------------|-------------------|
| `UserName` | `TaskUserName` |
| `ComputerName` | `TaskComputerName` |

</details>

#### Linux Deconflict

<details>
<summary><code>talon_lin_deconflict_processrollup2</code> — Prefix: <code>Child</code></summary>

| Original Field | Deconflicted Field |
|----------------|-------------------|
| `ImageFileName` | `ChildImageFileName` |
| `CommandLine` | `ChildCommandLine` |
| `SHA256HashData` | `ChildSHA256HashData` |
| `SHA1HashData` | `ChildSHA1HashData` |
| `MD5HashData` | `ChildMD5HashData` |
| `TargetProcessId` | `ChildTargetProcessId` |
| `RawProcessId` | `ChildRawProcessId` |
| `ProcessStartTime` | `ChildProcessStartTime` |
| `UID` | `ChildUID` |
| `RUID` | `ChildRUID` |
| `GID` | `ChildGID` |
| `RGID` | `ChildRGID` |
| `OciContainerId` | `ChildOciContainerId` |
| `PodId` | `ChildPodId` |
| `PIDNamespaceId` | `ChildPIDNamespaceId` |
| `TtyName` | `ChildTtyName` |
| `SSHSessionId` | `ChildSSHSessionId` |

</details>

---

### 2c. Formatters {#_2c-formatters}

Formatters reshape complex or encoded field values into structured, analyst-friendly output. Unlike normalizers, formatters perform structural transformations such as XML parsing, delimiter replacement, and array filtering.

<details>
<summary><code>talon_win_format_callstackmodules</code> — Call stack module extraction</summary>

| Property | Value |
|----------|-------|
| **Labels** | `format`, `callstackmodule`, `windows` |

Strips memory offset information from raw `CallStackModuleNames`, splits the pipe-delimited string, filters to only `.exe` and `.dll` entries, and reassembles into a newline-separated `CallStackModules` field.

</details>

<details>
<summary><code>talon_win_format_callstackmodules_child_process</code> — Child process call stack extraction</summary>

| Property | Value |
|----------|-------|
| **Labels** | `format`, `callstackmodule`, `windows` |

Same logic as above but writes to `ChildCallStackModuleNames` and `ChildCallStackModules` for use in join contexts where the call stack belongs to a child process.

</details>

<details>
<summary><code>talon_win_format_command_history</code> — PowerShell command history formatting</summary>

| Property | Value |
|----------|-------|
| **Labels** | `format`, `commandhistory`, `windows` |

Replaces pilcrow (`¶`) delimiters in the `CommandHistory` field with newline characters so that command history entries render as a structured, line-by-line list.

</details>

<details>
<summary><code>talon_win_format_scheduledtaskregistered</code> — Scheduled task XML parsing</summary>

| Property | Value |
|----------|-------|
| **Labels** | `format`, `scheduledtaskregistered`, `windows` |

Applies `parseXml()` to the `TaskXml` field, then strips Unicode control characters and excess whitespace from all extracted sub-fields including action commands, arguments, COM handler class IDs, principal settings, task settings, and trigger configurations across all trigger types.

</details>

---

## 3. Lookups {#_3-lookups}

Lookups are CSV-based reference tables loaded into the query engine and matched against event fields at search time. They serve two purposes: **filtering** (excluding non-routable traffic to reduce noise) and **detection enrichment** (annotating matches with operational context for triage).

<details>
<summary><code>rfc_exclusions.csv</code> — IPv4 special-purpose address catalog (35 entries)</summary>

| Property | Value |
|----------|-------|
| **Key Field** | `cidr_exclusion` |
| **Columns** | `cidr_exclusion`, `name`, `category`, `rfc`, `description`, `notes` |

Provides a comprehensive catalog of IPv4 address ranges that are non-routable, reserved, or carry special meaning per IETF RFCs and cloud provider conventions.

| Category | Count | Purpose |
|----------|-------|---------|
| RFC Special Purpose | 27 | Non-routable or reserved ranges — loopback, link-local, multicast, broadcast, transition technologies, protocol-specific anycast |
| RFC Documentation | 4 | TEST-NET ranges reserved for documentation; presence in live traffic is always anomalous |
| RFC 1918 Private | 3 | Standard private address blocks (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) |
| Cloud Infrastructure | 1 | Cloud instance metadata endpoint (`169.254.169.254/32`) — typically monitored, not excluded |

::: warning
The `169.254.169.254/32` (Cloud Metadata Service) entry should be evaluated carefully before use in exclusion filters. Unexpected access to this endpoint is a high-fidelity indicator of SSRF and credential theft.
:::

</details>

---

## 4. Cradles {#_4-cradles}

Cradles are the building blocks of the Talon Hunt Framework. They are pre-built, enriched saved searches that analysts use as starting points for hunt queries. Rather than writing raw queries from scratch, analysts begin with a cradle that already handles event selection, normalization, enrichment, deconfliction, and table formatting — then layer detection logic on top.

Cradles come in two types:

- **Query** — Searches a single event type with full enrichment. These are the simplest building blocks: filter an event, apply all relevant core and transform assets, and output a clean table.
- **Match** — Joins two or more event types together using `defineTable()` and `match()` to correlate activity across different telemetry sources. These enable cross-event analysis such as "show me the process that made this network connection" or "which process wrote this file."

### 4a. Query Cradles {#_4a-query-cradles}

Query cradles target a single `#event_simpleName` and apply the full enrichment pipeline: UTC time conversion, Falcon helper enrichment, relevant normalizers, deconflict transforms, file size conversion, path normalization, and GeoIP/ASN lookups where applicable.

#### Windows — Process

<details>
<summary><code>talon_win_query_processrollup2</code> — Process execution events</summary>

| Property | Value |
|----------|-------|
| **Event** | `ProcessRollup2` / `SyntheticProcessRollup2` |
| **Labels** | `query`, `processrollup2`, `syntheticprocessrollup2`, `windows` |
| **Assets Used** | `talon_convert_time_utc`, `talon_utility_falcon_helper`, `talon_win_format_callstackmodules`, `talon_win_normalize_file_path` (×2), `talon_win_normalize_nt_authority_system_user`, `talon_win_normalize_processrollup2` |

Base query for process execution data. Outputs process tree context (grandparent, parent, file path, command line), hash data, call stack modules, URL context, session/subsystem/integrity metadata, and all decoded bitmask fields.

</details>

<details>
<summary><code>talon_win_query_commandhistory</code> — PowerShell command history events</summary>

| Property | Value |
|----------|-------|
| **Event** | `CommandHistory` |
| **Labels** | `query`, `commandhistory`, `windows` |
| **Assets Used** | `talon_convert_time_utc`, `talon_utility_falcon_helper`, `talon_win_format_command_history`, `asn()` |

Base query for PowerShell command execution data. Formats pilcrow-delimited command history into readable line-by-line output. Enriches suspicious IPs with ASN data.

</details>

#### Windows — DNS

<details>
<summary><code>talon_win_query_dnsrequest</code> — DNS request events</summary>

| Property | Value |
|----------|-------|
| **Event** | `DnsRequest` |
| **Labels** | `query`, `dnsrequest`, `windows` |
| **Assets Used** | `talon_convert_time_utc`, `talon_utility_falcon_helper`, `talon_win_normalize_dnsrequest`, `asn()`, `ipLocation()` |

Base query for DNS resolution data. Normalizes request types and response sources. Enriches resolved IPs with ASN, organization, country, and city via GeoIP lookups.

</details>

#### Windows — Network

<details>
<summary><code>talon_win_query_networkconnectip4</code> — Network connection events</summary>

| Property | Value |
|----------|-------|
| **Event** | `NetworkConnectIP4` |
| **Labels** | `query`, `networkconnectip4`, `windows` |
| **Assets Used** | `talon_convert_time_utc`, `talon_utility_falcon_helper`, `talon_win_normalize_networkconnectip4`, `asn()`, `ipLocation()` |

Base query for IPv4 network connections. Normalizes protocol, direction, and connection flags. Enriches remote IPs with GeoIP and ASN data. Outputs Community ID for cross-tool correlation.

</details>

#### Windows — File

<details>
<summary><code>talon_win_query_directorycreate</code> — Directory creation events</summary>

| Property | Value |
|----------|-------|
| **Event** | `DirectoryCreate` |
| **Labels** | `query`, `directorycreate`, `windows` |
| **Assets Used** | `talon_convert_time_utc`, `talon_utility_falcon_helper`, `talon_win_normalize_directorycreate`, `talon_win_deconflict_directorycreate`, `talon_win_normalize_file_path` |

Base query for directory creation events. Normalizes status codes and deconflicts file fields. Outputs file system metadata including access, share, IRP flags, and ECP bitmask data.

</details>

<details>
<summary><code>talon_win_query_newexecutablewritten</code> — New executable file write events</summary>

| Property | Value |
|----------|-------|
| **Event** | `NewExecutableWritten` |
| **Labels** | `query`, `newexecutablewritten`, `windows` |
| **Assets Used** | `talon_convert_time_utc`, `talon_utility_falcon_helper`, `talon_win_normalize_newexecutablewritten`, `talon_win_deconflict_newexecutablewritten`, `talon_win_normalize_file_path` (×2) |

Base query for detecting newly written executable files. Normalizes status codes and deconflicts file fields.

</details>

<details>
<summary><code>talon_win_query_newscriptwritten</code> — New script file write events</summary>

| Property | Value |
|----------|-------|
| **Event** | `NewScriptWritten` |
| **Labels** | `query`, `newscriptwritten`, `windows` |
| **Assets Used** | `talon_convert_time_utc`, `talon_utility_falcon_helper`, `talon_win_normalize_newscriptwritten`, `talon_win_deconflict_newscriptwritten`, `talon_win_normalize_file_path` (×2) |

Base query for newly written script files. Normalizes file category and deconflicts file fields.

</details>

<details>
<summary><code>talon_win_query_lnkfilewritten</code> — LNK shortcut file write events</summary>

| Property | Value |
|----------|-------|
| **Event** | `LnkFileWritten` |
| **Labels** | `query`, `lnkfilewritten`, `windows` |
| **Assets Used** | `talon_convert_time_utc`, `talon_utility_falcon_helper`, `talon_win_normalize_lnkfilewritten`, `talon_win_deconflict_lnkfilewritten`, `talon_convert_file_size`, `talon_win_normalize_file_path` (×2) |

Base query for shortcut file creation. Normalizes file category, removable disk flag, and ECP/write flags. Converts file size to human-readable format.

</details>

<details>
<summary><code>talon_win_query_motwwritten</code> — Mark of the Web write events</summary>

| Property | Value |
|----------|-------|
| **Event** | `MotwWritten` |
| **Labels** | `query`, `motwwritten`, `windows` |
| **Assets Used** | `talon_convert_time_utc`, `talon_utility_falcon_helper`, `talon_win_normalize_motwwritten`, `talon_win_deconflict_motwwritten`, `talon_win_normalize_file_path` (×2), `parseUrl()` |

Base query for MOTW zone identifier writes. Normalizes zone identifiers and parses the `HostUrl` into components (host, port, path, query, fragment).

</details>

<details>
<summary><code>talon_win_query_webscriptfilewritten</code> — Web script file write events</summary>

| Property | Value |
|----------|-------|
| **Event** | `WebScriptFileWritten` |
| **Labels** | `query`, `webscriptfilewritten`, `windows` |
| **Assets Used** | `talon_convert_time_utc`, `talon_utility_falcon_helper`, `talon_win_normalize_webscriptfilewritten`, `talon_win_deconflict_webscriptfilewritten`, `talon_win_normalize_file_path` (×2), `talon_convert_file_size` |

Base query for web-sourced script file creation. Normalizes file category and ECP/write flag bitmasks. Converts file size.

</details>

<details>
<summary><code>talon_win_query_scriptfilewritteninfo</code> — Script file content info events</summary>

| Property | Value |
|----------|-------|
| **Event** | `ScriptFileWrittenInfo` |
| **Labels** | `query`, `scriptfilewritteninfo`, `windows` |
| **Assets Used** | `talon_convert_time_utc`, `talon_utility_falcon_helper`, `talon_win_normalize_scriptfilewritteninfo`, `talon_win_deconflict_scriptfilewritteninfo`, `talon_win_normalize_file_path` (×2) |

Base query for script file content scan results. Normalizes content scan status codes. Outputs script content and format string data.

</details>

<details>
<summary><code>talon_win_query_scriptcontrolscantelemetry</code> — Script execution telemetry events</summary>

| Property | Value |
|----------|-------|
| **Event** | `ScriptControlScanTelemetry` |
| **Labels** | `query`, `scriptcontrolscantelemetry`, `windows` |
| **Assets Used** | `talon_convert_time_utc`, `talon_utility_falcon_helper`, `talon_win_format_callstackmodules`, `talon_convert_file_size`, `talon_win_normalize_file_path` (×4), `talon_win_normalize_scriptcontrolscantelemetry` |

Base query for in-process script execution telemetry. Outputs full process tree, call stack modules, suspect stack flags, script content, scripting language, and reflective DLL data.

</details>

#### Windows — Module

<details>
<summary><code>talon_win_query_classifiedmoduleload</code> — Classified module load events</summary>

| Property | Value |
|----------|-------|
| **Event** | `ClassifiedModuleLoad` |
| **Labels** | `query`, `classifiedmoduleload`, `windows` |
| **Assets Used** | `talon_convert_time_utc`, `talon_utility_falcon_helper`, `talon_win_deconflict_classifiedmoduleload`, `talon_convert_file_size`, `talon_win_normalize_file_path` (×2), `talon_win_normalize_classifiedmoduleload`, `parseUrl()` (×2) |

Base query for classified DLL/module loads. Deconflicts module fields, normalizes signature type/level, and parses Host/Referer URLs. Outputs full module characteristics, telemetry classification, and signing flag bitmasks.

</details>

<details>
<summary><code>talon_win_query_imagehash</code> — Image hash events</summary>

| Property | Value |
|----------|-------|
| **Event** | `ImageHash` |
| **Labels** | `query`, `imagehash`, `windows` |
| **Assets Used** | `talon_convert_time_utc`, `talon_win_deconflict_imagehash`, `talon_utility_falcon_helper`, `talon_convert_file_size`, `talon_win_normalize_imagehash`, `talon_win_normalize_file_path` |

Base query for file image hash data. Normalizes primary module flag, known status, and mapping mode. Outputs Authenticode hash, module characteristics, and signing flags.

</details>

<details>
<summary><code>talon_win_query_unsignedmoduleload</code> — Unsigned module load events</summary>

| Property | Value |
|----------|-------|
| **Event** | `UnsignedModuleLoad` |
| **Labels** | `query`, `unsignedmoduleload`, `windows` |
| **Assets Used** | `talon_convert_time_utc`, `talon_utility_falcon_helper`, `talon_win_deconflict_unsignedmoduleload`, `talon_win_normalize_file_path`, `talon_win_normalize_unsignedmoduleload` |

Base query for unsigned DLL loads. Outputs signature state, error state, public keys, and module characteristics.

</details>

<details>
<summary><code>talon_win_query_reflectivedotnetmoduleload</code> — Reflective .NET module load events</summary>

| Property | Value |
|----------|-------|
| **Event** | `ReflectiveDotnetModuleLoad` |
| **Labels** | `query`, `reflectivedotnetmoduleload`, `windows` |
| **Assets Used** | `talon_convert_time_utc`, `talon_utility_falcon_helper`, `talon_win_normalize_file_path`, `talon_win_deconflict_reflectivedotnetmoduleload`, `talon_win_normalize_reflectivedotnetmoduleload` |

Base query for reflectively loaded .NET assemblies. Outputs assembly metadata, .NET module flags, ETW provider type, managed PDB path, and module IL path.

</details>

#### Windows — Persistence

<details>
<summary><code>talon_win_query_createservice</code> — Service creation events</summary>

| Property | Value |
|----------|-------|
| **Event** | `CreateService` |
| **Labels** | `query`, `createservice`, `windows` |
| **Assets Used** | `talon_convert_time_utc`, `talon_utility_falcon_helper`, `talon_win_normalize_createservice` |

Base query for Windows service creation. Outputs full service configuration including start type, error control, service type, SID type, dependencies, DLL path, required privileges, and normalized display name/image path for frequency stacking.

</details>

<details>
<summary><code>talon_win_query_scheduledtaskregistered</code> — Scheduled task registration events</summary>

| Property | Value |
|----------|-------|
| **Event** | `ScheduledTaskRegistered` |
| **Labels** | `query`, `scheduledtaskregistered`, `windows` |
| **Assets Used** | `talon_convert_time_utc`, `talon_utility_falcon_helper`, `talon_win_deconflict_scheduledtaskregistered`, `talon_win_format_scheduledtaskregistered`, `talon_win_normalize_scheduledtaskregistered` |

Base query for scheduled task registration. Parses TaskXml into structured fields. Outputs full trigger configuration, principal settings, task settings, and resolved RPC interface source.

</details>

#### Windows — Registry

<details>
<summary><code>talon_win_query_asepvalueupdate</code> — ASEP registry value update events</summary>

| Property | Value |
|----------|-------|
| **Event** | `AsepValueUpdate` |
| **Labels** | `query`, `asepvalueupdate`, `windows` |
| **Assets Used** | `talon_convert_time_utc`, `talon_utility_falcon_helper`, `talon_win_normalize_asepvalueupdate` |

Base query for Auto-Start Extensibility Point (ASEP) registry modifications. Outputs registry object, value, type, ASEP class, flags, and value type.

</details>

<details>
<summary><code>talon_win_query_regsystemconfigvalueupdate</code> — System config registry update events</summary>

| Property | Value |
|----------|-------|
| **Event** | `RegSystemConfigValueUpdate` |
| **Labels** | `query`, `asepvalueupdate`, `windows` |
| **Assets Used** | `talon_convert_time_utc`, `talon_utility_falcon_helper`, `talon_win_normalize_regsystemconfigvalueupdate` |

Base query for system configuration registry modifications. Outputs registry object, value, type, operation type, classification, and classification flags.

</details>

#### Linux — Process

<details>
<summary><code>talon_lin_query_processrollup2</code> — Linux process execution events</summary>

| Property | Value |
|----------|-------|
| **Event** | `ProcessRollup2` |
| **Labels** | `query`, `processrollup2`, `linux`, `falcon_container` |
| **Assets Used** | `talon_convert_time_utc`, `talon_utility_falcon_helper`, `talon_lin_normalize_processrollup2` |

Base query for Linux process execution. Outputs UID/GID pairs, parent process, image path, command line, all three hash types, SSH session, TTY, container/pod/namespace context, capabilities, and process tree identifiers.

</details>

#### Linux — DNS

<details>
<summary><code>talon_lin_query_dnsrequest</code> — Linux DNS request events</summary>

| Property | Value |
|----------|-------|
| **Event** | `DnsRequest` |
| **Labels** | `query`, `dnsrequest`, `linux`, `falcon_container` |
| **Assets Used** | `talon_convert_time_utc`, `talon_utility_falcon_helper`, `talon_lin_normalize_dnsrequest`, `asn()`, `ipLocation()` |

Base query for Linux DNS resolution. Normalizes request types and enriches resolved IPs. Includes additional record types (MX, NS, PTR, TXT) and container context.

</details>

#### Linux — Network

<details>
<summary><code>talon_lin_query_networkconnectip4</code> — Linux network connection events</summary>

| Property | Value |
|----------|-------|
| **Event** | `NetworkConnectIP4` |
| **Labels** | `query`, `networkconnectip4`, `linux`, `falcon_container` |
| **Assets Used** | `talon_convert_time_utc`, `talon_utility_falcon_helper`, `talon_lin_normalize_networkconnectip4`, `asn()`, `ipLocation()` |

Base query for Linux IPv4 network connections. Normalizes protocol, direction, and connection flags. Enriches remote IPs with GeoIP and ASN data.

</details>

---

### 4b. Match Cradles {#_4b-match-cradles}

Match cradles join two or more event types using `defineTable()` and `match()` to correlate activity across telemetry sources. Each match cradle has a **direction** indicated by its name: the first event type is loaded into the lookup table (L1), and the second event type is the primary search (L2) that matches against it. Bidirectional pairs are provided so analysts can choose which event type drives filtering.

Match cradles join on the Falcon process identifier — typically `TargetProcessId` matched to `falconPID` (resolved via `talon_utility_falcon_pid`) — and apply a `groupBy()` to deduplicate correlated results.

#### Windows — Process

<details>
<summary><code>talon_win_match_processrollup2_enhanced</code> — Parent → Child process correlation</summary>

| Property | Value |
|----------|-------|
| **L1 (Table)** | `ProcessRollup2` (child processes) |
| **L2 (Search)** | `ProcessRollup2` (parent processes) |
| **Join Key** | `TargetProcessId` ↔ `ParentProcessId` |
| **Labels** | `match`, `processrollup2`, `syntheticprocessrollup2`, `windows` |

Self-joins `ProcessRollup2` to enrich each process with its child process context. Outputs both parent and child file paths, command lines, hashes, call stack modules, and original filenames. Groups by `aid`.

</details>

#### Windows — DNS

<details>
<summary><code>talon_win_match_dnsrequest_processrollup2</code> — DNS → Process correlation</summary>

| Property | Value |
|----------|-------|
| **L1 (Table)** | `DnsRequest` |
| **L2 (Search)** | `ProcessRollup2` |
| **Join Key** | `TargetProcessId` ↔ `falconPID` |
| **Labels** | `match`, `dnsrequest`, `processrollup2`, `windows` |

Loads DNS requests into the lookup table and matches against process execution data. Enriches DNS events with full process tree context. Groups by `aid`, `SHA256HashData`, `DomainName`.

</details>

<details>
<summary><code>talon_win_match_processrollup2_dnsrequest</code> — Process → DNS correlation</summary>

| Property | Value |
|----------|-------|
| **L1 (Table)** | `ProcessRollup2` |
| **L2 (Search)** | `DnsRequest` |
| **Join Key** | `falconPID` ↔ `TargetProcessId` |
| **Labels** | `match`, `dnsrequest`, `processrollup2`, `windows` |

Loads process data into the lookup table and matches against DNS requests. Enables process-first filtering with DNS enrichment. Groups by `aid`, `SHA256HashData`, `DomainName`.

</details>

#### Windows — Network

<details>
<summary><code>talon_win_match_networkconnectip4_processrollup2</code> — Network → Process correlation</summary>

| Property | Value |
|----------|-------|
| **L1 (Table)** | `NetworkConnectIP4` |
| **L2 (Search)** | `ProcessRollup2` |
| **Join Key** | `TargetProcessId` ↔ `falconPID` |
| **Labels** | `match`, `networkconnectip4`, `processrollup2`, `windows` |

Loads network connections into the lookup table (with RFC exclusion filtering via `rfc_exclusions.csv`) and matches against process execution. Enriches with GeoIP/ASN. Groups by `aid`, `SHA256HashData`, `RemoteIP`.

</details>

<details>
<summary><code>talon_win_match_processrollup2_networkconnectip4</code> — Process → Network correlation</summary>

| Property | Value |
|----------|-------|
| **L1 (Table)** | `ProcessRollup2` |
| **L2 (Search)** | `NetworkConnectIP4` |
| **Join Key** | `falconPID` ↔ `TargetProcessId` |
| **Labels** | `match`, `networkconnectip4`, `processrollup2`, `windows` |

Loads process data into the lookup table and matches against network connections (with RFC exclusion filtering). Groups by `aid`.

</details>

#### Windows — File

<details>
<summary><code>talon_win_match_directorycreate_processrollup2</code> — DirectoryCreate → Process</summary>

**L1:** `DirectoryCreate` · **L2:** `ProcessRollup2` · Enriches directory creation events with the process that created them.

</details>

<details>
<summary><code>talon_win_match_processrollup2_directorycreate</code> — Process → DirectoryCreate</summary>

**L1:** `ProcessRollup2` · **L2:** `DirectoryCreate` · Enriches process data with directory creation activity.

</details>

<details>
<summary><code>talon_win_match_newexecutablewritten_processrollup2</code> — NewExecutableWritten → Process</summary>

**L1:** `NewExecutableWritten` · **L2:** `ProcessRollup2` · Enriches new executable write events with the writing process context.

</details>

<details>
<summary><code>talon_win_match_newscriptwritten_processrollup2</code> — NewScriptWritten → Process</summary>

**L1:** `NewScriptWritten` · **L2:** `ProcessRollup2` · Enriches new script write events with the writing process context.

</details>

<details>
<summary><code>talon_win_match_lnkfilewritten_processrollup2</code> — LnkFileWritten → Process</summary>

**L1:** `LnkFileWritten` · **L2:** `ProcessRollup2` · Enriches shortcut file creation events with the writing process context.

</details>

<details>
<summary><code>talon_win_match_motwwritten_processrollup2</code> — MotwWritten → Process</summary>

**L1:** `MotwWritten` · **L2:** `ProcessRollup2` · Enriches Mark of the Web events with the process that triggered them.

</details>

<details>
<summary><code>talon_win_match_webscriptfilewritten_processrollup2</code> — WebScriptFileWritten → Process</summary>

**L1:** `WebScriptFileWritten` · **L2:** `ProcessRollup2` · Enriches web script file creation events with the writing process context.

</details>

<details>
<summary><code>talon_win_match_scriptfilewritteninfo_processrollup2</code> — ScriptFileWrittenInfo → Process</summary>

**L1:** `ScriptFileWrittenInfo` · **L2:** `ProcessRollup2` · Enriches script content scan events with the writing process context.

</details>

#### Windows — Module

<details>
<summary><code>talon_win_match_classifiedmoduleload_processrollup2</code> — ClassifiedModuleLoad → Process</summary>

**L1:** `ClassifiedModuleLoad` · **L2:** `ProcessRollup2` · Enriches classified module loads with the host process context.

</details>

<details>
<summary><code>talon_win_match_processrollup2_classifiedmoduleload</code> — Process → ClassifiedModuleLoad</summary>

**L1:** `ProcessRollup2` · **L2:** `ClassifiedModuleLoad` · Enriches process data with loaded module details.

</details>

<details>
<summary><code>talon_win_match_imagehash_processrollup2</code> — ImageHash → Process</summary>

**L1:** `ImageHash` · **L2:** `ProcessRollup2` · Enriches image hash events with the executing process context.

</details>

<details>
<summary><code>talon_win_match_processrollup2_imagehash</code> — Process → ImageHash</summary>

**L1:** `ProcessRollup2` · **L2:** `ImageHash` · Enriches process data with image hash details.

</details>

<details>
<summary><code>talon_win_match_unsignedmoduleload_processrollup2</code> — UnsignedModuleLoad → Process</summary>

**L1:** `UnsignedModuleLoad` · **L2:** `ProcessRollup2` · Enriches unsigned module loads with the host process context.

</details>

<details>
<summary><code>talon_win_match_processrollup2_unsignedmoduleload</code> — Process → UnsignedModuleLoad</summary>

**L1:** `ProcessRollup2` · **L2:** `UnsignedModuleLoad` · Enriches process data with unsigned module load details.

</details>

<details>
<summary><code>talon_win_match_reflectivedotnetmoduleload_processrollup2</code> — ReflectiveDotnetModuleLoad → Process</summary>

**L1:** `ReflectiveDotnetModuleLoad` · **L2:** `ProcessRollup2` · Enriches reflective .NET module loads with the host process context.

</details>

<details>
<summary><code>talon_win_match_processrollup2_reflectivedotnetmoduleload</code> — Process → ReflectiveDotnetModuleLoad</summary>

**L1:** `ProcessRollup2` · **L2:** `ReflectiveDotnetModuleLoad` · Enriches process data with reflective .NET module details.

</details>

#### Windows — Persistence

<details>
<summary><code>talon_win_match_createservice_processrollup2</code> — CreateService → Process</summary>

**L1:** `CreateService` · **L2:** `ProcessRollup2` · Enriches service creation events with the process that installed them.

</details>

<details>
<summary><code>talon_win_match_processrollup2_createservice</code> — Process → CreateService</summary>

**L1:** `ProcessRollup2` · **L2:** `CreateService` · Enriches process data with service creation activity.

</details>

<details>
<summary><code>talon_win_match_scheduledtaskregistered_processrollup2</code> — ScheduledTaskRegistered → Process</summary>

**L1:** `ScheduledTaskRegistered` · **L2:** `ProcessRollup2` · Enriches scheduled task registration events with the registering process context.

</details>

<details>
<summary><code>talon_win_match_processrollup2_scheduledtaskregistered</code> — Process → ScheduledTaskRegistered</summary>

**L1:** `ProcessRollup2` · **L2:** `ScheduledTaskRegistered` · Enriches process data with scheduled task registration activity.

</details>

#### Windows — Registry

<details>
<summary><code>talon_win_match_asepvalueupdate_processrollup2</code> — AsepValueUpdate → Process</summary>

**L1:** `AsepValueUpdate` · **L2:** `ProcessRollup2` · Enriches ASEP registry modification events with the modifying process context.

</details>

<details>
<summary><code>talon_win_match_processrollup2_asepvalueupdate</code> — Process → AsepValueUpdate</summary>

**L1:** `ProcessRollup2` · **L2:** `AsepValueUpdate` · Enriches process data with ASEP registry modification activity.

</details>

#### Linux — Network

<details>
<summary><code>talon_lin_match_networkconnectip4_processrollup2</code> — Network → Process (Linux)</summary>

| Property | Value |
|----------|-------|
| **L1 (Table)** | `NetworkConnectIP4` |
| **L2 (Search)** | `ProcessRollup2` |
| **Join Key** | `TargetProcessId` ↔ `falconPID` |
| **Labels** | `match`, `networkconnectip4`, `processrollup2`, `linux` |

Loads Linux network connections into the lookup table and matches against process execution. Includes full Linux process context: UID/GID pairs, container/pod/namespace identifiers, capabilities, SSH session, and TTY data. Groups by `aid`.

</details>

