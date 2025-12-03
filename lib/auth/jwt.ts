import jwt from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface TokenPayload {
  sub: string; // userId como string (padrão JWT)
}

export function generateToken(userId: string): string {
  const payload: { sub: string } = { sub: userId };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    console.log('[verifyToken] Token:', token);
    console.log('[verifyToken] JWT_SECRET:', JWT_SECRET);
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    console.log('[verifyToken] Decoded:', decoded);
    return decoded;
  } catch (error) {
    console.error('[verifyToken] Error:', error);
    return null;
  }
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.decode(token) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

