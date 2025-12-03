'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { hashPassword, comparePassword } from '@/lib/auth/bcrypt';
import { generateToken } from '@/lib/auth/jwt';
import { getCurrentUser } from '@/lib/auth/get-user';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export interface RegisterResult {
  success: boolean;
  error?: string;
  token?: string;
}

export async function registerAction(formData: FormData): Promise<RegisterResult> {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const username = formData.get('username') as string | null;

    // Validações básicas
    if (!name || !email || !password) {
      return {
        success: false,
        error: 'Nome, email e senha são obrigatórios',
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: 'A senha deve ter pelo menos 6 caracteres',
      };
    }

    // Verificar se o email já existe
    const existingUserByEmail = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUserByEmail.length > 0) {
      return {
        success: false,
        error: 'Este email já está em uso',
      };
    }

    // Verificar se o username já existe (apenas se fornecido)
    if (username) {
      const existingUserByUsername = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

      if (existingUserByUsername.length > 0) {
        return {
          success: false,
          error: 'Este username já está em uso',
        };
      }
    }

    // Hash da senha
    const hashedPassword = await hashPassword(password);

    // Criar usuário
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        username: username || null,
        password: hashedPassword,
      })
      .returning();

    if (!newUser) {
      return {
        success: false,
        error: 'Erro ao criar usuário',
      };
    }

    // Gerar token JWT
    const token = generateToken(newUser.id);

    // Definir cookie
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    });

    return {
      success: true,
      token,
    };
  } catch (error) {
    console.error('Erro no registro:', error);
    return {
      success: false,
      error: 'Erro interno do servidor. Tente novamente.',
    };
  }
}

export async function loginAction(formData: FormData): Promise<RegisterResult> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return {
        success: false,
        error: 'Email e senha são obrigatórios',
      };
    }

    // Buscar usuário por email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return {
        success: false,
        error: 'Email ou senha inválidos',
      };
    }

    // Verificar senha
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return {
        success: false,
        error: 'Email ou senha inválidos',
      };
    }

    // Verificar se o usuário está ativo
    if (!user.active) {
      return {
        success: false,
        error: 'Sua conta está desativada',
      };
    }

    // Gerar token JWT
    const token = generateToken(user.id);

    // Definir cookie
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    });

    return {
      success: true,
      token,
    };
  } catch (error) {
    console.error('Erro no login:', error);
    return {
      success: false,
      error: 'Erro interno do servidor. Tente novamente.',
    };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  // Não redireciona aqui, deixa o componente cliente fazer o redirecionamento
}

export async function getSessionAction() {
  try {
    const user = await getCurrentUser();
    return { user };
  } catch {
    return { user: null };
  }
}

