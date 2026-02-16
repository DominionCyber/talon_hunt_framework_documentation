# Getting Started

## Prerequisites

Before using Talon Hunt Framework, ensure you have the following:

- **CrowdStrike Falcon** access with appropriate permissions to import saved searches.
- **Falcon Insight** or **Falcon OverWatch** module enabled (depending on your use case).
- Familiarity with **CrowdStrike Query Language (CQL)** basics.

## Installation

Talon requires no external installation. It operates entirely within CrowdStrike Falcon.

### Step 1: Clone or Download the Repository

Download the Talon Hunt Framework repository from GitHub:

```bash
git clone https://github.com/DominionCyber/talon_hunt_framework_documentation.git
```

Or download the ZIP archive directly from the [releases page](https://github.com/DominionCyber/talon_hunt_framework_documentation/releases).

### Step 2: Import Saved Searches into Falcon

1. Log in to your **CrowdStrike Falcon** console.
2. Navigate to **Investigate → Custom Saved Searches** (or the relevant module).
3. Use the **Import** function to load the `.json` or `.cql` files from the Talon repository.
4. Verify the imported searches appear in your saved searches list.

::: tip
Start with a small subset of queries (e.g., one MITRE tactic category) to validate the import process before loading the full framework.
:::

### Step 3: Validate Your Queries

After importing, run a few queries against your environment to confirm they execute correctly:

```sql
-- Example: Hunt for scheduled task creation events
event_simpleName=ProcessRollup2
| FileName IN ("schtasks.exe", "at.exe")
| stats count by ComputerName, CommandLine
| sort -count
```

::: warning
Some queries may need adjustment based on your Falcon module version, data retention settings, or custom field configurations.
:::

### Step 4: Organize and Customize

- **Tag** imported searches with your team's internal taxonomy.
- **Modify** queries as needed to match your environment's unique telemetry.
- **Schedule** recurring hunts for continuous coverage.

## What's Next?

- Read the [About Talon Hunt Framework](/about) page for details on framework architecture and naming conventions.
- Check the [FAQs](/faqs) for common questions and troubleshooting.
