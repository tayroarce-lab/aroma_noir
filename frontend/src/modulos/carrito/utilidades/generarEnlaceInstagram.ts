/**
 * generarEnlaceInstagram.ts
 * Genera el enlace para abrir el chat de Instagram del negocio.
 * Instagram no permite pre-llenar el texto del DM como WhatsApp,
 * así que el mensaje se copia al portapapeles por separado.
 */
export function generarEnlaceInstagram(): string {
  const usuario = process.env.NEXT_PUBLIC_INSTAGRAM_USUARIO ?? 'aroma_noir.cr';
  return `https://ig.me/m/${usuario}`;
}

/**
 * Copia texto al portapapeles con fallback para navegadores/contextos
 * donde navigator.clipboard no está disponible (ej. http sin TLS).
 */
export async function copiarAlPortapapeles(texto: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch {
    // sigue al fallback
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = texto;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const exito = document.execCommand('copy');
    document.body.removeChild(textarea);
    return exito;
  } catch {
    return false;
  }
}
