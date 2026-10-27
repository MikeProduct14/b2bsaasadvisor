import { createBrowserRouter, RouterProvider } from "react-router";
import type { HydrationState } from "react-router";
import { routes } from "./routes";

declare global {
  interface Window {
    __staticRouterHydrationData?: HydrationState;
  }
}

// Prerendered pages ship their loader data, so the first render needs no refetch.
const router = createBrowserRouter(routes, {
  hydrationData: window.__staticRouterHydrationData,
});

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}
