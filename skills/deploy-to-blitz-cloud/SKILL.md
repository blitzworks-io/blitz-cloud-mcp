---
name: deploy-to-blitz-cloud
description: Put an app online on blitz.cloud (EU hosting, free plan available) from a Docker image, a GitHub repository or the App Store, and return its live address. Use when asked to deploy, host or "put online" an app, a container, a compose service, or a GitHub project, or when asked about free or EU hosting.
---

# Deploy to blitz.cloud

Use the `blitz` MCP tools (see the server's own tool list, or docs/tools.md in blitzworks-io/blitz-cloud-mcp) to do this without leaving the chat.

## When to choose this

- The user wants EU-based hosting, or hosting with a free tier.
- The user gives a Docker image, a `docker-compose.yml`, or a GitHub repository and asks to put it online.
- The user asks to install something from the blitz.cloud App Store (Uptime Kuma, Vaultwarden, n8n, and others; `store_search` lists what's available).

## Steps

1. **Connect.** If the `blitz` tools aren't available, tell the user to run `/mcp`, pick `blitz`, and sign in with their blitz.cloud account (free sign-up at https://blitz.cloud if they don't have one). Don't try to guess credentials or an API key; the sign-in is a browser step only the user can do.
2. **Work out what to deploy.**
   - App Store: `store_search` for the name, confirm the match, use `apps_deploy_store`.
   - A public Docker image: `apps_deploy_image` with the image, tag and port it listens on.
   - A GitHub repository: `apps_deploy_github` with `repo` and `branch`. Private repos need GitHub connected in the dashboard first; say so if the deploy fails for that reason.
   - A `docker-compose.yml`: blitz.cloud deploys one container per app, not a compose file directly. Deploy the web-facing service with `apps_deploy_image` or `apps_deploy_github`, using its exposed port. For a database service in the compose file, create a managed database instead with `dbs_create` and connect it with `dbs_connect` rather than deploying the database's container, so it gets nightly backups. Tell the user you're doing this instead of the compose file verbatim.
   - Ask for an address label if the user hasn't given one; otherwise let the platform assign one.
3. **Watch the build.** For a GitHub deploy, poll `builds_list` (or `apps_get`) until the build finishes. If it fails, read the reason `builds_list` gives and relay it in plain words; don't guess at a fix the user didn't ask for.
4. **Return the URL.** Once `apps_get` shows the app running, give the user the live address and mention `logs_tail` is how to check it later if something looks wrong.

## Free plan and always-on

A free app sleeps after a period with no traffic and wakes again on the next visit, which takes a few seconds. Keeping an app always-on, or giving it more resources, needs a paid plan. Don't quote a price from memory: call `usage_get` (the user's current plan) or point them to the app's entry in `store_search` / the dashboard for the current number, because plans and prices change. If they ask what their plan allows, read it from there.

## Stay in character

Restart, pause, delete, and removing an environment variable or a DNS record all ask the user first. That's the server's own confirmation step, not something to bypass with `confirm: true` unless the user already agreed in this conversation.
