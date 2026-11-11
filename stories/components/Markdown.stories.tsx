import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Markdown } from "../../lib/markdown";
import { dataScientist, longSheet } from "../fixtures/roadmaps";

// The authored roadmap body renderer. Rendered inside the sheet's body container so the real type scale applies.
const meta = {
  title: "Components/Markdown",
  component: Markdown,
  parameters: { layout: "padded" },
  args: { source: dataScientist.content },
  render: (args) => (
    <div className="edition-detail-body">
      <Markdown source={args.source} />
    </div>
  ),
} satisfies Meta<typeof Markdown>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Formatting: Story = {
  args: {
    source: "# Heading one\n\n## Heading two\n\nPlain paragraph with *emphasis* and **strong** text.\n\n- First bullet with **bold**\n- Second bullet with *italic*\n- Third bullet",
  },
};
export const EscapesHtml: Story = {
  name: "Escapes HTML in source",
  args: {
    source: "Text with <script>alert('x')</script> and <img src=x onerror=alert(1)> stays as text.",
  },
};
export const Empty: Story = { args: { source: "" } };
export const LongText: Story = { name: "Long text", args: { source: longSheet.content } };
export const Mobile: Story = { args: { source: longSheet.content }, globals: { viewport: { value: "w375" } } };
