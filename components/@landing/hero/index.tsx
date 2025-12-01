import { Destaques } from "./destaques";
import Hero from "./hero";

export function ContentHeron() {
  return (
    <section className="flex flex-col items-center justify-center lg:min-h-[calc(100vh-200px)] min-h-[calc(100vh-300px)] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <Hero />

      <div className="mt-8 sm:mt-12 lg:mt-16 w-full">
        <Destaques />
      </div>
    </section>
  );
}