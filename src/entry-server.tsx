import { renderToString } from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router";
import { routes } from "./app/routes";
import { postPath, posts } from "./app/blog/posts";
import { getHead, renderHead } from "./app/seo";
import { AUTHOR, SITE_NAME, SITE_URL } from "./app/site";

// Build-time entry: scripts/prerender.mjs turns every path below into static HTML,
// so search engines and AI crawlers get the full page without running JavaScript.

export { posts, AUTHOR, SITE_NAME, SITE_URL };

export const staticPaths = [
  "/",
  "/philosophy/",
  "/scale/",
  "/products/",
  "/blog/",
  ...posts.map((post) => postPath(post.slug)),
];

export async function render(url: string) {
  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request(`${SITE_URL}${url}`));
  if (context instanceof Response) {
    throw new Error(`Unexpected response while prerendering ${url}: ${context.status}`);
  }
  const router = createStaticRouter(handler.dataRoutes, context);
  const html = renderToString(
    <StaticRouterProvider router={router} context={context} />,
  );
  return { html, head: renderHead(getHead(url)) };
}
