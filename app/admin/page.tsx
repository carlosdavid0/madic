import { getCurrentUser } from '@/lib/auth/get-user';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Settings, BarChart3, Shield, Database, FileText, ArrowLeft } from 'lucide-react';

export default async function AdminPage() {
  const user = await getCurrentUser();

  const menuItems = [
    {
      title: 'Usuários',
      description: 'Gerenciar usuários do sistema, roles e permissões',
      href: '/admin/users',
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      title: 'Configurações',
      description: 'Configurações gerais do sistema e preferências',
      icon: Settings,
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-950/20',
      borderColor: 'border-gray-200 dark:border-gray-800',
    },
    {
      title: 'Relatórios',
      description: 'Visualizar relatórios e estatísticas do sistema',
      icon: BarChart3,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      borderColor: 'border-green-200 dark:border-green-800',
    },
    {
      title: 'Segurança',
      description: 'Gerenciar segurança e auditoria do sistema',
      icon: Shield,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      borderColor: 'border-red-200 dark:border-red-800',
    },
    {
      title: 'Banco de Dados',
      description: 'Gerenciar dados e backups do sistema',
      icon: Database,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
    },
    {
      title: 'Logs',
      description: 'Visualizar logs e histórico de atividades',
      icon: FileText,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8 lg:mb-12">
          <div className="mb-6">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo-amarela.png"
                alt="Logo"
                width={180}
                height={180}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                  Área Administrativa
                </h1>
                <p className="text-muted-foreground text-lg">
                  Bem-vindo,{' '}
                  <span className="font-semibold text-foreground">
                    {user?.name || 'Administrador'}
                  </span>
                </p>
              </div>
              <Button size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao App
                </Link>
              </Button>
            </div>
          </div>
          <div className="h-px bg-border" />
        </div>

        {/* Menu Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const content = (
              <Card
                className={`
                  group relative overflow-hidden
                  transition-all duration-300
                  hover:shadow-lg hover:scale-[1.02]
                  ${item.borderColor}
                  ${item.href ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'}
                `}
              >
                <CardHeader className="pb-3">
                  <div
                    className={`
                      w-12 h-12 rounded-lg flex items-center justify-center mb-3
                      ${item.bgColor}
                      transition-transform duration-300
                      group-hover:scale-110
                    `}
                  >
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardContent>
                {item.href && (
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </Card>
            );

            return item.href ? (
              <Link key={item.title} href={item.href}>
                {content}
              </Link>
            ) : (
              <div key={item.title}>{content}</div>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground text-center">
            Painel administrativo • Acesso restrito
          </p>
        </div>
      </div>
    </div>
  );
}

