# Talon Query Manager Reference
This page documents the CrowdStrike API endpoints and TQM features used to manage saved queries and lookup files within your Falcon NGSIEM tenant.

## CrowdStrike API Reference

TQM interacts with the following CrowdStrike API endpoints. This section is provided as a reference for anyone looking to understand the underlying API calls or build their own tooling on top of the same endpoints.

### Authentication

**`POST /oauth2/token`**

Every API request requires authorization via an OAuth2 Bearer token. TQM's first call on startup is to this endpoint. The Client ID and Client Secret are sent as form data, and CrowdStrike returns a token that is valid for 30 minutes. All subsequent requests include this token in the `Authorization` header.

### Saved Query Operations

**`GET /ngsiem-content/queries/savedqueries/v1`**: Retrieve Saved Query IDs

This endpoint returns a list of saved query IDs that match a given filter. TQM uses it to enumerate what currently exists in your tenant. For anything related to the Talon Hunt Framework, the naming convention prefixes every query with `talon_`, which makes filtering straightforward.

Available parameters:

| Parameter | Description |
|---|---|
| `string` | Maximum number of results to return. |
| `offset` | Number of results to skip before returning. Used for pagination. |
| `filter` | FQL filter expression applied to the query name. Supports text matching on the name field, for example: `name:~'talon_'`. |
| `search_domain` | The domain to search within. Accepted values: `all`, `falcon`, `third-party`. |

The IDs returned by this endpoint are required for all downstream operations (retrieval, update, deletion).

**`GET /ngsiem-content/entities/savedqueries-template/v1`**: Retrieve Saved Query by ID

Returns the full properties of a saved query, including its name, description, query string, labels, time interval, and visualization settings. This is used to inspect what a query actually contains once you have its ID.

Available parameters:

| Parameter | Description |
|---|---|
| `string` | The saved query ID to retrieve. |
| `search_domain` | The search domain context. Accepted values: `view`, `repo`. |

**`POST /ngsiem-content/entities/savedqueries-template/v1`**: Create Saved Query

Creates a new saved query from a LogScale YAML template. The YAML must conform to the LogScale saved query schema at `https://schemas.humio.com/query/v0.6.0`.

Available parameters:

| Parameter | Description |
|---|---|
| `search_domain` | The target search domain. |
| `yaml_template` | The full YAML content of the saved query template. |

**`PATCH /ngsiem-content/entities/savedqueries-template/v1`**: Update Saved Query

Overwrites an existing saved query with new YAML template content. The query is identified by its ID, and the new YAML replaces the old content entirely. The same schema requirements apply.

Available parameters:

| Parameter | Description |
|---|---|
| `string` | The target search domain. |
| `ids` | The ID of the saved query to update. |
| `yaml_template` | The replacement YAML template content. Must conform to `https://schemas.humio.com/query/v0.6.0`. |

**`DELETE /ngsiem-content/entities/savedqueries/v1`**: Delete Saved Query

Permanently removes a saved query from the tenant.

Available parameters:

| Parameter | Description |
|---|---|
| `ids` | The ID of the saved query to delete. |
| `search_domain` | The search domain context. |

### Lookup File Operations

**`GET /ngsiem-content/entities/lookupfiles/v1`**: Retrieve Lookup File

Retrieves a lookup file by its filename.

Available parameters:

| Parameter | Description |
|---|---|
| `filename` | The filename of the lookup file. |
| `search_domain` | The search domain context. |

**`POST /ngsiem-content/entities/lookupfiles/v1`**: Create Lookup File

Uploads a new lookup file (typically a CSV) into NGSIEM.

Available parameters:

| Parameter | Description |
|---|---|
| `string` | The target search domain. |
| `filename` | The filename to assign to the lookup file. |
| `file` | The file content to upload. |

**`DELETE /ngsiem-content/entities/lookupfiles/v1`**: Delete Lookup File

Permanently removes a lookup file from the tenant.

Available parameters:

| Parameter | Description |
|---|---|
| `filename` | The filename of the lookup file to delete. |
| `search_domain` | The search domain context. |

## Feature Reference

### Saved Query Browser

The Saved Query Browser lets you search for and inspect saved queries that already exist in your CrowdStrike NGSIEM tenant. It provides a filterable, scrollable list of saved queries and the ability to drill into any individual query to view its full definition.

**How it works:** The browser queries the `GET /ngsiem-content/queries/savedqueries/v1` endpoint using your filter criteria to retrieve matching query IDs. When you select a query from the list, it calls `GET /ngsiem-content/entities/savedqueries-template/v1` to pull back the full YAML template, including the query string, labels, description, time interval, and visualization settings.

**Common use cases:**

- Verifying that a set of Talon Hunt Framework queries were installed correctly by searching for the `talon_` prefix and reviewing the results.
- Auditing what saved queries exist in the tenant before performing bulk updates or deletions.
- Inspecting the actual CQL logic, labels, and metadata of a query without needing to open the Falcon console.
- Comparing what is deployed in the tenant against what exists in a local YAML file to identify drift.

### Saved Query Creator

