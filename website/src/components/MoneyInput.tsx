import { useEffect, useRef } from 'react'
import { currencySymbol } from '../lib/format'

/** Big numeric input with a currency prefix (€ or £). Stores the raw text; parent validates. */
export default function MoneyInput({
  id,
  value,
  onChange,
  onSubmit,
  invalid,
  describedBy,
  label,
  suffix,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  invalid: boolean
  describedBy?: string
  label: string
  suffix?: string
}) {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    ref.current?.focus({ preventScroll: true })
  }, [id])

  return (
    <div
      className={`flex items-center gap-2 rounded-2xl border-2 bg-white px-5 py-3 transition focus-within:border-ink ${
        invalid ? 'border-loss' : 'border-line'
      }`}
    >
      <span className="font-display text-4xl font-semibold text-muted" aria-hidden="true">
        {currencySymbol()}
      </span>
      <input
        ref={ref}
        id={id}
        aria-label={label}
        inputMode="numeric"
        autoComplete="off"
        placeholder="0"
        value={value ? Number(value).toLocaleString('en-GB') : ''}
        onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ''))}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className="w-full bg-transparent font-display text-4xl font-semibold tracking-tight outline-none placeholder:text-line sm:text-[2.75rem]"
        style={{ outline: 'none' }}
      />
      {suffix && <span className="shrink-0 text-sm font-medium text-muted">{suffix}</span>}
    </div>
  )
}
