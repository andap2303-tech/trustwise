export default function OptionButton({
  label,
  selected,
  onClick,
  multi = false,
  index,
}: {
  label: string
  selected: boolean
  onClick: () => void
  multi?: boolean
  index: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group flex min-h-14 w-full items-center gap-4 rounded-2xl border-2 px-4 py-3 text-left text-[15px] font-medium transition duration-150 ${
        selected
          ? 'border-ink bg-ink text-white shadow-lift'
          : 'border-line bg-white text-ink hover:border-ink-soft hover:shadow-soft'
      }`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center text-xs font-bold ${
          multi ? 'rounded-lg' : 'rounded-full'
        } ${selected ? 'bg-salmon text-on-accent' : 'bg-sand text-ink-soft'}`}
        aria-hidden="true"
      >
        {selected ? '✓' : String.fromCharCode(65 + index)}
      </span>
      {label}
    </button>
  )
}
