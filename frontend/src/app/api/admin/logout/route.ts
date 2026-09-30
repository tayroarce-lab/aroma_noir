import { NextResponse } from 'next/server';
import { COOKIE_ADMIN } from '@/lib/adminSesion';

export async function POST() {
  const respuesta = NextResponse.json({ ok: true });
  respuesta.cookies.set(COOKIE_ADMIN, '', { path: '/', maxAge: 0 });
  return respuesta;
}
