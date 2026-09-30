'use client';

import { useCallback, useEffect, useState } from 'react';
import type { PedidoPanel } from '../tipos/Pedido.tipos';

const REFRESCO_MS = 60_000;

/** Carga los pedidos reales desde /api/admin/pedidos y los refresca cada minuto. */
export function usePedidosPanel() {
  const [pedidos, setPedidos] = useState<PedidoPanel[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    try {
      const r = await fetch('/api/admin/pedidos', { cache: 'no-store' });
      if (r.status === 401) {
        window.location.href = '/acceso-admin';
        return;
      }
      if (!r.ok) throw new Error();
      const datos = await r.json();
      setPedidos(datos.pedidos ?? []);
      setError(null);
    } catch {
      setError('No se pudieron cargar los pedidos. Reintentando…');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    const inicial = setTimeout(cargar, 0);
    const id = setInterval(cargar, REFRESCO_MS);
    return () => {
      clearTimeout(inicial);
      clearInterval(id);
    };
  }, [cargar]);

  return { pedidos, cargando, error, recargar: cargar };
}
