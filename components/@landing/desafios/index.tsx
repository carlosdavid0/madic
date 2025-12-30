import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { challenges } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";

export async function Desafios() {
  // Buscar os 3 desafios mais recentes
  const recentChallenges = await db.query.challenges.findMany({
    orderBy: [desc(challenges.createdAt)],
    limit: 3,
    with: {
      participants: true,
      challengeFiles: true,
    },
  });

  if (recentChallenges.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-8 sm:py-12 lg:py-16 min-h-[calc(50vh)]">
      <article className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl lg:text-4xl font-medium text-center leading-tight mb-8">
          Desafios em Aberto
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {recentChallenges.map((challenge) => (
            <Link 
              key={challenge.id} 
              href={`/desafios/${challenge.id}`}
              className="group block"
            >
              <div className="bg-card rounded-xl overflow-hidden h-full transition-all duration-300 border border-border hover:border-primary/50 hover:shadow-2xl hover:scale-[1.02]">
                {/* Header com pontuação destaque */}
                <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-6 border-b border-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      Desafio
                    </span>
                    <div className="flex items-center gap-1 bg-primary/20 px-3 py-1 rounded-full">
                      <span className="text-xs font-bold text-primary">
                        {challenge.firstPlacePoints}pts
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
                    {challenge.name}
                  </h3>
                </div>

                {/* Conteúdo */}
                <div className="p-6 space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3 min-h-[4rem]">
                    {challenge.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Participantes: </span>
                      <span className="font-semibold text-foreground">
                        {challenge.participants?.length || 0}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Arquivos: </span>
                      <span className="font-semibold text-foreground">
                        {challenge.challengeFiles?.length || 0}
                      </span>
                    </div>
                  </div>

                  {/* Premiação */}
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="text-lg">🥇</div>
                      <div className="text-xs font-bold text-yellow-600">
                        {challenge.firstPlacePoints}
                      </div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="text-lg">🥈</div>
                      <div className="text-xs font-bold text-gray-500">
                        {challenge.secondPlacePoints}
                      </div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="text-lg">🥉</div>
                      <div className="text-xs font-bold text-orange-600">
                        {challenge.thirdPlacePoints}
                      </div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="text-lg">🎖️</div>
                      <div className="text-xs font-bold text-muted-foreground">
                        {challenge.otherPlacesPoints}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Button asChild size="lg" variant="secondary" className="h-16 px-12 text-lg rounded-none!">
            <Link href="/desafios">
              Ver todos os desafios
            </Link>
          </Button>
        </div>
      </article>
    </section>
  );
}
