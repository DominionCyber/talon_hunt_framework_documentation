# Talon Hunt Framework Schema Specification

This document defines the high-level schema and structural components of the **Talon Hunt Framework**. It describes the standardized format and organization of saved searches, lookup resources, and modular building blocks ("cradles") that collectively support the framework's detection, enrichment, and investigative pipeline.

- **Version:** 1.0.0  
- **Release Date:** 2026-02-16  

## Core Saved Queries

Core saved queries represent foundational schema components within the Talon Hunt Framework. These queries are not intended to be executed as standalone hunts. Instead, they provide platform-agnostic normalization, enrichment, and linkage logic that downstream detection and investigative searches invoke consistently.

Core queries are categorized into two functional groups:

- **Converters**: Deterministic field transformations for analyst readability.
- **Utilities**: Reusable identifiers and enrichment-ready event structures.

### Converters

Converters perform deterministic transformations of machine-oriented fields into operator-friendly representations. These conversions improve analyst readability by translating raw telemetry values (for example, epoch timestamps or byte counts) into standardized, human-readable formats.

**Example:** `talon_convert_time_utc`

``` sql
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

::: details Query Explanation
This converter normalizes sensor-provided epoch time into a formatted UTC timestamp suitable for consistent presentation across Talon hunts and reporting outputs.
:::

---

### Utilities

Utilities provide reusable functional fields and enrichment-ready event structures. These queries generate stable identifiers and schema-consistent fields that downstream searches can reference without requiring repeated field-specific logic.

Utilities commonly integrate with the native `$falcon/helper:enrich` mechanism, enabling enrichment operations to be applied uniformly across eligible fields. This approach reduces query duplication, minimizes hunt complexity, and lowers the knowledge overhead required for analysts to leverage enrichment capabilities.

**Example:** `talon_utility_falcon_pid`

``` sql
// =====================================================
// UTILITY
// =====================================================
| falconPID := coalesce([ContextProcessId, RpcClientProcessId, WritingProcessId])
```

::: details Query Explanation
This utility generates a normalized `falconPID` identifier by selecting the first available process identifier from the event context. The resulting field is used to correlate multiple independent telemetry events into a unified, process-level investigative view presented to the analyst.
:::

---

## Transforms

Transforms are responsible for field deconfliction, value formatting to enhance readability, and value normalization to support statistical analysis techniques such as stack counting. Transforms are categorized into three functional groups:

- **Deconflictors**: Rename colliding field names to prevent data loss during event joins.
- **Formatters**: Clean and reformat field values for improved readability.
- **Normalizers**: Translate machine-readable numeric values into human-readable labels.

### Deconflictors

Deconflictors resolve field-name collisions that occur when joining events. Across CrowdStrike telemetry, identical field names appear in multiple event types. This becomes problematic when events are joined together: if field names overlap, values from one event overwrite those from another, and the analyst loses visibility into each event's respective data.

As a practical example, a `ProcessRollup2` event contains the field `FileName`, and the `PEFileWritten` event contains its own `FileName` field. Without deconflicting these fields prior to joining, the analyst would be unable to distinguish the `FileName` value originating from `ProcessRollup2` from the one originating from `PEFileWritten`. This collision pattern is common across many field names and data types within CrowdStrike telemetry.

**Example:** `talon_win_deconflict_pefilewritten`

``` sql
  // =====================================================
  // DECONFLICT FIELDS
  // =====================================================
  | PeFileName := FileName
  | PeFilePath := FilePath
  | PeFileSize := Size
  | PeTargetFileName := TargetFileName
