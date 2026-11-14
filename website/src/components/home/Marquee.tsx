import { Mark } from './PhoneFrame'

/** Scrolling brand band: the Trustwise mark between short brand phrases; the last one is the payoff. */
export default function Marquee({ items }: { items: string[] }) {
  const payoff = items[items.length - 1]
  const row = [...items, ...items]
  return (
    <div className="overflow-hidden bg-ink py-4 text-white" aria-hidden="true">
      <div className="flex w-max animate-marquee items-center gap-8">
        {[...row, ...row].map((t, i) => (
          <span key={i} className={`flex items-center gap-8 font-display text-xl font-semibold whitespace-nowrap sm:text-2xl ${t === payoff ? 'text-salmon' : ''}`}>
            {t}
            <Mark className="h-6 w-6" light />
          </span>
        ))}
      </div>
    </div>
  )
}
