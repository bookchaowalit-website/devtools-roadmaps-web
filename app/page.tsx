import { getAllRoadmaps } from "@/lib/mdx";
import { RoadmapIndex } from "@/lib/roadmap-index";

export default async function Home() {
  return (
    <RoadmapIndex
      title="Choose a route you can keep walking."
      description="Three authored paths for the work between curiosity and a useful next step."
      roadmaps={await getAllRoadmaps()}
    />
  );
}
