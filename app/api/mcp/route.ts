import { NextResponse } from "next/server";
import { getAllRoadmaps, getRoadmapBySlug, searchRoadmaps } from "@/lib/mdx";

// Stateless JSON-RPC MCP endpoint over the same authored roadmaps the pages show (content/roadmaps).

type RpcRequest = { id?: number | string | null; method?: string; params?: { name?: string; arguments?: Record<string, unknown> } };

const TOOLS = [
  { name: "get_all", description: "List every authored roadmap with its stages", inputSchema: { type: "object", properties: {} } },
  { name: "get_by_slug", description: "Get one roadmap by slug", inputSchema: { type: "object", properties: { slug: { type: "string" } }, required: ["slug"] } },
  { name: "search", description: "Search titles, categories, prerequisites and stage items", inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] } },
];

class RpcError extends Error {
  constructor(readonly code: number, message: string) {
    super(message);
  }
}

async function callTool(name: string | undefined, args: Record<string, unknown> = {}) {
  switch (name) {
    case "get_all":
      return { roadmaps: await getAllRoadmaps() };
    case "get_by_slug": {
      const roadmap = typeof args.slug === "string" ? await getRoadmapBySlug(args.slug) : null;
      if (!roadmap) throw new RpcError(-32602, `No roadmap with slug ${String(args.slug)}`);
      return { roadmap };
    }
    case "search":
      return { roadmaps: searchRoadmaps(await getAllRoadmaps(), typeof args.query === "string" ? args.query : "") };
    default:
      throw new RpcError(-32602, `Unknown tool: ${String(name)}`);
  }
}

export async function POST(request: Request) {
  let id: RpcRequest["id"] = null;
  let body: RpcRequest;
  try {
    body = (await request.json()) as RpcRequest;
  } catch {
    return NextResponse.json({ jsonrpc: "2.0", id, error: { code: -32700, message: "Parse error" } }, { status: 400 });
  }
  id = body.id ?? null;
  try {
    let result: unknown;
    switch (body.method) {
      case "initialize":
        result = { protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "Roadmaps", version: "1.0.0" } };
        break;
      case "tools/list":
        result = { tools: TOOLS };
        break;
      case "tools/call":
        result = await callTool(body.params?.name, body.params?.arguments);
        break;
      default:
        throw new RpcError(-32601, `Unknown method: ${String(body.method)}`);
    }
    return NextResponse.json({ jsonrpc: "2.0", id, result });
  } catch (error) {
    if (error instanceof RpcError) {
      return NextResponse.json({ jsonrpc: "2.0", id, error: { code: error.code, message: error.message } }, { status: 400 });
    }
    return NextResponse.json({ jsonrpc: "2.0", id, error: { code: -32603, message: "Internal error" } }, { status: 500 });
  }
}
