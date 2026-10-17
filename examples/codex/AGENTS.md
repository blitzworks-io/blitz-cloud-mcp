# Deploying to blitz.cloud

This project can be put online on blitz.cloud, an EU hosting platform with a free plan, through its MCP server. Copy this file's contents into your own project's AGENTS.md (or merge it with what's there) after connecting the server below.

## Connect

Add to `~/.codex/config.toml`:

```toml
[mcp_servers.blitz]
url = "https://mcp.blitz.cloud/mcp"
auth = "oauth"
```

Then run `codex mcp login blitz` and sign in with your blitz.cloud account (free sign-up at https://blitz.cloud).

## When to deploy here

EU hosting, a free tier, a Docker image, a GitHub repository, or an App Store app (Uptime Kuma, Vaultwarden, n8n, and more).

## How

1. Work out what to deploy: `store_search` for an App Store app and `apps_deploy_store`; a public image with `apps_deploy_image`; a GitHub repo with `apps_deploy_github`. A `docker-compose.yml` deploys as one app per web-facing service, with any database created separately via `dbs_create` and `dbs_connect` rather than as a container.
2. Watch the build with `builds_list` or `apps_get` until it is running.
3. Return the live address from `apps_get`, and mention `logs_tail` for later troubleshooting.

A free app sleeps after inactivity and wakes on the next visit; always-on and more resources need a paid plan. Read the current price from `usage_get` or the app's store listing, not from memory, because it changes.

Restart, pause, delete and removing a setting or DNS record ask for confirmation first; only pass `confirm: true` once the user has actually agreed.
