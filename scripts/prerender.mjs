// Runs after `vite build` and `vite build --ssr`: writes static HTML for every page,
// plus sitemap.xml, robots.txt, rss.xml and llms.txt.
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

// Production React: no dev-only SSR warnings in the build log.
process.env.NODE_ENV = "production";

const root = process.cwd();
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const { render, staticPaths, pageLastmod, posts, SITE_URL, SITE_NAME } = await import(
  pathToFileURL(path.join(ssrDir, "entry-server.js")).href
);

const template = await fs.readFile(path.join(dist, "index.html"), "utf8");
if (!template.includes("<!--app-head-->") || !template.includes("<!--app-html-->")) {
  throw new Error("index.html must contain <!--app-head--> and <!--app-html--> placeholders");
}

function fill(head, html) {
  return template.replace("<!--app-head-->", head).replace("<!--app-html-->", html);
}

async function write(relative, content) {
  const file = path.join(dist, relative);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content);
}

function xml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

for (const url of staticPaths) {
  const { html, head } = await render(url);
  await write(url === "/" ? "index.html" : path.join(url, "index.html"), fill(head, html));
}

// GitHub Pages serves 404.html for unknown paths; the SPA then renders the route.
await write(
  "404.html",
  fill(`<title>Страница не найдена — ${SITE_NAME}</title>\n      <meta name="robots" content="noindex" />`, ""),
);

const postDate = (post) => post.updated ?? post.date;

await write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPaths
  .map((url) => {
    const post = posts.find((p) => url === `/blog/${p.slug}/`);
    const date = post ? postDate(post) : pageLastmod[url];
    const lastmod = date ? `<lastmod>${date}</lastmod>` : "";
    return `  <url><loc>${SITE_URL}${url}</loc>${lastmod}</url>`;
  })
  .join("\n")}
</urlset>
`,
);

await write(
  "robots.txt",
  `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: ${SITE_URL}/sitemap.xml
`,
);

await write(
  "rss.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${xml(`Блог ${SITE_NAME}`)}</title>
  <link>${SITE_URL}/blog/</link>
  <description>ИИ и автоматизация для бизнеса: кейсы, расчёты, новости</description>
  <language>ru</language>
  <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${posts
  .slice(0, 30)
  .map(
    (post) => `  <item>
    <title>${xml(post.title)}</title>
    <link>${SITE_URL}/blog/${post.slug}/</link>
    <guid>${SITE_URL}/blog/${post.slug}/</guid>
    <pubDate>${new Date(`${post.date}T09:00:00+03:00`).toUTCString()}</pubDate>
    <description>${xml(post.description)}</description>
  </item>`,
  )
  .join("\n")}
</channel>
</rss>
`,
);

await write(
  "llms.txt",
  `# ${SITE_NAME}

> Консультант по автоматизации бизнес-процессов и внедрению ИИ для компаний в России и СНГ. Находит, где ручная работа тормозит рост, считает эффект в деньгах и внедряет автоматизацию: интеграции CRM и 1С, AI-агенты, боты, отчётность.

## Основное

- [Главная](${SITE_URL}/): услуги, кейсы, форматы работы и цены
- [Подход](${SITE_URL}/philosophy/): принципы работы
- [Опыт](${SITE_URL}/scale/): масштаб проектов и команд
- [Продукты](${SITE_URL}/products/): собственные продукты и MVP автора с текущим статусом
- [Карта рынка финтеха России и СНГ](${SITE_URL}/fintech-map/): 57 сегментов с оценками перегрева, барьера входа и денег, где в 2026 году есть окно для входа, календарь регуляторики 2026–2028; срез 29.10.2026
- [Карта корпоративной AI-платформы](${SITE_URL}/ai-platform-map/): слои платформы, инструменты с лицензиями и оценками, экономика, 152-ФЗ и ФСТЭК, риски и дорожная карта, проверено 29.10.2026

## Блог

${posts.map((post) => `- [${post.title}](${SITE_URL}/blog/${post.slug}/): ${post.description}`).join("\n")}
`,
);

await fs.rm(ssrDir, { recursive: true, force: true });
console.log(`prerendered ${staticPaths.length} pages, ${posts.length} posts`);
