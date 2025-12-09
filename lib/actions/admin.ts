'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export interface UpdateUserResult {
  success: boolean;
  error?: string;
}

export async function updateUserRoleAction(
  userId: string,
  role: 'user' | 'admin'
): Promise<UpdateUserResult> {
  try {
    await db.update(users).set({ role }).where(eq(users.id, userId));

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar role do usuário:', error);
    return {
      success: false,
      error: 'Erro ao atualizar role do usuário',
    };
  }
}

export async function toggleUserActiveAction(
  userId: string
): Promise<UpdateUserResult> {
  try {
    const [user] = await db
      .select({ active: users.active })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return {
        success: false,
        error: 'Usuário não encontrado',
      };
    }

    await db
      .update(users)
      .set({ active: !user.active })
      .where(eq(users.id, userId));

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Erro ao alterar status do usuário:', error);
    return {
      success: false,
      error: 'Erro ao alterar status do usuário',
    };
  }
}

export async function getAllUsersAction() {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
        avatar: users.avatar,
        role: users.role,
        active: users.active,
        profileCompleted: users.profileCompleted,
        emailValidated: users.emailValidated,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));

    return { success: true, users: allUsers };
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return {
      success: false,
      error: 'Erro ao buscar usuários',
      users: [],
    };
  }
}

