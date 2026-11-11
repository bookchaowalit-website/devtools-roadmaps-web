import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RoadmapDetailView } from "./RoadmapDetailView";
import { blankSheet, completedSheet, dataScientist, longSheet, productManager, webDeveloper } from "../fixtures/roadmaps";

// "/roadmaps/[slug]" for the three authored sheets plus the states the page can show.
const meta = {
  title: "Sections/RoadmapDetail",
  component: RoadmapDetailView,
  parameters: { layout: "fullscreen", nextjs: { navigation: { pathname: "/roadmaps/web-developer" } } },
  args: { roadmap: webDeveloper },
} satisfies Meta<typeof RoadmapDetailView>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WebDeveloper: Story = {};
export const DataScientist: Story = { args: { roadmap: dataScientist } };
export const ProductManager: Story = { args: { roadmap: productManager } };
export const BlankSheet: Story = { name: "Blank sheet (no prerequisites, body or stages)", args: { roadmap: blankSheet } };
export const LongSheet: Story = { name: "Long sheet", args: { roadmap: longSheet } };
export const Completed: Story = { name: "Completed (100%)", args: { roadmap: completedSheet } };
export const Mobile: Story = { args: { roadmap: webDeveloper }, globals: { viewport: { value: "w375" } } };
