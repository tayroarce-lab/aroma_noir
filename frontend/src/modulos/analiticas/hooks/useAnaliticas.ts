'use client';

import { useState, useEffect } from 'react';
import type { DatosDashboard } from '../tipos/Analiticas.tipos';

/**
 * Datos simulados del dashboard para desarrollo.
 * Reemplazar con llamadas reales a /api/v1/analiticas/* cuando Supabase esté conectado.
 */
function generarTendencia() {
  const dias = [];
  for (let i = 6; i >= 0; i--) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - i);
    dias.push({
      fecha: fecha.toISOString().split('T')[0],
      pedidos: Math.floor(Math.random() * 8) + 1,
      ingresos: Math.floor(Math.random() * 350000) + 50000,
    });
  }
  return dias;
}

const DATOS_SIMULADOS: DatosDashboard = {
  resumen: {
    totalPedidos: 142,
    totalProductos: 16,
    ingresoTotalCrc: 9_420_000,
    pedidosPendientes: 8,
    pedidosConfirmados: 118,
    pedidosEnviados: 12,
    pedidosEntregados: 104,
    tasaConversion: 83.1,
  },
  clasificaciones: {
    Nicho:      { ingresos: 4_850_000, pedidos: 52 },
    Arabe:      { ingresos: 2_310_000, pedidos: 48 },
    'Diseñador': { ingresos: 2_260_000, pedidos: 42 },
  },
  topPerfumes: [
    { perfume: { id: 'nicho-04', nombre: 'Interlude Man',      marca: { nombre: 'Amouage' },          clasificacion: 'Nicho' },      ingresosCrc: 1_225_000, pedidos: 5 },
    { perfume: { id: 'dis-03',   nombre: 'Sauvage EDP',        marca: { nombre: 'Dior' },              clasificacion: 'Diseñador' },   ingresosCrc: 1_104_000, pedidos: 12 },
    { perfume: { id: 'nicho-01', nombre: 'Layton',             marca: { nombre: 'Parfums de Marly' }, clasificacion: 'Nicho' },      ingresosCrc: 925_000,   pedidos: 5 },
    { perfume: { id: 'arabe-01', nombre: 'Khamrah',            marca: { nombre: 'Lattafa' },           clasificacion: 'Arabe' },      ingresosCrc: 715_000,   pedidos: 13 },
    { perfume: { id: 'dis-04',   nombre: 'Bleu de Chanel EDP', marca: { nombre: 'Chanel' },            clasificacion: 'Diseñador' },   ingresosCrc: 630_000,   pedidos: 6 },
  ],
  pedidosRecientes: [
    { id: 'p-001', fechaPedido: new Date(Date.now() - 1 * 3600000).toISOString(),   clienteNombre: 'Andrea Vega',     clienteWhatsapp: '8811-2233', totalCobradoCrc: 185000, estadoPagoSinpe: 'CONFIRMADO', estadoDespacho: 'ENVIADO',    perfume: { nombre: 'Layton',             marca: { nombre: 'Parfums de Marly' }, clasificacion: 'Nicho' } },
    { id: 'p-002', fechaPedido: new Date(Date.now() - 3 * 3600000).toISOString(),   clienteNombre: 'Carlos Mora',     clienteWhatsapp: '7744-5566', totalCobradoCrc: 92000,  estadoPagoSinpe: 'PENDIENTE',  estadoDespacho: 'NO_ENVIADO', perfume: { nombre: 'Sauvage EDP',        marca: { nombre: 'Dior' },              clasificacion: 'Diseñador' } },
    { id: 'p-003', fechaPedido: new Date(Date.now() - 5 * 3600000).toISOString(),   clienteNombre: 'María Solano',    clienteWhatsapp: '8822-7788', totalCobradoCrc: 55000,  estadoPagoSinpe: 'CONFIRMADO', estadoDespacho: 'ENTREGADO',  perfume: { nombre: 'Khamrah',            marca: { nombre: 'Lattafa' },           clasificacion: 'Arabe' } },
    { id: 'p-004', fechaPedido: new Date(Date.now() - 8 * 3600000).toISOString(),   clienteNombre: 'Luis Fernández',  clienteWhatsapp: '6633-9900', totalCobradoCrc: 245000, estadoPagoSinpe: 'CONFIRMADO', estadoDespacho: 'ENVIADO',    perfume: { nombre: 'Interlude Man',      marca: { nombre: 'Amouage' },          clasificacion: 'Nicho' } },
    { id: 'p-005', fechaPedido: new Date(Date.now() - 12 * 3600000).toISOString(),  clienteNombre: 'Sofía Castro',    clienteWhatsapp: '8855-1122', totalCobradoCrc: 105000, estadoPagoSinpe: 'CONFIRMADO', estadoDespacho: 'ENTREGADO',  perfume: { nombre: 'Bleu de Chanel EDP', marca: { nombre: 'Chanel' },            clasificacion: 'Diseñador' } },
    { id: 'p-006', fechaPedido: new Date(Date.now() - 18 * 3600000).toISOString(),  clienteNombre: 'Diego Rojas',     clienteWhatsapp: '7711-4433', totalCobradoCrc: 72000,  estadoPagoSinpe: 'CONFIRMADO', estadoDespacho: 'ENTREGADO',  perfume: { nombre: 'Rose Oud',           marca: { nombre: 'Arabian Oud' },       clasificacion: 'Arabe' } },
    { id: 'p-007', fechaPedido: new Date(Date.now() - 24 * 3600000).toISOString(),  clienteNombre: 'Valeria Ulate',   clienteWhatsapp: '8866-2244', totalCobradoCrc: 220000, estadoPagoSinpe: 'PENDIENTE',  estadoDespacho: 'NO_ENVIADO', perfume: { nombre: 'Waves of Success',   marca: { nombre: 'Xerjoff' },           clasificacion: 'Nicho' } },
    { id: 'p-008', fechaPedido: new Date(Date.now() - 30 * 3600000).toISOString(),  clienteNombre: 'Pablo Navarro',   clienteWhatsapp: '6644-8866', totalCobradoCrc: 65000,  estadoPagoSinpe: 'CONFIRMADO', estadoDespacho: 'ENTREGADO',  perfume: { nombre: 'Eros',               marca: { nombre: 'Versace' },           clasificacion: 'Diseñador' } },
  ],
  tendencia: generarTendencia(),
  inventario: { conStock: 14, sinStock: 2, total: 16 },
};

export function useAnaliticas() {
  const [datos, setDatos] = useState<DatosDashboard | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Simula latencia de red
    const t = setTimeout(() => {
      setDatos(DATOS_SIMULADOS);
      setCargando(false);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  return { datos, cargando };
}
