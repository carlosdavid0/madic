import { Button } from "@/components/ui/button";

export function Ranking() {
  return (
    <section className="w-full py-8 sm:py-12 lg:py-16 min-h-[calc(50vh)]">
      <section className="flex flex-col sm:flex-row items-center justify-center sm:justify-evenly h-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto gap-4 sm:gap-6 lg:gap-8">
        <article className="flex-1 w-full sm:w-auto max-w-md">
          {/* <Button variant={"secondary"} className="h-32 flex-1 max-w-md text-2xl">
            Último desafio
          </Button> */}
        </article>

        <article className="w-full sm:w-auto">
          <Button
            variant={"gray"}
            className="h-16 sm:h-20 w-full sm:w-auto flex-1 max-w-md text-xl sm:text-2xl lg:text-3xl rounded-none!"
          >
            Último desafio
          </Button>
        </article>
      </section>
    </section>
  );
}
