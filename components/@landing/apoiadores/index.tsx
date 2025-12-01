import { Button } from "@/components/ui/button";

export function Apoiadores() {
  return (
    <section className="w-full py-8 sm:py-12 lg:py-16 min-h-[calc(50vh)]">
      <article className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl lg:text-4xl font-medium text-center leading-tight mb-8">
          Apoio
        </h2>

        <div className="w-full flex flex-col items-center justify-center gap-6">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 w-full max-w-4xl mx-auto">
            {Array.from({ length: 16 }).map((_, index) => (
              <div
                key={index}
                className="w-[120px] h-[120px] bg-magic-dark/70 rounded-full"
              />
            ))}
          </div>
        </div>
        <div className="w-full flex justify-center items-center mt-16">
          <Button
            variant="default"
            size="default"
            className="w-full lg:w-fit mx-auto h-16 text-xl font-bold justify-center items-center"
          >
            Torne-se um apoiador
          </Button>
        </div>
      </article>
    </section>
  );
}
