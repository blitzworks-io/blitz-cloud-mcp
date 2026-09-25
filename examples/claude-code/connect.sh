#!/bin/sh
# Connect Claude Code to blitz.cloud. Replace <your name> with your address,
# as shown on https://beta.blitz.cloud/ai.
#
# Sign in (recommended): run this once, then /mcp in Claude Code, pick
# "blitz" and sign in with your blitz.cloud account.
claude mcp add --transport http blitz "https://mcp.blitz.cloud/<your name>"

# With an API key instead, for machines where nobody can sign in:
# claude mcp add --transport http blitz "https://mcp.blitz.cloud/<your name>" \
#   --header "Authorization: Bearer $BLITZ_API_KEY"
