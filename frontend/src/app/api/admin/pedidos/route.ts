import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_ADMIN, tokenValido } from '@/lib/adminSesion';

export const dynamic = 'force-dynamic';

/**
 * Entrega los pedidos reales al panel. La clave de n8n vive solo en el servidor
 * y n8n ya excluye cédula, teléfono y dirección exacta.
 */
export async function GET(request: NextRequest) {
  if (!(await tokenValido(request.cookies.get(COOKIE_ADMIN)?.value))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const url = process.env.AN_PANEL_URL;
  const clave = process.env.AN_PANEL_CLAVE;
  if (!url || !clave) {
    return NextResponse.json({ error: 'Panel sin configurar' }, { status: 503 });
  }

  try {
    const r = await fetch(url, {
      headers: { 'x-panel-clave': clave },
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    });
    if (!r.ok) return NextResponse.json({ error: 'Origen no disponible' }, { status: 502 });
    const datos = await r.json();
    return NextResponse.json({ pedidos: Array.isArray(datos?.pedidos) ? datos.pedidos : [] });
  } catch {
    return NextResponse.json({ error: 'Origen no disponible' }, { status: 502 });
  }
}
