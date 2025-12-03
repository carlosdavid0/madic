'use client';

import { CompleteProfileForm } from './complete-profile-form';
import { useAuth } from '@/lib/contexts/auth-context';
import { ProfileObserver } from '@/components/auth/profile-observer';

export default function CompleteProfilePage() {
  const { user, loading } = useAuth();

  // Mostrar loading enquanto carrega
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-foreground/70">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não tem usuário ou perfil já completo, o layout vai redirecionar
  // Mas adicionamos o ProfileObserver para garantir redirecionamento dinâmico
  if (!user || user.profileCompleted) {
    return (
      <>
        <ProfileObserver />
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="text-foreground/70">Redirecionando...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ProfileObserver />
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Complete seu perfil
            </h1>
            <p className="text-foreground/70">
              Preencha algumas informações para finalizar seu cadastro
            </p>
          </div>
          <CompleteProfileForm user={user} />
        </div>
      </div>
    </>
  );
}

