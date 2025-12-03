import { redirect } from 'next/navigation';
import { checkProfileCompleted } from '@/lib/auth/check-profile';

interface ProfileCheckProps {
  children: React.ReactNode;
  /**
   * Se true, redireciona para /complete-profile se o perfil não estiver completo
   * Por padrão: true
   */
  requireCompleted?: boolean;
  /**
   * Se true, redireciona para / se o perfil já estiver completo (útil para página de completar perfil)
   * Por padrão: false
   */
  redirectIfCompleted?: boolean;
}

/**
 * Componente Server Component que verifica o status do perfil completo
 * Use em layouts ou páginas que precisam verificar o perfil completo no servidor
 */
export async function ProfileCheck({
  children,
  requireCompleted = true,
  redirectIfCompleted = false,
}: ProfileCheckProps) {
  const profileCompleted = await checkProfileCompleted();

  // Se requer perfil completo mas não está autenticado ou perfil não completo
  if (requireCompleted && profileCompleted === false) {
    redirect('/complete-profile');
  }

  // Se está na página de completar perfil mas o perfil já está completo
  if (redirectIfCompleted && profileCompleted === true) {
    redirect('/');
  }

  return <>{children}</>;
}

