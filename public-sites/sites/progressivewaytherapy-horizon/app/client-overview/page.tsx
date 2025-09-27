import type { JSX } from "react";
import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Client Overview | Progressive Way Therapy",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

type MarkdownBlock =
  | { type: "heading"; level: 1 | 2 | 3; content: string }
  | { type: "paragraph"; content: string }
  | {
      type: "list";
      ordered: boolean;
      depth: number;
      items: Array<{ content: string; checked?: boolean }>
    }
  | { type: "table"; headers: string[]; rows: string[][] };

function parseMarkdown(markdown: string): MarkdownBlock[] {
  const lines = markdown.split(/\r?\n/);
  const blocks: MarkdownBlock[] = [];

  let paragraphBuffer: string[] = [];
  let listBuffer: { ordered: boolean; depth: number; items: Array<{ content: string; checked?: boolean }> } | null = null;
  let tableBuffer: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      blocks.push({ type: "paragraph", content: paragraphBuffer.join(" ") });
      paragraphBuffer = [];
    }
  };

  const flushList = () => {
    if (listBuffer && listBuffer.items.length > 0) {
      blocks.push({ type: "list", ordered: listBuffer.ordered, depth: listBuffer.depth, items: listBuffer.items });
    }

    listBuffer = null;
  };

  const flushTable = () => {
    if (tableBuffer.length === 0) return;

    const rows = tableBuffer
      .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()))
      .filter((cells) => cells.length > 0);

    if (rows.length > 0) {
      const [rawHeader, ...rawRows] = rows;
      const headers = rawHeader;
      const filteredRows = rawRows.filter((row) => !row.every((cell) => /^-+$/.test(cell)));
      blocks.push({ type: "table", headers, rows: filteredRows });
    }

    tableBuffer = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      flushTable();
      continue;
    }

    const tableMatch = line.startsWith("|") && line.endsWith("|");
    if (tableMatch) {
      flushParagraph();
      flushList();
      tableBuffer.push(line);
      continue;
    }

    flushTable();

    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = Math.min(headingMatch[1].length, 3) as 1 | 2 | 3;
      const content = headingMatch[2].trim();
      blocks.push({ type: "heading", level, content });
      continue;
    }

    const indentationMatch = rawLine.match(/^(\s*)(.*)$/);
    const indentSpaces = indentationMatch ? indentationMatch[1].length : 0;
    const depth = Math.floor(indentSpaces / 2);
    const trimmedContent = indentationMatch ? indentationMatch[2].trim() : line;

    const todoMatch = trimmedContent.match(/^- \[( |x)\]\s+(.*)$/i);
    if (todoMatch) {
      flushParagraph();
      if (listBuffer?.ordered || listBuffer?.depth !== depth) {
        flushList();
      }
      listBuffer = listBuffer ?? { ordered: false, depth, items: [] };
      listBuffer.items.push({ content: todoMatch[2].trim(), checked: todoMatch[1].toLowerCase() === "x" });
      continue;
    }

    const unorderedMatch = trimmedContent.match(/^-\s+(.*)$/);
    if (unorderedMatch) {
      flushParagraph();
      if (listBuffer?.ordered || listBuffer?.depth !== depth) {
        flushList();
      }
      listBuffer = listBuffer ?? { ordered: false, depth, items: [] };
      listBuffer.items.push({ content: unorderedMatch[1].trim() });
      continue;
    }

    const orderedMatch = trimmedContent.match(/^(\d+)\.\s+(.*)$/);
    if (orderedMatch) {
      flushParagraph();
      if (listBuffer && (!listBuffer.ordered || listBuffer.depth !== depth)) {
        flushList();
      }
      listBuffer = listBuffer ?? { ordered: true, depth, items: [] };
      listBuffer.items.push({ content: orderedMatch[2].trim() });
      continue;
    }

    flushList();
    paragraphBuffer.push(line);
  }

  flushParagraph();
  flushList();
  flushTable();

  return blocks;
}

function renderInline(content: string) {
  return content.split(/(\*\*[^*]+\*\*)/g).map((segment, index) => {
    if (segment.startsWith("**") && segment.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-earth-brown">
          {segment.slice(2, segment.length - 2)}
        </strong>
      );
    }

    return <span key={index}>{segment}</span>;
  });
}

