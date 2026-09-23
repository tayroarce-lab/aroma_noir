'use client';

import { useState, useMemo } from 'react';
import type { PedidoReciente } from '@/modulos/analiticas/tipos/Analiticas.tipos';

// Extendemos con el campo de dirección que el admin necesita ver
export interface PedidoAdmin extends PedidoReciente {
  clienteDireccion?: string;
}

export type FiltroEstadoPago     = 'TODOS' | 'PENDIENTE' | 'CONFIRMADO';
export type FiltroEstadoDespacho = 'TODOS' | 'NO_ENVIADO' | 'ENVIADO' | 'ENTREGADO';

const PEDIDOS_ADMIN: PedidoAdmin[] = [
  { id: 'p-001', fechaPedido: new Date(Date.now() - 0.5*3600000).toISOString(),  clienteNombre: 'Andrea Vega',        clienteWhatsapp: '8811-2233', clienteDireccion: 'Desamparados, 200m norte del parque, casa azul',            totalCobradoCrc: 185000, estadoPagoSinpe: 'CONFIRMADO', estadoDespacho: 'ENVIADO',    perfume: { nombre: 'Layton',             marca: { nombre: 'Parfums de Marly' }, clasificacion: 'Nicho' } },
  { id: 'p-002', fechaPedido: new Date(Date.now() - 2*3600000).toISOString(),    clienteNombre: 'Carlos Mora',         clienteWhatsapp: '7744-5566', clienteDireccion: 'San José, Sabana Norte, Edif. Plaza 200, apt 4B',          totalCobradoCrc: 92000,  estadoPagoSinpe: 'PENDIENTE',  estadoDespacho: 'NO_ENVIADO', perfume: { nombre: 'Sauvage EDP',        marca: { nombre: 'Dior' },              clasificacion: 'Diseñador' } },
  { id: 'p-003', fechaPedido: new Date(Date.now() - 4*3600000).toISOString(),    clienteNombre: 'María Solano',        clienteWhatsapp: '8822-7788', clienteDireccion: 'Cartago, Tres Ríos, contiguo a la iglesia, portón negro',  totalCobradoCrc: 55000,  estadoPagoSinpe: 'CONFIRMADO', estadoDespacho: 'ENTREGADO',  perfume: { nombre: 'Khamrah',            marca: { nombre: 'Lattafa' },           clasificacion: 'Arabe' } },
  { id: 'p-004', fechaPedido: new Date(Date.now() - 7*3600000).toISOString(),    clienteNombre: 'Luis Fernández',      clienteWhatsapp: '6633-9900', clienteDireccion: 'Heredia, San Pablo, 100m sur del supermercado BM',        totalCobradoCrc: 245000, estadoPagoSinpe: 'CONFIRMADO', estadoDespacho: 'ENVIADO',    perfume: { nombre: 'Interlude Man',      marca: { nombre: 'Amouage' },          clasificacion: 'Nicho' } },
  { id: 'p-005', fechaPedido: new Date(Date.now() - 11*3600000).toISOString(),   clienteNombre: 'Sofía Castro',        clienteWhatsapp: '8855-1122', clienteDireccion: 'Escazú, Trejos Montealegre, casa 14B',                    totalCobradoCrc: 105000, estadoPagoSinpe: 'CONFIRMADO', estadoDespacho: 'ENTREGADO',  perfume: { nombre: 'Bleu de Chanel EDP', marca: { nombre: 'Chanel' },            clasificacion: 'Diseñador' } },
  { id: 'p-006', fechaPedido: new Date(Date.now() - 17*3600000).toISOString(),   clienteNombre: 'Diego Rojas',         clienteWhatsapp: '7711-4433', clienteDireccion: 'Alajuela centro, 300m este de la catedral',               totalCobradoCrc: 72000,  estadoPagoSinpe: 'CONFIRMADO', estadoDespacho: 'ENTREGADO',  perfume: { nombre: 'Rose Oud',           marca: { nombre: 'Arabian Oud' },       clasificacion: 'Arabe' } },
  { id: 'p-007', fechaPedido: new Date(Date.now() - 23*3600000).toISOString(),   clienteNombre: 'Valeria Ulate',       clienteWhatsapp: '8866-2244', clienteDireccion: 'San José, Moravia, El Jardín, de la iglesia 200m norte', totalCobradoCrc: 220000, estadoPagoSinpe: 'PENDIENTE',  estadoDespacho: 'NO_ENVIADO', perfume: { nombre: 'Waves of Success',   marca: { nombre: 'Xerjoff' },           clasificacion: 'Nicho' } },
  { id: 'p-008', fechaPedido: new Date(Date.now() - 29*3600000).toISOString(),   clienteNombre: 'Pablo Navarro',       clienteWhatsapp: '6644-8866', clienteDireccion: 'Santa Ana, Pozos, urbanización La Colina, casa 22',      totalCobradoCrc: 65000,  estadoPagoSinpe: 'CONFIRMADO', estadoDespacho: 'ENTREGADO',  perfume: { nombre: 'Eros',               marca: { nombre: 'Versace' },           clasificacion: 'Diseñador' } },
  { id: 'p-009', fechaPedido: new Date(Date.now() - 36*3600000).toISOString(),   clienteNombre: 'Fernanda Acosta',     clienteWhatsapp: '8833-5577', clienteDireccion: 'Curridabat, Granadilla, Res. El Roble, casa 7',          totalCobradoCrc: 155000, estadoPagoSinpe: 'CONFIRMADO', estadoDespacho: 'NO_ENVIADO', perfume: { nombre: 'Feminité du Bois',   marca: { nombre: 'Serge Lutens' },      clasificacion: 'Nicho' } },
  { id: 'p-010', fechaPedido: new Date(Date.now() - 48*3600000).toISOString(),   clienteNombre: 'José Quirós',         clienteWhatsapp: '6622-3344', clienteDireccion: 'Pérez Zeledón, San Isidro, 100m oeste del hospital',    totalCobradoCrc: 48000,  estadoPagoSinpe: 'PENDIENTE',  estadoDespacho: 'NO_ENVIADO', perfume: { nombre: 'Oud Mood',           marca: { nombre: 'Lattafa' },           clasificacion: 'Arabe' } },
];

