import type { ReactNode } from 'react'
import Pill from '../components/Pill'

/** Shared shell for the Phase 4 pages (draft content for now). */
export default function StubPage({
  eyebrow,
  title,
  sub,
  children,
}: {
  eyebrow: string
  title: string
  sub?: string
  children: ReactNode
}) {
  return (
    <div className="relative overflow-x-clip">
      <div className="halo -top-32 -right-24 h-96 w-96 bg-lilac/50" />
      <div className="container-page relative py-14 sm:py-20">
        <header className="max-w-2xl space-y-5">
          <Pill>{eyebrow}</Pill>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">{title}</h1>
          {sub && <p className="text-lg leading-relaxed text-ink-soft">{sub}</p>}
        </header>
        <div className="mt-12">{children}</div>
      </div>
    </div>
  )
}
