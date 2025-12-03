import { cookies } from 'next/headers';
import { verifyToken } from './jwt';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Verifica se o usuário atual tem perfil completo
 * Retorna true se o perfil está completo, false caso contrário
 * Retorna null se não há usuário autenticado
 */
export async function checkProfileCompleted(): Promise<boolean | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return null;
    }

    const payload = verifyToken(token);

    if (!payload) {
      return null;
    }

    const [user] = await db
      .select({
        profileCompleted: users.profileCompleted,
        active: users.active,
      })
      .from(users)
      .where(eq(users.id, payload.sub))
      .limit(1);

    if (!user || !user.active) {
      return null;
    }

    return user.profileCompleted ?? false;
  } catch {
    return null;
  }
}

