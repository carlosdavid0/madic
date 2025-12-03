'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';

interface AppGuardProps {
  children: React.ReactNode;
  /**
   * Rotas que não requerem perfil completo
   * Por padrão: ['/complete-profile', '/api']
   */
  routesWithoutProfileCheck?: string[];
  /**
   * Se true, redireciona usuários não autenticados para /login
   * Por padrão: false (middleware cuida disso)
   */
  requireAuth?: boolean;
}

/**
 * Guard para rotas protegidas que precisam de autenticação e perfil completo
 * Use apenas em rotas que realmente precisam dessa proteção
 */
export function AppGuard({
  children,
  routesWithoutProfileCheck = ['/complete-profile', '/api'],
  requireAuth = false,
}: AppGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isRouteWithoutProfileCheck = routesWithoutProfileCheck.some((route) =>
    pathname.startsWith(route)
  );

  useEffect(() => {
    // Não fazer nada enquanto está carregando
    if (loading) return;

    // Se requer autenticação e não está autenticado
    if (requireAuth && !user) {
      router.push('/login');
      return;
    }

    // Se não está autenticado, deixar middleware cuidar do redirecionamento
    if (!user) {
      return;
    }

    // Se está autenticado mas perfil não está completo
    if (!user.profileCompleted) {
      // E não está na página de completar perfil
      if (!isRouteWithoutProfileCheck) {
        router.push('/complete-profile');
      }
      return;
    }

    // Se perfil está completo e está na página de completar perfil, redirecionar para home
    if (user.profileCompleted && pathname === '/complete-profile') {
      router.push('/');
    }
  }, [user, loading, pathname, router, isRouteWithoutProfileCheck, requireAuth]);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-foreground/70">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se requer autenticação e não está autenticado, mostrar loading enquanto redireciona
  if (requireAuth && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-foreground/70">Redirecionando...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, mostrar conteúdo normalmente (middleware cuida do redirecionamento)
  if (!user) {
    return <>{children}</>;
  }

  // Se está autenticado mas perfil não está completo
  if (!user.profileCompleted) {
    // Se está na página de completar perfil ou rota permitida, mostrar conteúdo
    if (isRouteWithoutProfileCheck) {
      return <>{children}</>;
    }
    // Caso contrário, mostrar loading enquanto redireciona
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-foreground/70">Redirecionando...</p>
        </div>
      </div>
    );
  }

  // Se está tudo ok, mostrar conteúdo normalmente
  return <>{children}</>;
}

