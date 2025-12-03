'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirmação de senha obrigatória'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      setRegisterError(null);
      setIsLoading(true);

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('password', data.password);

      // const result = await registerAction(formData);

      // if (result?.success) {
      //   setRegisterSuccess(true);
      //   // Redirecionar após registro bem-sucedido
      //   setTimeout(() => {
      //     window.location.replace('/login');
      //   }, 2000);
      // } else {
      //   setRegisterError(result?.error || 'Erro ao criar conta. Tente novamente.');
      //   setIsLoading(false);
      // }

      // Simulação temporária
      setTimeout(() => {
        setRegisterSuccess(true);
        setIsLoading(false);
      }, 1500);
    } catch {
      setRegisterError('Erro interno. Tente novamente.');
      setIsLoading(false);
    }
  };

  if (registerSuccess) {
    return (
      <div className="w-full max-w-lg mx-auto space-y-6 animate-slide-up">
        <div className="p-4 bg-green-900/50 border border-green-700 rounded-md text-center">
          <p className="text-green-200 text-sm">
            Conta criada com sucesso! Redirecionando...
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-lg mx-auto space-y-6 animate-slide-up"
    >
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-zinc-200">
          Nome completo
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Seu nome completo"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-email" className="text-sm font-medium text-zinc-200">
          Email
        </Label>
        <Input
          id="register-email"
          type="email"
          placeholder="seu@email.com"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password" className="text-sm font-medium text-zinc-200">
          Senha
        </Label>
        <Input
          id="register-password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="confirm-password"
          className="text-sm font-medium text-zinc-200"
        >
          Confirmar senha
        </Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="••••••••"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-red-400 text-xs mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {registerError && (
          <div className="p-3 bg-red-900/50 border border-red-700 rounded-md">
            <p className="text-red-200 text-sm">{registerError}</p>
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
              Criando conta...
            </div>
          ) : (
            'Criar conta'
          )}
        </Button>
      </div>
    </form>
  );
}

