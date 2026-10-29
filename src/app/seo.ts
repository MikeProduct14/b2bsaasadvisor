import { getPost, posts, postPath } from "./blog/posts";
import { products } from "./products";
import { AUTHOR, SITE_NAME, SITE_URL } from "./site";

export interface Head {
  title: string;
  description: string;
  path: string;
  type: "website" | "article";
  robots?: string;
  jsonLd: object[];
}

const HOME_DESCRIPTION =
  "Нахожу, где ручная работа тормозит рост бизнеса, и заменяю её системой: интеграции, AI-агенты, сквозная автоматизация с измеримым ROI.";

const person = {
  "@type": "Person",
  name: AUTHOR.name,
  jobTitle: AUTHOR.jobTitle,
  url: `${SITE_URL}/`,
};

const organization = {
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#org`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  description: HOME_DESCRIPTION,
  areaServed: ["RU", "BY", "KZ", "UZ", "AM", "GE"],
  knowsAbout: [
    "автоматизация бизнес-процессов",
    "AI-агенты для бизнеса",
    "интеграции CRM и 1С",
    "продуктовый менеджмент",
  ],
};

function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

function withBrand(title: string): string {
  const full = `${title} | ${SITE_NAME}`;
  return full.length <= 70 ? full : title;
}

export function normalizePath(pathname: string): string {
  return pathname === "/" || pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export function getHead(pathname: string): Head {
  const path = normalizePath(pathname);

  if (path === "/") {
    return {
      title: `${SITE_NAME} — автоматизация бизнес-процессов`,
      description: HOME_DESCRIPTION,
      path,
      type: "website",
      jsonLd: [
        { "@context": "https://schema.org", ...organization, founder: person },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: `${SITE_URL}/`,
          inLanguage: "ru-RU",
        },
      ],
    };
  }

  if (path === "/blog/") {
    return {
      title: withBrand("Блог об ИИ и автоматизации для бизнеса"),
      description:
        "Разборы кейсов, расчёты и новости ИИ для собственников и руководителей в России и СНГ. Без хайпа и техножаргона: прочитали — внедряете.",
      path,
      type: "website",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Blog",
          name: `Блог ${SITE_NAME}`,
          url: `${SITE_URL}/blog/`,
          inLanguage: "ru-RU",
          blogPost: posts.slice(0, 20).map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            url: `${SITE_URL}${postPath(post.slug)}`,
            datePublished: post.date,
          })),
        },
        breadcrumbs([
          { name: "Главная", path: "/" },
          { name: "Блог", path: "/blog/" },
        ]),
      ],
    };
  }

  const postMatch = path.match(/^\/blog\/([^/]+)\/$/);
  const post = postMatch && getPost(postMatch[1]);
  if (post) {
    const jsonLd: object[] = [
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        inLanguage: "ru-RU",
        keywords: post.keywords.join(", "),
        mainEntityOfPage: `${SITE_URL}${path}`,
        author: person,
        publisher: { "@type": "Organization", name: SITE_NAME, url: `${SITE_URL}/` },
        citation: post.sources.map((source) => source.url),
      },
      breadcrumbs([
        { name: "Главная", path: "/" },
        { name: "Блог", path: "/blog/" },
        { name: post.title, path },
      ]),
    ];
    if (post.faq.length > 0) {
      jsonLd.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      });
    }
    return {
      title: withBrand(post.seoTitle ?? post.title),
      description: post.description,
      path,
      type: "article",
      jsonLd,
    };
  }

  if (path === "/philosophy/") {
    return {
      title: withBrand("Подход: как я думаю о продукте и автоматизации"),
      description:
        "Принципы работы: найти ограничение системы, посчитать экономику решения и автоматизировать узкое место, а не всё подряд.",
      path,
      type: "website",
      jsonLd: [],
    };
  }

  if (path === "/products/") {
    return {
      title: withBrand("Продукты: что я собрал сам"),
      description:
        "Каталог моделей и SEO-воронки для MoleculAI, воронка приложения Harvest Map, MVP по 115-ФЗ для МФО, курс по A/B-тестам, Luno, Roadmap App и лендинги — с честным статусом каждого.",
      path,
      type: "website",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Продукты ProductMike",
          itemListElement: products.map((product, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: product.name,
            description: product.summary,
            url: `${SITE_URL}/products/#${product.slug}`,
          })),
        },
        breadcrumbs([
          { name: "Главная", path: "/" },
          { name: "Продукты", path: "/products/" },
        ]),
      ],
    };
  }

  if (path === "/scale/") {
    return {
      title: withBrand("Опыт и управленческий масштаб"),
      description:
        "Продукты с ARR до 3 млрд ₽, кросс-функциональные команды, решения с измеримым результатом на разных стадиях роста.",
      path,
      type: "website",
      jsonLd: [],
    };
  }

  return {
    title: `Страница не найдена — ${SITE_NAME}`,
    description: HOME_DESCRIPTION,
    path,
    type: "website",
    robots: "noindex",
    jsonLd: [],
  };
}

function escapeAttr(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

export function renderHead(head: Head): string {
  const url = `${SITE_URL}${head.path}`;
  const tags = [
    `<title>${escapeAttr(head.title)}</title>`,
    `<meta name="description" content="${escapeAttr(head.description)}" />`,
    head.robots
      ? `<meta name="robots" content="${head.robots}" />`
      : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${head.type}" />`,
    `<meta property="og:locale" content="ru_RU" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${escapeAttr(head.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(head.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta name="twitter:card" content="summary" />`,
    ...head.jsonLd.map(
      (data) =>
        `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`,
    ),
  ];
  return tags.join("\n      ");
}

// Keeps title, description and canonical in sync during client-side navigation.
export function applyHead(head: Head): void {
  document.title = head.title;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute("content", head.description);
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute("href", `${SITE_URL}${head.path}`);
}
