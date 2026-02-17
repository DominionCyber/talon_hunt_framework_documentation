# Talon Hunt Framework Schema Specification

This document defines the high-level schema and structural components of the **Talon Hunt Framework**. It describes the standardized format and organization of saved searches, lookup resources, and modular building blocks ("cradles") that collectively support the framework’s detection, enrichment, and investigative pipeline.

- **Version:** 1.0.0  
- **Release Date:** 2026-02-16  

## Core Saved Queries

Core saved queries represent foundational schema components within the Talon Hunt Framework. These queries are not intended to be executed as standalone hunts. Instead, they provide platform-agnostic normalization, enrichment, and linkage logic that is consistently invoked by downstream detection and investigative searches.

Core queries are categorized into two functional groups:

- **Converters**
- **Utilities**

### Converters

Converters perform deterministic transformations of machine-oriented fields into operator-friendly representations. These conversions improve analyst readability by translating raw telemetry values (for example, epoch timestamps or byte counts) into standardized human-readable formats.

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

Utilities provide reusable functional fields and enrichment-ready event structures. These queries are designed to generate stable identifiers and schema-consistent fields that downstream searches can reference without requiring repeated field-specific logic.

Utilities commonly integrate with the native `$falcon/helper:enrich` mechanism, enabling enrichment operations to be applied uniformly across eligible fields. This approach reduces query duplication, minimizes hunt complexity, and lowers the knowledge overhead required for analysts to leverage enrichment capabilities.

**Example:** `talon_utility_falcon_pid`

``` sql
// =====================================================
// UTILITY
// =====================================================
| falconPID := coalesce([ContextProcessId, RpcClientProcessId, WritingProcessId])
```

::: details Query Explanation
This utility generates a normalized `falconPID` identifier by selecting the first available process identifier from the event context. The resulting field is used to correlate multiple independent telemetry events into a unified process-level investigative view presented to the analyst.
:::

## Transforms

Transforms are responssible for field deconflictions, formatting field values to enhance readability or normalize values to improve or enhance for statistical analysis such as stack counting.

### Deconflitors
Deconflictors are used, as the name states, to deconflict fields. Across Crowdstrike telemetry, there are field names that are repeated across events. This can become problematic when joining events together and field names step on eachother, and you won't be able to see each value produced by each respective event.

A functional example of this is that a `ProcessRollup2` event has the field `FileName` and the event `PEFileWritten` has the same field named file name. Without deconflciting the fields, and joining them together, you would never be able to see the `FileName` of the `ProcessRollup2` event and the `PEFileWritten` event respectively. This is one nuance found in many field names across many data types within Crowdstrike telemetry. Refer to the query below for a functional example.

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
This query translates the `ProcessRollup2` native fields `FileName`, `FilePath`, `Size` into unique fields (not repeated across other events) to `PeFileName`, `PeFilePath` and `PeFileSize` respectively. This prevents the potential for field collision when using `match` queries to join events.
:::

### Formatters
Formatters are used to improve readability of event fields. Within CrowdStrike telemetry, certain events contain characters such as unicode characters, pilcrow characters, etc. that can make it hard for analysts to read. These aim to format the finished (table) output of a query to enhance readability and streamline analysis if used in external data analysis tools (such as Excel, PowerBI, LLMs).

A functional example of this is the event `CommandHistory` inserts a pilcrow character (¶) to separate commands that were run. By removing these, and inserting a new line character, the resulting value is less convoluted and easier to read. Refer to the functional example below:

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

### Normalizers
Normalizers act as a tool to translate fields that are primarily machine readable (likely numerical values) into human readable output (what we as humans understand).

A functional example of this is the `NetworkConnectIP4` event has various fields such as `Protocol`, `ConnectionDirection` and `ConnectionFlags` that present themselves as numerical values. When focusing on the `Protocol` value, it may present itself as `6` which maps to the protocol of `TCP` being used for that respective network transaciton. Refer to the functional exmaple below:

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
This query converts the numerical values of the `Protocol` and `ConnectonDirection` field values with the human readabile equivalent. In the case of `ConnectionFlags` it translates the numerical value into the respective human readable components via the Logscale `bitfield:extractFlagsAsString` function to create a new field called `ConnectionFlags_mask` where the human readable output is listed.
:::

## Lookups
Lookups are simply a CSV or JSON data set that is used for inline enrichment, or search inclusions/exclusion. These are generally used to search for a narrow, specific set of data, or filter out consistent unwanted data sets. An example CSV is provided below:

``` csv
cidr_exclusion,name,category,rfc,description,notes
10.0.0.0/8,Private-Use Class A,RFC 1918 Private,RFC 1918,Private network space - Class A equivalent,Largest private address block - 16.7M addresses
172.16.0.0/12,Private-Use Class B,RFC 1918 Private,RFC 1918,Private network space - Class B equivalent,1M addresses - 172.16.0.0 to 172.31.255.255
192.168.0.0/16,Private-Use Class C,RFC 1918 Private,RFC 1918,Private network space - Class C equivalent,65K addresses - most common home network range
```
::: details Query Explanation
This lookup table provides a list of Class A, B and C network address CIDR ranges that could be utilized to drop unwanted network traffic from a `NetworkConnectIP4` query to reduce query result overhead improve efficacy. This is particularily useful when trying to search for external network connections.
:::

## Cradles

Cradles act as the building blocks and heart of the Talon Hunt Framework. These are to be used as a building block for analyst to use to create queries that leverage consistent field presentation, enrichment, normalization, formatting and deconflicting. The essence of this is to have consistency across queries to not only help streamline development, but also provide a consistent output to enhance automation and analysis efforts.

### Query Cradle
The query cradle is a single event building block that can be utilized by analysts to deep dive into a specific event. Refer to the functional example below:

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
This query provides the building blocks to search for `ProcessRollup2` events. It allows the analyst to add criteria under the `SEARCH` section and have consistent data presentation via the `table` function, which can be modified to include or exclude critical field information as-needed. This example searches for execution of the any process containing `bad.exe` within the `FileName` field.
:::

### Match Cradle
The match cradle is a multi-event building bock that allows for events to be joined together via usage of the `defineTable` function by joining on the generated `falconPID` field to link common events together. Necessary functions, such as field deconflicting is executed as part of the query operations to avoid field collision alongside various enhancements to improve readability/functionality.

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
  | table([utc_time,ComputerName,UserName,GrandParentBaseFileName,ParentBaseFileName,FilePath,FileName,ContextBaseFileName,CommandLine,SHA256HashData,CallStackModules,HostUrl,RefererUrl,OriginalFilename,SessionId,ImageSubsystem,IntegrityLevel,CreateProcessType,ProcessCreateFlags,ProcessCreateFlags_mask,ProcessParameterFlags,ProcessParameterFlags_mask,ProcessSxsFlags,ProcessSxsFlags_mask,RawProcessId,Protocol,ConnectionDirection,ConnectionFlags,ConnectionFlags_mask,CommunityID,LocalIP,LocalPort,RemoteIP,RemotePort,RemoteIP.asn,RemoteIP.org,RemoteIP.country,RemoteIP.city])
```
::: details Query Explanation
This query provides the building blocks to search for `NetworkConnectIP4` events, store them in a temporary lookup via the `defineTable` function and leverage the `mactch` function to correlate the associated `ProcessRollup2` event via the generated `falconPID` field. This searches for network connections to `1.1.1.1` made by the process `bad.exe`.
:::

