import { AdminHeader } from '@/components/admin/admin-header';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { getCurrentUser } from '@/lib/auth/get-user';
import { ensureSignedAvatarUrl } from '@/lib/s3';
import { redirect } from 'next/navigation';

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
    <div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-primary-foreground">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <AdminHeader user={userForHeader} />
      <AdminSidebar />
      
      <main className="lg:pl-72 pt-24 relative z-10">
        <div className="container mx-auto px-6 py-8 max-w-[1600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}

