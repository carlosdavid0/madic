import { db } from '@/lib/db';
import { challenges } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trophy } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin/admin-breadcrumb';
import { AdminPageHeader } from '@/components/admin/admin-page-header';

export default async function ChallengesPage() {
  const allChallenges = await db.query.challenges.findMany({
    orderBy: [desc(challenges.createdAt)],
    with: {
      participants: true,
      challengeFiles: true,
    },
  });

  return (
    <div>
      <AdminBreadcrumb
        items={[{ label: 'Desafios' }]}
      />

      <AdminPageHeader
        title="Desafios"
        description="Gerencie todos os desafios da plataforma"
        actions={
          <Button asChild>
            <Link href="/admin/challenges/new">
              <Plus className="w-4 h-4 mr-2" />
              Novo Desafio
            </Link>
          </Button>
        }
      />

      {allChallenges.length === 0 ? (
        <Card className="border-dashed border-2">
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
          <div className="mb-4 text-sm text-muted-foreground">
            {allChallenges.length} {allChallenges.length === 1 ? 'desafio encontrado' : 'desafios encontrados'}
          </div>
          <div className="grid gap-4">
            {allChallenges.map((challenge) => (
              <Link
                key={challenge.id}
                href={`/admin/challenges/${challenge.id}`}
                className="block group"
              >
                <Card className="hover:shadow-xl hover:border-primary/50 transition-all cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                          {challenge.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 mt-2 text-base">
                          {challenge.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">🥇</span>
                        <span className="font-semibold text-yellow-600 dark:text-yellow-500">
                          {challenge.firstPlacePoints}pts
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">🥈</span>
                        <span className="font-semibold text-gray-600 dark:text-gray-400">
                          {challenge.secondPlacePoints}pts
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">🥉</span>
                        <span className="font-semibold text-orange-700 dark:text-orange-600">
                          {challenge.thirdPlacePoints}pts
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">🎖️</span>
                        <span className="font-semibold">
                          {challenge.otherPlacesPoints}pts
                        </span>
                      </div>
                      <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          👥 {challenge.participants?.length || 0} participante(s)
                        </span>
                        <span>
                          📎 {challenge.challengeFiles?.length || 0} arquivo(s)
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}


