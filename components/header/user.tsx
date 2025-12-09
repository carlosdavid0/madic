'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logoutAction } from '@/lib/actions/auth';
import { cn } from '@/lib/utils';
import { LogOut, Settings, UserCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
type UserType = {
  id: string;
  name: string;
  username: string | null;
  email: string;
  avatar: string | null;
  socialName: string | null;
  bio: string | null;
  age: string | null;
  locate: string | null;
  availableFreelancer: boolean | null;
  active: boolean | null;
  profileCompleted: boolean | null;
  role: string;
  createdAt: Date | null;
  updatedAt: Date | null;
} | null;

type UserProps = {
  user: UserType | null;
  showFullUsername?: boolean;
};

export function User({ user, showFullUsername = false }: UserProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    // Disparar evento para sincronizar entre abas
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-change'));
    }
    router.push('/');
    router.refresh();
  };

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
        >
          Entrar
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none rounded-full">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              width={35}
              height={35}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="h-[35px] w-[35px] rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span
            className={cn(
              'text-md font-normal',
              !showFullUsername && 'hidden lg:block'
            )}
          >
            {user.name}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/profile/${user.username || user.id}`} className="cursor-pointer">
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Meu Perfil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </Link>
        </DropdownMenuItem>
        {user.role === 'admin' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Admin</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-400 focus:text-red-400">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
