import { getAllRoadmaps } from "@/lib/mdx";
import { RoadmapIndex } from "@/lib/roadmap-index";

export default async function RoadmapsPage() {
  return (
    <RoadmapIndex
      title="The full route index."
      description="Browse the complete field edition, then open one sheet to see its stages and prerequisites."
      roadmaps={await getAllRoadmaps()}
    />
  );
}
