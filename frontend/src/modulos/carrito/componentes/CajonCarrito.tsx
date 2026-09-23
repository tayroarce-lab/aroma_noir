'use client';

import { useState, useEffect } from 'react';
import { useCarritoEstado } from '../estado/useCarritoEstado';
import { formatearCRC } from '@/lib/formateadores';
import {
  generarEnlaceWhatsapp,
  validarDatosCliente,
  type DatosCliente,
} from '../utilidades/generarEnlaceWhatsapp';

type PasoCheckout = 'carrito' | 'datos' | 'confirmacion';

export default function CajonCarrito() {
  const {
    items,
    abierto,
    cerrarCarrito,
    eliminar,
    actualizarCantidad,
    vaciar,
    total,
    cantidadItems,
  } = useCarritoEstado();

  const [paso, setPaso] = useState<PasoCheckout>('carrito');
  const [cliente, setCliente] = useState<DatosCliente>({
    nombre: '',
    whatsapp: '',
    direccion: '',
  });
  const [errores, setErrores] = useState<string[]>([]);
  const [montado, setMontado] = useState(false);

  // Evitar hydration mismatch con Zustand persist
  useEffect(() => { setMontado(true); }, []);
  // Resetear paso cuando se cierra
  useEffect(() => { if (!abierto) { setTimeout(() => setPaso('carrito'), 400); } }, [abierto]);

  if (!montado) return null;

  const totalCarrito = total();
  const cantidad = cantidadItems();

  const handleFinalizarPedido = () => {
    const erroresValidacion = validarDatosCliente(cliente);
    if (erroresValidacion.length > 0) {
      setErrores(erroresValidacion);
      return;
    }
    setErrores([]);
    setPaso('confirmacion');
  };

  const handleIrAWhatsApp = () => {
    const enlace = generarEnlaceWhatsapp(items, cliente);
    vaciar();
    cerrarCarrito();
    window.open(enlace, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Overlay oscuro */}
      {abierto && (
        <div
          className="cajon-overlay animar-fadein"
          onClick={cerrarCarrito}
          aria-hidden="true"
        />
      )}

      {/* Cajón lateral */}
      <aside
        className={`cajon ${abierto ? 'cajon-abierto' : ''}`}
        aria-label="Carrito de compras"
        aria-hidden={!abierto}
      >
        {/* ─── Encabezado ─────────────────────────────────── */}
        <div className="cajon-encabezado">
          <div className="cajon-titulo-grupo">
            <h2 className="cajon-titulo">
              {paso === 'carrito' && 'Tu Selección'}
              {paso === 'datos' && 'Tus Datos'}
              {paso === 'confirmacion' && 'Confirmar Pedido'}
            </h2>
            {paso === 'carrito' && cantidad > 0 && (
              <span className="cajon-badge">{cantidad}</span>
            )}
          </div>
          <button onClick={cerrarCarrito} className="cajon-cerrar" aria-label="Cerrar carrito">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="cajon-cerrar-icono">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ─── PASO 1: Carrito ─────────────────────────────── */}
        {paso === 'carrito' && (
          <>
            {items.length === 0 ? (
              <div className="cajon-vacio">
                <div className="cajon-vacio-icono">
                  <svg viewBox="0 0 80 80" fill="none">
                    <path d="M20 22h40l-5 30H25L20 22z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <circle cx="32" cy="58" r="4" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="52" cy="58" r="4" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M10 14h6l4 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="cajon-vacio-texto">Tu carrito está vacío</p>
                <p className="cajon-vacio-subtexto">Explora nuestras fragancias y agrega tus favoritas.</p>
                <button onClick={cerrarCarrito} className="cajon-btn-explorar">Explorar catálogo</button>
              </div>
            ) : (
              <>
                {/* Lista de items */}
                <div className="cajon-items">
                  {items.map((item) => (
                    <div key={item.perfume.id} className="cajon-item animar-entrada">
                      {/* Miniatura */}
                      <div className="cajon-item-imagen">
                        {item.perfume.imagenUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.perfume.imagenUrl} alt={item.perfume.nombre} />
                        ) : (
                          <div className="cajon-item-placeholder">
                            <svg viewBox="0 0 40 40" fill="none">
                              <ellipse cx="20" cy="28" rx="11" ry="9" stroke="currentColor" strokeWidth="1.2" />
                              <rect x="15" y="12" width="10" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                              <path d="M18 17 Q20 10 22 17" stroke="currentColor" strokeWidth="1.2" fill="none" />
                              <line x1="20" y1="6" x2="20" y2="12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="cajon-item-info">
                        <p className="cajon-item-marca">{item.perfume.marca.nombre}</p>
                        <p className="cajon-item-nombre">{item.perfume.nombre}</p>
                        <p className="cajon-item-detalle">
                          {item.perfume.concentracion} · {item.perfume.volumenMl}ml
                        </p>
                        <div className="cajon-item-footer">
                          {/* Cantidad */}
                          <div className="cajon-cantidad">
                            <button
                              onClick={() => actualizarCantidad(item.perfume.id, item.cantidad - 1)}
                              className="cajon-cantidad-btn"
                              aria-label="Disminuir cantidad"
                            >−</button>
                            <span className="cajon-cantidad-valor">{item.cantidad}</span>
                            <button
                              onClick={() => actualizarCantidad(item.perfume.id, item.cantidad + 1)}
                              className="cajon-cantidad-btn"
                              aria-label="Aumentar cantidad"
                            >+</button>
                          </div>
                          <p className="cajon-item-precio">
                            {formatearCRC(item.perfume.precioVentaCrc * item.cantidad)}
                          </p>
                        </div>
                      </div>

                      {/* Eliminar */}
                      <button
                        onClick={() => eliminar(item.perfume.id)}
                        className="cajon-item-eliminar"
                        aria-label={`Eliminar ${item.perfume.nombre}`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Resumen y acción */}
                <div className="cajon-resumen">
                  <div className="cajon-divisor-dorado" />
                  <div className="cajon-total-fila">
                    <span className="cajon-total-label">Total del pedido</span>
                    <span className="cajon-total-valor">{formatearCRC(totalCarrito)}</span>
                  </div>
                  <p className="cajon-sinpe-nota">
                    💳 Pago por SINPE Móvil — Te confirmamos el número al chat.
                  </p>
                  <button
                    onClick={() => setPaso('datos')}
                    className="cajon-btn-continuar"
                  >
                    Continuar al checkout
                    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16 }}>
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button onClick={vaciar} className="cajon-btn-vaciar">
                    Vaciar carrito
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* ─── PASO 2: Datos del cliente ───────────────────── */}
        {paso === 'datos' && (
          <div className="cajon-formulario">
            <button onClick={() => setPaso('carrito')} className="cajon-btn-volver">
              ← Volver al carrito
            </button>

            <p className="cajon-form-descripcion">
              Ingresa tus datos para completar el pedido. Te contactaremos por WhatsApp para confirmar el pago.
            </p>

            <div className="form-campo">
              <label className="form-etiqueta" htmlFor="cliente-nombre">
                Nombre completo *
              </label>
              <input
                id="cliente-nombre"
                type="text"
                placeholder="Ej: María González"
                value={cliente.nombre}
                onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
                className="form-input"
                autoComplete="name"
              />
            </div>

            <div className="form-campo">
              <label className="form-etiqueta" htmlFor="cliente-whatsapp">
                Número de WhatsApp *
              </label>
              <input
                id="cliente-whatsapp"
                type="tel"
                placeholder="Ej: 8888-8888"
                value={cliente.whatsapp}
                onChange={(e) => setCliente({ ...cliente, whatsapp: e.target.value })}
                className="form-input"
                autoComplete="tel"
              />
            </div>

            <div className="form-campo">
              <label className="form-etiqueta" htmlFor="cliente-direccion">
                Dirección de entrega *
              </label>
              <textarea
                id="cliente-direccion"
                placeholder="Ej: San José, Desamparados, 300m norte del parque central, casa azul con portón negro"
                value={cliente.direccion}
                onChange={(e) => setCliente({ ...cliente, direccion: e.target.value })}
                className="form-textarea"
                rows={3}
                autoComplete="street-address"
              />
            </div>

            {/* Errores de validación */}
            {errores.length > 0 && (
              <div className="form-errores">
                {errores.map((err, i) => (
                  <p key={i} className="form-error">⚠ {err}</p>
                ))}
              </div>
            )}

            <div className="cajon-resumen-mini">
              <span className="cajon-resumen-mini-texto">
                {cantidad} {cantidad === 1 ? 'artículo' : 'artículos'}
              </span>
              <span className="cajon-resumen-mini-total">{formatearCRC(totalCarrito)}</span>
            </div>

            <button onClick={handleFinalizarPedido} className="cajon-btn-continuar">
              Revisar pedido
              <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16 }}>
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* ─── PASO 3: Confirmación ────────────────────────── */}
        {paso === 'confirmacion' && (
          <div className="cajon-confirmacion">
            <button onClick={() => setPaso('datos')} className="cajon-btn-volver">
              ← Editar datos
            </button>

            <div className="confirmacion-resumen">
              <h3 className="confirmacion-subtitulo">Resumen del pedido</h3>
              {items.map((item) => (
                <div key={item.perfume.id} className="confirmacion-fila">
                  <span className="confirmacion-nombre">
                    {item.cantidad}× {item.perfume.marca.nombre} {item.perfume.nombre}
                  </span>
                  <span className="confirmacion-precio">
                    {formatearCRC(item.perfume.precioVentaCrc * item.cantidad)}
                  </span>
                </div>
              ))}
              <div className="confirmacion-total-fila">
                <span>Total</span>
                <span className="confirmacion-total">{formatearCRC(totalCarrito)}</span>
              </div>
            </div>

            <div className="confirmacion-cliente">
              <h3 className="confirmacion-subtitulo">Datos de entrega</h3>
              <p className="confirmacion-dato"><strong>Nombre:</strong> {cliente.nombre}</p>
              <p className="confirmacion-dato"><strong>WhatsApp:</strong> {cliente.whatsapp}</p>
              <p className="confirmacion-dato"><strong>Dirección:</strong> {cliente.direccion}</p>
            </div>

            <div className="confirmacion-aviso">
              <span className="confirmacion-aviso-icono">💬</span>
              <p className="confirmacion-aviso-texto">
                Al presionar el botón se abrirá WhatsApp con tu pedido completo listo para enviarnos. El pago se coordina por ese mismo chat.
              </p>
            </div>

            <button onClick={handleIrAWhatsApp} className="cajon-btn-whatsapp">
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Finalizar por WhatsApp
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
