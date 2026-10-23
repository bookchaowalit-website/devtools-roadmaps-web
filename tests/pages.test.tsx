import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";
import RoadmapPage, { generateStaticParams } from "@/app/roadmaps/[slug]/page";

describe("pages", () => {
  it("home lists every authored route and the sample-progress notice", async () => {
    const out = renderToString(await Home());
    expect(out).toContain("Choose a route you can keep walking.");
    expect(out).toContain("Web Developer Roadmap");
    expect(out).toContain("Data Scientist Roadmap");
    expect(out).toContain("Progress is");
  });

  it("prebuilds a detail page for every roadmap", async () => {
    expect((await generateStaticParams()).map((p) => p.slug).sort()).toEqual(["data-scientist", "product-manager", "web-developer"]);
  });

  it("renders a detail page from a Promise of params (Next 16) with stages and the authored description", async () => {
    const out = renderToString(await RoadmapPage({ params: Promise.resolve({ slug: "web-developer" }) }));
    expect(out).toContain("Web Developer Roadmap");
    expect(out).toContain("Docker basics");
    expect(out).toContain("A comprehensive roadmap for becoming a full-stack web developer");
    expect(out).not.toContain("*Progress");
  });

  it("calls notFound for an unknown slug", async () => {
    await expect(RoadmapPage({ params: Promise.resolve({ slug: "nope" }) })).rejects.toThrow(/NEXT_HTTP_ERROR_FALLBACK;404|NEXT_NOT_FOUND/);
  });
});
