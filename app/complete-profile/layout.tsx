import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/get-user';

export default async function CompleteProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Se não está autenticado, redirecionar para login
  if (!user) {
    redirect('/login');
  }

  // Se perfil já está completo, redirecionar para home
  if (user.profileCompleted) {
    redirect('/');
  }

  return <>{children}</>;
}

