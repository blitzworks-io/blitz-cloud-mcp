# Security

## Reporting a vulnerability

If you find a security issue in the blitz.cloud MCP server, its sign-in, or anything else on blitz.cloud, please report it privately through **Report a vulnerability** on this repository's [Security tab](../../security/advisories/new). Please don't open a public issue.

It helps to include:

- what you found and what an attacker could do with it
- the steps to reproduce it, with the requests you sent
- your account's address if the issue involves your own account

We will confirm that we received your report, keep you informed while we fix it, and credit you in the advisory if you like.

## Testing

Only test against accounts you own. Please don't access other people's data, degrade the service for others (load tests, flooding the registration or sign-in endpoints), or use social engineering against users or staff. If you reach data that isn't yours by accident, stop, don't keep it, and tell us.

## Scope

In scope: `mcp.blitz.cloud`, sign-in at `login.blitz.cloud` as far as it concerns MCP clients, API keys, and the AI tools page on `beta.blitz.cloud`.

The code in this repository is examples and documentation. An issue in one of the examples is welcome as a normal issue or pull request.

How sign-in and permissions are designed is described in [docs/security.md](docs/security.md).
