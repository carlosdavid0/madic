'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      setLoginError(null);
      setIsLoading(true);

      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);

      // const result = await loginAction(formData);

      // if (result?.success && result.token) {
      //   // Definir cookie no cliente se não foi definido no servidor
      //   setCookieClient('token', result.token, {
      //     maxAge: 60 * 60 * 24 * 7, // 7 days
      //     secure: process.env.NODE_ENV === 'production',
      //     sameSite: 'lax',
      //     path: '/',
      //   });

      //   // Redirecionar imediatamente sem delay
      //   // Não definir setIsLoading(false) aqui para manter o loading até o redirect
      //   window.location.replace('/dashboard');
      // } else {
      //   // setLoginError(result?.error || 'Email ou senha inválidos');
      //   setIsLoading(false);
      // }
    } catch {
      setLoginError('Erro interno. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-lg mx-auto space-y-6 animate-slide-up"
    >
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-zinc-200">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-zinc-200">
          Senha
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-4">
        {loginError && (
          <div className="p-3 bg-red-900/50 border border-red-700 rounded-md">
            <p className="text-red-200 text-sm">{loginError}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full font-medium py-2.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Entrando...
            </div>
          ) : (
            'Entrar'
          )}
        </Button>

        <div className="text-center">
          <a
            href="#"
            className="text-sm text-zinc-400 hover:text-primary transition-colors"
          >
            Esqueceu sua senha?
          </a>
        </div>
      </div>
    </form>
  );
}
