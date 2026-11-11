import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RoadmapIndex } from "../../lib/roadmap-index";
import { dataScientist, longSheet, noRoadmaps, productManager, webDeveloper } from "../fixtures/roadmaps";

// "/roadmaps" renders RoadmapIndex with the full-index copy from app/roadmaps/page.tsx.
const indexCopy = {
  title: "The full route index.",
  description: "Browse the complete field edition, then open one sheet to see its stages and prerequisites.",
};

const meta = {
  title: "Sections/RoadmapsIndex",
  parameters: { layout: "fullscreen", nextjs: { navigation: { pathname: "/roadmaps" } } },
  args: { ...indexCopy, roadmaps: [productManager, webDeveloper, dataScientist] },
  render: (args) => <RoadmapIndex {...args} />,
} satisfies Meta<typeof RoadmapIndex>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const EmptyCatalogue: Story = { name: "Empty catalogue", args: { roadmaps: noRoadmaps } };
export const LongEntries: Story = { name: "Long entries", args: { roadmaps: [longSheet, productManager, webDeveloper, dataScientist] } };
export const Mobile: Story = { globals: { viewport: { value: "w375" } } };
