import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { ensureSignedAvatarUrl } from '@/lib/s3';
import { ArrowLeft, CheckCircle, Filter, Search, Shield, User, XCircle } from 'lucide-react';
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

    const sortedUsers = filteredUsers.sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );

    // Gerar URLs assinadas para avatares
    const usersWithSignedAvatars = await Promise.all(
      sortedUsers.map(async (user) => {
        if (user.avatar) {
          try {
            const signedAvatarUrl = await ensureSignedAvatarUrl(user.avatar);
            return { ...user, avatar: signedAvatarUrl };
          } catch (error) {
            console.error(
              `[getUsers] Erro ao garantir URL assinada do avatar para usuário ${user.id}:`,
              error
            );
            return user;
          }
        }
        return user;
      })
    );

    return usersWithSignedAvatars;
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciar Usuários</h1>
            <p className="text-muted-foreground mt-1">
                Gerencie permissões, status e detalhes de todos os usuários.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="border-white/10 hover:bg-white/5">
            <Link href="/admin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
            </Link>
          </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-5">
        <StatsCard title="Total" value={stats.total} icon={User} delay={0} />
        <StatsCard title="Ativos" value={stats.active} icon={CheckCircle} color="text-green-500" delay={100} />
        <StatsCard title="Inativos" value={stats.inactive} icon={XCircle} color="text-red-500" delay={200} />
        <StatsCard title="Admins" value={stats.admins} icon={Shield} color="text-blue-500" delay={300} />
        <StatsCard title="Usuários" value={stats.users} icon={User} color="text-yellow-500" delay={400} />
      </div>

      {/* Filtros e Busca */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-sm">
          <form method="get" className="flex flex-col md:flex-row gap-4 items-end">
             <div className="flex-1 w-full relative">
                <label htmlFor="search" className="text-xs font-medium mb-1.5 block text-muted-foreground">Buscar</label>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <Input
                        id="search"
                        name="search"
                        placeholder="Nome, email ou username..."
                        defaultValue={search}
                        className="pl-9 bg-white/5 border-white/10 focus-visible:ring-primary/20"
                    />
                </div>
             </div>
             <div className="w-full md:w-48">
                <label htmlFor="role" className="text-xs font-medium mb-1.5 block text-muted-foreground">Role</label>
                <div className="relative">
                     <Filter className="absolute left-3 top-3 w-3.5 h-3.5 text-muted-foreground z-10" />
                     <select
                        id="role"
                        name="role"
                        defaultValue={role}
                        className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 pl-9 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                    >
                        <option value="all">Todos os cargos</option>
                        <option value="admin">Administrador</option>
                        <option value="user">Usuário</option>
                    </select>
                </div>
             </div>
             <div className="w-full md:w-48">
                <label htmlFor="active" className="text-xs font-medium mb-1.5 block text-muted-foreground">Status</label>
                <div className="relative">
                     <Filter className="absolute left-3 top-3 w-3.5 h-3.5 text-muted-foreground z-10" />
                     <select
                        id="active"
                        name="active"
                        defaultValue={active}
                        className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 pl-9 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                    >
                        <option value="all">Todos os status</option>
                        <option value="true">Ativo</option>
                        <option value="false">Inativo</option>
                    </select>
                </div>
             </div>
             <div className="flex gap-2">
                <Button type="submit" size="sm">Filtrar</Button>
                <Link href="/admin/users">
                  <Button type="button" variant="ghost" size="sm" className="hover:bg-white/5">
                    Limpar
                  </Button>
                </Link>
             </div>
          </form>
      </div>

      {/* Lista de Usuários */}
      <Card className="border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
        <CardContent className="p-0">
          <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Carregando...</div>}>
            {usersList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Search className="w-12 h-12 opacity-20 mb-4" />
                <p>Nenhum usuário encontrado com os filtros atuais</p>
              </div>
            ) : (
              <>
                {/* Desktop: Tabela */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.02]">
                        <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Usuário</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Data</th>
                        <th className="text-right py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {usersList.map((user) => (
                        <UserTableRow key={user.id} user={user} />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile: Cards */}
                <div className="lg:hidden grid gap-4 p-4">
                  {usersList.map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </div>
              </>
            )}
          </Suspense>
        </CardContent>
      </Card>
      
      <div className="text-center text-xs text-muted-foreground/40 pt-4">
        Mostrando {usersList.length} usuários
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, color = "text-muted-foreground", delay }: { title: string, value: number, icon: any, color?: string, delay: number }) {
    return (
        <div 
            className="group p-5 rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm hover:scale-[1.02] transition-all duration-300"
        >
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <Icon className={`w-4 h-4 ${color} opacity-70 group-hover:opacity-100 transition-opacity`} />
            </div>
            <div className="text-2xl font-bold">{value}</div>
        </div>
    )
}

function UserTableRow({ user }: { user: typeof users.$inferSelect }) {
  return (
    <tr className="group hover:bg-white/[0.02] transition-colors">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center overflow-hidden shrink-0 border border-white/10 group-hover:border-primary/20 transition-colors">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || ''}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-bold text-muted-foreground">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium truncate text-sm group-hover:text-primary transition-colors">{user.name}</p>
            </div>
            {user.username && (
              <p className="text-xs text-muted-foreground/60 truncate">
                @{user.username}
              </p>
            )}
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <p className="text-sm truncate max-w-[200px] text-muted-foreground">{user.email}</p>
      </td>
      <td className="py-4 px-6">
        <span
          className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
            user.role === 'admin'
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              : 'bg-white/5 text-muted-foreground border-white/10'
          }`}
        >
          {user.role === 'admin' ? 'Admin' : 'Usuário'}
        </span>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${user.active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-500'}`} />
            <span className={`text-xs ${user.active ? 'text-green-400' : 'text-red-400'}`}>
                {user.active ? 'Ativo' : 'Inativo'}
            </span>
        </div>
        {!user.profileCompleted && (
            <span className="text-[10px] text-yellow-500/80 mt-1 block">Perfil incompleto</span>
        )}
      </td>
      <td className="py-4 px-6">
        <p className="text-sm text-muted-foreground">
          {user.createdAt
            ? new Date(user.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
              })
            : '-'}
        </p>
      </td>
      <td className="py-4 px-6">
        <div className="flex justify-end">
          <UserActions user={user} />
        </div>
      </td>
    </tr>
  );
}

function UserCard({ user }: { user: typeof users.$inferSelect }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.04]">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center overflow-hidden border border-white/10">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || ''}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-muted-foreground">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm">{user.name}</h3>
                {user.role === 'admin' && (
                  <span className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate mb-2">
                {user.email}
              </p>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground/60">
                 <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${user.active ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span>{user.active ? 'Ativo' : 'Inativo'}</span>
                 </div>
                 <div>
                    {user.createdAt
                     ? new Date(user.createdAt).toLocaleDateString('pt-BR')
                     : '-'}
                 </div>
              </div>
            </div>
          </div>
          <UserActions user={user} />
        </div>
    </div>
  );
}

