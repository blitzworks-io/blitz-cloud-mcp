# blitz.cloud plugin for Claude Code

Host apps on blitz.cloud from Claude Code: install one of the App Store apps, deploy a Docker image or a GitHub repository, upload your own code, and read logs and databases. Servers are in the EU.

The plugin connects Claude Code to the blitz.cloud MCP server at `https://mcp.blitz.cloud/mcp` and adds the skill `deploy-to-blitz-cloud`, which walks Claude through a first deploy.

## Install

```
/plugin marketplace add blitzworks-io/blitz-cloud-mcp
/plugin install blitz-cloud@blitz-cloud-mcp
```

The first time Claude uses a blitz.cloud tool, your browser opens and you sign in to blitz.cloud. Nothing else to set up.

## Links

- Guide: https://blitz.cloud/docs/ai-assistants/
- Privacy: https://blitz.cloud/privacy/
- Source and other clients: https://github.com/blitzworks-io/blitz-cloud-mcp
