import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { ContactModal } from "./ContactModal";
import { ModalProvider } from "../context/ModalContext";
import { applyHead, getHead } from "../seo";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  useEffect(() => {
    applyHead(getHead(pathname));
  }, [pathname]);
  return null;
}

export function Root() {
  return (
    <ModalProvider>
      <ScrollToTop />
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ContactModal />
    </ModalProvider>
  );
}
