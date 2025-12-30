'use client';

import { updateChallenge } from '@/lib/actions/challenges';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Challenge } from '@/lib/db/schema';

interface EditChallengeFormProps {
  challenge: Challenge;
}

export function EditChallengeForm({ challenge }: EditChallengeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const formData = new FormData(e.currentTarget);
      const result = await updateChallenge(challenge.id, formData);
      
      if (!result.success) {
        setError(result.error || 'Erro ao atualizar desafio');
        setIsSubmitting(false);
        return;
      }
      
      // Redirecionar para a página do desafio
      router.push(`/admin/challenges/${challenge.id}`);
    } catch (error) {
      console.error('Erro ao atualizar challenge:', error);
      setError(error instanceof Error ? error.message : 'Erro ao atualizar challenge');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Desafio *</Label>
        <Input
          id="name"
          name="name"
          required
          defaultValue={challenge.name}
          placeholder="Ex: Desafio de Design UI/UX"
          className="w-full"
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição *</Label>
        <Textarea
          id="description"
          name="description"
          required
          rows={5}
          defaultValue={challenge.description}
          placeholder="Descreva o desafio, seus objetivos e requisitos..."
          className="w-full resize-none"
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base">Pontuação por Colocação</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstPlacePoints" className="text-sm font-normal">
              🥇 1º Lugar
            </Label>
            <Input
              id="firstPlacePoints"
              name="firstPlacePoints"
              type="number"
              defaultValue={challenge.firstPlacePoints}
              min={0}
              className="w-full"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondPlacePoints" className="text-sm font-normal">
              🥈 2º Lugar
            </Label>
            <Input
              id="secondPlacePoints"
              name="secondPlacePoints"
              type="number"
              defaultValue={challenge.secondPlacePoints}
              min={0}
              className="w-full"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="thirdPlacePoints" className="text-sm font-normal">
              🥉 3º Lugar
            </Label>
            <Input
              id="thirdPlacePoints"
              name="thirdPlacePoints"
              type="number"
              defaultValue={challenge.thirdPlacePoints}
              min={0}
              className="w-full"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="otherPlacesPoints" className="text-sm font-normal">
              🎖️ Outros
            </Label>
            <Input
              id="otherPlacesPoints"
              name="otherPlacesPoints"
              type="number"
              defaultValue={challenge.otherPlacesPoints}
              min={0}
              className="w-full"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="flex-1"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            'Salvar Alterações'
          )}
        </Button>
      </div>
    </form>
  );
}


