# blitz.cloud MCP server

Host apps by asking your AI assistant.

[blitz.cloud](https://blitz.cloud) is a hosting platform in the EU with a free plan. Its MCP server lets Claude, ChatGPT, Cursor, VS Code and any other MCP client do what you can do in the dashboard: put an app online from the App Store, a Docker image or a GitHub project, give it a database, change its settings, and read its logs when something goes wrong.

Ask "put Uptime Kuma online at uptime" and your assistant installs it from the App Store under `uptime.<your name>.blitz.cloud`, with HTTPS, and tells you when it answers.

This repository has the setup for each client, examples for scripts, the tool reference, and how sign-in and permissions work. The server itself is hosted by blitz.cloud, so there is nothing here to install or run.

## Connect in one minute

You need a blitz.cloud account with its address claimed. [Sign up](https://beta.blitz.cloud) for free if you don't have one. Your server address is `https://mcp.blitz.cloud/<your name>` and is shown on the [AI tools](https://beta.blitz.cloud/ai) page.

Most clients sign in with your blitz.cloud account: you add the address, a browser window opens, you sign in and allow the app. There is no key to copy.

**Claude (web and desktop)**

Settings → Connectors → Add custom connector. Paste your server address, click Connect and sign in.

**Claude Code**

```sh
claude mcp add --transport http blitz https://mcp.blitz.cloud/<your name>
```

Then run `/mcp`, pick `blitz` and sign in.

**Claude Code (plugin)**

```sh
/plugin marketplace add blitzworks-io/blitz-cloud-mcp
/plugin install blitz-cloud@blitz-cloud-mcp
```

This also adds a skill that knows how to deploy an app and give you its address.

**Codex**: add to `~/.codex/config.toml`, then run `codex mcp login blitz`

```toml
[mcp_servers.blitz]
url = "https://mcp.blitz.cloud/mcp"
auth = "oauth"
```

See [`examples/codex`](examples/codex) for a ready-made `config.toml` and an `AGENTS.md` with the deploy steps.

**Cursor**: add to `~/.cursor/mcp.json`

```json
{
  "mcpServers": {
    "blitz": { "url": "https://mcp.blitz.cloud/<your name>" }
  }
}
```

**VS Code**: add to `.vscode/mcp.json`

```json
{
  "servers": {
    "blitz": { "type": "http", "url": "https://mcp.blitz.cloud/<your name>" }
  }
}
```

**ChatGPT and other clients**: add a connector or remote MCP server with your server address and sign in when asked.

Ready-made files are in [`examples/`](examples).

## Things to ask

- "What do I have running, and is anything broken?"
- "Put Vaultwarden online at vault and tell me when it's up."
- "Deploy my GitHub repo acme/shop at shop, with a PostgreSQL database."
- "My blog stopped working. Look at its logs and tell me why."
- "Set SMTP_HOST on the blog to smtp.example.com."
- "Add a TXT record for _dmarc so my mail provider can verify me."
- "How much of my plan am I using?"

## What your assistant can do

| Tools | What they do |
|---|---|
| `apps_*` | List apps, show one, deploy from the App Store, a Docker image or a GitHub project, change name, address, port or nightly updates, restart, pause, resume, delete |
| `store_*` | Search the App Store and Docker Hub |
| `builds_*` | Build a GitHub project again, list its builds and why one failed |
| `dbs_*` | List, create, connect to an app, restart and delete PostgreSQL, MariaDB and Redis databases |
| `env_*` | List, read, set and remove an app's environment variables |
| `domains_*` | List, add and remove DNS records under your address |
| `network_*` | See your private networks and make an app private or public |
| `logs_tail` | The last lines an app printed, or what it printed before its last restart |
| `usage_get` | Your plan and how much of it is used |

Every tool with its arguments is in [docs/tools.md](docs/tools.md). The server's own list, which is always current, is on the AI tools page in the dashboard.

## You stay in control

- **Deleting, restarting and pausing ask you first.** If your client can show a question from the server, the question goes to you and the assistant cannot answer it. Other clients have to repeat the call with `confirm: true`, which a well-behaved assistant only does after checking with you.
- **The consent screen tells you who is asking.** Claude Code and VS Code are recognised by their publisher's domain. Any other app registered itself, and the page says its name is unchecked.
- **Disconnect works immediately.** Every app you sign in is listed under Connected apps on the AI tools page. Disconnecting it stops the next request, not the next hour.
- **Your plan is the limit.** An assistant can't put more apps online than you could, and it can't reach the dashboard's own API.
- **Everything is on record.** Each change is logged under the app or key that made it.

How this works in detail, and how to report a security issue, is in [docs/security.md](docs/security.md) and [SECURITY.md](SECURITY.md).

## Scripts and clients without sign-in

Make an API key on the [AI tools](https://beta.blitz.cloud/ai) page and send it in the `Authorization` header:

```sh
claude mcp add --transport http blitz https://mcp.blitz.cloud/<your name> \
  --header "Authorization: Bearer $BLITZ_API_KEY"
```

A key is shown once, only its hash is stored, and you can have five. [`examples/python`](examples/python) and [`examples/typescript`](examples/typescript) list your apps with the official MCP SDKs.

## Limits

- 120 calls a minute for each key or connected app, 20 of which may change something.
- Changes need a confirmed email address.
- Connecting a Tailscale or WireGuard network isn't a tool. It needs a secret or a config file, which belongs in the dashboard rather than in a chat.

## Links

- [Documentation](https://blitz.cloud/docs/ai-assistants/)
- [What's live on blitz.cloud](https://blitz.cloud/whats-live/)
- [Dashboard](https://beta.blitz.cloud)

## License

The examples and documentation in this repository are released under the [MIT License](LICENSE). The blitz.cloud service is covered by its own terms.
