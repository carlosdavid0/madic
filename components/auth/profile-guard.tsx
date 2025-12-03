'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProfileGuardProps {
  children: React.ReactNode;
}

export function ProfileGuard({ children }: ProfileGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && !user.profileCompleted) {
      // Verificar se não está já na página de completar perfil
      if (window.location.pathname !== '/complete-profile') {
        router.push('/complete-profile');
      }
    }
  }, [user, loading, router]);

  // Se está carregando ou perfil não completo, mostrar loading
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

  // Se perfil não está completo, não renderizar children (já redirecionou)
  if (user && !user.profileCompleted) {
    return null;
  }

  return <>{children}</>;
}

