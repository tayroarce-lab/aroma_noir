/**
 * generarEnlaceWhatsapp.ts
 * Función que compila el resumen del carrito y genera la URL
 * de WhatsApp con el mensaje pre-formateado listo para el chatbot.
 */
import type { ItemCarrito } from '@/modulos/catalogo/tipos/Perfume.tipos';
import { formatearCRC } from '@/lib/formateadores';

export interface DatosCliente {
  nombre: string;
  whatsapp: string;
  direccion: string;
}

export interface ResumenPedido {
  items: ItemCarrito[];
  subtotal: number;
  cliente: DatosCliente;
  fechaHora: string;
}

/**
 * Formatea el número de WhatsApp eliminando caracteres no numéricos.
 * +506 8888-8888 → 50688888888
 */
function limpiarNumero(numero: string): string {
  return numero.replace(/\D/g, '');
}

/**
 * Genera el mensaje de pedido formateado para WhatsApp e Instagram.
 * Incluye: lista de productos, totales, datos del cliente e instrucciones de pago.
 */
export function construirMensaje(resumen: ResumenPedido): string {
  const { items, subtotal, cliente, fechaHora } = resumen;

  // Encabezado del pedido
  const encabezado = [
    '✨ *NUEVO PEDIDO — Aroma Noir* ✨',
    '_Deja estela._',
    '━━━━━━━━━━━━━━━━━━━━',
    '',
  ].join('\n');

  // Lista de productos
  const lineasProductos = items
    .map((item, i) => {
      const subtotalItem = item.perfume.precioVentaCrc * item.cantidad;
      return [
        `${i + 1}. *${item.perfume.marca.nombre} — ${item.perfume.nombre}*`,
        `   ${item.perfume.concentracion} · ${item.perfume.volumenMl}ml · ${item.perfume.genero}`,
        `   Cantidad: ${item.cantidad} × ${formatearCRC(item.perfume.precioVentaCrc)} = *${formatearCRC(subtotalItem)}*`,
      ].join('\n');
    })
    .join('\n\n');

  // Resumen de pago
  const resumenPago = [
    '',
    '━━━━━━━━━━━━━━━━━━━━',
    `💰 *TOTAL A PAGAR: ${formatearCRC(subtotal)}*`,
    '━━━━━━━━━━━━━━━━━━━━',
    '',
    '💳 *INSTRUCCIONES DE PAGO:*',
    'Transferir el total por *SINPE Móvil* al número que le indicará nuestro agente.',
    'Una vez confirmado el pago, procedemos con el despacho. 🚚',
    '',
    '━━━━━━━━━━━━━━━━━━━━',
    '👤 *DATOS DEL CLIENTE:*',
    `Nombre: ${cliente.nombre}`,
    `WhatsApp: ${cliente.whatsapp}`,
    `Dirección de entrega: ${cliente.direccion}`,
    '',
    '━━━━━━━━━━━━━━━━━━━━',
    `📅 Pedido generado: ${fechaHora}`,
    '',
    '_Este mensaje fue generado automáticamente desde aroma-noir.vercel.app_',
  ].join('\n');

  return encabezado + lineasProductos + resumenPago;
}

/**
 * Genera la URL de WhatsApp con el mensaje del pedido codificado.
 * @param items        Artículos del carrito
 * @param cliente      Datos del cliente (nombre, teléfono, dirección)
 * @returns            URL completa de WhatsApp lista para abrir
 */
export function generarEnlaceWhatsapp(
  items: ItemCarrito[],
  cliente: DatosCliente,
): string {
  const numeroNegocio =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMERO ?? '50600000000';

  const subtotal = items.reduce(
    (acc, item) => acc + item.perfume.precioVentaCrc * item.cantidad,
    0,
  );

  const ahora = new Date();
  const fechaHora = new Intl.DateTimeFormat('es-CR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Costa_Rica',
  }).format(ahora);

  const resumen: ResumenPedido = {
    items,
    subtotal,
    cliente: {
      ...cliente,
      whatsapp: limpiarNumero(cliente.whatsapp),
    },
    fechaHora,
  };

  const mensaje = construirMensaje(resumen);
  const mensajeCodificado = encodeURIComponent(mensaje);
  const numeroCodificado = limpiarNumero(numeroNegocio);

  return `https://wa.me/${numeroCodificado}?text=${mensajeCodificado}`;
}

/**
 * Valida los datos del cliente antes de generar el enlace.
 */
export function validarDatosCliente(datos: Partial<DatosCliente>): string[] {
  const errores: string[] = [];

  if (!datos.nombre || datos.nombre.trim().length < 2) {
    errores.push('El nombre debe tener al menos 2 caracteres.');
  }
  if (!datos.whatsapp || limpiarNumero(datos.whatsapp).length < 8) {
    errores.push('Ingresa un número de WhatsApp válido (mínimo 8 dígitos).');
  }
  if (!datos.direccion || datos.direccion.trim().length < 10) {
    errores.push('La dirección de entrega debe ser más descriptiva (mínimo 10 caracteres).');
  }

  return errores;
}
