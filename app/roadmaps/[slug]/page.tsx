import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailView, splitBody } from "@/components/roadmap-views";
import { getAllRoadmaps, getRoadmapBySlug } from "@/lib/mdx";

// Every roadmap is prebuilt; any other slug is a 404 without touching the file system.
export const dynamicParams = false;

export async function generateStaticParams() {
  const roadmaps = await getAllRoadmaps();
  return roadmaps.map((roadmap) => ({ slug: roadmap.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const roadmap = await getRoadmapBySlug((await params).slug);
  if (!roadmap) return {};
  return {
    title: roadmap.title,
    description: splitBody(roadmap.content).summary || undefined,
    alternates: { canonical: "/roadmaps/" + roadmap.slug },
  };
}

export default async function RoadmapPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const roadmap = await getRoadmapBySlug(slug);
  if (!roadmap) notFound();
  return <DetailView roadmap={roadmap} all={await getAllRoadmaps()} />;
}
