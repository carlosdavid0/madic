import { AdminBreadcrumb } from '@/components/admin/admin-breadcrumb';
import { NewChallengeForm } from '../new-challenge-form';

export default function NewChallengePage() {
  return (
    <div className="space-y-6">
      <AdminBreadcrumb
        items={[
          { label: 'Desafios', href: '/admin/challenges' },
          { label: 'Novo Desafio' },
        ]}
      />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Criar Novo Desafio</h1>
        <p className="text-muted-foreground">
          Preencha as informações abaixo para lançar um novo desafio para a comunidade.
        </p>
      </div>

      <NewChallengeForm />
    </div>
  );
}


