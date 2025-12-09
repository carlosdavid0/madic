'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  updateUserRoleAction,
  toggleUserActiveAction,
} from '@/lib/actions/admin';
import { users } from '@/lib/db/schema';
import { useRouter } from 'next/navigation';

interface UserActionsProps {
  user: typeof users.$inferSelect;
}

export function UserActions({ user }: UserActionsProps) {
  const router = useRouter();
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isActiveDialogOpen, setIsActiveDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = async (newRole: 'user' | 'admin') => {
    setIsLoading(true);
    try {
      const result = await updateUserRoleAction(user.id, newRole);
      if (result.success) {
        setIsRoleDialogOpen(false);
        router.refresh();
      } else {
        alert(result.error || 'Erro ao atualizar role');
      }
    } catch (error) {
      alert('Erro ao atualizar role do usuário');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async () => {
    setIsLoading(true);
    try {
      const result = await toggleUserActiveAction(user.id);
      if (result.success) {
        setIsActiveDialogOpen(false);
        router.refresh();
      } else {
        alert(result.error || 'Erro ao alterar status');
      }
    } catch (error) {
      alert('Erro ao alterar status do usuário');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Alterar Role
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Role do Usuário</DialogTitle>
            <DialogDescription>
              Alterar role de {user.name} de {user.role} para{' '}
              {user.role === 'admin' ? 'usuário' : 'admin'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRoleDialogOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={() =>
                handleRoleChange(user.role === 'admin' ? 'user' : 'admin')
              }
              disabled={isLoading}
            >
              {isLoading ? 'Alterando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isActiveDialogOpen} onOpenChange={setIsActiveDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant={user.active ? 'destructive' : 'default'}
            size="sm"
          >
            {user.active ? 'Desativar' : 'Ativar'}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {user.active ? 'Desativar' : 'Ativar'} Usuário
            </DialogTitle>
            <DialogDescription>
              {user.active
                ? `Tem certeza que deseja desativar ${user.name}?`
                : `Tem certeza que deseja ativar ${user.name}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsActiveDialogOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              variant={user.active ? 'destructive' : 'default'}
              onClick={handleToggleActive}
              disabled={isLoading}
            >
              {isLoading
                ? user.active
                  ? 'Desativando...'
                  : 'Ativando...'
                : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

