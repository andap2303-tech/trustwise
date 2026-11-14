import type { ReactNode } from 'react'

/** iPhone-style frame with status bar and the Trustwise app header. */
export default function PhoneFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-[2.75rem] border-[9px] border-ink bg-cream shadow-lift ${className}`}>
      <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-semibold" aria-hidden="true">
        <span>9:41</span>
        <span className="h-5 w-24 rounded-full bg-ink" />
        <span className="flex gap-1">
          <span className="h-2.5 w-3 rounded-sm bg-ink" />
          <span className="h-2.5 w-5 rounded-sm bg-ink" />
        </span>
      </div>
      {children}
    </div>
  )
}

/** The Trustwise mark: teal circle with a white sprout. */
export function Mark({ className = 'h-7 w-7', light = false }: { className?: string; light?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill={light ? '#FFFFFF' : 'var(--color-violet)'} />
      <path d="M16 25V14" stroke={light ? 'var(--color-violet)' : '#FFFFFF'} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M16 16c-1-4-4-6-8-6 0 4 3 7 8 6z" fill={light ? 'var(--color-violet)' : '#FFFFFF'} />
      <path d="M16 14c1-4 4-6 8-6 0 4-3 7-8 6z" fill={light ? 'var(--color-mint)' : '#FFFFFF'} />
    </svg>
  )
}
