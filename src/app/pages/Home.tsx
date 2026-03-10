import { Hero } from "../components/Hero";
import { Problems } from "../components/Problems";
import { Solutions } from "../components/Solutions";
import { Cases } from "../components/Cases";
import { Formats } from "../components/Formats";
import { Process } from "../components/Process";
import { NotFor } from "../components/NotFor";
import { CTA } from "../components/CTA";

export function Home() {
  return (
    <>
      <Hero />
      <Problems />
      <Solutions />
      <Cases />
      <Formats />
      <Process />
      <NotFor />
      <CTA />
    </>
  );
}
