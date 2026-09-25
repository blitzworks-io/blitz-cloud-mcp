"""List your blitz.cloud apps through the MCP server, with an API key.

Usage:
    export BLITZ_API_KEY=bc_...        # from https://beta.blitz.cloud/ai
    python list_apps.py
"""

import asyncio
import json
import os
import sys

import httpx2
from mcp import ClientSession
from mcp.client.streamable_http import streamable_http_client

SERVER = os.environ.get("BLITZ_MCP_URL", "https://mcp.blitz.cloud/mcp")


async def main() -> int:
    key = os.environ.get("BLITZ_API_KEY")
    if not key:
        print("Set BLITZ_API_KEY to a key from https://beta.blitz.cloud/ai", file=sys.stderr)
        return 1

    headers = {"Authorization": f"Bearer {key}"}
    async with httpx2.AsyncClient(headers=headers, timeout=30) as http:
        async with streamable_http_client(SERVER, http_client=http) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()
                result = await session.call_tool("apps_list", {})

    texts = [block.text for block in result.content if getattr(block, "text", None)]
    if getattr(result, "is_error", False):
        print(" ".join(texts), file=sys.stderr)
        return 1

    # A list comes back as one content block per item.
    for app in map(json.loads, texts):
        print(f"{app['name']:<24} {app['statusLabel']:<16} {app['url'] or '-'}")
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
