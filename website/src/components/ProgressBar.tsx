import { SECTIONS, type Section } from '../content/questions'

/** Segmented progress bar: one segment per section, filling as you go. */
export default function ProgressBar({
  section,
  sectionProgress,
  step,
  total,
}: {
  section: Section
  /** 0–1 progress inside the current section */
  sectionProgress: number
  step: number
  total: number
}) {
  const current = SECTIONS.indexOf(section)
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold text-muted">
        <span className="uppercase tracking-wider text-ink-soft">{section}</span>
        <span>
          Step {step} of {total}
        </span>
      </div>
      <div
        className="flex gap-1.5"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={step}
        aria-label={`Step ${step} of ${total}`}
      >
        {SECTIONS.map((s, i) => {
          const fill = i < current ? 1 : i > current ? 0 : sectionProgress
          return (
            <span key={s} className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
              <span
                className="block h-full rounded-full bg-ink transition-[width] duration-500"
                style={{ width: `${fill * 100}%` }}
              />
            </span>
          )
        })}
      </div>
    </div>
  )
}
