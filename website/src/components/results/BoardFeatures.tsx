import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { EngineResult } from '../../lib/engine'
import { gbpShort, pct } from '../../lib/format'
import type { Answers } from '../../lib/types'
import { usePlus } from '../../state/PlusContext'
import Icon from '../Icon'

/** Board plan features: unlocked by the demo toggle on /pricing (no payment). */
export default function BoardFeatures({ a, r }: { a: Answers; r: EngineResult }) {
  const { isPlusDemo } = usePlus()
  return (
    <section className="mt-14">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">✦ Board plan · £1,800 / year</span>
          <h2 className="mt-3 text-3xl font-semibold">For boards that want to go further</h2>
        </div>
        {!isPlusDemo && (
          <Link to="/pricing" className="btn-plus">
            Unlock the demo <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Locked locked={!isPlusDemo} title="Sector Map" icon="map">
          <SectorMap a={a} r={r} />
        </Locked>
        <Locked locked={!isPlusDemo} title="Rebalancing monitor" icon="bell">
          <Rebalance r={r} />
        </Locked>
        <Locked locked={!isPlusDemo} title="What-if: a bad year next year" icon="storm">
          <WhatIf r={r} />
        </Locked>
        <Locked locked={!isPlusDemo} title="Coming in Year 3: Board+ Custom" icon="leaf">
          <p className="text-sm leading-relaxed text-ink-soft">
            Custom ethical portfolios built with an FCA-authorised partner: your exclusions ({a.ethics.toLowerCase()}),
            your income needs, your benchmark. Regulated advice, so it comes after the core product.
          </p>
          <p className="mt-3 text-xs font-semibold text-muted">Upside — not included in our financial plan.</p>
        </Locked>
      </div>
    </section>
  )
}

function Locked({ locked, title, icon, children }: { locked: boolean; title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="card relative overflow-hidden p-7">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-lavender text-violet">
          <Icon name={icon} className="h-5 w-5" />
        </span>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className={locked ? 'pointer-events-none select-none blur-[5px]' : ''} aria-hidden={locked}>
        {children}
      </div>
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/30">
          <span className="flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white shadow-lift">
            <Icon name="lock" className="h-4 w-4" /> Board plan
          </span>
        </div>
      )}
    </div>
  )
}

/** Where the charity sits among the K-means clusters (income vs spending ratio). */
function SectorMap({ a, r }: { a: Answers; r: EngineResult }) {
  const W = 320, H = 170
  const x = (inc: number) => 20 + ((Math.log10(Math.max(inc, 1e4)) - 4) / 4) * (W - 40) // £10k → £100m
  const y = (ratio: number) => H - 20 - Math.min(1, Math.max(0, (ratio - 0.6) / 0.7)) * (H - 40) // 0.6 → 1.3
  const clusters = [
    { cx: x(60_000), cy: y(0.95), rx: 46, ry: 36, c: 'var(--color-sand)', l: 'Small, local' },
    { cx: x(1_800_000), cy: y(0.93), rx: 62, ry: 34, c: 'var(--color-lilac)', l: 'Our target: 8,159' },
    { cx: x(25_000_000), cy: y(0.98), rx: 40, ry: 30, c: 'var(--color-amber-soft)', l: 'Large' },
  ]
  const ratio = a.spending / a.income
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Sector map of UK charities">
        {clusters.map((c) => (
          <g key={c.l}>
            <ellipse cx={c.cx} cy={c.cy} rx={c.rx} ry={c.ry} fill={c.c} opacity={0.9} />
            <text x={c.cx} y={c.cy - c.ry - 4} textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--color-ink-soft)">{c.l}</text>
          </g>
        ))}
        <circle cx={x(a.income)} cy={y(ratio)} r="6" fill="var(--color-salmon)" stroke="#fff" strokeWidth="2" />
        <text x={x(a.income) + 9} y={y(ratio) + 3} fontSize="9" fontWeight="700" fill="var(--color-ink)">You</text>
        <text x={W / 2} y={H - 3} textAnchor="middle" fontSize="8" fill="var(--color-muted)">Income (log scale) →</text>
      </svg>
      <p className="mt-2 text-sm text-ink-soft">
        {r.inTarget
          ? `You sit in our target group: 8,159 charities with £500k–£10m income and a similar spending pattern (K-means on the Charity Commission register).`
          : 'You sit outside our core group (£500k–£10m). The analysis still applies, but compare with care.'}{' '}
        Spending ratio: {pct(ratio)} of income.
      </p>
    </div>
  )
}

function Rebalance({ r }: { r: EngineResult }) {
  const drift = r.allocation.map((x, i) => ({ ...x, now: Math.max(0, x.weight + [0.04, -0.02, 0.01, -0.01, -0.02][i % 5]) }))
  return (
    <div>
      <ul className="space-y-2 text-sm">
        {drift.map((d) => {
          const off = d.now - d.weight
          return (
            <li key={d.name} className="flex items-center justify-between">
              <span>{d.name}</span>
              <span className="tabular-nums text-muted">
                target {pct(d.weight)} · now {pct(d.now)}{' '}
                <b className={Math.abs(off) > 0.03 ? 'text-loss' : 'text-gain'}>{Math.abs(off) > 0.03 ? 'rebalance' : 'ok'}</b>
              </span>
            </li>
          )
        })}
      </ul>
      <p className="mt-3 text-xs text-muted">Illustrative drift. Alerts when a holding moves more than 3 points from target; full review every 12 months.</p>
    </div>
  )
}

function WhatIf({ r }: { r: EngineResult }) {
  const [shock, setShock] = useState(-0.2)
  const loss = r.investable * r.y * shock
  const left = r.monthsCovered * r.monthlySpend
  return (
    <div>
      <label className="text-sm font-semibold" htmlFor="shock">
        Equity markets fall {pct(-shock)}
      </label>
      <input id="shock" type="range" min={-0.5} max={0} step={0.05} value={shock} onChange={(e) => setShock(Number(e.target.value))} className="mt-2 w-full accent-[var(--color-violet)]" />
      <p className="mt-3 text-sm text-ink-soft">
        Portfolio loss ≈ <b className="text-loss">{gbpShort(loss)}</b>. Cash buffer untouched: <b>{gbpShort(Math.min(left, r.buffer))}</b>, enough for{' '}
        {r.bufferMonths} months of spending without selling anything.
      </p>
    </div>
  )
}