```

::: details Query Explanation
This query renames the `PEFileWritten` native fields `FileName`, `FilePath`, `Size`, and `TargetFileName` to the unique aliases `PeFileName`, `PeFilePath`, `PeFileSize`, and `PeTargetFileName`, respectively. This prevents field collision when using `match` queries to join events.
:::

---

### Formatters

Formatters improve the readability of event field values. Within CrowdStrike telemetry, certain events contain characters (such as Unicode characters, pilcrow characters (`¶`), and other delimiters) that can hinder analyst interpretation. Formatters clean the final table output of a query to enhance readability and streamline downstream analysis in external tools such as Excel, Power BI, or LLM-based workflows.

As a practical example, the `CommandHistory` event inserts a pilcrow character (`¶`) to separate individual commands. Replacing these with newline characters produces a cleaner, more legible output.

**Example:** `talon_win_format_commandhistory`

``` sql
  // =====================================================
  // FORMATTING
  // =====================================================
  | replace(
      field=CommandHistory,
      regex="\\¶",
      with="\n",
      as=CommandHistory
  )
```

::: details Query Explanation
This query replaces the pilcrow character with a newline character to enhance readability of the `CommandHistory` field.
:::

---

### Normalizers

Normalizers translate fields that are primarily machine-readable (typically numeric values) into human-readable output that analysts can interpret without referencing external documentation.

As a practical example, the `NetworkConnectIP4` event contains fields such as `Protocol`, `ConnectionDirection`, and `ConnectionFlags`, all of which present as numeric values. For the `Protocol` field, a value of `6` maps to the protocol `TCP`. Normalizers perform this translation inline.

**Example:** `talon_win_normalize_networkconnectip4`

``` sql
  // =====================================================
  // NORMALIZATION
  // =====================================================
  | case {
      Protocol = "0"   | Protocol := "IP";
      Protocol = "1"   | Protocol := "ICMP";
      Protocol = "2"   | Protocol := "IGMP";
      Protocol = "6"   | Protocol := "TCP";
      Protocol = "17"  | Protocol := "UDP";
      Protocol = "41"  | Protocol := "IPV6";
      Protocol = "47"  | Protocol := "GRE";
      Protocol = "58"  | Protocol := "ICMPV6";
      Protocol = "255" | Protocol := "UNKNOWN";
      *
  }

  | case {
      ConnectionDirection = "0" | ConnectionDirection := "OUTBOUND";
      ConnectionDirection = "1" | ConnectionDirection := "INBOUND";
      ConnectionDirection = "2" | ConnectionDirection := "NEITHER";
      ConnectionDirection = "3" | ConnectionDirection := "INBOUND & OUTBOUND";
      ConnectionDirection = "4" | ConnectionDirection := "UNKNOWN";
      *
  }

  | bitfield:extractFlagsAsString(
      field="ConnectionFlags",
      flagNames=[
          [0, "RAW_SOCKET"],
          [1, "PROMISCUOUS_MODE_SIO_RCVALL"],
          [2, "PROMISCUOUS_MODE_SIO_RCVALL_IGMPMCAST"],
          [3, "PROMISCUOUS_MODE_SIO_RCVALL_MCAST"],
          [4, "IS_LOOPBACK"]
      ],
      as="ConnectionFlags_mask",
      separator=", "
  )
