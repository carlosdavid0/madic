import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { NewChallengeForm } from '../new-challenge-form';
import { AdminBreadcrumb } from '@/components/admin/admin-breadcrumb';
import { AdminPageHeader } from '@/components/admin/admin-page-header';

export default function NewChallengePage() {
  return (
    <div>
      <AdminBreadcrumb
        items={[
          { label: 'Desafios', href: '/admin/challenges' },
          { label: 'Novo Desafio' },
        ]}
      />

      <AdminPageHeader
        title="Criar Novo Desafio"
        description="Preencha as informações abaixo para criar um novo desafio"
      />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
              <Trophy className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <CardTitle>Informações do Desafio</CardTitle>
              <CardDescription className="mt-1">
                Os arquivos serão enviados após a criação do desafio
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <NewChallengeForm />
        </CardContent>
      </Card>
    </div>
  );
}


