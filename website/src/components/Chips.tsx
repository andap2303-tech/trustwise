import { gbpShort } from '../lib/format'

export default function Chips({
  values,
  current,
  onPick,
}: {
  values: number[]
  current: number | null
  onPick: (v: number) => void
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Quick picks">
      {values.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onPick(v)}
          aria-pressed={current === v}
          className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition ${
            current === v
              ? 'border-ink bg-ink text-white'
              : 'border-line bg-white text-ink-soft hover:border-ink hover:text-ink'
          }`}
        >
          {gbpShort(v)}
        </button>
      ))}
    </div>
  )
}
