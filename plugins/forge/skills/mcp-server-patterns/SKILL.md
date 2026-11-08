---
disable-model-invocation: true  # skl: on-demand pack skill
name: mcp-server-patterns
description: Building Model Context Protocol (MCP) servers - tools, resources, prompts, input schemas, error results, stdio vs Streamable HTTP transport, security, testing with the Inspector, and registering in Claude Code. Use when building, extending or debugging an MCP server in TypeScript, Python, Go or Rust, designing MCP tool schemas, choosing a transport, or when a server fails to connect or register.
---

# MCP server patterns

MCP lets a client (Claude Code, Claude Desktop, IDEs) call **tools**, read **resources** and use
**prompts** exposed by a server over JSON-RPC 2.0. Tool design principles (naming, granularity,
observation shape) are shared with forge:agent-harness. Write the smallest server that does the
job (forge:ponytail): one file and a handful of tools is normal.

## Before writing

- Does it need to be an MCP server? A CLI the agent runs via Bash, or a skill with a script, is
  simpler when the capability is local, stateless and used by one client. MCP earns its keep for
  reusable integrations across clients, long-lived connections/sessions, or remote/authenticated
  services.
- SDK APIs change between versions. Pin the SDK version, then check its README/examples for the
  current registration and transport calls before writing code; do not trust remembered
  signatures.
- Official SDKs: TypeScript `@modelcontextprotocol/sdk`, Python `mcp` (includes `FastMCP`), Go
  `github.com/modelcontextprotocol/go-sdk`, Rust `rmcp`. Prefer the one matching the project's
  language.

## Core concepts

| Primitive | Controlled by | Use for |
|---|---|---|
| Tool | model decides to call | actions and queries with arguments (search, create issue, run query) |
| Resource | client/app attaches | read-only data addressed by URI (file, row, document) |
| Prompt | user picks | reusable parameterized prompt templates |

Most servers need only tools. Add resources/prompts when a client actually surfaces them.

## Minimal servers

Python (FastMCP; type hints and docstring become the schema and description):

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("notes")

@mcp.tool()
def search_notes(query: str, limit: int = 10) -> list[str]:
    """Search note titles by case-insensitive substring. Returns at most `limit` titles."""
    return [t for t in load_titles() if query.lower() in t.lower()][:limit]

if __name__ == "__main__":
    mcp.run()  # stdio by default
```

TypeScript (verify method names against the installed SDK version):

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "notes", version: "0.1.0" });
server.registerTool(
  "search_notes",
  { description: "Search note titles by substring.", inputSchema: { query: z.string(), limit: z.number().int().max(50).default(10) } },
  async ({ query, limit }) => ({ content: [{ type: "text", text: JSON.stringify(search(query, limit)) }] }),
);
await server.connect(new StdioServerTransport());
```

Keep tool logic in plain functions independent of the transport, so it can be unit-tested and the
entrypoint can switch transports.

## Tool design

- Names: stable, specific, `verb_noun` (`search_issues`, `get_issue`), unique across the servers a
  client may load. No catch-all `do_action` tool.
- Descriptions are prompts: say what it does, when to use it, what it returns, side effects, and
  cost/rate limits. The model chooses tools from these words.
- Inputs: narrow schemas - enums over free strings, bounds on numbers, required vs optional
  explicit. Validate again in the handler; the schema is a hint to the client, not a guarantee.
- Outputs: concise and deterministic in shape. Paginate or truncate large results and say so
  ("showing 20 of 340; pass cursor=..."). Return IDs the model can pass to the next tool.
- Prefer idempotent tools; make destructive ones explicit (separate `delete_*` tool, a
  confirmation parameter, or a dry-run mode). Tool annotations (read-only, destructive, idempotent
  hints) help clients decide what to confirm, if the SDK/spec version supports them.
- A handful of well-chosen tools beats dozens of overlapping ones; each tool's description costs
  context in every session.

## Errors

- Distinguish protocol errors (unknown tool, malformed request - the SDK handles these) from tool
  execution failures. Report execution failures as a tool result with `isError: true` and a
  message the model can act on: what failed, why, and what to try next.
- Never return raw stack traces, credentials or internal hostnames in results.
- Put timeouts on every outbound call; a hung tool hangs the client's turn.

## Transports

- **stdio** for local servers launched by the client. stdout carries only protocol messages:
  any `print`/`console.log`/`println!` to stdout corrupts the stream. Log to stderr.
- **Streamable HTTP** for remote or shared servers (single MCP endpoint). Legacy HTTP+SSE only for
  old clients.
- For HTTP servers: bind to `127.0.0.1` when local, validate the `Origin` header, require auth for
  anything non-local (the spec's authorization flow is OAuth-based), and enforce per-user
  authorization inside tools.

## Security

Tool arguments come from a model that may have read attacker-controlled text. Treat them as
untrusted input:

- Confine filesystem access to configured roots; resolve and check paths (no `..` escapes, no
  symlink tricks).
- Never interpolate arguments into shell commands or SQL; use argument arrays and bind parameters.
- Least privilege: read-only credentials for read-only tools, scoped tokens, secrets from env/config
  never from tool arguments, never echoed back.
- Content your tools return (web pages, issues, emails) can carry prompt injection to the client;
  return it as data and don't add instructions around it.

## Testing and debugging

- Unit-test the plain functions behind tools like any other code (forge:tdd).
- Exercise the real server with the MCP Inspector (`npx @modelcontextprotocol/inspector <command> <args>`)
  to list tools, check schemas and call them.
- Register in Claude Code: `claude mcp add <name> -- <command> [args...]` (stdio) or
  `claude mcp add --transport http <name> <url>`; check status with `claude mcp list` or `/mcp`.
- "Failed to connect" usually means: the command isn't on PATH for the client's environment, the
  server crashed on startup (run the command by hand and read stderr), something wrote to stdout,
  or a required env var isn't passed in the server config.
- After changing tool schemas, restart the client session; clients cache tool lists.

## Review checklist

- [ ] MCP is justified over a CLI/script
- [ ] Tool names specific, descriptions state behaviour, side effects and limits
- [ ] Inputs bounded and validated in the handler; paths confined; no shell/SQL interpolation
- [ ] Execution errors returned as `isError` results with actionable messages
- [ ] Large outputs paginated/truncated with a note
- [ ] stdio servers log only to stderr; HTTP servers check Origin and auth
- [ ] SDK version pinned; tested with the Inspector
