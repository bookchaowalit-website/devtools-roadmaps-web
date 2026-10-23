import { describe, expect, it } from "vitest";
import { getAllRoadmaps, getRoadmapBySlug, isValidSlug, searchRoadmaps } from "@/lib/mdx";

describe("roadmap content", () => {
  it("loads every authored roadmap, sorted by marked progress (highest first)", async () => {
    const roadmaps = await getAllRoadmaps();
    expect(roadmaps.map((r) => [r.slug, r.progress])).toEqual([
      ["product-manager", "85"],
      ["web-developer", "75"],
      ["data-scientist", "60"],
    ]);
    for (const r of roadmaps) expect(r.stages.length).toBeGreaterThan(0);
  });

  it("returns null for a slug with no file", async () => {
    expect(await getRoadmapBySlug("nope")).toBeNull();
  });

  it("refuses slugs that try to leave content/roadmaps", async () => {
    expect(isValidSlug("web-developer")).toBe(true);
    expect(isValidSlug("../roadmaps/web-developer")).toBe(false);
    expect(isValidSlug("a/b")).toBe(false);
    expect(isValidSlug("")).toBe(false);
    expect(await getRoadmapBySlug("../roadmaps/web-developer")).toBeNull();
  });

  it("searches case-insensitively over title, category, prerequisites and stage items", async () => {
    const all = await getAllRoadmaps();
    expect(searchRoadmaps(all, "PYTHON").map((r) => r.slug)).toEqual(["data-scientist"]);
    expect(searchRoadmaps(all, "management").map((r) => r.slug)).toEqual(["product-manager", "web-developer"]); // category + "State Management" stage item
    expect(searchRoadmaps(all, "  ").length).toBe(3);
    expect(searchRoadmaps(all, "kubernetes-operator-xyz")).toEqual([]);
  });
});
