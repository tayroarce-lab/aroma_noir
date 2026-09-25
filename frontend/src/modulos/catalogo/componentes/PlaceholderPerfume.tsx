interface PropsPlaceholderPerfume {
  marca: string;
  className?: string;
  compacto?: boolean;
}

export default function PlaceholderPerfume({
  marca,
  className = '',
  compacto = false,
}: PropsPlaceholderPerfume) {
  if (compacto) {
    return (
      <div className={`cajon-item-placeholder ${className}`.trim()} aria-hidden="true">
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: 28, height: 28, color: 'var(--color-dorado)' }}
        >
          <ellipse cx="20" cy="28" rx="11" ry="9" stroke="currentColor" strokeWidth="1.3" />
          <rect x="15" y="12" width="10" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M18 17 Q20 10 22 17" stroke="currentColor" strokeWidth="1.3" fill="none" />
          <line x1="20" y1="6" x2="20" y2="12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`tarjeta-imagen-placeholder ${className}`.trim()}
      style={{
        border: '1px solid rgba(201, 138, 59, 0.25)',
      }}
      aria-hidden="true"
    >
      <div className="tarjeta-placeholder-icono" style={{ color: 'var(--color-dorado)' }}>
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="40" cy="55" rx="22" ry="18" stroke="currentColor" strokeWidth="1.5" />
          <rect x="30" y="22" width="20" height="10" rx="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M36 32 Q40 18 44 32" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <line x1="40" y1="10" x2="40" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="40" cy="55" rx="12" ry="8" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        </svg>
      </div>
      <span
        className="tarjeta-placeholder-marca"
        style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-dorado)' }}
      >
        {marca}
      </span>
    </div>
  );
}
