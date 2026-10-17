# Examples

| Folder | What it is |
|---|---|
| [`claude-code`](claude-code) | The one command that connects Claude Code, with sign-in or with a key |
| [`cursor`](cursor) | `mcp.json` for Cursor |
| [`vscode`](vscode) | `mcp.json` for VS Code |
| [`codex`](codex) | `config.toml` for Codex CLI, and an `AGENTS.md` with the deploy steps |
| [`python`](python) | Lists your apps with the official MCP Python SDK and an API key |
| [`typescript`](typescript) | The same with the official TypeScript SDK |

Replace `<your name>` with your blitz.cloud address, as shown on the [AI tools](https://beta.blitz.cloud/ai) page. The scripts read the key from `BLITZ_API_KEY`; never commit a key to a repository.

The scripts use `https://mcp.blitz.cloud/mcp`. The part after the host only makes the address easier to recognise, so any path works, and `BLITZ_MCP_URL` overrides it.

## Python

```sh
cd examples/python
python -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
export BLITZ_API_KEY=bc_...
python list_apps.py
```

## TypeScript

```sh
cd examples/typescript
npm install
export BLITZ_API_KEY=bc_...
npm start
```
