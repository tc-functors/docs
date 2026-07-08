---
title: MCP
description: MCP interface
---

`tc mcp` command spins up a MCP server. It currently exposes a handful of tools (compose, build, create, delete, update, test, invoke, changelog). All of the tools take a dir, profile, sandbox as arguments.

### Using mcp-cli

```
cat ~/.config/mcp/mcp_servers.json
{
  "mcpServers": {
    "tc": {
      "command": "tc",
      "args": [
        "mcp"
      ]
    }
  }
```

```sh
 mcp-cli info tc

Server: tc
Transport: stdio
Command: tc mcp

Tools (9):
  build
    Parameters:
      • dir (string, required)
      • profile (string, required)

  changelog
    Parameters:
      • between (string,null, optional)
      • dir (string, required)
      • search (string,null, optional)
      • verbose (boolean, required)

  compose
    Parameters:
      • dir (string, required)
      • recursive (boolean, required)

  create
    Parameters:
      • dir (string, required)
      • profile (string, required)
      • recursive (boolean, required)
      • sandbox (string, required)
```

```
mcp-cli call tc <tool> <params>
```

```
mcp-cli
tc
  • build
  • changelog
  • compose
  • create
  • delete
  • invoke
  • resolve
  • test
  • update
```

### Screencast

[![MCP image]][MCP source]

[MCP image]: ../../../assets/mcp.gif
[MCP source]: ../../../assets/mcp.gif
