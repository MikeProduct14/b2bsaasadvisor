import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked } from "marked";
import type { Plugin } from "vite";

// Turns content/blog/*.md into two kinds of modules:
//   *.md?meta — frontmatter only (small, bundled eagerly for lists and SEO)
//   *.md?body — rendered HTML + table of contents (loaded per post)
// The build fails on invalid frontmatter, so a broken post never ships.

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh",
  щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .split("")
    .map((ch) => TRANSLIT[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toDateString(value: unknown): string | undefined {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string") return value;
  return undefined;
}

function fail(file: string, message: string): never {
  throw new Error(`[blog] ${path.relative(process.cwd(), file)}: ${message}`);
}

function stringList(file: string, data: Record<string, unknown>, key: string, required: boolean): string[] {
  const value = data[key];
  if (value === undefined && !required) return [];
  if (!Array.isArray(value) || value.length === 0 || value.some((v) => typeof v !== "string" || !v.trim())) {
    fail(file, `"${key}" must be a non-empty list of strings`);
  }
  return value as string[];
}

function requiredString(file: string, data: Record<string, unknown>, key: string): string {
  const value = data[key];
  if (typeof value !== "string" || !value.trim()) fail(file, `"${key}" is required`);
  return value.trim();
}

function parseMeta(file: string, data: Record<string, unknown>, body: string) {
  const slug = path.basename(file, ".md");
  if (!SLUG_RE.test(slug)) fail(file, "file name must be a latin kebab-case slug");
  if (data.slug !== undefined && data.slug !== slug) fail(file, `"slug" must match the file name (${slug})`);

  const date = toDateString(data.date);
  if (!date || !DATE_RE.test(date)) fail(file, `"date" must be YYYY-MM-DD`);
  const updated = toDateString(data.updated);
  if (updated !== undefined && !DATE_RE.test(updated)) fail(file, `"updated" must be YYYY-MM-DD`);

  const sources = data.sources;
  if (!Array.isArray(sources) || sources.length === 0) fail(file, `"sources" must list at least one source`);
  for (const s of sources as Record<string, unknown>[]) {
    if (typeof s?.title !== "string" || typeof s?.url !== "string" || !/^https?:\/\//.test(s.url)) {
      fail(file, `every source needs "title" and an http(s) "url"`);
    }
  }

  const faq = data.faq ?? [];
  if (!Array.isArray(faq)) fail(file, `"faq" must be a list`);
  for (const item of faq as Record<string, unknown>[]) {
    if (typeof item?.q !== "string" || typeof item?.a !== "string") fail(file, `every faq item needs "q" and "a"`);
  }

  const words = body.split(/\s+/).filter(Boolean).length;

  return {
    slug,
    title: requiredString(file, data, "title"),
    seoTitle: typeof data.seoTitle === "string" ? data.seoTitle : undefined,
    description: requiredString(file, data, "description"),
    date,
    updated,
    tags: stringList(file, data, "tags", true),
    keywords: stringList(file, data, "keywords", true),
    summary: stringList(file, data, "summary", true),
    faq: faq as { q: string; a: string }[],
    sources: (sources as Record<string, unknown>[]).map((s) => ({
      title: s.title as string,
      url: s.url as string,
      publisher: typeof s.publisher === "string" ? s.publisher : undefined,
      date: toDateString(s.date),
    })),
    draft: data.draft === true,
    readingMinutes: Math.max(1, Math.round(words / 180)),
  };
}

function renderBody(file: string, markdown: string) {
  const toc: { id: string; text: string }[] = [];
  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      // Raw HTML in posts is shown as text: posts are written by an agent.
      html({ text }) {
        return escapeHtml(text);
      },
      heading({ tokens, depth, text }) {
        if (depth === 1) fail(file, "do not use H1 (#) in the body; the title is the H1");
        const plain = text.replace(/[*_`[\]]/g, "");
        const id = slugify(plain);
        if (depth === 2) toc.push({ id, text: plain });
        return `<h${depth} id="${id}">${this.parser.parseInline(tokens)}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const inner = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href) && !/^https?:\/\/(www\.)?productmike\.ru/.test(href);
        const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
        const rel = external ? ' target="_blank" rel="noopener"' : "";
        return `<a href="${escapeHtml(href)}"${titleAttr}${rel}>${inner}</a>`;
      },
    },
  });
  const html = marked.parse(markdown, { async: false }) as string;
  return { html, toc };
}

export function blogPlugin(): Plugin {
  return {
    name: "productmike-blog",
    load(id) {
      const [file, query] = id.split("?");
      if (!file.endsWith(".md") || !query) return null;
      const params = new URLSearchParams(query);
      if (!params.has("meta") && !params.has("body")) return null;

      this.addWatchFile(file);
      const { data, content } = matter(fs.readFileSync(file, "utf8"));
      const meta = parseMeta(file, data, content);
      const payload = params.has("meta") ? meta : renderBody(file, content);
      return `export default ${JSON.stringify(payload)};`;
    },
  };
}
