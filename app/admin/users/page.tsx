import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { UserActions } from './user-actions';

async function getUsers(search?: string, role?: string, active?: string) {
  try {
    const query = db.select().from(users);

    const allUsers = await query;

    let filteredUsers = allUsers;

    // Filtro de busca
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.username?.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por role
    if (role && role !== 'all') {
      filteredUsers = filteredUsers.filter((user) => user.role === role);
    }

    // Filtro por status ativo
    if (active && active !== 'all') {
      const isActive = active === 'true';
      filteredUsers = filteredUsers.filter((user) => user.active === isActive);
    }

    return filteredUsers.sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return [];
  }
}

interface UsersPageProps {
  searchParams: Promise<{
    search?: string;
    role?: string;
    active?: string;
  }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;
  const search = params.search || '';
  const role = params.role || 'all';
  const active = params.active || 'all';

  const usersList = await getUsers(search, role, active);

  const stats = {
    total: usersList.length,
    active: usersList.filter((u) => u.active).length,
    inactive: usersList.filter((u) => !u.active).length,
    admins: usersList.filter((u) => u.role === 'admin').length,
    users: usersList.filter((u) => u.role === 'user').length,
  };

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
                  Gerenciar Usuários
                </h1>
                <p className="text-muted-foreground text-lg">
                  Gerencie todos os usuários do sistema
                </p>
              </div>
              <Button size="sm" asChild>
                <Link href="/admin">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Link>
              </Button>
            </div>
          </div>
          <div className="h-px bg-border" />
        </div>

        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-5 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.active}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Inativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.inactive}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.admins}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.users}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <form method="get" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label
                    htmlFor="search"
                    className="text-sm font-medium mb-2 block"
                  >
                    Buscar
                  </label>
                  <Input
                    id="search"
                    name="search"
                    placeholder="Nome, email ou username..."
                    defaultValue={search}
                  />
                </div>
                <div>
                  <label
                    htmlFor="role"
                    className="text-sm font-medium mb-2 block"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    defaultValue={role}
                    className="flex h-14 w-full rounded-lg border border-input bg-input/30 px-4 py-3 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <option value="all">Todos</option>
                    <option value="admin">Admin</option>
                    <option value="user">Usuário</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="active"
                    className="text-sm font-medium mb-2 block"
                  >
                    Status
                  </label>
                  <select
                    id="active"
                    name="active"
                    defaultValue={active}
                    className="flex h-14 w-full rounded-lg border border-input bg-input/30 px-4 py-3 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <option value="all">Todos</option>
                    <option value="true">Ativo</option>
                    <option value="false">Inativo</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Filtrar</Button>
                <Link href="/admin/users">
                  <Button type="button" variant="secondary">
                    Limpar
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Usuários */}
        <Card>
          <CardHeader>
            <CardTitle>Usuários ({usersList.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Carregando...</div>}>
              {usersList.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum usuário encontrado
                </div>
              ) : (
                <>
                  {/* Desktop: Tabela */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Usuário
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Email
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Role
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Status
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Criado em
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersList.map((user) => (
                          <UserTableRow key={user.id} user={user} />
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile: Cards */}
                  <div className="lg:hidden space-y-4">
                    {usersList.map((user) => (
                      <UserCard key={user.id} user={user} />
                    ))}
                  </div>
                </>
              )}
            </Suspense>
          </CardContent>
        </Card>

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

function UserTableRow({ user }: { user: typeof users.$inferSelect }) {
  return (
    <tr className="border-b hover:bg-muted/50 transition-colors">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || ''}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-semibold">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium truncate">{user.name}</p>
              {!user.profileCompleted && (
                <span className="px-1.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded shrink-0">
                  Incompleto
                </span>
              )}
            </div>
            {user.username && (
              <p className="text-sm text-muted-foreground truncate">
                @{user.username}
              </p>
            )}
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <p className="text-sm truncate max-w-xs">{user.email}</p>
        {user.emailValidated && (
          <span className="text-xs text-green-600">✓ Validado</span>
        )}
      </td>
      <td className="py-4 px-4">
        <span
          className={`px-2 py-1 text-xs font-medium rounded ${
            user.role === 'admin'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
          }`}
        >
          {user.role === 'admin' ? 'Admin' : 'Usuário'}
        </span>
      </td>
      <td className="py-4 px-4">
        <span
          className={`px-2 py-1 text-xs font-medium rounded ${
            user.active
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {user.active ? 'Ativo' : 'Inativo'}
        </span>
      </td>
      <td className="py-4 px-4">
        <p className="text-sm text-muted-foreground">
          {user.createdAt
            ? new Date(user.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            : 'N/A'}
        </p>
      </td>
      <td className="py-4 px-4">
        <div className="flex justify-end">
          <UserActions user={user} />
        </div>
      </td>
    </tr>
  );
}

function UserCard({ user }: { user: typeof users.$inferSelect }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || ''}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{user.name}</h3>
                {user.role === 'admin' && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                    Admin
                  </span>
                )}
                {!user.active && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded">
                    Inativo
                  </span>
                )}
                {!user.profileCompleted && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded">
                    Perfil Incompleto
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                {user.email}
              </p>
              {user.username && (
                <p className="text-sm text-muted-foreground">
                  @{user.username}
                </p>
              )}
              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                <span>
                  Criado em:{' '}
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('pt-BR')
                    : 'N/A'}
                </span>
                {user.emailValidated && (
                  <span className="text-green-600">Email validado</span>
                )}
              </div>
            </div>
          </div>
          <UserActions user={user} />
        </div>
      </CardContent>
    </Card>
  );
}

