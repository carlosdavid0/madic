'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, LayoutDashboard, LogOut, Menu, Settings, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { AdminMobileNav } from './admin-mobile-nav';

interface AdminHeaderProps {
  user: {
    name: string | null;
    email: string | null;
    avatar: string | null;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-20 border-b border-white/5 bg-background/40 backdrop-blur-md transition-all duration-300">
        <div className="h-full px-6 flex items-center justify-between gap-4">
          {/* Logo & Menu Mobile */}
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground hover:text-primary hover:bg-white/5"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Image
                    src="/logo-amarela.png"
                    alt="Logo"
                    width={120}
                    height={120}
                    className="h-9 w-auto object-contain relative z-10"
                  />
              </div>
              <span className="hidden sm:inline text-sm font-medium text-muted-foreground/50 border-l border-white/10 pl-3 ml-1">
                Painel Admin
              </span>
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary hover:bg-white/5 rounded-full w-10 h-10 transition-all duration-300">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-background animate-pulse" />
            </Button>

            <div className="h-8 w-px bg-white/5 mx-1" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-3 pl-3 pr-4 py-6 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300 group">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || ''}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className="hidden md:flex flex-col items-start gap-0.5">
                    <span className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                        {user.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                        Administrador
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-[#1a1a1a]/95 backdrop-blur-xl border-white/10 p-2">
                <DropdownMenuLabel className="p-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem asChild className="p-2.5 focus:bg-white/5 focus:text-primary cursor-pointer rounded-lg">
                  <Link href="/" className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Ver Site
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="p-2.5 focus:bg-white/5 focus:text-primary cursor-pointer rounded-lg">
                  <Link href="/complete-profile" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem className="p-2.5 text-red-500 focus:text-red-400 focus:bg-red-500/10 cursor-pointer rounded-lg flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <AdminMobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
}