```

::: details Query Explanation
This query converts the numeric values of the `Protocol` and `ConnectionDirection` fields to their human-readable equivalents. For the `ConnectionFlags` field, it translates the numeric value into its constituent flag components using the LogScale `bitfield:extractFlagsAsString` function, producing a new field called `ConnectionFlags_mask` that contains the human-readable flag labels.
:::

---

## Lookups

Lookups are CSV or JSON data sets used for inline enrichment or search inclusion/exclusion filtering. They are typically employed to target a narrow, specific set of data or to filter out consistently unwanted records.

**Example:** `rfc_exclusions.csv`

``` csv
cidr_exclusion,name,category,rfc,description,notes
10.0.0.0/8,Private-Use Class A,RFC 1918 Private,RFC 1918,Private network space - Class A equivalent,Largest private address block - 16.7M addresses
172.16.0.0/12,Private-Use Class B,RFC 1918 Private,RFC 1918,Private network space - Class B equivalent,1M addresses - 172.16.0.0 to 172.31.255.255
192.168.0.0/16,Private-Use Class C,RFC 1918 Private,RFC 1918,Private network space - Class C equivalent,65K addresses - most common home network range
```

::: details Query Explanation
This lookup table provides a list of Class A, B, and C private network CIDR ranges that can be used to exclude internal network traffic from a `NetworkConnectIP4` query. Filtering these ranges reduces result volume and improves efficacy, particularly when searching for external network connections.
:::

---

## Cradles

Cradles are the primary building blocks of the Talon Hunt Framework. They provide analysts with reusable query templates that enforce consistent field presentation, enrichment, normalization, formatting, and deconfliction. The goal is to ensure uniformity across queries, which streamlines development and produces a consistent output schema that supports downstream automation and analysis. Cradles are categorized into two types:

- **Query Cradle**: A single-event building block for deep-dive analysis of a specific event type.
- **Match Cradle**: A multi-event building block that joins related events via the `defineTable` and `match` functions.

### Query Cradle

The query cradle is a single-event building block that analysts can use to investigate a specific event type. It provides a standardized search template with built-in enrichment, normalization, and a predefined table output.

**Example:** `talon_win_cradle_processrollup2`

``` sql
  // =====================================================
  // SEARCH
  // =====================================================
  #event_simpleName=/ProcessRollup2/ event_platform=Win FileName=/bad\.exe/i

  // =====================================================
  // SEARCH ASSETS
  // =====================================================
  | $talon_convert_time_utc()
  | $talon_utility_falcon_helper()
  | $talon_win_format_callstackmodules()
  | $talon_win_normalize_file_path(TargetField=FilePath)
  | $talon_win_normalize_file_path(TargetField=CallStackModules)
  | $talon_win_normalize_nt_authority_system_user()
  | $talon_win_normalize_processrollup2()

  // =====================================================
  // TABLE
  // =====================================================
  | table(
      [
          utc_time,
          ComputerName,
          UserName,
          GrandParentBaseFileName,
          ParentBaseFileName,
          FilePath,
          FileName,
          CommandLine,
          SHA256HashData,
          CallStackModules,
          HostUrl,
          RefererUrl,
          OriginalFilename,
          SessionId,
          ImageSubsystem,
          IntegrityLevel,
          CreateProcessType,
          ProcessCreateFlags,
          ProcessCreateFlags_mask,
          ProcessParameterFlags,
          ProcessParameterFlags_mask,
          ProcessSxsFlags,
          ProcessSxsFlags_mask,
          RawProcessId,
          SignInfoFlags,
          SignInfoFlags_mask
      ],
      limit=max
  )
