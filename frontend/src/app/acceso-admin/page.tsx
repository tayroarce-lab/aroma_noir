'use client';

import { useState } from 'react';

export default function PaginaAccesoAdmin() {
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError('');
    const r = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contrasena }),
    }).catch(() => null);
    if (r?.ok) {
      window.location.href = '/admin';
      return;
    }
    setError(r ? 'Contraseña incorrecta.' : 'No se pudo conectar. Intente de nuevo.');
    setEnviando(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-perla px-4">
      <form
        onSubmit={entrar}
        className="w-full max-w-sm bg-hueso border border-arena rounded-lg p-8 shadow-suave"
      >
        <p className="text-dorado text-sm tracking-widest uppercase">Aroma Noir</p>
        <h1 className="font-serif text-3xl text-carbon mt-1 mb-6">Panel de administración</h1>
        <label htmlFor="contrasena" className="block text-sm text-grafito mb-2">
          Contraseña
        </label>
        <input
          id="contrasena"
          type="password"
          autoComplete="current-password"
          autoFocus
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          className="w-full rounded-md border border-arena bg-perla px-3 py-2 text-carbon outline-none focus:border-dorado"
        />
        {error && <p className="text-sm text-red-700 mt-2">{error}</p>}
        <button
          type="submit"
          disabled={enviando || !contrasena}
          className="mt-6 w-full rounded-md bg-carbon text-perla py-2.5 text-sm tracking-wide disabled:opacity-50"
        >
          {enviando ? 'Verificando…' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}
