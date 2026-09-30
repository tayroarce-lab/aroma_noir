/**
 * adminSesion.ts
 * Sesión del panel de administración: cookie firmada con HMAC-SHA256.
 * La clave de firma se deriva de ADMIN_PASSWORD; si no está definida, nadie entra.
 */

export const COOKIE_ADMIN = 'an_admin';
export const DURACION_SESION_SEG = 60 * 60 * 12;

const codificador = new TextEncoder();

function aHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function firmar(mensaje: string, secreto: string): Promise<string> {
  const clave = await crypto.subtle.importKey(
    'raw',
    codificador.encode(secreto),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return aHex(await crypto.subtle.sign('HMAC', clave, codificador.encode(mensaje)));
}

function iguales(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diferencia = 0;
  for (let i = 0; i < a.length; i++) diferencia |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diferencia === 0;
}

/** Compara la contraseña recibida con ADMIN_PASSWORD sin filtrar información por tiempo. */
export async function contrasenaCorrecta(recibida: string): Promise<boolean> {
  const esperada = process.env.ADMIN_PASSWORD;
  if (!esperada) return false;
  const [a, b] = await Promise.all([firmar(recibida, 'cmp'), firmar(esperada, 'cmp')]);
  return iguales(a, b);
}

export async function crearToken(): Promise<string | null> {
  const secreto = process.env.ADMIN_PASSWORD;
  if (!secreto) return null;
  const expira = String(Math.floor(Date.now() / 1000) + DURACION_SESION_SEG);
  return `${expira}.${await firmar(expira, secreto)}`;
}

export async function tokenValido(token: string | undefined): Promise<boolean> {
  const secreto = process.env.ADMIN_PASSWORD;
  if (!secreto || !token) return false;
  const [expira, firma] = token.split('.');
  if (!expira || !firma) return false;
  if (Number(expira) < Math.floor(Date.now() / 1000)) return false;
  return iguales(firma, await firmar(expira, secreto));
}
