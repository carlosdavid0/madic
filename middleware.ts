import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getCurrentUserFromToken } from './lib/auth/get-user-middleware';

// Rotas públicas que não precisam de autenticação
const publicRoutes = ['/login', '/register'];

// Rotas que não requerem perfil completo

// Rotas protegidas que precisam de autenticação E perfil completo
const protectedRoutes = ['/dashboard', '/profile', '/settings'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Verificar se é uma rota pública
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Verificar se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );


  // Se não tem token e está tentando acessar rota protegida
  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se tem token e está tentando acessar rota pública (login/register)
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Se tem token, verificar se é válido apenas para rotas protegidas
  if (token && isProtectedRoute) {
    const user = await getCurrentUserFromToken(token);

    // Se o token existe mas o usuário é null, o token é inválido/expirado
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      // Limpar cookie inválido
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

