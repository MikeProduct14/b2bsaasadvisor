export interface PostSource {
  title: string;
  url: string;
  publisher?: string;
  date?: string;
}

export interface PostMeta {
  slug: string;
  title: string;
  seoTitle?: string;
  description: string;
  date: string;
  updated?: string;
  tags: string[];
  keywords: string[];
  summary: string[];
  faq: { q: string; a: string }[];
  sources: PostSource[];
  draft: boolean;
  readingMinutes: number;
}

export interface PostBody {
  html: string;
  toc: { id: string; text: string }[];
}

// Frontmatter of every post is bundled; bodies load per post (see plugins/blog.ts).
const metaModules = import.meta.glob<PostMeta>("/content/blog/*.md", {
  query: "?meta",
  import: "default",
  eager: true,
});
const bodyModules = import.meta.glob<PostBody>("/content/blog/*.md", {
  query: "?body",
  import: "default",
});

export const posts: PostMeta[] = Object.values(metaModules)
  .filter((post) => !post.draft || import.meta.env.DEV)
  .sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug: string | undefined): PostMeta | undefined {
  return posts.find((post) => post.slug === slug);
}

export async function loadPostBody(slug: string | undefined): Promise<PostBody | null> {
  const post = getPost(slug);
  const load = post && bodyModules[`/content/blog/${post.slug}.md`];
  return load ? load() : null;
}

export function relatedPosts(post: PostMeta, limit = 3): PostMeta[] {
  const shared = (other: PostMeta) => other.tags.filter((tag) => post.tags.includes(tag)).length;
  return posts
    .filter((other) => other.slug !== post.slug)
    .sort((a, b) => shared(b) - shared(a) || b.date.localeCompare(a.date))
    .slice(0, limit);
}

export function postPath(slug: string): string {
  return `/blog/${slug}/`;
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
