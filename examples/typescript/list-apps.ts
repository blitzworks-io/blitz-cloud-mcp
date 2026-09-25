// List your blitz.cloud apps through the MCP server, with an API key.
//
//   export BLITZ_API_KEY=bc_...   # from https://beta.blitz.cloud/ai
//   npm install && npm start

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

type AppLine = { name: string; statusLabel: string; url: string | null };

const server = process.env.BLITZ_MCP_URL ?? "https://mcp.blitz.cloud/mcp";
const key = process.env.BLITZ_API_KEY;
if (!key) {
  console.error("Set BLITZ_API_KEY to a key from https://beta.blitz.cloud/ai");
  process.exit(1);
}

const transport = new StreamableHTTPClientTransport(new URL(server), {
  requestInit: { headers: { Authorization: `Bearer ${key}` } },
});
const client = new Client({ name: "blitz-cloud-example", version: "1.0.0" });

await client.connect(transport);
const result = await client.callTool({ name: "apps_list", arguments: {} });
await client.close();

const texts = (result.content as { type: string; text?: string }[]).flatMap((block) => (block.text ? [block.text] : []));
if (result.isError) {
  console.error(texts.join(" "));
  process.exit(1);
}

// A list comes back as one content block per item.
for (const app of texts.map((text) => JSON.parse(text) as AppLine)) {
  console.log(`${app.name.padEnd(24)} ${app.statusLabel.padEnd(16)} ${app.url ?? "-"}`);
}
