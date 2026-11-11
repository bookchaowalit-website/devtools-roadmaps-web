import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RoadmapIndex } from "../../lib/roadmap-index";
import { completedSheet, longSheet, noRoadmaps, productManager, webDeveloper, dataScientist, blankSheet } from "../fixtures/roadmaps";

const meta = {
  title: "Components/RoadmapIndex",
  component: RoadmapIndex,
  parameters: { layout: "fullscreen" },
  args: {
    title: "Choose a route you can keep walking.",
    description: "Three authored paths for the work between curiosity and a useful next step.",
    roadmaps: [productManager, webDeveloper, dataScientist],
  },
} satisfies Meta<typeof RoadmapIndex>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const EmptyList: Story = { name: "Empty list", args: { roadmaps: noRoadmaps } };
export const SingleRoute: Story = { name: "Single route", args: { roadmaps: [dataScientist] } };
export const ProgressEdges: Story = {
  name: "Progress edges (0% and 100%)",
  args: { roadmaps: [completedSheet, blankSheet] },
};
export const LongText: Story = {
  name: "Long text",
  args: {
    title: "A very long editorial heading that keeps going so the wrapping of the largest display type can be checked",
    description:
      "Two sentences of description. The second sentence is here to make the paragraph wrap across several lines at the narrow measure used on the hero.",
    roadmaps: [longSheet, productManager],
  },
};
export const Mobile: Story = { globals: { viewport: { value: "w375" } } };
