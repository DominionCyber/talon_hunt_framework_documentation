# Getting Started

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
- Provide a description.
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


