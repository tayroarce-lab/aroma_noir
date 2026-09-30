import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COOKIE_ADMIN, tokenValido } from '@/lib/adminSesion';

/** Protege todo /admin: sin sesión válida se redirige a la pantalla de acceso. */
export async function proxy(request: NextRequest) {
  const token = request.cookies.get(COOKIE_ADMIN)?.value;
  if (await tokenValido(token)) return NextResponse.next();
  return NextResponse.redirect(new URL('/acceso-admin', request.url));
}

export const config = {
  matcher: '/admin/:path*',
};
