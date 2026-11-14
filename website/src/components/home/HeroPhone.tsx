import { useRef, useState } from 'react'
import { EXAMPLE } from '../../content/questions'
import { ALLOC_COLORS, runEngine } from '../../lib/engine'
import { gbp, gbpShort, pct } from '../../lib/format'
import DraggableChip from './DraggableChip'
import PhoneFrame, { Mark } from './PhoneFrame'

const ex = runEngine(EXAMPLE)

/** Hero: phone mock of the results screen + chips you can drag around. */
export default function HeroPhone() {
  const bounds = useRef<HTMLDivElement>(null)
  const [order, setOrder] = useState([0, 1, 2, 3])
  const top = (i: number) => setOrder((o) => [...o.filter((x) => x !== i), i])
  const z = (i: number) => 10 + order.indexOf(i)

  return (
    <div ref={bounds} className="relative mx-auto h-[560px] w-full max-w-[460px]">
      <PhoneFrame className="absolute left-1/2 top-2 w-[280px] -translate-x-1/2">
        <div className="space-y-3 px-4 pb-6 pt-2">
          <div className="flex items-center gap-2">
            <Mark className="h-6 w-6" />
            <span className="font-display text-sm font-bold">TRUST<span className="text-violet">WISE</span></span>
          </div>
          <div className="rounded-2xl bg-ink p-4 text-white">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-lilac">{EXAMPLE.charityName}</p>
            <p className="mt-1 font-display text-3xl font-bold">{gbpShort(ex.investable)}</p>
            <p className="text-[11px] text-white/70">can be invested for the long term</p>
          </div>
          <div className="rounded-2xl bg-white p-3 shadow-soft">
            <p className="text-[11px] font-semibold text-muted">Balanced portfolio</p>
            <div className="mt-2 flex h-3 overflow-hidden rounded-full">
              {ex.allocation.map((a) => (
                <span key={a.name} style={{ width: `${a.weight * 100}%`, background: ALLOC_COLORS[a.name] }} />
              ))}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
              {ex.allocation.map((a) => (
                <span key={a.name} className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm" style={{ background: ALLOC_COLORS[a.name] }} />
                  {a.name} {pct(a.weight)}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-lavender p-3">
              <p className="text-[10px] font-semibold text-muted">Expected</p>
              <p className="font-display text-lg font-bold text-violet">{pct(ex.stats.er, 1)}</p>
            </div>
            <div className="rounded-2xl bg-salmon-soft p-3">
              <p className="text-[10px] font-semibold text-muted">Bad year</p>
              <p className="font-display text-lg font-bold text-loss">{gbpShort(ex.badYear)}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-white p-3 text-[11px]">
            <p className="font-semibold">Board Report ready ✓</p>
            <p className="text-muted">CC14 · CC19 checklist included</p>
          </div>
        </div>
      </PhoneFrame>

      <DraggableChip boundsRef={bounds} className="left-0 top-16" zIndex={z(0)} onGrab={() => top(0)}>
        <div className="rounded-2xl bg-white px-4 py-3 shadow-lift">
          <p className="text-[11px] font-semibold text-muted">Cash in larger charities</p>
          <p className="font-display text-xl font-bold">£31bn</p>
        </div>
      </DraggableChip>
      <DraggableChip boundsRef={bounds} className="right-0 top-40" floatDelay="1.2s" zIndex={z(1)} onGrab={() => top(1)}>
        <div className="rounded-full bg-violet px-4 py-2.5 text-sm font-semibold text-white shadow-lift">CC14 duties ✓</div>
      </DraggableChip>
      <DraggableChip boundsRef={bounds} className="bottom-24 left-2" floatDelay="2.1s" zIndex={z(2)} onGrab={() => top(2)}>
        <div className="rounded-2xl bg-amber-soft px-4 py-3 shadow-lift ring-1 ring-amber/40">
          <p className="text-[11px] font-semibold text-muted">Fund costs</p>
          <p className="font-display text-xl font-bold">~0.10%</p>
        </div>
      </DraggableChip>
      <DraggableChip boundsRef={bounds} className="bottom-8 right-2" floatDelay="0.6s" zIndex={z(3)} onGrab={() => top(3)}>
        <div className="rounded-2xl bg-ink px-4 py-3 text-white shadow-lift">
          <p className="text-[11px] font-semibold text-white/70">vs bank, per year</p>
          <p className="font-display text-xl font-bold text-mint">+{gbp(ex.yearlyGain)}</p>
        </div>
      </DraggableChip>
    </div>
  )
}
