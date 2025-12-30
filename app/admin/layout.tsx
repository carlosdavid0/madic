import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/get-user';
import { AdminHeader } from '@/components/admin/admin-header';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { ensureSignedAvatarUrl } from '@/lib/s3';

/**
 * Layout para área administrativa
 * Requer autenticação e role 'admin'
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Se não está autenticado, redirecionar para login
  if (!user) {
    redirect('/login');
  }

  // Se perfil não está completo, redirecionar para completar perfil
  if (!user.profileCompleted) {
    redirect('/complete-profile');
  }

  // Verificar se o usuário tem role de admin
  if (user.role !== 'admin') {
    redirect('/');
  }

  // Garantir URL assinada para avatar
  let avatarUrl = user.avatar;
  if (avatarUrl) {
    try {
      avatarUrl = await ensureSignedAvatarUrl(avatarUrl);
    } catch (error) {
      console.error('Erro ao garantir URL assinada do avatar:', error);
    }
  }

  const userForHeader = {
    name: user.name,
    email: user.email,
    avatar: avatarUrl,
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader user={userForHeader} />
      <AdminSidebar />
      
      <main className="lg:pl-64 pt-16">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}

