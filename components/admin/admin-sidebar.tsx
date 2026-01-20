'use client';

import { cn } from '@/lib/utils';
import {
    BarChart3,
    Database,
    FileText,
    LayoutDashboard,
    Link as LinkIcon,
    LogOut,
    Settings,
    Shield,
    Trophy,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
    title: 'Links',
    href: '/admin/links',
    icon: LinkIcon,
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
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-72 lg:bg-background/40 lg:backdrop-blur-md lg:border-r lg:border-white/5 transition-all duration-300 z-40">
      <div className="flex-1 overflow-y-auto py-8 px-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="mb-8 px-4">
             <h2 className="text-xs font-semibold text-muted-foreground/50 uppercase tracking-widest">
                Menu Principal
             </h2>
        </div>
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href + '/'));
            
            return (
              <Link
                key={item.href}
                href={item.disabled ? '#' : item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden',
                  isActive
                    ? 'bg-gradient-to-r from-primary/10 to-transparent text-primary shadow-[0_0_20px_rgba(239,199,60,0.1)] border border-primary/10'
                    : item.disabled
                    ? 'text-muted-foreground/30 cursor-not-allowed'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground hover:translate-x-1'
                )}
                onClick={(e) => item.disabled && e.preventDefault()}
              >
                {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-primary rounded-r-full shadow-[0_0_10px_rgba(239,199,60,0.4)]" />
                )}
                <Icon className={cn("w-5 h-5 shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                <span className="truncate">{item.title}</span>
                {item.disabled && (
                  <span className="ml-auto text-[10px] uppercase font-bold tracking-wider bg-white/5 px-2 py-0.5 rounded text-muted-foreground/50">
                    Breve
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-3">
             <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                 <LogOut className="w-4 h-4 text-muted-foreground" />
             </div>
             <div>
                 <p className="text-xs font-medium text-muted-foreground">Logado como Admin</p>
             </div>
        </div>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-primary hover:text-black transition-all duration-300 border border-white/10 hover:border-primary hover:shadow-[0_0_20px_rgba(239,199,60,0.2)]"
        >
          Retornar ao Site
        </Link>
      </div>
    </aside>
  );
}


