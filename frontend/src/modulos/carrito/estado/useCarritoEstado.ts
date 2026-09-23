import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ItemCarrito, Perfume } from '@/modulos/catalogo/tipos/Perfume.tipos';

interface EstadoCarrito {
  // Estado
  items: ItemCarrito[];
  abierto: boolean;

  // Acciones — Carrito
  agregar: (perfume: Perfume) => void;
  eliminar: (perfumeId: string) => void;
  actualizarCantidad: (perfumeId: string, cantidad: number) => void;
  vaciar: () => void;

  // Acciones — UI
  abrirCarrito: () => void;
  cerrarCarrito: () => void;
  alternarCarrito: () => void;

  // Getters computados
  total: () => number;
  cantidadItems: () => number;
}

export const useCarritoEstado = create<EstadoCarrito>()(
  persist(
    (set, get) => ({
      items: [],
      abierto: false,

      // ─── Agregar al carrito ──────────────────────────────────────
      agregar: (perfume: Perfume) => {
        set((estado) => {
          const existente = estado.items.find(
            (item) => item.perfume.id === perfume.id,
          );

          if (existente) {
            // Incrementar cantidad si ya existe
            return {
              items: estado.items.map((item) =>
                item.perfume.id === perfume.id
                  ? { ...item, cantidad: item.cantidad + 1 }
                  : item,
              ),
              abierto: true, // Abrir el cajón al agregar
            };
          }

          return {
            items: [...estado.items, { perfume, cantidad: 1 }],
            abierto: true,
          };
        });
      },

      // ─── Eliminar del carrito ────────────────────────────────────
      eliminar: (perfumeId: string) => {
        set((estado) => ({
          items: estado.items.filter((item) => item.perfume.id !== perfumeId),
        }));
      },

      // ─── Actualizar cantidad ─────────────────────────────────────
      actualizarCantidad: (perfumeId: string, cantidad: number) => {
        if (cantidad <= 0) {
          get().eliminar(perfumeId);
          return;
        }
        set((estado) => ({
          items: estado.items.map((item) =>
            item.perfume.id === perfumeId ? { ...item, cantidad } : item,
          ),
        }));
      },

      // ─── Vaciar carrito ──────────────────────────────────────────
      vaciar: () => set({ items: [] }),

      // ─── Control de UI ───────────────────────────────────────────
      abrirCarrito:    () => set({ abierto: true }),
      cerrarCarrito:   () => set({ abierto: false }),
      alternarCarrito: () => set((e) => ({ abierto: !e.abierto })),

      // ─── Getters computados ──────────────────────────────────────
      total: () =>
        get().items.reduce(
          (acc, item) => acc + item.perfume.precioVentaCrc * item.cantidad,
          0,
        ),

      cantidadItems: () =>
        get().items.reduce((acc, item) => acc + item.cantidad, 0),
    }),
    {
      name: 'luxeparfums-carrito', // clave en localStorage
      partialize: (state) => ({ items: state.items }), // Solo persiste items, no el estado del cajón
    },
  ),
);
