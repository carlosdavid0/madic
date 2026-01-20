import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { db } from '@/lib/db';
import { challenges } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { Plus, Trophy } from 'lucide-react';
import Link from 'next/link';

import { ArrowLeft, FileText, Medal, Users } from 'lucide-react';

export default async function ChallengesPage() {
  const allChallenges = await db.query.challenges.findMany({
    orderBy: [desc(challenges.createdAt)],
    with: {
      participants: true,
      challengeFiles: true,
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Desafios</h1>
            <p className="text-muted-foreground mt-1">
                Gerencie todos os desafios da plataforma
            </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild className="border-white/10 hover:bg-white/5">
                <Link href="/admin">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                </Link>
            </Button>
            <Button asChild size="sm">
                <Link href="/admin/challenges/new">
                <Plus className="w-4 h-4 mr-2" />
                Novo Desafio
                </Link>
            </Button>
        </div>
      </div>

      {allChallenges.length === 0 ? (
        <Card className="border-dashed border-2 border-white/10 bg-white/5">
          <CardContent className="py-16 text-center">
            <Trophy className="w-20 h-20 mx-auto mb-4 text-muted-foreground opacity-30" />
            <h3 className="text-xl font-semibold mb-2">Nenhum desafio criado</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Comece criando seu primeiro desafio para engajar a comunidade e premiar os melhores talentos.
            </p>
            <Button asChild size="lg">
              <Link href="/admin/challenges/new">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Desafio
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground bg-white/5 w-fit px-3 py-1 rounded-full border border-white/5">
            <Trophy className="w-4 h-4" />
            <span>{allChallenges.length} {allChallenges.length === 1 ? 'desafio encontrado' : 'desafios encontrados'}</span>
          </div>
          <div className="grid gap-6">
            {allChallenges.map((challenge) => (
              <Link
                key={challenge.id}
                href={`/admin/challenges/${challenge.id}`}
                className="block group"
              >
                <div className="relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] transition-all hover:bg-white/[0.04] hover:border-primary/20 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)]">
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wider">
                          Ver Detalhes
                      </div>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                       <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{challenge.name}</h3>
                          <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed max-w-2xl">
                              {challenge.description}
                          </p>

                          <div className="flex flex-wrap gap-4 mt-6">
                             <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded border border-white/5">
                                 <Users className="w-3.5 h-3.5" />
                                 <span>{challenge.participants?.length || 0} participantes</span>
                             </div>
                             <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded border border-white/5">
                                 <FileText className="w-3.5 h-3.5" />
                                 <span>{challenge.challengeFiles?.length || 0} arquivos</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="w-full md:w-auto bg-black/20 rounded-xl p-4 border border-white/5 min-w-[280px]">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                                <Medal className="w-3 h-3" />
                                Premiação
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">🥇</span>
                                        <span className="font-medium text-yellow-500">1º Lugar</span>
                                    </div>
                                    <span className="font-bold bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded">{challenge.firstPlacePoints} pts</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">🥈</span>
                                        <span className="font-medium text-gray-400">2º Lugar</span>
                                    </div>
                                    <span className="font-bold bg-gray-500/10 text-gray-400 px-2 py-0.5 rounded">{challenge.secondPlacePoints} pts</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">🥉</span>
                                        <span className="font-medium text-orange-500">3º Lugar</span>
                                    </div>
                                    <span className="font-bold bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded">{challenge.thirdPlacePoints} pts</span>
                                </div>
                            </div>
                       </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}


