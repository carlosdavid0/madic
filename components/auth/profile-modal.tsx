'use client';

import { useRouter, usePathname } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/contexts/auth-context';

export function ProfileModal() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Mostrar modal apenas se usuário está autenticado, perfil não está completo
  // e não está na página de completar perfil
  const shouldShowModal = Boolean(
    !loading &&
    user &&
    !user.profileCompleted &&
      pathname !== '/complete-profile'
  );

  const handleCompleteProfile = () => {
    router.push('/complete-profile');
  };

  return (
    <Dialog open={shouldShowModal}>
      <DialogContent
        className="sm:max-w-[425px]"
        onCloseAutoFocus={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Complete seu perfil</DialogTitle>
          <DialogDescription>
            Para continuar usando a plataforma, você precisa completar seu
            perfil com algumas informações básicas.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end mt-4">
          <Button onClick={handleCompleteProfile}>
            Completar perfil agora
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

