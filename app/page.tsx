import { HomeView } from "@/components/roadmap-views";
import { getAllRoadmaps } from "@/lib/mdx";

export default async function Home() {
  return <HomeView roadmaps={await getAllRoadmaps()} />;
}