export function usePedidosAdmin() {
  const [pedidos, setPedidos] = useState<PedidoAdmin[]>(PEDIDOS_ADMIN);
  const [filtroPago,     setFiltroPago]     = useState<FiltroEstadoPago>('TODOS');
  const [filtroDespacho, setFiltroDespacho] = useState<FiltroEstadoDespacho>('TODOS');
  const [busqueda,       setBusqueda]       = useState('');

  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter((p) => {
      const coincidePago     = filtroPago     === 'TODOS' || p.estadoPagoSinpe === filtroPago;
      const coincideDespacho = filtroDespacho === 'TODOS' || p.estadoDespacho  === filtroDespacho;
      const termino = busqueda.toLowerCase();
      const coincideBusqueda = !busqueda
        || p.clienteNombre.toLowerCase().includes(termino)
        || p.clienteWhatsapp.includes(termino)
        || p.perfume.nombre.toLowerCase().includes(termino)
        || p.perfume.marca.nombre.toLowerCase().includes(termino);

      return coincidePago && coincideDespacho && coincideBusqueda;
    });
  }, [pedidos, filtroPago, filtroDespacho, busqueda]);

  // Simulación de actualización de estado (en producción → PATCH /api/v1/pedidos/:id/estado)
  const actualizarEstadoPago = (id: string, estado: 'PENDIENTE' | 'CONFIRMADO') => {
    setPedidos((prev) =>
      prev.map((p) => p.id === id ? { ...p, estadoPagoSinpe: estado } : p),
    );
  };

  const actualizarEstadoDespacho = (
    id: string,
    estado: 'NO_ENVIADO' | 'ENVIADO' | 'ENTREGADO',
  ) => {
    setPedidos((prev) =>
      prev.map((p) => p.id === id ? { ...p, estadoDespacho: estado } : p),
    );
  };

  const pendientesAccion = pedidos.filter(
    (p) => p.estadoPagoSinpe === 'PENDIENTE' ||
           (p.estadoPagoSinpe === 'CONFIRMADO' && p.estadoDespacho === 'NO_ENVIADO'),
  ).length;

  return {
    pedidos: pedidosFiltrados,
    total: pedidosFiltrados.length,
    pendientesAccion,
    filtroPago,     setFiltroPago,
    filtroDespacho, setFiltroDespacho,
    busqueda,       setBusqueda,
    actualizarEstadoPago,
    actualizarEstadoDespacho,
  };
}
