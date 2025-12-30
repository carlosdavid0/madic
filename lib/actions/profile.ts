'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { getCurrentUser } from '@/lib/auth/get-user';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import {
  deleteFileFromS3,
  extractS3KeyFromUrl,
  uploadAvatarToS3,
  validateAvatarFile,
} from '@/lib/s3';

export interface UpdateProfileResult {
  success: boolean;
  error?: string;
}

export interface UploadAvatarResult {
  success: boolean;
  avatarUrl?: string;
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

export async function uploadAvatarAction(
  formData: FormData
): Promise<UploadAvatarResult> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        error: 'Usuário não autenticado',
      };
    }

    const file = formData.get('avatar') as File | null;

    if (!file) {
      return {
        success: false,
        error: 'Nenhum arquivo enviado',
      };
    }

    // Validar arquivo
    try {
      validateAvatarFile({ type: file.type, size: file.size });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Arquivo inválido';
      return {
        success: false,
        error: errorMessage,
      };
    }

    // Converter arquivo para buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sempre excluir o avatar anterior ANTES de fazer upload do novo
    // Isso garante que não acumule arquivos antigos no S3
    if (currentUser.avatar) {
      try {
        const oldKey = extractS3KeyFromUrl(currentUser.avatar);
        if (oldKey) {
          console.log(`[Avatar] Excluindo avatar antigo: ${oldKey}`);
          await deleteFileFromS3(oldKey);
          console.log(`[Avatar] Avatar antigo excluído com sucesso`);
        } else {
          console.warn(`[Avatar] Não foi possível extrair a chave S3 da URL: ${currentUser.avatar}`);
        }
      } catch (error) {
        console.error('[Avatar] Erro ao excluir avatar antigo:', error);
        // Continuar mesmo se não conseguir excluir o antigo
        // Mas logar o erro para debug
      }
    }

    // Fazer upload do novo avatar
    const { url } = await uploadAvatarToS3(
      buffer,
      file.name,
      file.type,
      currentUser.id
    );

    // Atualizar avatar no banco de dados
    const [updatedUser] = await db
      .update(users)
      .set({
        avatar: url,
        updatedAt: new Date(),
      })
      .where(eq(users.id, currentUser.id))
      .returning();

    if (!updatedUser) {
      return {
        success: false,
        error: 'Erro ao atualizar avatar',
      };
    }

    revalidatePath('/');
    revalidatePath('/complete-profile');
    revalidatePath(`/profile/${currentUser.username || currentUser.id}`);

    return {
      success: true,
      avatarUrl: url,
    };
  } catch (error) {
    console.error('Erro ao fazer upload do avatar:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Erro interno do servidor. Tente novamente.';
    return {
      success: false,
      error: errorMessage,
    };
  }
}
