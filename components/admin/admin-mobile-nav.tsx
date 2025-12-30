'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Trophy,
  Users,
  Settings,
  BarChart3,
  Shield,
  Database,
  FileText,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Desafios',
    href: '/admin/challenges',
    icon: Trophy,
  },
  {
    title: 'Usuários',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Relatórios',
    href: '/admin/reports',
    icon: BarChart3,
    disabled: true,
  },
  {
    title: 'Configurações',
    href: '/admin/settings',
    icon: Settings,
    disabled: true,
  },
  {
    title: 'Segurança',
    href: '/admin/security',
    icon: Shield,
    disabled: true,
  },
  {
    title: 'Banco de Dados',
    href: '/admin/database',
    icon: Database,
    disabled: true,
  },
  {
    title: 'Logs',
    href: '/admin/logs',
    icon: FileText,
    disabled: true,
  },
];

interface AdminMobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function AdminMobileNav({ open, onClose }: AdminMobileNavProps) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-72 border-r bg-background shadow-xl lg:hidden">
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <h2 className="text-lg font-semibold">Menu Admin</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="overflow-y-auto py-6 px-4">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              
              return (
                <Link
                  key={item.href}
                  href={item.disabled ? '#' : item.href}
                  onClick={(e) => {
                    if (item.disabled) {
                      e.preventDefault();
                    } else {
                      onClose();
                    }
                  }}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : item.disabled
                      ? 'text-muted-foreground opacity-50 cursor-not-allowed'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.title}</span>
                  {item.disabled && (
                    <span className="ml-auto text-xs bg-muted-foreground/20 px-2 py-0.5 rounded">
                      Em breve
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-muted/30">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-background hover:bg-muted transition-colors border"
          >
            ← Voltar ao Site
          </Link>
        </div>
      </aside>
    </>
  );
}


