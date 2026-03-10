import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./pages/Home";
import { ProductPhilosophy } from "./pages/ProductPhilosophy";
import { ManagementScale } from "./pages/ManagementScale";
import AdminLeads from "./pages/AdminLeads";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "philosophy", Component: ProductPhilosophy },
      { path: "scale", Component: ManagementScale },
      { path: "admin/leads", Component: AdminLeads },
    ],
  },
], {
  basename: "/b2bsaasadvisor",
});
