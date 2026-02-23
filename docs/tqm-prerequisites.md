## Prerequisites

### Go Installation

Talon Manager is distributed as source code. You will need [Go](https://go.dev/dl/) installed on your system in order to compile the binary. Once Go is present, building is straightforward:

```bash
go build -o talon-manager .
```

You are responsible for compiling the binary for your target operating system and architecture. Go's cross-compilation support makes this simple. For example, to build for Windows from a Linux or macOS host:

```bash
GOOS=windows GOARCH=amd64 go build -o talon-manager.exe .
```

> **A note on endpoint protection:** Because Talon Manager is a locally compiled, unsigned binary, endpoint detection products (including CrowdStrike Falcon and Microsoft Defender) may flag it as suspicious. This is expected behavior. Unsigned executables without a Mark-of-the-Web lineage or a recognized code signing certificate will commonly trigger heuristic detections. You may need to create exclusions or allowlist the binary hash in your environment. This is another reason to read and understand the source code before running it.

---

## API Credentials

> **Required API Scopes:**
> - NGSIEM Saved Queries -- Read and Write
> - NGSIEM Lookup Files -- Read and Write

Before using Talon Manager, you must provision an API client in your CrowdStrike Falcon console with the scopes listed above. Both read and write permissions are required for each scope. Without them, the tool will not be able to enumerate, create, update, or delete content.

When you launch Talon Manager, you will be prompted to provide your API credentials: a Client ID and a Client Secret. These are used to authenticate against the CrowdStrike OAuth2 token endpoint and obtain a Bearer token. The token is held in memory for the duration of your session and is never written to disk.

You will also need to specify which CrowdStrike cloud your tenant lives in, as this determines the base URL for all API calls. The two most common are:

- `https://api.crowdstrike.com` (US-1)
- `https://api.us-2.crowdstrike.com` (US-2)

Other regional clouds (EU, GOV) follow the same URL pattern. Provide the base URL that matches your tenant.

Tokens expire after 30 minutes. Talon Manager handles token lifecycle automatically. If a token expires mid-session, the tool will request a new one using the credentials you provided at startup.
