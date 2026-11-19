import type { Metadata } from "next";
import { IndexView } from "@/components/roadmap-views";
import { getAllRoadmaps } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "All roadmaps",
  description: "Search every career learning roadmap by stage, prerequisite or level.",
  alternates: { canonical: "/roadmaps" },
};

type Search = { q?: string | string[]; level?: string | string[] };
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";

export default async function RoadmapsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams;
  return <IndexView roadmaps={await getAllRoadmaps()} query={first(params.q).trim().slice(0, 100)} level={first(params.level)} />;
}
