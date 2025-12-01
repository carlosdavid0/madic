import { Button } from "@/components/ui/button";
import { CardRanking } from "./card-ranking";

export function Ranking() {
  return (
    <section className="w-full py-8 sm:py-12 lg:py-16 min-h-[calc(50vh)]">
      <section className="flex flex-col sm:flex-row items-start justify-center sm:justify-evenly h-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto gap-4 sm:gap-6 lg:gap-8">
        <article className="flex-1 w-full sm:w-auto max-w-md space-y-4">
          <Button
            variant={"secondary"}
            className="h-16 sm:h-20 w-full text-xl sm:text-2xl lg:text-3xl rounded-none!"
          >
            Último desafio
          </Button>
          <ol className="w-full space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <li key={index}>
                <CardRanking
                  type={
                    index === 0
                      ? "gold"
                      : index === 1
                      ? "silver"
                      : index === 2
                      ? "bronze"
                      : "participant"
                  }
                  position={index + 1}
                  score={100}
                  who={{
                    name: "Carlos David",
                    avatar: "https://github.com/carlosdavid0.png",
                  }}
                />
              </li>
            ))}
          </ol>

          <Button size={"lg"} className="w-fit">Ver todos</Button>
        </article>
        <article className="flex-1 w-full sm:w-auto max-w-md space-y-4">
          <Button
            variant={"gray"}
            className="h-16 sm:h-20 w-full text-xl sm:text-2xl lg:text-3xl rounded-none!"
          >
            Ranking geral
          </Button>
          <ol className="w-full space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <li key={index}>
                <CardRanking
                  type={
                    index === 0
                      ? "gold"
                      : index === 1
                      ? "silver"
                      : index === 2
                      ? "bronze"
                      : "participant"
                  }
                  position={index + 1}
                  score={100}
                  who={{
                    name: "Carlos David",
                    avatar: "https://github.com/carlosdavid0.png",
                  }}
                />
              </li>
            ))}
          </ol>

          <Button size={"lg"} className="w-fit">Ver todos</Button>
        </article>
      </section>
    </section>
  );
}
