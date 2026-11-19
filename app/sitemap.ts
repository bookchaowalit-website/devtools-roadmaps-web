import type { MetadataRoute } from "next";
import { SITE } from "@/components/roadmap-views";
import { getAllRoadmaps } from "@/lib/mdx";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const roadmaps = await getAllRoadmaps();
  return [SITE + "/", SITE + "/roadmaps", ...roadmaps.map((r) => SITE + "/roadmaps/" + r.slug)].map((url) => ({ url }));
}
