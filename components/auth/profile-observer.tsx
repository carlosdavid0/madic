'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';

/**
 * Componente Client Component que observa mudanças no contexto de autenticação
 * e redireciona quando necessário baseado no status do perfil completo
 */
export function ProfileObserver() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const lastProfileStatus = useRef<boolean | null>(null);

  useEffect(() => {
    // Não fazer nada enquanto está carregando
    if (loading) return;

    // Rotas públicas que não precisam de verificação
    const publicRoutes = ['/login', '/register', '/api', '/perfil'];
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

    // Se está em rota pública, não fazer nada
    if (isPublicRoute) return;

    // Se não está autenticado, não fazer nada (middleware cuida disso)
    if (!user) {
      lastProfileStatus.current = null;
      return;
    }

    const currentProfileStatus = user.profileCompleted;

    // Se perfil não está completo e não está na página de completar perfil
    if (!currentProfileStatus && pathname !== '/complete-profile') {
      router.push('/complete-profile');
      return;
    }

    // Se perfil está completo e está na página de completar perfil, redirecionar para home
    // Verificar se o status mudou de false para true (perfil foi completado)
    if (
      currentProfileStatus &&
      pathname === '/complete-profile' &&
      lastProfileStatus.current === false
    ) {
      router.push('/');
      return;
    }

    // Atualizar o último status conhecido
    lastProfileStatus.current = currentProfileStatus;
  }, [user, loading, pathname, router]);

  // Este componente não renderiza nada, apenas observa e redireciona
  return null;
}

