'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateProfileAction } from '@/lib/actions/profile';
import { useAuth } from '@/lib/contexts/auth-context';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import z from 'zod';

const profileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username deve ter pelo menos 3 caracteres')
    .regex(/^[a-z0-9_]+$/, 'Username deve conter apenas letras minúsculas, números e underscore'),
  bio: z.string().optional(),
  age: z.string().optional(),
  locate: z.string().optional(),
  availableFreelancer: z.boolean().default(false),
});

type User = {
  id: string;
  username: string | null;
  bio: string | null;
  age: string | null;
  locate: string | null;
};

interface CompleteProfileFormProps {
  user: User;
}

export function CompleteProfileForm({ user }: CompleteProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { refreshUser } = useAuth();

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user.username || '',
      bio: user.bio || '',
      age: user.age || '',
      locate: user.locate || '',
      availableFreelancer: false,
    },
  });

  const availableFreelancer = watch('availableFreelancer');

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      setError(null);
      setIsLoading(true);

      const formData = new FormData();
      formData.append('username', data.username);
      if (data.bio) {
        formData.append('bio', data.bio);
      }
      if (data.age) {
        formData.append('age', data.age);
      }
      if (data.locate) {
        formData.append('locate', data.locate);
      }
      formData.append('availableFreelancer', String(data.availableFreelancer || false));

      const result = await updateProfileAction(formData);

      if (result?.success) {
        // Atualizar o contexto de autenticação
        await refreshUser();
        window.dispatchEvent(new Event('auth-change'));
        // Aguardar um pouco para garantir que o contexto foi atualizado
        await new Promise((resolve) => setTimeout(resolve, 300));
        // Redirecionar após completar perfil
        router.replace('/');
      } else {
        setError(result?.error || 'Erro ao atualizar perfil');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setError('Erro interno. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-lg mx-auto space-y-6 bg-zinc-900/50 border border-zinc-800 rounded-lg p-6"
    >
      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-medium text-zinc-200">
          Username <span className="text-red-400">*</span>
        </Label>
        <Input
          id="username"
          type="text"
          placeholder="seu_username"
          {...register('username')}
        />
        {errors.username && (
          <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>
        )}
        <p className="text-xs text-zinc-400">
          Este campo é obrigatório para completar seu perfil
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-sm font-medium text-zinc-200">
          Bio
        </Label>
        <textarea
          id="bio"
          rows={4}
          placeholder="Conte um pouco sobre você..."
          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-foreground placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          {...register('bio')}
        />
        {errors.bio && (
          <p className="text-red-400 text-xs mt-1">{errors.bio.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="age" className="text-sm font-medium text-zinc-200">
            Data de nascimento
          </Label>
          <Input
            id="age"
            type="date"
            {...register('age')}
          />
          {errors.age && (
            <p className="text-red-400 text-xs mt-1">{errors.age.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="locate" className="text-sm font-medium text-zinc-200">
            Localização
          </Label>
          <Input
            id="locate"
            type="text"
            placeholder="Cidade, Estado"
            {...register('locate')}
          />
          {errors.locate && (
            <p className="text-red-400 text-xs mt-1">{errors.locate.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="availableFreelancer"
          className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-primary focus:ring-primary"
          {...register('availableFreelancer')}
        />
        <Label htmlFor="availableFreelancer" className="text-sm font-medium text-zinc-200 cursor-pointer">
          Estou disponível para trabalhar como freelancer
        </Label>
      </div>

      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-900/50 border border-red-700 rounded-md">
            <p className="text-red-200 text-sm">{error}</p>
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
              Salvando...
            </div>
          ) : (
            'Completar perfil'
          )}
        </Button>
      </div>
    </form>
  );
}

