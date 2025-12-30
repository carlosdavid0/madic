import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/db';
import { challenges } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EditChallengeForm } from './edit-challenge-form';

export default async function EditChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, id),
  });

  if (!challenge) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href={`/admin/challenges/${id}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o Desafio
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-2">
            <Edit className="w-7 h-7" />
            Editar Desafio
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Atualize as informações do desafio <strong>{challenge.name}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditChallengeForm challenge={challenge} />
        </CardContent>
      </Card>
    </div>
  );
}


