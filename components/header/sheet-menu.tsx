'use client';

import { cn } from '@/lib/utils';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
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
import { User } from './user';

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
        'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-5 w-5" />
        <span className="sr-only">Fechar</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
SheetContent.displayName = DialogPrimitive.Content.displayName;

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'Desafios', href: '/desafios' },
  { label: 'Membros', href: '/membros' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contato', href: '/contato' },
];

interface SheetMenuProps {
  pathname: string;
  user: UserType | null;
}

export function SheetMenu({ pathname, user }: SheetMenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Abrir menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
        <div className="flex flex-col gap-6 mt-8">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => {
              const active = pathname === item.href;

              return (
                <SheetClose key={item.href} asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'text-lg font-medium transition-colors duration-300 py-2 px-3 rounded-md',
                      active
                        ? 'text-primary font-semibold bg-primary/10'
                        : 'text-foreground/70 hover:text-foreground hover:bg-accent'
                    )}
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              );
            })}
          </nav>
          <div className="pt-6 border-t">
            <User user={user} showFullUsername />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}