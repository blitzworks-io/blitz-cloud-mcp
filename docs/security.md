# How sign-in and permissions work

An assistant connected to blitz.cloud can put apps online and delete them, so how it gets in and what it may do matters. This page describes both for people who want to know before they connect one.

## Signing in

blitz.cloud follows the [MCP authorization specification](https://modelcontextprotocol.io/specification/latest/basic/authorization), which is plain OAuth 2.1.

1. A client calls `https://mcp.blitz.cloud/<your name>` without a credential and gets `401` with a `WWW-Authenticate` header pointing to the server's protected resource metadata (RFC 9728).
2. That document names `https://login.blitz.cloud/realms/blitz` as the authorization server. Its own metadata (RFC 8414) tells the client where to send you.
3. The client opens the blitz.cloud sign-in in your browser, with PKCE (S256 only). You sign in there, never in the client.
4. A consent page shows which app is asking and what it will be able to do. Nothing is granted until you allow it.
5. The client receives a short-lived access token for the MCP server and nothing else.

### Which app is asking

Clients identify themselves in one of two ways, and the consent page tells you which.

- **Client ID Metadata Documents.** Claude Code and VS Code present a `client_id` that is an `https` URL on `claude.ai` or `vscode.dev`. blitz.cloud fetches the document behind it and only trusts those two domains for this, so no other app can present itself as one of them. The consent page names the domain.
- **Dynamic client registration** (RFC 7591). Other clients, such as Claude's web connectors, ChatGPT and Cursor, register themselves before the first sign-in. Anyone can register an app under any name, so the consent page says the name is the app's own claim and shows no logo it supplied. What such an app can't choose is where the sign-in goes: its redirect addresses must be on the known MCP clients (Claude, ChatGPT, Cursor, VS Code) or on your own computer. An app registered by somebody else therefore can't receive your sign-in on a server of theirs. Consent is always required for these apps, they can only ask for access to the MCP server, and registration is rate-limited.

Only allow an app you just connected yourself. blitz.cloud never asks you to sign in an app from an email or a message.

### What a token opens

Tokens for the MCP server carry the server as their audience and the `mcp:tools` scope, and the server accepts nothing else. A token issued for the blitz.cloud dashboard doesn't open the MCP server, and a token issued for an assistant doesn't open the dashboard or its API.

### Disconnecting

Every app you sign in is listed under Connected apps on the [AI tools](https://beta.blitz.cloud/ai) page. Disconnect does two things at once: it takes back your consent, so the app can't get a new token, and it makes the server refuse every token the app was given before, from its next request. You don't have to wait for a token to expire. Signing the app in again later is a new consent.

## API keys

Keys are for scripts and for clients that can't sign in.

- A key is shown once, right after you make it. blitz.cloud stores only a SHA-256 hash of it and its first characters, which is how the dashboard tells your keys apart.
- The response that shows a new key tells every cache on the way not to keep it.
- You can have up to five keys. Rotate replaces a key's value and the old value stops working in the same moment. Revoke deletes it.
- Keys work only on the MCP server. They don't open the dashboard or its API.
- Keys are only issued to an account whose email address is confirmed, and a suspended account's keys stop working immediately.

## What an assistant can and can't do

An assistant acts as your account and goes through the same checks as the dashboard. It sees your apps, databases and addresses and nobody else's, and your plan's limits apply unchanged.

It can't:

- sign in to the dashboard, change your password, email address, sign-in methods or billing
- connect a Tailscale or WireGuard network, because that needs a secret or a config file, which belong in the dashboard
- read database passwords; connecting a database hands them to the app directly
- make changes while your email address is unconfirmed

It can read environment variables, including secret ones, because that's often what debugging an app takes. Keep that in mind when you connect an assistant you don't fully trust.

## Destructive actions

Deleting an app, a database, a DNS record or an environment variable, and restarting or pausing, ask first.

When the client supports elicitation, the MCP server asks you directly in the client, and the assistant cannot answer in your place. This matters because text an assistant reads, such as an app's log output or a web page, can contain instructions aimed at the model. A question that goes to you is not affected by that.

Clients without elicitation have to repeat the call with `confirm: true`. Here the confirmation is the assistant's word, so use clients that support elicitation for accounts you care about, and read what your assistant is about to do.

## Limits and records

- Each key or connected app can make 120 calls a minute, 20 of which may change something.
- Every change is recorded in your account's audit log under the key or app that made it. On an app's Activity tab it appears as done by you.
- blitz.cloud can switch off the whole MCP server at once without affecting the dashboard.

## Good practice

- Prefer signing in over keys. There is nothing to leak, and you can see and disconnect every app.
- One key per machine or tool, so you can revoke one without touching the others.
- Keep keys in your client's secret storage or an environment variable, not in a repository.
- Disconnect apps you no longer use.

To report a security issue, see [SECURITY.md](../SECURITY.md).
