import "server-only";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { z } from "zod";

const DOCS_DIR = path.join(process.cwd(), "src", "content", "docs");
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  updated: z.coerce.date().optional(),
});

export interface DocHeading {
  id: string;
  text: string;
  depth: 2 | 3;
}

export interface Doc {
  slug: string;
  title: string;
  description: string;
  updated?: Date;
  headings: DocHeading[];
  html: string;
}

export async function getDocSlugs(): Promise<string[]> {
  let entries: string[];
  try {
    entries = await readdir(DOCS_DIR);
  } catch {
    return [];
  }
  return entries
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.slice(0, -".md".length))
    .filter((slug) => SLUG_PATTERN.test(slug))
    .sort();
}

export async function docExists(slug: string): Promise<boolean> {
  return (await getDocSlugs()).includes(slug);
}

export async function getDoc(slug: string): Promise<Doc | null> {
  // The pattern check also blocks path traversal like "../secret".
  if (!SLUG_PATTERN.test(slug)) return null;

  let raw: string;
  try {
    raw = await readFile(path.join(DOCS_DIR, `${slug}.md`), "utf8");
  } catch {
    return null;
  }

  const { data, content } = matter(raw);
  // Throws (and fails the build) when frontmatter is missing or malformed.
  const meta = frontmatterSchema.parse(data);

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
      properties: { className: ["heading-link"] },
    })
    .use(rehypeStringify)
    .process(content);

  return {
    slug,
    title: meta.title,
    description: meta.description,
    updated: meta.updated,
    headings: extractHeadings(content),
    html: String(file),
  };
}

function stripInlineMarkdown(text: string): string {
  return text.replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[`*~]/g, "");
}

// Builds the table of contents from ## and ### headings. Ids are produced
// with the same slugger rehype-slug uses, so links match the rendered page.
function extractHeadings(markdown: string): DocHeading[] {
  const slugger = new GithubSlugger();
  const headings: DocHeading[] = [];
  let inFence = false;

  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const depth = match[1].length;
    const text = stripInlineMarkdown(match[2]);
    // Slug every heading level so duplicate-heading suffixes stay aligned.
    const id = slugger.slug(text);

    if (depth === 2 || depth === 3) {
      headings.push({ id, text, depth });
    }
  }

  return headings;
}