The Saved Query Creator takes a LogScale YAML template file and pushes it into your NGSIEM tenant as a new saved query. The YAML must conform to the `https://schemas.humio.com/query/v0.6.0` schema, which is the same format used by the Talon Hunt Framework, Sigma conversions, and any other community content designed for CrowdStrike NGSIEM.

**How it works:** You point the creator at a YAML file, either from your local filesystem or from a fetched repository. TQM reads the file contents and sends them to the `POST /ngsiem-content/entities/savedqueries-template/v1` endpoint. CrowdStrike validates the YAML against its schema and, if it passes, creates the saved query in your tenant.

**Common use cases:**

- Installing individual saved queries from the Talon Hunt Framework or other community detection repositories.
- Deploying new hunt or detection content that your team has written locally and wants to push into production.
- Testing a newly authored YAML template by creating it in a development or staging tenant before promoting it.

### Saved Query Updater

The Saved Query Updater overwrites an existing saved query with new YAML content. This is how you push changes to queries that are already deployed, whether those changes come from an upstream framework update, a locally authored modification, or a corrected version of an existing detection.

**How it works:** The updater first resolves the target query's ID (by searching for it via the browser endpoint or by accepting the ID directly). It then sends the new YAML content to the `PATCH /ngsiem-content/entities/savedqueries-template/v1` endpoint along with the query ID. The existing query is replaced in its entirety.

**Common use cases:**

- Applying updates from a new release of the Talon Hunt Framework to queries that were previously installed.
- Correcting a typo, tuning a filter, or adjusting the time interval on a deployed query without deleting and recreating it.
- Propagating changes from a version-controlled YAML repository into the tenant as part of a release workflow.
- Overwriting a query that was manually edited in the Falcon console with the canonical version from source control.

### Saved Query Deleter

The Saved Query Deleter removes saved queries from your NGSIEM tenant. Deletion is permanent. There is no recycle bin or undo.

**How it works:** The deleter resolves the target query's ID and sends a request to the `DELETE /ngsiem-content/entities/savedqueries/v1` endpoint. Once the call succeeds, the query is gone.

**Common use cases:**

- Removing deprecated or superseded detections that are no longer relevant.
- Cleaning up test queries that were created during development.
- Uninstalling the Talon Hunt Framework or a subset of its queries from a tenant.
- Performing bulk cleanup of stale content as part of a periodic hygiene process.

### Lookup File Creator

The Lookup File Creator uploads a file (typically CSV) into NGSIEM as a lookup table. Lookup files are used by saved queries to enrich, filter, or correlate event data against reference datasets. The Talon Hunt Framework, for example, ships with lookup files like `rfc_exclusions.csv` that provide standardized exclusion lists for common false-positive sources.

**How it works:** You specify the filename and point the tool at the file on your local filesystem. TQM sends the file content to the `POST /ngsiem-content/entities/lookupfiles/v1` endpoint, which creates the lookup file in your tenant under the specified filename.

**Common use cases:**

- Installing the lookup files that ship with the Talon Hunt Framework so that framework queries can reference them.
- Uploading custom enrichment tables (for example, a list of known-good hashes, internal IP ranges, or VIP user accounts) that your team's queries depend on.
- Deploying updated versions of reference data as part of a scheduled content refresh.

### Lookup File Deleter

The Lookup File Deleter removes a lookup file from NGSIEM by filename. Like saved query deletion, this is permanent.

**How it works:** You provide the filename of the lookup file to remove. TQM calls the `DELETE /ngsiem-content/entities/lookupfiles/v1` endpoint, and the file is deleted from the tenant.

**Common use cases:**

- Removing outdated lookup files that are no longer referenced by any active queries.
- Replacing a lookup file by deleting the old version and uploading a corrected one via the creator.
- Cleaning up test data that was uploaded during development or validation.

### Talon Installer

The Talon Installer is a guided workflow that automates the end-to-end installation of the Talon Hunt Framework (or any compatible YAML-based saved search collection) into your NGSIEM tenant. Rather than manually creating each query and lookup file one at a time, the installer handles the process in bulk.

**What to expect:**

1. **Source selection.** Point the installer at the Talon Hunt Framework repository (or any other GitHub repository or local directory containing valid LogScale YAML templates).
2. **Dependency resolution.** The Talon Hunt Framework includes a dependency map (`meta/dependencies.json`) that defines relationships between transforms, core utilities, and queries. The installer reads this map to determine the correct installation order, ensuring that foundational components (converters, normalizers, formatters) are created before the queries that depend on them.
3. **Lookup file deployment.** Any lookup files included in the framework (such as `rfc_exclusions.csv`) are uploaded to your tenant so that queries referencing them will function correctly on first run.
4. **Saved query creation.** Each YAML template is pushed to the tenant via the saved query creation endpoint. The installer processes these in the order dictated by the dependency graph.
5. **Validation.** After installation, the installer provides a summary of what was created, what failed (if anything), and any errors returned by the API.

For teams that already have a partial installation, the installer can be combined with the browser and updater to identify what needs to be created versus what needs to be updated.
