import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Suspense } from 'react';
import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';

export const metadata: Metadata = {
  title: 'Login | Madic',
  description: 'Acesse sua conta ou crie uma nova conta no Madic',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <div className="grid lg:grid-cols-1 min-h-screen bg-magic ">
       
        <section className="flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-lg space-y-8 animate-fade-in">
            <div className="text-center space-y-8">
              <div className="flex justify-center">
                <Image
                  src="/logo-amarela.png"
                  alt="Madic Logo"
                  width={950}
                  height={800}
                  className="w-5/12"
                  priority
                />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                  Bem-vindo ao Madic
                </h1>
                <p className="text-foreground text-sm lg:text-base">
                  Acesse sua conta ou crie uma nova
                </p>
              </div>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-input/30">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Entrar
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Criar conta
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-0">
                <Suspense fallback={<div>Carregando...</div>}>
                  <LoginForm />
                </Suspense>
              </TabsContent>

              <TabsContent value="register" className="mt-0">
                <Suspense fallback={<div>Carregando...</div>}>
                  <RegisterForm />
                </Suspense>
              </TabsContent>
            </Tabs>

            <div className="text-center text-xs text-zinc-500 pt-4 border-t border-zinc-700">
              <p>
                © {new Date().getFullYear()} Madic. Todos os
                direitos reservados.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
