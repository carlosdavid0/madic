import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/ui/countdown";
import { db } from "@/lib/db";
import { challenges } from "@/lib/db/schema";
import { ensureSignedFileUrl } from "@/lib/s3";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ParticipationSection from "./participation-section";

export default async function DesafioDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, id),
    with: {
      participants: {
        with: {
          user: true,
        },
      },
      challengeFiles: {
        with: {
          file: true,
        },
      },
      thumbnailFile: true,
    },
  });

  if (!challenge) {
    notFound();
  }

  const filesWithSignedUrls = await Promise.all(
    challenge.challengeFiles.map(async (cf) => {
      if (!cf.file) return cf;
      const signedUrl = await ensureSignedFileUrl(cf.file.url);
      return {
        ...cf,
        file: {
          ...cf.file,
          url: signedUrl || cf.file.url,
        },
      };
    })
  );

  // Get signed URL for thumbnail
  let thumbnailUrl = null;
  if (challenge.thumbnailFile?.url) {
    thumbnailUrl = await ensureSignedFileUrl(challenge.thumbnailFile.url);
  }

  const sortedParticipants = [...challenge.participants].sort((a, b) => {
    if (a.position === null && b.position === null) return 0;
    if (a.position === null) return 1;
    if (b.position === null) return -1;
    return a.position - b.position;
  });

  const getPositionBadge = (position: number | null, points: number | null) => {
    if (!position) {
      return (
        <span className="px-4 py-2 rounded-lg bg-muted/50 text-muted-foreground text-sm">
          Sem classificação
        </span>
      );
    }
    
    const badges = {
      1: { emoji: '🥇', bgColor: 'bg-yellow-500/20', textColor: 'text-yellow-600' },
      2: { emoji: '🥈', bgColor: 'bg-gray-400/20', textColor: 'text-gray-500' },
      3: { emoji: '🥉', bgColor: 'bg-orange-500/20', textColor: 'text-orange-600' },
    };
    
    const badge = badges[position as keyof typeof badges];
    
    if (badge) {
      return (
        <div className="flex items-center gap-2">
          <span className={`px-4 py-2 rounded-lg font-semibold ${badge.bgColor} ${badge.textColor}`}>
            {badge.emoji} {position}º Lugar
          </span>
          <span className="text-sm font-bold">{points}pts</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2">
        <span className="px-4 py-2 rounded-lg font-semibold bg-muted/50 text-foreground">
          {position}º Lugar
        </span>
        <span className="text-sm font-bold">{points}pts</span>
      </div>
    );
  };

  return (
    <div className="bg-magic">
      <section className="w-full py-8 sm:py-12">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button variant="ghost" asChild className="hover:bg-muted/50">
              <Link href="/desafios">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para Desafios
              </Link>
            </Button>
          </div>

          <div className="bg-card rounded-xl p-6 sm:p-8 border border-border">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Coluna Principal: Thumbnail + Descrição */}
              <div className="lg:col-span-2 space-y-6">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                  {challenge.name}
                </h1>

                {thumbnailUrl && (
                  <div className="relative w-full h-64 lg:h-96 rounded-lg overflow-hidden">
                    <Image
                      src={thumbnailUrl}
                      alt={challenge.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}

                <div className="prose prose-lg max-w-none">
                  <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {challenge.description}
                  </p>
                </div>
              </div>

              {/* Coluna Lateral: Informações */}
              <div className="space-y-6">
                {/* Countdown para Início da Participação */}
                {challenge.participationStartDate && new Date(challenge.participationStartDate) > new Date() && (
                  <div className="p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl border-2 border-primary/20">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold text-foreground mb-2">⏰ Início em</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(challenge.participationStartDate).toLocaleDateString('pt-BR', { 
                          day: '2-digit', 
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="mt-4">
                      <Countdown targetDate={challenge.participationStartDate} />
                    </div>
                  </div>
                )}

                {/* Countdown para Fim da Participação */}
                {challenge.participationEndDate && new Date(challenge.participationEndDate) > new Date() && 
                 challenge.participationStartDate && new Date(challenge.participationStartDate) <= new Date() && (
                  <div className="p-6 bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent rounded-xl border-2 border-orange-500/20">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold text-foreground mb-2">⏳ Termina em</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(challenge.participationEndDate).toLocaleDateString('pt-BR', { 
                          day: '2-digit', 
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="mt-4">
                      <Countdown targetDate={challenge.participationEndDate} />
                    </div>
                  </div>
                )}

                {/* Datas do Desafio */}
                {(challenge.participationStartDate || challenge.votingStartDate) && (
                  <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold text-foreground">📅 Cronograma</h3>
                    {challenge.participationStartDate && (
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-1">Participação</p>
                        <p className="text-sm">
                          {new Date(challenge.participationStartDate).toLocaleDateString('pt-BR', { 
                            day: '2-digit', 
                            month: 'short',
                            year: 'numeric'
                          })}
                          {challenge.participationEndDate && (
                            <> até {new Date(challenge.participationEndDate).toLocaleDateString('pt-BR', { 
                              day: '2-digit', 
                              month: 'short',
                              year: 'numeric'
                            })}</>
                          )}
                        </p>
                      </div>
                    )}
                    {challenge.votingStartDate && (
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-1">Votação</p>
                        <p className="text-sm">
                          {new Date(challenge.votingStartDate).toLocaleDateString('pt-BR', { 
                            day: '2-digit', 
                            month: 'short',
                            year: 'numeric'
                          })}
                          {challenge.votingEndDate && (
                            <> até {new Date(challenge.votingEndDate).toLocaleDateString('pt-BR', { 
                              day: '2-digit', 
                              month: 'short',
                              year: 'numeric'
                            })}</>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {/* Botão Participar */}
                <div>
                  <Button asChild size="lg" className="w-full">
                    <Link href={`/desafios/${id}/participar`}>
                      🚀 Participar do Desafio
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-br from-card via-card to-primary/5 rounded-xl border-2 border-primary/20 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">🏆 Sistema de Pontuação</h2>
              <p className="text-muted-foreground">Conquiste pontos e suba no ranking</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-yellow-500/30 hover:border-yellow-500/50 transition-all hover:scale-105 hover:shadow-2xl">
                  <div className="text-5xl mb-4 text-center animate-bounce">🥇</div>
                  <div className="text-center">
                    <div className="text-5xl font-black text-yellow-600 mb-2 drop-shadow-lg">
                      {challenge.firstPlacePoints}
                    </div>
                    <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                      Pontos
                    </div>
                    <div className="mt-3 text-xs font-semibold text-yellow-600 bg-yellow-500/10 rounded-full px-3 py-1">
                      1º Lugar
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-400/20 to-gray-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-400/30 hover:border-gray-400/50 transition-all hover:scale-105 hover:shadow-2xl">
                  <div className="text-5xl mb-4 text-center animate-bounce [animation-delay:100ms]">🥈</div>
                  <div className="text-center">
                    <div className="text-5xl font-black text-gray-500 mb-2 drop-shadow-lg">
                      {challenge.secondPlacePoints}
                    </div>
                    <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                      Pontos
                    </div>
                    <div className="mt-3 text-xs font-semibold text-gray-500 bg-gray-400/10 rounded-full px-3 py-1">
                      2º Lugar
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-500/30 hover:border-orange-500/50 transition-all hover:scale-105 hover:shadow-2xl">
                  <div className="text-5xl mb-4 text-center animate-bounce [animation-delay:200ms]">🥉</div>
                  <div className="text-center">
                    <div className="text-5xl font-black text-orange-600 mb-2 drop-shadow-lg">
                      {challenge.thirdPlacePoints}
                    </div>
                    <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                      Pontos
                    </div>
                    <div className="mt-3 text-xs font-semibold text-orange-600 bg-orange-500/10 rounded-full px-3 py-1">
                      3º Lugar
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-primary/30 hover:border-primary/50 transition-all hover:scale-105 hover:shadow-2xl">
                  <div className="text-5xl mb-4 text-center animate-bounce [animation-delay:300ms]">🎖️</div>
                  <div className="text-center">
                    <div className="text-5xl font-black text-primary mb-2 drop-shadow-lg">
                      {challenge.otherPlacesPoints}
                    </div>
                    <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                      Pontos
                    </div>
                    <div className="mt-3 text-xs font-semibold text-primary bg-primary/10 rounded-full px-3 py-1">
                      Participação
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-magic-light w-full py-8 sm:py-12 lg:py-16">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  📎 Arquivos do Desafio
                </h2>
                <p className="text-sm text-muted-foreground">
                  {filesWithSignedUrls.length === 0 
                    ? 'Nenhum arquivo disponível' 
                    : `${filesWithSignedUrls.length} arquivo(s) anexado(s)`
                  }
                </p>
              </div>
              <div className="p-6">
                {filesWithSignedUrls.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="text-6xl mb-4">📄</div>
                    <p className="text-sm">Nenhum arquivo anexado</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filesWithSignedUrls.map((cf) => {
                      if (!cf.file) return null;
                      const isImage = cf.file.mimeType?.startsWith('image/');
                      return (
                        <div
                          key={cf.id}
                          className="border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all"
                        >
                          {isImage && (
                            <div className="relative w-full h-48 bg-muted">
                              <Image
                                src={cf.file.url}
                                alt={cf.file.filename || 'Imagem'}
                                fill
                                className="object-contain"
                                unoptimized
                              />
                            </div>
                          )}
                          <div className="flex items-center justify-between p-4">
                            <div className="flex-1 min-w-0 mr-4">
                              <p className="text-sm font-medium truncate text-foreground">
                                {cf.file.filename || 'Arquivo'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {cf.file.mimeType || 'Tipo desconhecido'}
                              </p>
                            </div>
                            <Button variant="default" size="sm" asChild>
                              <a 
                                href={cf.file.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                download={cf.file.filename || 'arquivo'}
                              >
                                {isImage ? 'Ver' : 'Baixar'}
                              </a>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  👥 Participantes
                </h2>
                <p className="text-sm text-muted-foreground">
                  {sortedParticipants.length === 0 
                    ? 'Aguardando participantes' 
                    : `${sortedParticipants.length} participante(s) inscrito(s)`
                  }
                </p>
              </div>
              <div className="p-6">
                {sortedParticipants.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="text-6xl mb-4">👥</div>
                    <p className="text-sm">Seja o primeiro a participar!</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {sortedParticipants.map((p) => {
                      if (!p.user) return null;
                      return (
                        <div
                          key={p.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-border rounded-xl hover:border-primary/50 transition-all"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary flex-shrink-0">
                              {p.user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold truncate text-foreground">{p.user.name}</p>
                              {p.user.username && (
                                <p className="text-sm text-muted-foreground truncate">
                                  @{p.user.username}
                                </p>
                              )}
                            </div>
                          </div>
                          <div>
                            {getPositionBadge(p.position, p.pointsEarned)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ParticipationSection id={id} />
    </div>
  );
} 