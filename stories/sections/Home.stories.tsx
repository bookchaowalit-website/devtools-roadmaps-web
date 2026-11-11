import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RoadmapIndex } from "../../lib/roadmap-index";
import { dataScientist, noRoadmaps, productManager, webDeveloper } from "../fixtures/roadmaps";

// "/" renders RoadmapIndex with the home copy from app/page.tsx and the roadmaps from getAllRoadmaps().
const homeCopy = {
  title: "Choose a route you can keep walking.",
  description: "Three authored paths for the work between curiosity and a useful next step.",
};

const meta = {
  title: "Sections/Home",
  parameters: { layout: "fullscreen", nextjs: { navigation: { pathname: "/" } } },
  args: { ...homeCopy, roadmaps: [productManager, webDeveloper, dataScientist] },
  render: (args) => <RoadmapIndex {...args} />,
} satisfies Meta<typeof RoadmapIndex>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const EmptyCatalogue: Story = { name: "Empty catalogue", args: { roadmaps: noRoadmaps } };
export const Mobile: Story = { globals: { viewport: { value: "w375" } } };
