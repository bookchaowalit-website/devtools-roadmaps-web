import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Markdown } from "@/lib/markdown";

const html = (source: string) => renderToString(<Markdown source={source} />);

describe("Markdown", () => {
  it("renders paragraphs with emphasis and strong text, not raw asterisks", () => {
    const out = html("*Progress: 75% complete*\n\nA **full-stack** path.");
    expect(out).toBe("<p><em>Progress: 75% complete</em></p><p>A <strong>full-stack</strong> path.</p>");
  });

  it("renders headings one level down (the page owns h1) and bullet lists", () => {
    const out = html("## Next\n\n- one\n- two");
    expect(out).toBe("<h3>Next</h3><ul><li>one</li><li>two</li></ul>");
  });

  it("escapes HTML in the source instead of injecting it", () => {
    const out = html("<script>alert(1)</script> & <b>x</b>");
    expect(out).not.toContain("<script>");
    expect(out).toContain("&lt;script&gt;");
  });

  it("renders nothing for empty content", () => {
    expect(html("  \n\n ")).toBe("");
  });
});
