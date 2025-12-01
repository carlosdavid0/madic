"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CardRanking } from "./card-ranking";

const RankingContent = () => {
  return (
    <article className="flex-1 w-full sm:w-auto max-w-md space-y-4">
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
      <Button size={"lg"} className="w-full lg:w-fit">
        Ver todos
      </Button>
    </article>
  );
};

export function Ranking() {
  return (
    <section className="w-full py-8 sm:py-12 lg:py-16 min-h-[calc(50vh)]">
      {/* Mobile: Tabs */}
      <div className="sm:hidden px-4">
        <Tabs defaultValue="ultimo-desafio" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-16 rounded-none bg-transparent p-0 gap-0">
            <TabsTrigger
              value="ultimo-desafio"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "h-16 w-full text-xl rounded-none! transition-all",
                "data-[state=active]:opacity-100 data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] data-[state=active]:z-10",
                "data-[state=active]:bg-secondary! data-[state=active]:text-secondary-foreground!",
                "dark:data-[state=active]:bg-secondary! dark:data-[state=active]:text-secondary-foreground!",
                "data-[state=inactive]:opacity-50 data-[state=inactive]:hover:opacity-70"
              )}
            >
              Último desafio
            </TabsTrigger>
            <TabsTrigger
              value="ranking-geral"
              className={cn(
                buttonVariants({ variant: "gray" }),
                "h-16 w-full text-xl rounded-none! transition-all",
                "data-[state=active]:opacity-100 data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] data-[state=active]:z-10",
                "data-[state=active]:bg-gray! data-[state=active]:text-white!",
                "dark:data-[state=active]:bg-gray! dark:data-[state=active]:text-white!",
                "data-[state=inactive]:opacity-50 data-[state=inactive]:hover:opacity-70"
              )}
            >
              Ranking geral
            </TabsTrigger>
          </TabsList>
          <TabsContent value="ultimo-desafio" className="mt-4">
            <RankingContent />
          </TabsContent>
          <TabsContent value="ranking-geral" className="mt-4">
            <RankingContent />
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop: Side by side */}
      <section className="hidden sm:flex flex-row items-start justify-center sm:justify-evenly h-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto gap-4 sm:gap-6 lg:gap-8">
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

          <Button size={"lg"} className="w-full lg:w-fit">
            Ver todos
          </Button>
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

          <Button size={"lg"} className="w-full lg:w-fit">
            Ver todos
          </Button>
        </article>
      </section>
    </section>
  );
}
