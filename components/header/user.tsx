"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/contexts/auth-context";
import { logoutAction } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";

export function User() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    await refreshUser();
    // Disparar evento para sincronizar entre abas
    window.dispatchEvent(new Event('auth-change'));
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        {/* Avatar skeleton */}
        <div className="h-[35px] w-[35px] rounded-full bg-zinc-700/50 animate-pulse" />

        {/* Name skeleton */}
        <div className="h-[14px] w-[80px] rounded-md bg-zinc-700/50 animate-pulse hidden lg:block" />
      </div>
    );
  }

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
    <div className="flex items-center gap-2">
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
      <span className="text-md font-normal hidden lg:block">{user.name}</span>
      <button
        onClick={handleLogout}
        className="ml-2 text-sm text-foreground/50 hover:text-foreground/70 transition-colors hidden lg:block"
        title="Sair"
      >
        Sair
      </button>
    </div>
  );
}
