import { getCurrentUser } from '@/lib/auth/get-user';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Trophy, Activity, TrendingUp } from 'lucide-react';
import { db } from '@/lib/db';
import { challenges, users } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import { AdminPageHeader } from '@/components/admin/admin-page-header';

export default async function AdminPage() {
  const user = await getCurrentUser();

  // Buscar estatísticas
  const [totalUsers, totalChallenges, activeUsers] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(users).then(r => r[0]?.count || 0),
    db.select({ count: sql<number>`count(*)` }).from(challenges).then(r => r[0]?.count || 0),
    db.select({ count: sql<number>`count(*)` }).from(users).where(sql`${users.active} = true`).then(r => r[0]?.count || 0),
  ]);

  const stats = [
    {
      title: 'Total de Usuários',
      value: totalUsers,
      description: `${activeUsers} ativos`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      title: 'Desafios',
      value: totalChallenges,
      description: 'Total criados',
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
    },
    {
      title: 'Usuários Ativos',
      value: activeUsers,
      description: 'Últimos 30 dias',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
    {
      title: 'Crescimento',
      value: '+12%',
      description: 'vs. mês anterior',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    },
  ];

  const quickActions = [
    {
      title: 'Gerenciar Usuários',
      description: 'Visualizar e editar usuários cadastrados',
      href: '/admin/users',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      title: 'Gerenciar Desafios',
      description: 'Criar e editar desafios da plataforma',
      href: '/admin/challenges',
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title={`Bem-vindo, ${user?.name || 'Administrador'}!`}
        description="Visão geral do painel administrativo"
      />

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Ações Rápidas */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href}>
                <Card className="group hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-6 h-6 ${action.color}`} />
                      </div>
                      <div>
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {action.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {action.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Atividades Recentes (Placeholder) */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Atividades Recentes</h2>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhuma atividade recente para mostrar
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

