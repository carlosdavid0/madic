import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/get-user';

/**
 * Layout para rotas protegidas que requerem perfil completo
 * Use este layout em rotas como /dashboard, /profile, /settings
 */
export default async function ProtectedLayout({
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

  return <>{children}</>;
}

