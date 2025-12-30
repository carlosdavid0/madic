import { db } from '@/lib/db';
import { challenges, challengeUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2 } from 'lucide-react';
import { deleteChallenge } from '@/lib/actions/challenges';
import { ChallengeParticipants } from './challenge-participants';
import { ChallengeFiles } from './challenge-files';
import { ensureSignedFileUrl } from '@/lib/s3';
import { AdminBreadcrumb } from '@/components/admin/admin-breadcrumb';
import { AdminPageHeader } from '@/components/admin/admin-page-header';

export default async function ChallengePage({ params }: { params: Promise<{ id: string }> }) {
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
    },
  });

  if (!challenge) {
    notFound();
  }

  // Gerar URLs assinadas para os arquivos
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

  return (
    <div>
      <AdminBreadcrumb
        items={[
          { label: 'Desafios', href: '/admin/challenges' },
          { label: challenge.name },
        ]}
      />

      <AdminPageHeader
        title={challenge.name}
        description={challenge.description || undefined}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/admin/challenges/${id}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Link>
            </Button>
            <form action={deleteChallenge.bind(null, id)}>
              <Button type="submit" variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Deletar
              </Button>
            </form>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              🥇 1º Lugar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-500">
              {challenge.firstPlacePoints}
              <span className="text-sm text-muted-foreground ml-1">pts</span>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              🥈 2º Lugar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">
              {challenge.secondPlacePoints}
              <span className="text-sm text-muted-foreground ml-1">pts</span>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              🥉 3º Lugar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-700 dark:text-orange-600">
              {challenge.thirdPlacePoints}
              <span className="text-sm text-muted-foreground ml-1">pts</span>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              🎖️ Outros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {challenge.otherPlacesPoints}
              <span className="text-sm text-muted-foreground ml-1">pts</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ChallengeFiles challengeId={id} files={filesWithSignedUrls} />
        <ChallengeParticipants
          challengeId={id}
          participants={challenge.participants}
        />
      </div>
    </div>
  );
}

