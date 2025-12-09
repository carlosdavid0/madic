import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/get-user';

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

  return <>{children}</>;
}