function MarkdownRenderer({ markdown }: { markdown: string }) {
  const blocks = parseMarkdown(markdown);
  const heroIndex = blocks.findIndex((block) => block.type === "heading" && block.level === 1);
  const heroBlock = heroIndex >= 0 ? (blocks[heroIndex] as { type: "heading"; level: 1; content: string }) : null;
  const contentBlocks = heroIndex >= 0 ? blocks.filter((_, index) => index !== heroIndex) : blocks;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 text-earth-brown">
      {heroBlock ? (
        <section
          data-section-id="client-overview--summary"
          className="rounded-md border border-soft-purple/40 bg-gradient-to-br from-soft-purple/15 via-cream/40 to-warm-tan/20 p-10 shadow-gentle"
        >
          <h1 className="font-serif text-3xl md:text-4xl text-soft-purple">
            {renderInline(heroBlock.content)}
          </h1>
          <p className="mt-4 text-muted-foreground">
            High-level briefing for quick reference during content and layout work.
          </p>
        </section>
      ) : null}

      <article
        data-section-id="client-overview--content"
        className="rounded-md border border-border/60 bg-card/80 p-10 shadow-gentle"
      >
        <div className="prose prose-neutral max-w-none text-base leading-relaxed">
          {contentBlocks.map((block, index) => {
            if (block.type === "heading") {
              const Tag = (block.level === 1
                ? "h1"
                : block.level === 2
                  ? "h2"
                  : "h3") as keyof JSX.IntrinsicElements;

              const headingStyles: Record<number, string> = {
                1: "mt-16 text-3xl font-serif text-soft-purple",
                2: "mt-12 text-2xl font-serif text-sage-green",
                3: "mt-8 text-xl font-semibold text-earth-brown",
              };

              return (
                <Tag key={index} className={headingStyles[block.level] ?? "mt-8 text-xl font-semibold"}>
                  {renderInline(block.content)}
                </Tag>
              );
            }

            if (block.type === "list") {
              const ListTag = (block.ordered ? "ol" : "ul") as keyof JSX.IntrinsicElements;
              const depthPadding = ["pl-6", "pl-11", "pl-16", "pl-20", "pl-24"];
              const depthClass = depthPadding[Math.min(block.depth, depthPadding.length - 1)];
              const depthBorder = block.depth > 0 ? "border-l border-border/40" : "";

              type NormalizedItem = {
                title: string;
                route?: string;
                purpose?: string;
                isNavigationNote: boolean;
                checked?: boolean;
              };

              const normalizedItems = block.items.reduce<NormalizedItem[]>((acc, item) => {
                const raw = item.content.trim();
                const lower = raw.toLowerCase();
                const isPurposeLine = lower.startsWith("purpose:");

                if (isPurposeLine) {
                  const last = acc[acc.length - 1];
                  if (last) {
                    last.purpose = raw.replace(/^purpose:\s*/i, "").trim();
                  }
                  return acc;
                }

                const isNavigationNote = lower.includes("*(navigation trigger only") || lower.includes("*(section only");
                const routeMatch = raw.match(/^(.*)\s\(`([^`]+)`\)$/);
                const title = routeMatch ? routeMatch[1].trim() : raw;
                const route = routeMatch ? routeMatch[2].trim() : undefined;

                acc.push({
                  title,
                  route,
                  isNavigationNote,
                  checked: item.checked,
                });

                return acc;
              }, []);

              return (
                <ListTag key={index} className={`mt-5 space-y-2 list-none ${depthClass} ${depthBorder}`}>
                  {normalizedItems.map((item, itemIndex) => {
                    const hasCheckbox = typeof item.checked === "boolean";
                    const isPageLine = !item.isNavigationNote && !hasCheckbox;
                    const bulletColor = block.depth === 0 ? "bg-soft-purple" : "bg-sage-green/70";

                    const details = [
                      item.route ? `Route: ${item.route}` : null,
                      item.purpose ? `Purpose: ${item.purpose}` : null,
                    ]
                      .filter(Boolean)
                      .join(" • ");

                    return (
                      <li key={itemIndex} className="relative pl-8">
                        {hasCheckbox ? (
                          <input
                            type="checkbox"
                            checked={item.checked}
                            readOnly
                            className="absolute left-0 top-1 h-4 w-4 rounded border-border text-soft-purple focus:ring-soft-purple"
                          />
                        ) : (
                          <span
                            className={`absolute left-1 top-2.5 h-2.5 w-2.5 rounded-full ${bulletColor}`}
                            aria-hidden
                          />
                        )}

                        <div className="flex flex-col gap-1">
                          <span
                            className={
                              isPageLine
                                ? "font-semibold text-earth-brown"
                                : "font-medium text-muted-foreground"
                            }
                            title={details || undefined}
                          >
                            {renderInline(item.title)}
                            {item.isNavigationNote ? (
                              <span className="ml-2 text-xs uppercase tracking-wide text-muted-foreground/70">
                                navigation only
                              </span>
                            ) : null}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ListTag>
              );
            }

            if (block.type === "table") {
              return (
                <div key={index} className="mt-8 overflow-x-auto">
                  <table className="w-full border-separate border-spacing-y-2 text-sm">
                    <thead>
                      <tr className="bg-soft-purple/10 text-soft-purple">
                        {block.headers.map((header, headerIndex) => (
                          <th key={headerIndex} className="rounded-md px-4 py-2 text-left font-semibold">
                            {renderInline(header)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="rounded-md bg-background/70 text-muted-foreground">
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="rounded-md px-4 py-2 align-top">
                              {renderInline(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }

            return (
              <p key={index} className="mt-6 text-muted-foreground">
                {renderInline(block.content)}
              </p>
            );
          })}
        </div>
      </article>
    </div>
  );
}

export default async function ClientOverviewPage() {
  const filePath = path.join(process.cwd(), "client-overview.md");
  const markdown = await readFile(filePath, "utf8");

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background px-4 py-12">
      <MarkdownRenderer markdown={markdown} />
    </main>
  );
}
