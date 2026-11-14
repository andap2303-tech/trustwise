/** Half-circle gauge for a 0–100 score. */
export default function ScoreGauge({
  label,
  value,
  color,
  limiting,
}: {
  label: string
  value: number
  color: string
  limiting: boolean
}) {
  const r = 52
  const len = Math.PI * r
  const v = Math.max(0, Math.min(100, value))
  return (
    <figure className="flex flex-col items-center">
      <svg viewBox="0 0 128 74" className="w-full max-w-[180px]" role="img" aria-label={`${label}: ${Math.round(v)} out of 100`}>
        <path d="M12 66 A52 52 0 0 1 116 66" fill="none" stroke="var(--color-sand)" strokeWidth="12" strokeLinecap="round" />
        <path
          d="M12 66 A52 52 0 0 1 116 66"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${(v / 100) * len} ${len}`}
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
        <text x="64" y="62" textAnchor="middle" className="font-display" fontSize="24" fontWeight="600" fill="var(--color-ink)">
          {Math.round(v)}
        </text>
      </svg>
      <figcaption className="mt-2 text-center text-sm font-semibold">
        {label}
        {limiting && (
          <span className="ml-2 rounded-full bg-salmon-soft px-2 py-0.5 text-xs text-ink">limits you</span>
        )}
      </figcaption>
    </figure>
  )
}
