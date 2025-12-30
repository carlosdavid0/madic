import { SubmissionForm } from '@/components/submission-form';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/auth/get-user';
import { db } from '@/lib/db';
import { challenges } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

export default async function ParticiparPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, id),
    with: {
      submissions: {
        where: (submissions, { eq }) => eq(submissions.userId, user.id),
      },
    },
  });

  if (!challenge) {
    notFound();
  }

  // Check if user already has a submission
  if (challenge.submissions && challenge.submissions.length > 0) {
    return (
      <div className="min-h-screen bg-magic py-12">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button variant="ghost" asChild className="hover:bg-muted/50">
              <Link href={`/desafios/${id}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para o Desafio
              </Link>
            </Button>
          </div>

          <div className="bg-card rounded-xl p-8 border border-border text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold mb-2">Você já participou deste desafio</h1>
            <p className="text-muted-foreground mb-6">
              Você já possui uma submissão para este desafio. Cada participante pode enviar apenas uma submissão.
            </p>
            <Button asChild>
              <Link href={`/desafios/${id}`}>
                Ver Desafio
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Check participation dates
  const now = new Date();
  if (challenge.participationStartDate && new Date(challenge.participationStartDate) > now) {
    return (
      <div className="min-h-screen bg-magic py-12">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button variant="ghost" asChild className="hover:bg-muted/50">
              <Link href={`/desafios/${id}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para o Desafio
              </Link>
            </Button>
          </div>

          <div className="bg-card rounded-xl p-8 border border-border text-center">
            <div className="text-6xl mb-4">⏰</div>
            <h1 className="text-2xl font-bold mb-2">Participações ainda não iniciadas</h1>
            <p className="text-muted-foreground mb-2">
              As participações para este desafio começam em:
            </p>
            <p className="text-lg font-semibold mb-6">
              {new Date(challenge.participationStartDate).toLocaleString('pt-BR')}
            </p>
            <Button asChild>
              <Link href={`/desafios/${id}`}>
                Ver Desafio
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (challenge.participationEndDate && new Date(challenge.participationEndDate) < now) {
    return (
      <div className="min-h-screen bg-magic py-12">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button variant="ghost" asChild className="hover:bg-muted/50">
              <Link href={`/desafios/${id}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para o Desafio
              </Link>
            </Button>
          </div>

          <div className="bg-card rounded-xl p-8 border border-border text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold mb-2">Participações encerradas</h1>
            <p className="text-muted-foreground mb-2">
              O prazo para participar deste desafio terminou em:
            </p>
            <p className="text-lg font-semibold mb-6">
              {new Date(challenge.participationEndDate).toLocaleString('pt-BR')}
            </p>
            <Button asChild>
              <Link href={`/desafios/${id}`}>
                Ver Desafio
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-magic py-12">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="hover:bg-muted/50">
            <Link href={`/desafios/${id}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para o Desafio
            </Link>
          </Button>
        </div>

        <div className="bg-card rounded-xl p-8 border border-border">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Participar do Desafio</h1>
            <h2 className="text-xl text-muted-foreground">{challenge.name}</h2>
          </div>

          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              💡 <strong>Dica:</strong> Seja detalhado na sua descrição. Explique seu processo de desenvolvimento, 
              desafios enfrentados e como você os resolveu. Anexe imagens, vídeos ou outros arquivos que demonstrem seu trabalho.
            </p>
          </div>

          <SubmissionForm challengeId={id} userId={user.id} />
        </div>
      </div>
    </div>
  );
}
