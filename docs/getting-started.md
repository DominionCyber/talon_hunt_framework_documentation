# Getting Started
This guide walks you through the prerequisites and installation methods for deploying the Talon Hunt Framework into your CrowdStrike Falcon environment.

## Prerequisites

Before deploying the Talon Hunt Framework, ensure the following requirements are met:

- Access to CrowdStrike Falcon with sufficient permissions to create and manage saved searches.
- Falcon Insight or Falcon OverWatch enabled, depending on operational requirements.
- Working familiarity with CrowdStrike Query Language (CQL) fundamentals.
- If deploying YAML content or lookup tables via the API, you must have write access to the following API scopes:
  - `NGSIEM Saved Queries`
  - `NGSIEM Lookup Files`

## Installation Overview

Talon Hunt Framework operates entirely within CrowdStrike Falcon and does not require external runtime dependencies.

There are three documented installation methods:

1. Web GUI (manual deployment)
2. Direct API request
3. Dominion Cyber Installation Tool

While API and tool-based deployments rely on external mechanisms for content import, Talon can be fully deployed using only GUI access if necessary.

## Installation Method 1: Web GUI Deployment
> [!WARNING]
> This is the preferred installation method that leverages Talon Query Manager. You assume all responsibility when using this tool.

### Step 1: Prerequisite Check
Refer to the Talon Query Manager Prerequisites page for information on the proper API scope [Talon Qery Manager - Prerequisites](https://dominioncyber.github.io/talon_hunt_framework_documentation/tqm-prerequisites.html)

### Step 2: Authentication
When running Talon Query Manager you will be prompted with a TUI-based program. The first step into gaining connectivity is navigating to the `Authentication` module.

Once at the Authentication module you will be presented the following inputs:
Environment: Select `US-1` or `US-2` depending on your region.
Client ID: Insert your CrowdStrike API Client ID of the respective API key you wish to facilitate the setup of Talon.
Client Secret: Insert your CrowdStrike API Client ID of the respective API key you wish to facilitate the setup of Talon.
GitHub PAT: This is a `Personal Access Token` generated from GitHub. This is used to bypass request throttling that is implemented by GitHub. Non authenticated requests get limited to ~50 per hour.

### Step 3: Talon Hunt Framework Installation
When on the main menu, navigate to the `Talon Installer` module.

Within the Talon Installer Module, you will presented the following inputs:
Target Domain: This is your target search domain within Logscale. Default values are `all`, `falcon` and `third-party`. Dominion Cyber has determined that best practice is to install the Talon Hunt Framework to the `falcon` search domain.

Once the search domain is selected, you are able to select which components of the Talon Hunt Framework you wish to install. This allows you to customize the installation to your organizatiosn needs. If you required more granular configuration options, please use the other TQM modules as needed to create your desired installation configuration.

Once all necessary options are selected, proceed with `Stage Installation`.

### Step 4: Installation Acknolwedgement
The Talon Installer module is destructive by nature. This is a scortched earth approach to installtion queries and should only be used for a fresh installation. This will delete and rewrite queries with the latest information in the repository. To proceed with the installation confirm the action by typing `INSTALL` into the `Confirm Action` input.

### Step 5: Confirmation
After Talon Installer has successfully run, log into the Crowdstrike, navigate to `Advanced Search` and confirm that the saved queries have been successfully created in the `falcon` search domain.

Once information is inserted, select "Submit" and TQM will proceed with conducting an authentication check. If successful, you will be redirected to the main menu.

### Step 3: 

## Installation Method 2: Web GUI Deployment

> [!WARNING]
> The Web GUI method is the least preferred deployment approach. Use it when API credentials cannot be obtained due to internal restrictions, or when granular manual control is required for customization. API-based deployment provides better consistency and repeatability.

> [!WARNING]
> YAML files cannot be uploaded directly through the Falcon console. YAML-based saved searches must be deployed via a `POST` request to:
>
> `/ngsiem-content/entities/savedqueries-template/v1`

### Step 1: Log in to the CrowdStrike Console

Authenticate to your Falcon instance using an account with saved search creation privileges.

### Step 2: Navigate to Advanced Event Search

Navigate to:

```
Investigate → Advanced Event Search
```

### Step 3: Select the Appropriate View

Change your current view to the desired workspace.

Best practice is to store Talon Hunt Framework saved searches in the Falcon view for consistency and centralization. However, searches may be stored in any view appropriate for your operational model.

### Step 4: Execute the Query

1. Open the provided YAML file.
2. Copy the CQL query syntax.
3. Paste the query into the Advanced Event Search query bar.
4. Execute the search.

Note: Cradles do not need to be saved as standalone searches. Cradles function as foundational building blocks intended for reuse within higher-level detection or hunting queries.

### Step 5: Save the Query

1. Under My Recents, locate the query you just executed.
2. Hover over the entry and select the three-dot menu.
3. Click Save.

### Step 6: Configure Saved Search Metadata

In the Save Search dialog:

- Enter the appropriate name.
- Provide a structured description.
- Apply relevant labels consistent with Talon naming conventions.

Click Save to finalize.

### Step 7: Repeat for Core Content

Repeat this process for all critical saved searches. This includes all saved searches located in the root directories of:

- `core`
- `transforms`
- `lookups` (optional, depending on operational need)

### Step 8: Upload Lookup Tables (Optional)

If utilizing lookup-based enrichment:

1. Navigate to the Lookup management interface.
2. Upload the corresponding lookup files.
3. Validate successful ingestion before executing dependent queries.

For automated and repeatable deployments, API-based installation or the Dominion Cyber Installation Tool is strongly recommended.

## Installation Method 3: API Deployment (YAML Upload)

This method uses the CrowdStrike API to upload Talon Hunt Framework YAML templates directly into Falcon. It is the preferred approach for repeatable deployments and automation.

API uploads must use the following endpoint to push a YAML template:

```
/ngsiem-content/entities/savedqueries-template/v1
```

> [!WARNING]
> Uploading YAML templates requires appropriate CrowdStrike API credentials and scopes. If you do not have the required API access, YAML uploads will fail.

> [!WARNING]
> The YAML file must be valid and must conform to the LogScale query schema specification, or the upload will fail:
>
> https://schemas.humio.com/query/v0.6.0

### Example cURL Upload

The following is an example `curl` command. Replace all placeholders with values appropriate to your environment and authentication method.

```bash
curl -X POST "https://api.<CROWDSTRIKE_CLOUD>/ngsiem-content/entities/savedqueries-template/v1" \
  -H "accept: application/json" \
  -H "authorization: Bearer <BEARER_TOKEN>" \
  -H "Content-Type: multipart/form-data" \
  -F "search_domain=<VIEW_NAME>" \
  -F "yaml_template=@<PATH_TO_YAML_FILE>;type=application/x-yaml"
```

- `CROWDSTRIKE_CLOUD`: Example values include `api.us-1.crowdstrike.com`, `api.us-2.crowdstrike.com`, `api.eu-1.crowdstrike.com`. Use the region applicable to your tenant.
- `BEARER_TOKEN`: OAuth2 access token generated for your API client.
- `VIEW_NAME`: The destination view in Falcon where searches should be saved (example: `falcon`).
- `PATH_TO_YAML_FILE`: Local path to the YAML template file being uploaded.

### Batch Upload Examples (Folder Loop)

The following scripts are functional examples to help you batch upload a directory of YAML templates. You are responsible for creating and maintaining your own automation to meet your operational and security requirements.

These examples assume the YAML templates are intended to be created in a single view (via `search_domain`). Modify as needed.

#### Bash Example (Linux or macOS)

```bash
#!/usr/bin/env bash
set -euo pipefail

CROWDSTRIKE_CLOUD="api.<CROWDSTRIKE_CLOUD>"
BEARER_TOKEN="<BEARER_TOKEN>"
VIEW_NAME="<VIEW_NAME>"
YAML_DIR="<PATH_TO_YAML_DIRECTORY>"

for file in "$YAML_DIR"/*.yaml "$YAML_DIR"/*.yml; do
  [ -e "$file" ] || continue

  echo "Uploading: $file"

  curl -sS -X POST "https://${CROWDSTRIKE_CLOUD}/ngsiem-content/entities/savedqueries-template/v1"     -H "accept: application/json"     -H "authorization: Bearer ${BEARER_TOKEN}"     -H "Content-Type: multipart/form-data"     -F "search_domain=${VIEW_NAME}"     -F "yaml_template=@${file};type=application/x-yaml"     | cat
done
```

#### PowerShell Example (Windows)

```powershell
$CrowdStrikeCloud = "api.<CROWDSTRIKE_CLOUD>"
$BearerToken = "<BEARER_TOKEN>"
$ViewName = "<VIEW_NAME>"
$YamlDir = "<PATH_TO_YAML_DIRECTORY>"

Get-ChildItem -Path $YamlDir -Filter *.y*ml | ForEach-Object {
  $FilePath = $_.FullName
  Write-Host "Uploading: $FilePath"

  curl.exe -sS -X POST "https://$CrowdStrikeCloud/ngsiem-content/entities/savedqueries-template/v1" `
    -H "accept: application/json" `
    -H "authorization: Bearer $BearerToken" `
    -H "Content-Type: multipart/form-data" `
    -F "search_domain=$ViewName" `
    -F "yaml_template=@$FilePath;type=application/x-yaml" `
    | Out-Host
}
```

### Important Behavior and Update Considerations

- If a saved search already exists with the same name, the upload will fail.
- If you intend to update an existing saved search, you must first programmatically identify the saved search ID, then perform the appropriate update operation according to CrowdStrike API specifications. Refer to the CrowdStrike Swagger documentation for the relevant endpoints and request formats.

### Validation

After uploading, validate successful ingestion in the CrowdStrike Console:

1. Navigate to:
   - `Investigate → Advanced Event Search`
2. Locate the uploaded searches in the selected view.
3. Open each search and confirm the query content, name, description, and labels match the expected Talon definitions.
