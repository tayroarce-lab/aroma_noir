/**
 * clienteApi.ts
 * Wrapper centralizado de fetch para comunicarse con el backend Nest.js.
 * Todos los módulos deben usar estas funciones en lugar de fetch directo.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const API_PREFIX = '/api/v1';

type MetodoHttp = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface OpcionesPeticion<T = unknown> {
  metodo?: MetodoHttp;
  cuerpo?: T;
  cache?: RequestCache;
  revalidar?: number; // segundos para ISR (Next.js)
}

async function peticion<TRespuesta, TCuerpo = unknown>(
  ruta: string,
  opciones: OpcionesPeticion<TCuerpo> = {},
): Promise<TRespuesta> {
  const { metodo = 'GET', cuerpo, cache = 'no-store', revalidar } = opciones;

  const respuesta = await fetch(`${BASE_URL}${API_PREFIX}${ruta}`, {
    method: metodo,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    cache: revalidar !== undefined ? undefined : cache,
    next: revalidar !== undefined ? { revalidate: revalidar } : undefined,
  });

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => ({ mensaje: 'Error desconocido' }));
    throw new Error(error.mensaje ?? `HTTP ${respuesta.status}`);
  }

  return respuesta.json() as Promise<TRespuesta>;
}

// ─── Métodos de conveniencia ───────────────────────────────────────────────

export const clienteApi = {
  obtener: <T>(ruta: string, revalidar?: number) =>
    peticion<T>(ruta, { metodo: 'GET', revalidar }),

  crear: <T, B = unknown>(ruta: string, cuerpo: B) =>
    peticion<T, B>(ruta, { metodo: 'POST', cuerpo }),

  actualizar: <T, B = unknown>(ruta: string, cuerpo: B) =>
    peticion<T, B>(ruta, { metodo: 'PATCH', cuerpo }),

  eliminar: <T>(ruta: string) =>
    peticion<T>(ruta, { metodo: 'DELETE' }),
};
