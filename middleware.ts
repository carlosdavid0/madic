import { getCurrentUserFromToken } from '@/lib/auth/get-user-middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const publicRoutes = ['/login', '/register', '/profile'];
const protectedRoutes = ['/dashboard', '/settings'];
const adminRoutes = ['/admin'];
const completeProfileRoute = '/complete-profile';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAdminRoute = adminRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isCompleteProfileRoute = pathname.startsWith(completeProfileRoute);

  // Se não tem token e está em rota protegida ou admin, redirecionar para login
  if (!token && (isProtectedRoute || isAdminRoute)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se está na rota de completar perfil, verificar autenticação e status do perfil
  if (isCompleteProfileRoute) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const user = await getCurrentUserFromToken(token);
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Se perfil já está completo, redirecionar para home
    if (user.profileCompleted) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Verificar role para rotas admin
  if (isAdminRoute && token) {
    const user = await getCurrentUserFromToken(token);
    if (!user || user.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Adicionar pathname no header para uso em Server Components
  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
  runtime: 'nodejs', 

};