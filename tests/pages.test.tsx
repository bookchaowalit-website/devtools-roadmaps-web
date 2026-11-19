import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";
import RoadmapsPage, { metadata as indexMetadata } from "@/app/roadmaps/page";
import RoadmapPage, { generateMetadata, generateStaticParams } from "@/app/roadmaps/[slug]/page";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { HomeView, IndexView, label, splitBody } from "@/components/roadmap-views";
import { getAllRoadmaps } from "@/lib/mdx";
import nextConfig from "@/next.config";

const index = async (params: Record<string, string | string[]>) => renderToString(await RoadmapsPage({ searchParams: Promise.resolve(params) }));

describe("home", () => {
  it("lists every authored route as cards, links to the full index and the hub, and shows no sample progress", async () => {
    const out = renderToString(await Home());
    expect(out).toContain("Choose a route you can keep walking.");
    expect(out).toContain("Pick by level and time");
    expect(out).not.toContain("Choose a route.<");
    expect(out).toContain("Web Developer Roadmap");
    expect(out).toContain("Data Scientist Roadmap");
    expect(out).toContain('href="/roadmaps"');
    expect(out).toContain('href="https://bookchaowalit.com/"');
    expect(out).not.toMatch(/\d+% (marked|complete)/);
    expect(out.match(/<h1/g)).toHaveLength(1);
  });

  it("says so when there are no roadmaps", () => {
    expect(renderToString(<HomeView roadmaps={[]} />)).toContain("No roadmaps yet");
  });
});

describe("index", () => {
  it("lists all roadmaps with level chips and a count", async () => {
    const out = await index({});
    expect(out).toContain("3 roadmaps");
    expect(out).toContain("Advanced");
    expect(out).toContain('aria-current="page"');
    expect(indexMetadata.alternates?.canonical).toBe("/roadmaps");
  });

  it("searches stage items and keeps the level when filtering", async () => {
    const out = await index({ q: "python", level: "advanced" });
    expect(out).toContain("Showing 1 of 3 roadmaps in Advanced for “python”");
    expect(out).toContain("Data Scientist Roadmap");
    expect(out).not.toContain("Web Developer Roadmap");
    expect(out).toContain('href="/roadmaps?q=python"');
  });

  it("ignores a level the content does not have and shows a way back when nothing matches", async () => {
    const out = await index({ q: ["zzzz"], level: "<b>x</b>" });
    expect(out).toContain("No roadmap matches");
    expect(out).toContain("Show all roadmaps");
    expect(out).not.toContain("&lt;b&gt;x");
    const levelOnly = renderToString(<IndexView roadmaps={await getAllRoadmaps()} level="advanced" query="zzzz" />);
    expect(levelOnly).toMatch(/at the (<!-- -->)?advanced(<!-- -->)? level/);
    expect(levelOnly).toContain('class="rs-plain" href="/roadmaps?level=advanced">Clear');
    expect(renderToString(<IndexView roadmaps={[]} />)).toContain("No roadmaps yet");
  });
});

describe("detail", () => {
  it("prebuilds a detail page for every roadmap", async () => {
    expect((await generateStaticParams()).map((p) => p.slug).sort()).toEqual(["data-scientist", "product-manager", "web-developer"]);
  });

  it("renders stages, prerequisites, the summary as lede and previous/next, without the progress line", async () => {
    const out = renderToString(await RoadmapPage({ params: Promise.resolve({ slug: "web-developer" }) }));
    expect(out).toContain("Web Developer Roadmap");
    expect(out).toContain("Docker basics");
    expect(out).toContain("A comprehensive roadmap for becoming a full-stack web developer");
    expect(out).toContain("Before you start");
    expect(out).toContain("1 prerequisite<");
    expect(out).toContain('rel="prev"');
    expect(out).toContain('rel="next"');
    expect(out).not.toContain("Progress");
    expect(out.match(/<h1/g)).toHaveLength(1);
  });

  it("gives each page its own title and canonical", async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug: "data-scientist" }) });
    expect(meta.title).toBe("Data Scientist Roadmap");
    expect(meta.alternates?.canonical).toBe("/roadmaps/data-scientist");
    expect(await generateMetadata({ params: Promise.resolve({ slug: "nope" }) })).toEqual({});
  });

  it("calls notFound for an unknown slug", async () => {
    await expect(RoadmapPage({ params: Promise.resolve({ slug: "nope" }) })).rejects.toThrow(/NEXT_HTTP_ERROR_FALLBACK;404|NEXT_NOT_FOUND/);
  });
});

describe("site", () => {
  it("helpers label values and split the summary", () => {
    expect(label("data-science")).toBe("Data science");
    expect(label("")).toBe("");
    expect(splitBody("One.\n\nTwo.\n\nThree.")).toEqual({ summary: "One.", rest: "Two.\n\nThree." });
  });

  it("redirects /more-projects to the hub and publishes sitemap and robots on its own domain", async () => {
    expect(await nextConfig.redirects!()).toContainEqual({ source: "/more-projects", destination: "https://bookchaowalit.com/", permanent: true });
    const urls = (await sitemap()).map((e) => e.url);
    expect(urls).toContain("https://roadmaps.bookchaowalit.com/roadmaps/web-developer");
    expect(robots().sitemap).toBe("https://roadmaps.bookchaowalit.com/sitemap.xml");
  });
});
