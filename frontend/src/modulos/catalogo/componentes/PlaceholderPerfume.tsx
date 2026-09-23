interface PropsPlaceholderPerfume {
  marca: string;
  className?: string;
}

export default function PlaceholderPerfume({ marca, className = '' }: PropsPlaceholderPerfume) {
  return (
    <div className={`tarjeta-imagen-placeholder ${className}`}>
      <div className="tarjeta-placeholder-icono">
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <ellipse cx="40" cy="55" rx="22" ry="18" stroke="currentColor" strokeWidth="1.5" />
          <rect x="30" y="22" width="20" height="10" rx="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M36 32 Q40 18 44 32" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <line x1="40" y1="10" x2="40" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="40" cy="55" rx="12" ry="8" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        </svg>
      </div>
      <span className="tarjeta-placeholder-marca">{marca}</span>
    </div>
  );
}
