import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Card, CardContent } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/auth/get-user';
import { db } from '@/lib/db';
import { challenges, users } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import { Activity, TrendingUp, Trophy, Users } from 'lucide-react';
import Link from 'next/link';

import { ArrowRight, ExternalLink, Star } from 'lucide-react';

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
      description: `${activeUsers} ativos recentemente`,
      icon: Users,
      gradient: 'from-blue-500/20 to-blue-600/5',
      iconColor: 'text-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Desafios Criados',
      value: totalChallenges,
      description: 'Disponíveis na plataforma',
      icon: Trophy,
      gradient: 'from-yellow-500/20 to-yellow-600/5',
      iconColor: 'text-yellow-500',
      change: '+4',
      changeType: 'neutral'
    },
    {
      title: 'Usuários Ativos',
      value: activeUsers,
      description: 'Nos últimos 30 dias',
      icon: Activity,
      gradient: 'from-green-500/20 to-green-600/5',
      iconColor: 'text-green-500',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Engajamento',
      value: '98%',
      description: 'Taxa de conclusão',
      icon: TrendingUp,
      gradient: 'from-purple-500/20 to-purple-600/5',
      iconColor: 'text-purple-500',
      change: '+2%',
      changeType: 'positive'
    },
  ];

  const quickActions = [
    {
      title: 'Gerenciar Usuários',
      description: 'Visualizar, editar e gerenciar alunos',
      href: '/admin/users',
      icon: Users,
      bg: 'bg-blue-500/10 hover:bg-blue-500/20',
      text: 'text-blue-500'
    },
    {
      title: 'Gerenciar Desafios',
      description: 'Criar e editar desafios da plataforma',
      href: '/admin/challenges',
      icon: Trophy,
      bg: 'bg-yellow-500/10 hover:bg-yellow-500/20',
      text: 'text-yellow-500'
    },
    {
        title: 'Ver Links',
        description: 'Gerenciar links da bio',
        href: '/admin/links',
        icon: ExternalLink,
        bg: 'bg-green-500/10 hover:bg-green-500/20',
        text: 'text-green-500'
    }
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={`Olá, ${user?.name || 'Administrador'} 👋`}
        description="Aqui está o resumo da sua plataforma hoje."
      />

      {/* Estatísticas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
                key={stat.title} 
                className={`relative overflow-hidden rounded-2xl p-6 border border-white/5 bg-gradient-to-br ${stat.gradient} backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-lg group`}
            >
              <div className="flex items-start justify-between">
                <div>
                   <div className={`p-2 rounded-lg bg-white/5 w-fit mb-4 group-hover:bg-white/10 transition-colors`}>
                        <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                   </div>
                   <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                   <div className="flex items-baseline gap-2 mt-1">
                        <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full bg-white/5 ${stat.changeType === 'positive' ? 'text-green-400' : 'text-muted-foreground'}`}>
                            {stat.change}
                        </span>
                   </div>
                   <p className="text-xs text-muted-foreground/60 mt-1">{stat.description}</p>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${stat.iconColor} opacity-[0.03] blur-2xl group-hover:opacity-[0.05] transition-opacity`} />
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-7 gap-6">
          {/* Ações Rápidas */}
          <div className="md:col-span-4 space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                Ações Rápidas
            </h2>
            <div className="grid gap-4">
            {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                <Link key={action.title} href={action.href}>
                    <div className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.04] hover:shadow-md hover:border-white/10 flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${action.bg} transition-transform group-hover:scale-110`}>
                            <Icon className={`w-6 h-6 ${action.text}`} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{action.title}</h3>
                            <p className="text-sm text-muted-foreground/80">{action.description}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                    </div>
                </Link>
                );
            })}
            </div>
          </div>

          {/* Atividades Recentes (Placeholder) */}
          <div className="md:col-span-3 space-y-6">
             <h2 className="text-lg font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Atividade Recente
            </h2>
            <Card className="border-white/5 bg-white/[0.02] backdrop-blur-sm h-full">
            <CardContent className="h-full flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-3">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                    <Activity className="w-6 h-6 opacity-20" />
                </div>
                <p>Nenhuma atividade recente para mostrar</p>
                <p className="text-xs opacity-50 max-w-[200px]">As atividades dos seus alunos aparecerão aqui.</p>
            </CardContent>
            </Card>
          </div>
      </div>
    </div>
  );
}

