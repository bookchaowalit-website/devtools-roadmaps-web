import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/mcp/route";

function rpc(body: unknown) {
  return POST(new Request("http://localhost/api/mcp", { method: "POST", body: JSON.stringify(body) }));
}

describe("MCP route", () => {
  it("echoes the JSON-RPC request id", async () => {
    const res = await rpc({ jsonrpc: "2.0", id: 7, method: "tools/list" });
    expect((await res.json()).id).toBe(7);
  });

  it("lists only the tools it really implements", async () => {
    const res = await rpc({ jsonrpc: "2.0", id: 1, method: "tools/list" });
    const { result } = await res.json();
    expect(result.tools.map((t: { name: string }) => t.name)).toEqual(["get_all", "get_by_slug", "search"]);
  });

  it("get_all returns the authored roadmaps from content/roadmaps, not sample data", async () => {
    const res = await rpc({ jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "get_all" } });
    const { result } = await res.json();
    expect(result.roadmaps.map((r: { slug: string }) => r.slug)).toEqual(["product-manager", "web-developer", "data-scientist"]);
    expect(JSON.stringify(result)).not.toContain("Sample Entry");
  });

  it("get_by_slug returns one roadmap with its stages", async () => {
    const res = await rpc({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "get_by_slug", arguments: { slug: "web-developer" } } });
    const { result } = await res.json();
    expect(result.roadmap.title).toBe("Web Developer Roadmap");
    expect(result.roadmap.stages).toHaveLength(4);
  });

  it("get_by_slug answers an invalid-params error for an unknown slug", async () => {
    const res = await rpc({ jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: "get_by_slug", arguments: { slug: "nope" } } });
    const body = await res.json();
    expect(body.id).toBe(4);
    expect(body.error.code).toBe(-32602);
  });

  it("search matches titles, categories and stage items", async () => {
    const res = await rpc({ jsonrpc: "2.0", id: 5, method: "tools/call", params: { name: "search", arguments: { query: "docker" } } });
    const { result } = await res.json();
    expect(result.roadmaps.map((r: { slug: string }) => r.slug)).toEqual(["web-developer"]);
  });

  it("rejects an unknown tool and an unknown method with the right codes", async () => {
    const tool = await (await rpc({ jsonrpc: "2.0", id: 6, method: "tools/call", params: { name: "delete_all" } })).json();
    expect(tool.error.code).toBe(-32602);
    const method = await (await rpc({ jsonrpc: "2.0", id: 8, method: "resources/list" })).json();
    expect(method.error.code).toBe(-32601);
    expect(method.id).toBe(8);
  });

  it("answers a parse error for a body that is not JSON", async () => {
    const res = await POST(new Request("http://localhost/api/mcp", { method: "POST", body: "{" }));
    expect((await res.json()).error.code).toBe(-32700);
  });
});