```

::: details Query Explanation
This query provides the building blocks to search for `ProcessRollup2` events. It allows the analyst to add criteria under the `SEARCH` section and receive consistent data presentation via the `table` function, which can be modified to include or exclude fields as needed. In this example, the query searches for any process execution where the `FileName` field contains `bad.exe`.
:::

---

### Match Cradle

The match cradle is a multi-event building block that joins events together using the `defineTable` function, correlating them on the generated `falconPID` field to link related telemetry. Field deconfliction is executed as part of the query operations to prevent field collision, alongside various enrichments to improve readability and analytical functionality.

**Example:** `talon_win_cradle_match_networkconnectip4_processrollup2`

``` sql
  // =====================================================
  // L1 SEARCH
  // =====================================================
  defineTable(
      query={
        #event_simpleName=NetworkConnectIP4 event_platform=Win RemoteIP=/1\.1\.1\.1/i
        | $talon_utility_falcon_pid()
        | $talon_win_normalize_networkconnectip4()
        | asn(RemoteIP)
        | ipLocation(RemoteIP)
        | !cidr(RemoteAddressIP4, file="rfc_exclusions.csv", column="cidr_block")
      },
      name=network_connections,
      include=[
          falconPID,
          ContextBaseFileName,
          Protocol,
          ConnectionDirection,
          ConnectionFlags,
          ConnectionFlags_mask,
          CommunityID,
          LocalIP,
          LocalPort,
          RemoteIP,
          RemotePort,
          RemoteIP.asn,
          RemoteIP.org,
          RemoteIP.country,
          RemoteIP.city
      ]
  )

  // =====================================================
  // L2 SEARCH
  // =====================================================
  | #event_simpleName=/ProcessRollup2/ event_platform=Win FileName=/^bad\.exe$/i
  | $talon_win_format_callstackmodules()
  | $talon_win_normalize_nt_authority_system_user()
  | $talon_win_normalize_file_path(TargetField=FilePath)
  | $talon_win_normalize_file_path(TargetField=CallStackModules)
  | $talon_win_normalize_processrollup2()

  // =====================================================
  // MATCH STATEMENT
  // =====================================================
  | match(
      table=network_connections,
      field=TargetProcessId,
      column=falconPID
  )

  // =====================================================
  // L2 SEARCH ASSETS
  // =====================================================
  | $talon_convert_time_utc()
  | $talon_utility_falcon_helper()
  | $talon_win_format_callstackmodules()
  | $talon_win_normalize_file_path(TargetField=FilePath)
  | $talon_win_normalize_file_path(TargetField=CallStackModules)
  | $talon_win_normalize_nt_authority_system_user()
  | $talon_win_normalize_processrollup2()

  // =====================================================
  // GROUP BY LOGIC
  // =====================================================
  | groupBy(
      [aid, SHA256HashData, RemoteIP],
      function=[
          collect([
              utc_time,
              ComputerName,
              UserName,
              GrandParentBaseFileName,
              ParentBaseFileName,
              FilePath,
              FileName,
              ContextBaseFileName,
              CommandLine,
              SHA256HashData,
              CallStackModules,
              HostUrl,
              RefererUrl,
              OriginalFilename,
              SessionId,
              ImageSubsystem,
              IntegrityLevel,
              CreateProcessType,
              ProcessCreateFlags,
              ProcessCreateFlags_mask,
              ProcessParameterFlags,
              ProcessParameterFlags_mask,
              ProcessSxsFlags,
              ProcessSxsFlags_mask,
              RawProcessId,
              Protocol,
              ConnectionDirection,
              ConnectionFlags,
              ConnectionFlags_mask,
              CommunityID,
              LocalIP,
              LocalPort,
              RemoteIP,
              RemotePort,
              RemoteIP.asn,
              RemoteIP.org,
              RemoteIP.country,
              RemoteIP.city
          ])
      ],
      limit=max
  )

  // =====================================================
  // TABLE
  // =====================================================
  | table(
      [
          utc_time,
          ComputerName,
          UserName,
          GrandParentBaseFileName,
          ParentBaseFileName,
          FilePath,
          FileName,
          ContextBaseFileName,
          CommandLine,
          SHA256HashData,
          CallStackModules,
          HostUrl,
          RefererUrl,
          OriginalFilename,
          SessionId,
          ImageSubsystem,
          IntegrityLevel,
          CreateProcessType,
          ProcessCreateFlags,
          ProcessCreateFlags_mask,
          ProcessParameterFlags,
          ProcessParameterFlags_mask,
          ProcessSxsFlags,
          ProcessSxsFlags_mask,
          RawProcessId,
          Protocol,
          ConnectionDirection,
          ConnectionFlags,
          ConnectionFlags_mask,
          CommunityID,
          LocalIP,
          LocalPort,
          RemoteIP,
          RemotePort,
          RemoteIP.asn,
          RemoteIP.org,
          RemoteIP.country,
          RemoteIP.city
      ]
  )
```

::: details Query Explanation
This query provides the building blocks to search for `NetworkConnectIP4` events, store them in a temporary lookup via the `defineTable` function, and leverage the `match` function to correlate the associated `ProcessRollup2` event via the generated `falconPID` field. In this example, the query searches for network connections to `1.1.1.1` made by the process `bad.exe`.
:::
