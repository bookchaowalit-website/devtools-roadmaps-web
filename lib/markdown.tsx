import type { ReactNode } from "react";

// A deliberately small Markdown renderer for the authored roadmap bodies: paragraphs, #-headings,
// "-" bullet lists, *em* and **strong**. It builds React elements, so any HTML in the source is
// escaped as text, never injected.

function inline(text: string, key: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    nodes.push(match[1] !== undefined ? <strong key={`${key}-${match.index}`}>{match[1]}</strong> : <em key={`${key}-${match.index}`}>{match[2]}</em>);
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function block(raw: string, index: number): ReactNode {
  const lines = raw.split("\n").map((line) => line.trim());
  const key = `b${index}`;
  const heading = /^(#{1,6})\s+(.*)$/.exec(lines[0]);
  if (heading && lines.length === 1) {
    const Tag = `h${Math.min(heading[1].length + 1, 6)}` as "h2";
    return <Tag key={key}>{inline(heading[2], key)}</Tag>;
  }
  if (lines.every((line) => /^[-*]\s+/.test(line))) {
    return <ul key={key}>{lines.map((line, i) => <li key={i}>{inline(line.replace(/^[-*]\s+/, ""), `${key}-${i}`)}</li>)}</ul>;
  }
  return <p key={key}>{inline(lines.join(" "), key)}</p>;
}

export function Markdown({ source }: { source: string }) {
  const blocks = source.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
  return <>{blocks.map(block)}</>;
}
