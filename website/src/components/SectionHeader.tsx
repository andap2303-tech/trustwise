import type { ReactNode } from 'react'
import Pill from './Pill'

export default function SectionHeader({
  eyebrow,
  title,
  sub,
  center = false,
}: {
  eyebrow: string
  title: string
  sub?: ReactNode
  center?: boolean
}) {
  return (
    <div className={`mb-10 max-w-2xl space-y-4 ${center ? 'mx-auto text-center' : ''}`}>
      <Pill>{eyebrow}</Pill>
      <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">{title}</h2>
      {sub && <p className="text-base leading-relaxed text-muted">{sub}</p>}
    </div>
  )
}
