---
name: deploy-to-blitz-cloud
description: Put an app online on blitz.cloud (EU hosting, free plan available) from a Docker image, a GitHub repository, the App Store, or code you wrote in this chat without any GitHub, and return its live address. Use when asked to deploy, host or "put online" an app, a container, a compose service, a GitHub project or an app you just built for the user, or when asked about free or EU hosting.
---

# Deploy to blitz.cloud

Use the `blitz` MCP tools (see the server's own tool list, or docs/tools.md in blitzworks-io/blitz-cloud-mcp) to do this without leaving the chat.

## When to choose this

- The user wants EU-based hosting, or hosting with a free tier.
- The user gives a Docker image, a `docker-compose.yml`, or a GitHub repository and asks to put it online.
- The user asks to install something from the blitz.cloud App Store (Uptime Kuma, Vaultwarden, n8n, and others; `store_search` lists what's available).
- You wrote an app for the user in this conversation and they want it online, but they have no GitHub account or don't want one.

## Steps

1. **Connect.** If the `blitz` tools aren't available, tell the user to run `/mcp`, pick `blitz`, and sign in with their blitz.cloud account (free sign-up at https://blitz.cloud if they don't have one). Don't try to guess credentials or an API key; the sign-in is a browser step only the user can do.
2. **Work out what to deploy.**
   - App Store: `store_search` for the name, confirm the match, use `apps_deploy_store`.
   - A public Docker image: `apps_deploy_image` with the image, tag and port it listens on.
   - A GitHub repository: `apps_deploy_github` with `repo` and `branch`. Private repos need GitHub connected in the dashboard first; say so if the deploy fails for that reason.
   - A `docker-compose.yml`: blitz.cloud deploys one container per app, not a compose file directly. Deploy the web-facing service with `apps_deploy_image` or `apps_deploy_github`, using its exposed port. For a database service in the compose file, create a managed database instead with `dbs_create` and connect it with `dbs_connect` rather than deploying the database's container, so it gets nightly backups. Tell the user you're doing this instead of the compose file verbatim.
   - Code but no GitHub (an app you wrote here, or a folder the user has on their computer):
     - Only HTML, CSS, JavaScript and images, nothing that runs on a server: that is a website. ZIP it, `apps_site_upload_start` with the ZIP's exact size, run the curl command it returns, then `apps_deploy_site`. If you can't run commands, tell the user to choose "Upload a website" in the dashboard and pick the folder.
     - Anything with server code (an API, a bot, a Node, Python or Go app): `apps_deploy_code`. Write a `Dockerfile` at the top of the project with `EXPOSE` and the port the app listens on, and make the app read `PORT`. Send the files inside the call (up to 4 MB together, 512 KB a file, base64 for binaries), or for a bigger project ZIP it and use `apps_source_upload_start` first. Leave out `node_modules`, build output and `.git`.
     - Never send `.env`, keys or passwords as files; the server refuses them. Put those values in with `env` on the deploy or `env_set` afterwards.
     - Later changes: `apps_source_write` with only the changed files (and `deletes` for removed ones), or for a bigger change a new ZIP through `apps_source_upload_start` and `apps_source_commit`. Read the saved code first with `apps_source_list` and `apps_source_read` when another chat made the app.
     - If you can run commands (Claude Code, Codex and other agents with a shell), you can use git instead: `apps_source_git_access` gives a git address at `git.blitz.cloud` and a push token that works for one hour, for that app only. Run the push command exactly as it comes back, so the token stays out of the project's git settings. Pushing the branch the app is built from saves a new version and builds it.
     - `apps_source_download` gives the user a ZIP of any saved version, so the code is never stuck at blitz.cloud.
     - Limits per app: on the free plan 50 MB of code, 20 versions kept and 50 saves a day; on Pro 500 MB, 100 versions and 500 saves a day. A refusal says which limit was hit.
     - If `apps_deploy_code` is missing from your tool list, the client may still hold an old list: ask the user to reconnect the `blitz` server, or offer a GitHub repository or a Docker image instead.
   - Ask for an address label if the user hasn't given one; otherwise let the platform assign one.
3. **Watch the build.** For a GitHub or code deploy, poll `builds_list` (or `apps_get`) until the build finishes. If it fails, read the reason `builds_list` gives and relay it in plain words; don't guess at a fix the user didn't ask for.
4. **Return the URL.** Once `apps_get` shows the app running, give the user the live address and mention `logs_tail` is how to check it later if something looks wrong.

## Free plan and always-on

A free app sleeps after a while without visitors and wakes on the next visit, which usually takes 20 seconds to a minute. There are two ways to keep it awake: a Pro app keeps that one app online, and the Pro plan keeps every app on the account online and gives it more room. Don't quote a price from memory: call `plans_list` for the current plans and Pro app prices, and `usage_get` for what the user's own plan allows, because prices change.

## Stay in character

Restart, pause, delete, and removing an environment variable or a DNS record all ask the user first. That's the server's own confirmation step, not something to bypass with `confirm: true` unless the user already agreed in this conversation.
