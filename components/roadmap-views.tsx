import Link from "next/link";
import {
  ArticleHeader,
  EmptyState,
  EntryList,
  Pager,
  Prose,
  Reader,
  ReaderFoot,
  ReaderHead,
  ReaderTop,
  ResultCount,
  SearchForm,
  TagFilter,
  matchesQuery,
  neighbours,
  plural,
  type Entry,
} from "@/components/reader-shell";
import { Markdown } from "@/lib/markdown";
import type { Roadmap } from "@/lib/mdx";

export const SITE = "https://roadmaps.bookchaowalit.com";
const SOURCE = "https://github.com/bookchaowalit-website/devtools-roadmaps-web";
const NOTE = "Authored learning routes kept in the repository. No account and no progress tracking: nothing you read here is stored.";

/** "data-science" → "Data science". */
export function label(value: string): string {
  const text = value.replace(/[-_]+/g, " ").trim();
  return text ? text[0].toUpperCase() + text.slice(1) : text;
}

/** The first paragraph of a roadmap's body (its summary) and whatever follows it. */
export function splitBody(content: string): { summary: string; rest: string } {
  const [first = "", ...rest] = content.split(/\n\s*\n/);
  return { summary: first.trim(), rest: rest.join("\n\n").trim() };
}

function toEntry(roadmap: Roadmap): Entry {
  return {
    href: "/roadmaps/" + roadmap.slug,
    title: roadmap.title,
    summary: splitBody(roadmap.content).summary || undefined,
    meta: [label(roadmap.difficulty), roadmap.estimated_time, plural(roadmap.stages.length, "stage")].filter(Boolean),
    tags: roadmap.category ? [label(roadmap.category)] : [],
  };
}

function searchFields(roadmap: Roadmap): string[] {
  return [roadmap.title, roadmap.category, roadmap.difficulty, ...roadmap.prerequisites, ...roadmap.stages.flatMap((s) => [s.name, ...s.items])];
}

function Frame({ current, children }: { current?: "/roadmaps"; children: React.ReactNode }) {
  return (
    <Reader>
      <ReaderTop name="Roadmaps" tagline="Learning routes" links={[{ href: "/roadmaps", label: "All roadmaps", current: current === "/roadmaps" }]} />
      <main id="main" className="rs-main">{children}</main>
      <ReaderFoot source={SOURCE} note={NOTE} />
    </Reader>
  );
}

export function HomeView({ roadmaps }: { roadmaps: Roadmap[] }) {
  return (
    <Frame>
      <ReaderHead
        eyebrow="Career learning roadmaps"
        title="Choose a route you can keep walking."
        lede="Authored paths for the work between curiosity and a useful next step: what to know first, then each stage in order."
      >
        <Link className="rs-button" href="/roadmaps">Browse and search all roadmaps</Link>
      </ReaderHead>
      <section aria-labelledby="routes-title">
        <div className="rs-section-head">
          <h2 id="routes-title">Pick by level and time</h2>
          <Link href="/roadmaps">Full index</Link>
        </div>
        {roadmaps.length ? (
          <EntryList entries={roadmaps.map(toEntry)} layout="cards" headingLevel={3} />
        ) : (
          <EmptyState title="No roadmaps yet" headingLevel={3}>Roadmaps appear here once they are added to the repository.</EmptyState>
        )}
      </section>
    </Frame>
  );
}

