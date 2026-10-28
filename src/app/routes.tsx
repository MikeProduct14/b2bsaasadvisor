import type { RouteObject } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./pages/Home";
import { ProductPhilosophy } from "./pages/ProductPhilosophy";
import { ManagementScale } from "./pages/ManagementScale";
import { Products } from "./pages/Products";
import { Blog } from "./pages/Blog";
import { BlogPost, blogPostLoader } from "./pages/BlogPost";
import AdminLeads from "./pages/AdminLeads";

// Shared by the browser router (App.tsx) and the build-time prerender (entry-server.tsx).
export const routes: RouteObject[] = [
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "philosophy", Component: ProductPhilosophy },
      { path: "scale", Component: ManagementScale },
      { path: "products", Component: Products },
      { path: "blog", Component: Blog },
      {
        path: "blog/:slug",
        Component: BlogPost,
        loader: blogPostLoader,
        HydrateFallback: () => null,
      },
      { path: "admin/leads", Component: AdminLeads },
    ],
  },
];
