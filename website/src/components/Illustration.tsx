// Soft, clay-like SVG stand-ins for the 3D renders in the design references:
// a coin on stepped plinths with a sprout, and a small growing tree.

export function SproutSteps({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 200" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="plinth" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#ECE7F7" />
        </linearGradient>
        <linearGradient id="coin" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#F9D27A" />
          <stop offset="1" stopColor="#E3A43A" />
        </linearGradient>
        <radialGradient id="glow" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#FFF7E6" />
          <stop offset="1" stopColor="var(--color-amber)" stopOpacity="0.25" />
        </radialGradient>
      </defs>
      <ellipse cx="120" cy="182" rx="96" ry="10" fill="var(--color-ink)" opacity="0.07" />
      {/* plinths */}
      <rect x="30" y="130" width="64" height="48" rx="14" fill="var(--color-ink)" />
      <rect x="30" y="124" width="64" height="16" rx="8" fill="url(#plinth)" />
      <rect x="88" y="100" width="64" height="78" rx="14" fill="var(--color-ink)" />
      <rect x="88" y="94" width="64" height="16" rx="8" fill="url(#plinth)" />
      <rect x="146" y="66" width="64" height="112" rx="14" fill="var(--color-ink)" />
      <rect x="146" y="60" width="64" height="16" rx="8" fill="url(#plinth)" />
      {/* glow orb */}
      <circle cx="178" cy="36" r="22" fill="url(#glow)" />
      {/* sprout */}
      <path d="M120 96 C120 80 120 70 120 58" stroke="#5E8C61" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M120 72 C104 70 98 58 100 48 C112 50 120 60 120 72z" fill="#86B38A" />
      <path d="M120 64 C134 60 140 48 138 38 C126 42 120 52 120 64z" fill="#A6CBA4" />
      {/* coin */}
      <ellipse cx="62" cy="116" rx="18" ry="8" fill="#C98C2A" />
      <ellipse cx="62" cy="112" rx="18" ry="8" fill="url(#coin)" />
      <text x="62" y="115.5" textAnchor="middle" fontSize="9" fontWeight="700" fill="#8A5A12" fontFamily="sans-serif">£</text>
      {/* floating coins */}
      <g className="animate-float" style={{ transformOrigin: 'center' }}>
        <ellipse cx="48" cy="70" rx="7" ry="4" fill="url(#coin)" transform="rotate(-25 48 70)" />
        <ellipse cx="206" cy="112" rx="6" ry="3.5" fill="#D9D4EE" transform="rotate(20 206 112)" />
      </g>
    </svg>
  )
}

export function GrowingTree({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 180" className={className} aria-hidden="true">
      <ellipse cx="100" cy="166" rx="74" ry="9" fill="var(--color-ink)" opacity="0.07" />
      <path d="M30 160 Q100 140 170 160 L170 166 Q100 150 30 166z" fill="#FFFFFF" />
      <path d="M96 160 C96 130 92 110 84 92 M100 130 C110 112 122 100 134 92 M98 112 C90 100 76 94 64 92" stroke="var(--color-ink)" strokeWidth="7" strokeLinecap="round" fill="none" />
      <circle cx="80" cy="70" r="26" fill="#A6CBA4" />
      <circle cx="116" cy="62" r="30" fill="#86B38A" />
      <circle cx="140" cy="86" r="20" fill="#A6CBA4" />
      <circle cx="58" cy="90" r="16" fill="#C3DDBF" />
      <circle cx="104" cy="40" r="14" fill="#C3DDBF" />
      <g fill="var(--color-amber)">
        <ellipse cx="72" cy="156" rx="7" ry="3" />
        <ellipse cx="124" cy="158" rx="7" ry="3" />
        <ellipse cx="138" cy="154" rx="6" ry="2.6" />
      </g>
    </svg>
  )
}
