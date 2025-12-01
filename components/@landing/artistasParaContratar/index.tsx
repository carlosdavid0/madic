import { ArtitisCard } from "@/components/artitis-card";
import { Button } from "@/components/ui/button";

export function ArtistasParaContratar() {
  return (
    <section className="w-full py-8 sm:py-12 lg:py-16 min-h-[calc(50vh)]">
      <article className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl lg:text-4xl font-medium text-center leading-tight mb-8">
         Disponíveis para contratar
        </h2>

        <ol className="w-full space-y-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <li key={index} className="w-full bg-magic-light rounded-xl p-4">
              <ArtitisCard name="Carlos David" avatar="https://github.com/carlosdavid0.png" professions={["Designer Gráfico", "Ilustrador"]} rankingPosition={index + 1} />
            </li>
          ))}
        </ol>
        <Button variant="default" size="default" className="w-fit mx-auto mt-8">
          Ver todos
        </Button>
      </article>
    </section>
  );
}