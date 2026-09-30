import { NextResponse } from 'next/server';
import {
  COOKIE_ADMIN,
  DURACION_SESION_SEG,
  contrasenaCorrecta,
  crearToken,
} from '@/lib/adminSesion';

export async function POST(request: Request) {
  const cuerpo = await request.json().catch(() => ({}));
  const contrasena = typeof cuerpo?.contrasena === 'string' ? cuerpo.contrasena : '';

  if (!(await contrasenaCorrecta(contrasena))) {
    // Pausa breve para frenar intentos repetidos.
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const token = await crearToken();
  if (!token) return NextResponse.json({ ok: false }, { status: 500 });

  const respuesta = NextResponse.json({ ok: true });
  respuesta.cookies.set(COOKIE_ADMIN, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: DURACION_SESION_SEG,
  });
  return respuesta;
}
