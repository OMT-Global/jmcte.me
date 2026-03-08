import type { MarkdownBlockType } from "@/lib/types";
import { parseMarkdownBlocks } from "@/lib/markdown";

type MarkdownViewProps = {
  content: string;
  className?: string;
};

export function MarkdownView({ content, className }: MarkdownViewProps) {
  const blocks: MarkdownBlockType[] = parseMarkdownBlocks(content);

  return (
    <article className={className}>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          if (block.level === 1) {
            return (
              <h1 key={`${block.type}-${index}`} className="mb-4 text-3xl font-bold">
                {block.text}
              </h1>
            );
          }
          if (block.level === 2) {
            return (
              <h2 key={`${block.type}-${index}`} className="mb-3 text-2xl font-semibold">
                {block.text}
              </h2>
            );
          }
          return (
            <h3 key={`${block.type}-${index}`} className="mb-2 text-xl font-semibold">
              {block.text}
            </h3>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={`${block.type}-${index}`} className="mb-4 ml-6 list-disc space-y-1">
              {block.items.map((item) => (
                <li key={item} className="text-sm leading-relaxed text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p
            key={`${block.type}-${index}`}
            className="mb-4 max-w-none text-base leading-relaxed text-muted-foreground"
          >
            {block.text}
          </p>
        );
      })}
    </article>
  );
}
