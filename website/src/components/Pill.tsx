import type { ReactNode } from 'react'

export default function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="eyebrow">
      <span className="h-1.5 w-1.5 rounded-full bg-salmon" aria-hidden="true" />
      {children}
    </span>
  )
}
