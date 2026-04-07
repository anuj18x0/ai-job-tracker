import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected and public routes
  const protectedRoutes = ['/board', '/profile', '/settings'];
  const authRoutes = ['/login', '/register', '/verify-email'];

  // Check if the route is protected
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Get the access token from cookies
  const token = request.cookies.get('accessToken');

  // Redirect to login if accessing a protected route without a token
  if (isProtected && !token) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if accessing auth routes while logged in
  if (isAuthRoute && token) {
    const url = new URL('/board', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/board/:path*', '/profile/:path*', '/settings/:path*', '/login', '/register', '/verify-email'],
};
