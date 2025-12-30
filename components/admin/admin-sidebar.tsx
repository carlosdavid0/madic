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
} from 'lucide-react';

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

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:border-r lg:bg-muted/30 lg:pt-20">
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.href}
                href={item.disabled ? '#' : item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : item.disabled
                    ? 'text-muted-foreground opacity-50 cursor-not-allowed'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                onClick={(e) => item.disabled && e.preventDefault()}
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

      <div className="p-4 border-t bg-background/50">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-background hover:bg-muted transition-colors border"
        >
          ← Voltar ao Site
        </Link>
      </div>
    </aside>
  );
}