export function IndexView({ roadmaps, query = "", level = "" }: { roadmaps: Roadmap[]; query?: string; level?: string }) {
  const matching = roadmaps.filter((roadmap) => matchesQuery(searchFields(roadmap), query));
  // Chips come from the levels the content really has, never from the URL.
  const levels = [...new Set(roadmaps.map((r) => r.difficulty).filter(Boolean))].sort();
  const activeLevel = levels.includes(level) ? level : "";
  const shown = activeLevel ? matching.filter((r) => r.difficulty === activeLevel) : matching;
  const href = (lvl: string, q = query) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (lvl) params.set("level", lvl);
    const text = params.toString();
    return "/roadmaps" + (text ? "?" + text : "");
  };

  return (
    <Frame current="/roadmaps">
      <ReaderHead title="All roadmaps" lede="Search every stage and prerequisite, or narrow the list by level, then open a route to see its stages in order." />
      <div className="rs-toolbar">
        <SearchForm label="Search roadmaps" action="/roadmaps" placeholder="Try Python, SQL or Docker" defaultValue={query} hidden={activeLevel ? { level: activeLevel } : {}} clearHref={href(activeLevel, "")} />
        <TagFilter
          label="Filter by level"
          options={[
            { href: href(""), label: "All levels", current: !activeLevel, count: matching.length },
            ...levels.map((lvl) => ({ href: href(lvl), label: label(lvl), current: lvl === activeLevel, count: matching.filter((r) => r.difficulty === lvl).length })),
          ]}
        />
        <ResultCount shown={shown.length} total={roadmaps.length} noun="roadmap" query={query || undefined} filter={activeLevel ? label(activeLevel) : undefined} />
      </div>
      {shown.length ? (
        <EntryList entries={shown.map(toEntry)} />
      ) : roadmaps.length ? (
        <EmptyState title="No roadmap matches" action={
          // A native link reloads the page, so the uncontrolled search field resets and focus lands in it
          // (READER.md: a "clear" link that removes itself ends in #rs-search-q).
          // eslint-disable-next-line @next/next/no-html-link-for-pages -- the full reload is the point
          <a className="rs-plain" href="/roadmaps#rs-search-q">Show all roadmaps</a>
        }>
          Nothing matches {query ? <>“{query}”</> : "this filter"}{activeLevel ? <> at the {label(activeLevel).toLowerCase()} level</> : null}. Try a shorter word or another level.
        </EmptyState>
      ) : (
        <EmptyState title="No roadmaps yet">Roadmaps appear here once they are added to the repository.</EmptyState>
      )}
    </Frame>
  );
}

export function DetailView({ roadmap, all }: { roadmap: Roadmap; all: Roadmap[] }) {
  const { summary, rest } = splitBody(roadmap.content);
  const { previous, next } = neighbours(all, all.findIndex((r) => r.slug === roadmap.slug));
  return (
    <Frame>
      <article className="rs-article">
        <ArticleHeader
          back={{ href: "/roadmaps", label: "All roadmaps" }}
          tags={[roadmap.category, roadmap.difficulty].filter(Boolean).map(label)}
          title={roadmap.title}
          lede={summary || undefined}
          meta={[roadmap.estimated_time, plural(roadmap.stages.length, "stage"), plural(roadmap.prerequisites.length, "prerequisite")].filter(Boolean)}
        />
        <Prose>
          {rest ? <Markdown source={rest} /> : null}
          <h2 id="before">Before you start</h2>
          {roadmap.prerequisites.length ? (
            <ul>{roadmap.prerequisites.map((item, i) => <li key={i}>{item}</li>)}</ul>
          ) : (
            <p>No prerequisites listed.</p>
          )}
          <h2 id="stages">Stages, in order</h2>
          <p>Read them in order and come back as needed. Time estimates are rough guides, not a promise of fluency.</p>
          {roadmap.stages.map((stage, i) => (
            <section key={i} aria-labelledby={"stage-" + (i + 1)}>
              <h3 id={"stage-" + (i + 1)}>{stage.name}</h3>
              <ul>{stage.items.map((item, j) => <li key={j}>{item}</li>)}</ul>
            </section>
          ))}
        </Prose>
        <Pager
          label="More roadmaps"
          previous={previous ? { href: "/roadmaps/" + previous.slug, title: previous.title } : undefined}
          next={next ? { href: "/roadmaps/" + next.slug, title: next.title } : undefined}
        />
      </article>
    </Frame>
  );
}
