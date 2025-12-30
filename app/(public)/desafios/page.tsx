import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { challenges } from "@/lib/db/schema";
import { ensureSignedFileUrl } from "@/lib/s3";
import { desc } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

export default async function DesafiosPage() {
  const allChallenges = await db.query.challenges.findMany({
    orderBy: [desc(challenges.createdAt)],
    with: {
      participants: true,
      challengeFiles: true,
      thumbnailFile: true,
    },
  });

  // Get signed URLs for thumbnails
  const challengesWithThumbnails = await Promise.all(
    allChallenges.map(async (challenge) => {
      let thumbnailUrl = null;
      if (challenge.thumbnailFile?.url) {
        thumbnailUrl = await ensureSignedFileUrl(challenge.thumbnailFile.url);
      }
      return { ...challenge, thumbnailUrl };
    })
  );

  const totalParticipants = challengesWithThumbnails.reduce((acc, c) => acc + (c.participants?.length || 0), 0);
  const totalPoints = challengesWithThumbnails.reduce((acc, c) => acc + c.firstPlacePoints, 0);

  return (
    <div className="bg-magic">
      {/* Hero Section */}
      <section className=" w-full py-12 sm:py-16 lg:py-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Desafios em Aberto
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Participe dos desafios, mostre seu talento e ganhe pontos para subir no ranking
            </p>
          </div>

          
        </div>
      </section>

      {/* Challenges List */}
      <section className="bg-magic w-full px-4">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {challengesWithThumbnails.length === 0 ? (
            <div className="bg-card rounded-xl p-12 text-center border border-dashed border-border">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Nenhum desafio disponível
              </h3>
              <p className="text-muted-foreground">
                Volte em breve para novos desafios!
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                  Todos os Desafios
                </h2>
                <div className="text-sm text-muted-foreground">
                  {challengesWithThumbnails.length} {challengesWithThumbnails.length === 1 ? 'desafio' : 'desafios'}
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                {challengesWithThumbnails.map((challenge) => (
                  <Link
                    key={challenge.id}
                    href={`/desafios/${challenge.id}`}
                    className="block group"
                  >
                    <div className="bg-card rounded-xl overflow-hidden h-full transition-all duration-300 border border-border hover:border-primary/50 hover:shadow-2xl hover:scale-[1.02]">
                      {/* Thumbnail */}
                      {challenge.thumbnailUrl && (
                        <div className="relative w-full h-48 bg-muted">
                          <Image
                            src={challenge.thumbnailUrl}
                            alt={challenge.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      
                      {/* Header */}
                      <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-6 border-b border-border">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-xs uppercase tracking-wider text-muted-foreground">
                            {new Date(challenge.createdAt!).toLocaleDateString('pt-BR')}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="bg-primary/20 px-3 py-1 rounded-full">
                              <span className="text-sm font-bold text-primary">
                                1º lugar
                              </span>
                            </div>
                            <div className="bg-primary px-4 py-1 rounded-full">
                              <span className="text-lg font-bold text-primary-foreground">
                                {challenge.firstPlacePoints}pts
                              </span>
                            </div>
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {challenge.name}
                        </h3>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-6">
                        <p className="text-muted-foreground line-clamp-3">
                          {challenge.description}
                        </p>

                        {/* Premiação */}
                        <div className="grid grid-cols-4 gap-3">
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <div className="text-2xl mb-1">🥇</div>
                            <div className="text-sm font-bold text-yellow-600">
                              {challenge.firstPlacePoints}
                            </div>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <div className="text-2xl mb-1">🥈</div>
                            <div className="text-sm font-bold text-gray-500">
                              {challenge.secondPlacePoints}
                            </div>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <div className="text-2xl mb-1">🥉</div>
                            <div className="text-sm font-bold text-orange-600">
                              {challenge.thirdPlacePoints}
                            </div>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <div className="text-2xl mb-1">🎖️</div>
                            <div className="text-sm font-bold text-muted-foreground">
                              {challenge.otherPlacesPoints}
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>{challenge.participants?.length || 0} participantes</span>
                            <span>{challenge.challengeFiles?.length || 0} arquivos</span>
                          </div>
                          <Button variant="default" size="sm">
                            Ver Desafio
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

