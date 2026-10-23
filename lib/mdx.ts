import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export interface RoadmapStage {
  name: string;
  items: string[];
}

export interface Roadmap {
  title: string;
  category: string;
  progress: string;
  difficulty: string;
  estimated_time: string;
  prerequisites: string[];
  stages: RoadmapStage[];
  slug: string;
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "roadmaps");

// Slugs come from the URL and from MCP arguments: allow only file-name-safe ids so a
// request can never read outside content/roadmaps.
export function isValidSlug(slug: unknown): slug is string {
  return typeof slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function parseRoadmap(slug: string, source: string): Roadmap {
  const { data, content } = matter(source);
  return {
    title: String(data.title ?? slug),
    category: String(data.category ?? ""),
    progress: String(data.progress ?? "0"),
    difficulty: String(data.difficulty ?? ""),
    estimated_time: String(data.estimated_time ?? ""),
    prerequisites: Array.isArray(data.prerequisites) ? data.prerequisites.map(String) : [],
    stages: Array.isArray(data.stages)
      ? data.stages.map((stage: { name?: unknown; items?: unknown }) => ({
          name: String(stage.name ?? ""),
          items: Array.isArray(stage.items) ? stage.items.map(String) : [],
        }))
      : [],
    slug,
    content: content.trim(),
  };
}

export async function getAllRoadmaps(): Promise<Roadmap[]> {
  const files = (await fs.readdir(CONTENT_DIR)).filter((file) => file.endsWith(".mdx"));
  const roadmaps = await Promise.all(
    files.map(async (file) => parseRoadmap(file.replace(/\.mdx$/, ""), await fs.readFile(path.join(CONTENT_DIR, file), "utf8"))),
  );
  return roadmaps.sort((a, b) => (parseInt(b.progress) || 0) - (parseInt(a.progress) || 0));
}

export async function getRoadmapBySlug(slug: string): Promise<Roadmap | null> {
  if (!isValidSlug(slug)) return null;
  try {
    return parseRoadmap(slug, await fs.readFile(path.join(CONTENT_DIR, `${slug}.mdx`), "utf8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export function searchRoadmaps(roadmaps: Roadmap[], query: string): Roadmap[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return roadmaps;
  return roadmaps.filter((roadmap) =>
    [roadmap.title, roadmap.category, roadmap.difficulty, ...roadmap.prerequisites, ...roadmap.stages.flatMap((s) => [s.name, ...s.items])]
      .join(" ")
      .toLowerCase()
      .includes(needle),
  );
}
