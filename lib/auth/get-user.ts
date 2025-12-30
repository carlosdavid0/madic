import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { verifyToken } from './jwt';
import { ensureSignedAvatarUrl } from '@/lib/s3';

export async function getCurrentUser() {
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
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
        avatar: users.avatar,
        socialName: users.socialName,
        bio: users.bio,
        age: users.age,
        locate: users.locate,
        availableFreelancer: users.availableFreelancer,
        active: users.active,
        profileCompleted: users.profileCompleted,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, payload.sub))
      .limit(1);

    if (!user || !user.active) {
      return null;
    }

    // Garantir que o avatar tenha URL assinada se existir
    if (user.avatar) {
      try {
        user.avatar = await ensureSignedAvatarUrl(user.avatar);
      } catch (error) {
        console.error('[getCurrentUser] Erro ao garantir URL assinada do avatar:', error);
        // Continuar mesmo se houver erro
      }
    }

    return user;
  } catch {
    return null;
  }
}

