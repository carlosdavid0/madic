import { verifyToken } from './jwt';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Busca o usuário atual no middleware
 * Esta função é otimizada para uso no middleware (Edge Runtime)
 */
export async function getCurrentUserFromToken(token: string) {
  try {
    if (!token) {
      return null;
    }

    const payload = verifyToken(token);

    if (!payload) {
      return null;
    }

    const [user] = await db
      .select({
        id: users.id,
        active: users.active,
        profileCompleted: users.profileCompleted,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, payload.sub))
      .limit(1);

    if (!user || !user.active) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

