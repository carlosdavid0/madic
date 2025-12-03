'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { getCurrentUser } from '@/lib/auth/get-user';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export interface UpdateProfileResult {
  success: boolean;
  error?: string;
}

export async function updateProfileAction(formData: FormData): Promise<UpdateProfileResult> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        error: 'Usuário não autenticado',
      };
    }

    const username = formData.get('username') as string;
    const bio = formData.get('bio') as string | null;
    const age = formData.get('age') as string | null;
    const locate = formData.get('locate') as string | null;
    const availableFreelancer = formData.get('availableFreelancer') === 'true';

    // Validação do username (obrigatório)
    if (!username || username.trim().length === 0) {
      return {
        success: false,
        error: 'Username é obrigatório',
      };
    }

    if (username.length < 3) {
      return {
        success: false,
        error: 'Username deve ter pelo menos 3 caracteres',
      };
    }

    if (!/^[a-z0-9_]+$/.test(username)) {
      return {
        success: false,
        error: 'Username deve conter apenas letras minúsculas, números e underscore',
      };
    }

    // Verificar se o username já existe (exceto o do próprio usuário)
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUser.length > 0 && existingUser[0].id !== currentUser.id) {
      return {
        success: false,
        error: 'Este username já está em uso',
      };
    }

    // Atualizar perfil
    const [updatedUser] = await db
      .update(users)
      .set({
        username,
        bio: bio || null,
        age: age || null,
        locate: locate || null,
        availableFreelancer,
        profileCompleted: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, currentUser.id))
      .returning();

    if (!updatedUser) {
      return {
        success: false,
        error: 'Erro ao atualizar perfil',
      };
    }

    revalidatePath('/');
    revalidatePath('/complete-profile');
    return {
      success: true,
    };
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return {
      success: false,
      error: 'Erro interno do servidor. Tente novamente.',
    };
  }
}
