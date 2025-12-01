import { Destaques } from "./destaques";
import Hero from "./hero";

export function ContentHeron() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
    <Hero />

    <div className="mt-16">
      <Destaques />
    </div>
  </section>
  );
}