import { useEffect, useState } from 'react'
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ALLOC_COLORS, BANK_ACCOUNT, INFLATION, MANAGER, PROFILE_STATS, RISKY_SHARE, type EngineResult } from '../../lib/engine'
import { gbp, gbpShort, pct, signedPct } from '../../lib/format'
import { PROFILES, type Profile } from '../../lib/types'
import ScoreGauge from './ScoreGauge'

/** Counts up to `value` once on mount. */
export function useCountUp(value: number, ms = 1100) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms)
      setV(value * (1 - (1 - p) ** 3))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, ms])
  return v
}

export function Headline({ name, r }: { name: string; r: EngineResult }) {
  const n = useCountUp(r.investable)
  return (
    <div className="card relative overflow-hidden bg-ink p-8 text-white sm:p-10">
      <div className="halo -top-20 -right-16 h-64 w-64 bg-violet/60" />
      <p className="relative text-sm font-semibold uppercase tracking-wider text-lilac">{name} · long-term reserves</p>
      {r.investable > 0 ? (
        <>
          <p className="relative mt-3 font-display text-5xl font-bold tracking-tight sm:text-7xl">{gbp(n)}</p>
          <p className="relative mt-3 max-w-xl text-lg text-white/80">
            can be invested for the long term, after keeping restricted funds, a {r.bufferMonths}-month safety buffer
            {r.project > 0 ? ' and your planned project' : ''} in cash.
          </p>
          <div className="relative mt-7 grid gap-3 sm:grid-cols-3">
            <Kpi label="Expected extra income vs bank" value={`+${gbpShort(r.yearlyGain)}/yr`} tone="text-mint" />
            <Kpi label="1-in-20 bad year" value={gbpShort(r.badYear)} tone="text-amber" />
            <Kpi label="Lost to inflation today" value={`−${gbpShort(r.erosion)}/yr`} tone="text-salmon-soft" />
          </div>
        </>
      ) : (
        <>
          <p className="relative mt-3 font-display text-4xl font-bold sm:text-5xl">Keep it in cash for now</p>
          <p className="relative mt-3 max-w-xl text-lg text-white/80">{r.warnings[0]}</p>
        </>
      )}
    </div>
  )
}

function Kpi({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
      <p className="text-xs font-semibold text-white/70">{label}</p>
      <p className={`mt-1 font-display text-2xl font-bold ${tone}`}>{value}</p>
    </div>
  )
}

/** Where every pound of cash goes: restricted / buffer / project / investable. */
export function ReserveSplit({ r, reserves, restricted }: { r: EngineResult; reserves: number; restricted: number }) {
  const buffer = Math.min(r.buffer, r.unrestricted)
  const project = Math.min(r.project, Math.max(0, r.unrestricted - buffer))
  const parts = [
    { label: 'Restricted funds', v: restricted, c: 'bg-lilac', note: 'Donor’s purpose. Stays in cash.' },
    { label: `Safety buffer (${r.bufferMonths} months)`, v: buffer, c: 'bg-amber', note: `${gbpShort(r.monthlySpend)} of spending a month.` },
    { label: 'Planned project', v: project, c: 'bg-ink-soft', note: 'Set aside, never at market risk.' },
    { label: 'Long-term money', v: r.investable, c: 'bg-violet', note: 'Can be invested for 3+ years.' },
  ].filter((p) => p.v > 0)
  return (
    <div className="card p-7">
      <h3 className="text-xl font-semibold">Reserve Check</h3>
      <p className="mt-1 text-sm text-muted">
        {gbp(reserves)} of cash today covers {r.monthsCovered.toFixed(1)} months of unrestricted spending.
      </p>
      <div className="mt-6 flex h-6 overflow-hidden rounded-full bg-sand">
        {parts.map((p) => (
          <span key={p.label} className={`${p.c} h-full animate-grow origin-left`} style={{ width: `${(p.v / reserves) * 100}%` }} title={p.label} />
        ))}
      </div>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {parts.map((p) => (
          <li key={p.label} className="flex gap-3">
            <span className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${p.c}`} />
            <div>
              <p className="text-sm font-semibold">
                {p.label} · {gbpShort(p.v)}
              </p>
              <p className="text-sm text-muted">{p.note}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ProfilePicker({
  r,
  chosen,
  onChange,
}: {
  r: EngineResult
  chosen: Profile
  onChange: (p: Profile) => void
}) {
  const suggested = r.limiting === 'capacity' ? Math.min(r.capacity, r.tolerance) : Math.min(r.capacity, r.tolerance)
  return (
    <div className="card p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">Your profile: {chosen}</h3>
          <p className="mt-1 max-w-md text-sm text-muted">
            We take the <b>lower</b> of what the charity can afford to lose (capacity) and what the board is comfortable
            with (tolerance). Here the limit is <b>{r.limiting}</b> ({Math.round(suggested)}/100).
          </p>
        </div>
        <div className="flex rounded-full bg-sand p-1" role="tablist" aria-label="Compare profiles">
          {PROFILES.map((p) => (
            <button
              key={p}
              role="tab"
              aria-selected={chosen === p}
              onClick={() => onChange(p)}
              className={`min-h-10 rounded-full px-4 text-sm font-semibold transition ${chosen === p ? 'bg-ink text-white shadow-soft' : 'text-ink-soft hover:text-ink'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <ScoreGauge label="Capacity" value={r.capacity} color="var(--color-violet)" limiting={r.limiting === 'capacity'} />
        <ScoreGauge label="Tolerance" value={r.tolerance} color="var(--color-salmon)" limiting={r.limiting === 'tolerance'} />
      </div>
      <div className="mt-6 grid grid-cols-3 gap-2 text-center">
        {PROFILES.map((p) => (
          <div key={p} className={`rounded-2xl p-3 ${p === chosen ? 'bg-lavender ring-2 ring-violet' : 'bg-sand/60'}`}>
            <p className="text-xs font-semibold text-muted">{p}</p>
            <p className="font-display text-lg font-bold">{pct(RISKY_SHARE[p])}</p>
            <p className="text-[11px] text-muted">invested in markets</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AllocationCard({ r }: { r: EngineResult }) {
  return (
    <div className="card p-7">
      <h3 className="text-xl font-semibold">Portfolio Builder</h3>
      <p className="mt-1 text-sm text-muted">
        Optimal mix of low-cost UCITS ETFs (tangency portfolio, 2014–2026 data) plus a cash fund, by region.
      </p>
      <div className="mt-4 grid items-center gap-6 sm:grid-cols-[180px_1fr]">
        <div className="relative h-44">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={r.allocation} dataKey="weight" nameKey="name" innerRadius="62%" outerRadius="100%" paddingAngle={2} stroke="none" isAnimationActive>
                {r.allocation.map((a) => (
                  <Cell key={a.name} fill={ALLOC_COLORS[a.name]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-2xl font-bold">{pct(r.y)}</span>
            <span className="text-[11px] text-muted">in markets</span>
          </div>
        </div>
        <ul className="space-y-2.5">
          {r.allocation.map((a) => (
            <li key={a.name} className="flex items-center gap-3 text-sm">
              <span className="h-3 w-3 rounded-sm" style={{ background: ALLOC_COLORS[a.name] }} />
              <span className="flex-1 font-medium">{a.name}</span>
              <span className="font-semibold tabular-nums">{pct(a.weight)}</span>
              <span className="w-20 text-right text-muted tabular-nums">{gbpShort(a.weight * r.investable)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5 text-center">
        <Stat label="Expected return" value={pct(r.stats.er, 1)} />
        <Stat label="Volatility (GARCH)" value={pct(r.stats.vol, 1)} />
        <Stat label="Fund costs" value={pct(r.costs.ter, 2)} />
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-display text-xl font-bold">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  )
}

export function BadYearCard({ r }: { r: EngineResult }) {
  const worst = r.stress[0]
  return (
    <div className="card bg-salmon-soft p-7">
      <h3 className="text-xl font-semibold">Bad-Year Lens</h3>
      <p className="mt-1 text-sm text-ink-soft">One year in twenty, the portfolio could lose this much or more:</p>
      <p className="mt-4 font-display text-5xl font-bold text-loss">{gbp(r.badYear)}</p>
      <p className="mt-1 text-sm font-semibold text-ink-soft">{signedPct(r.stats.bad)} of the invested money</p>
      <div className="mt-6 rounded-2xl bg-white/70 p-4 text-sm leading-relaxed text-ink-soft">
        In the <b>2008 crisis</b> this mix would have lost about <b>{gbpShort(-worst.loss)}</b> ({signedPct(worst.portfolio)}), against{' '}
        {signedPct(worst.world)} for world equities. The safety buffer means the charity never has to sell at the bottom.
      </div>
    </div>
  )
}

export function ProjectionCard({ r }: { r: EngineResult }) {
  const data = r.projection.map((p) => ({ ...p, band: [p.low, p.high] }))
  const end = r.projection[10]
  return (
    <div className="card p-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold">Ten years from now</h3>
          <p className="mt-1 text-sm text-muted">Expected path with a 1-in-10 good and bad range. Not a promise.</p>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl font-bold text-violet">{gbpShort(end.portfolio)}</p>
          <p className="text-xs text-muted">vs {gbpShort(end.bank)} in the bank · {gbpShort(end.real)} needed to beat inflation</p>
        </div>
      </div>
      <div className="mt-5 h-64">
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--color-line)" vertical={false} />
            <XAxis dataKey="year" tickFormatter={(y) => `Y${y}`} tick={{ fontSize: 12, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => gbpShort(v)} width={56} tick={{ fontSize: 12, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(v: number | number[], n: string) => [Array.isArray(v) ? `${gbpShort(v[0])} – ${gbpShort(v[1])}` : gbp(v), n]}
              labelFormatter={(y) => `Year ${y}`}
              contentStyle={{ borderRadius: 12, border: '1px solid var(--color-line)' }}
            />
            <Area dataKey="band" name="Likely range" stroke="none" fill="var(--color-lilac)" fillOpacity={0.45} />
            <Area dataKey="portfolio" name="Portfolio (expected)" stroke="var(--color-violet)" strokeWidth={3} fill="none" />
            <Area dataKey="real" name={`Inflation (${pct(INFLATION, 1)})`} stroke="var(--color-salmon)" strokeDasharray="5 4" strokeWidth={2} fill="none" />
            <Area dataKey="bank" name={`Bank account (${pct(BANK_ACCOUNT)})`} stroke="var(--color-ink-soft)" strokeWidth={2} fill="none" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-ink-soft">
        <Legend c="bg-violet" l="Portfolio (expected)" />
        <Legend c="bg-lilac" l="Likely range" />
        <Legend c="bg-salmon" l="Keeping up with inflation" />
        <Legend c="bg-ink-soft" l="Bank account" />
      </div>
    </div>
  )
}

const Legend = ({ c, l }: { c: string; l: string }) => (
  <span className="flex items-center gap-1.5">
    <span className={`h-2.5 w-2.5 rounded-full ${c}`} />
    {l}
  </span>
)

export function StressCard({ r }: { r: EngineResult }) {
  return (
    <div className="card p-7">
      <h3 className="text-xl font-semibold">Stress tests</h3>
      <p className="mt-1 text-sm text-muted">What this mix would have done in three real crashes (peak to trough).</p>
      <div className="mt-5 space-y-5">
        {r.stress.map((s) => (
          <div key={s.name}>
            <div className="mb-1.5 flex justify-between text-sm font-semibold">
              <span>{s.name}</span>
              <span className="text-loss">{gbpShort(s.loss)}</span>
            </div>
            <Bar label="Your portfolio" v={s.portfolio} c="bg-violet" />
            <Bar label="World equities" v={s.world} c="bg-ink-soft/50" />
          </div>
        ))}
      </div>
      <p className="mt-5 rounded-2xl bg-lavender p-4 text-sm font-medium text-ink-soft">
        In the 2008 crash this profile lost about {pct(r.stress[0].portfolio / r.stress[0].world)} of what world equities lost.
      </p>
    </div>
  )
}

function Bar({ label, v, c }: { label: string; v: number; c: string }) {
  return (
    <div className="mt-1 flex items-center gap-3 text-xs">
      <span className="w-28 shrink-0 text-muted">{label}</span>
      <span className="h-2.5 flex-1 rounded-full bg-sand">
        <span className={`block h-full origin-left animate-grow rounded-full ${c}`} style={{ width: `${Math.min(100, (-v / 0.5) * 100)}%` }} />
      </span>
      <span className="w-12 text-right font-semibold tabular-nums">{signedPct(v)}</span>
    </div>
  )
}

export function CostCard({ r }: { r: EngineResult }) {
  const rows = [
    { l: 'Trustwise Board plan + ETF fees', v: r.costs.total, c: 'bg-violet', note: `£1,800 + ${pct(r.costs.ter, 2)} fund costs` },
    { l: 'Typical investment manager', v: r.costs.manager, c: 'bg-ink-soft/60', note: `${pct(MANAGER.fee, 2)} + VAT, min £2,500 + VAT` },
  ]
  const max = Math.max(...rows.map((x) => x.v), 1)
  return (
    <div className="card p-7">
      <h3 className="text-xl font-semibold">What it costs per year</h3>
      <div className="mt-5 space-y-4">
        {rows.map((x) => (
          <div key={x.l}>
            <div className="flex justify-between text-sm font-semibold">
              <span>{x.l}</span>
              <span className="tabular-nums">{gbp(x.v)}</span>
            </div>
            <div className="mt-1.5 h-3 rounded-full bg-sand">
              <div className={`h-full origin-left animate-grow rounded-full ${x.c}`} style={{ width: `${(x.v / max) * 100}%` }} />
            </div>
            <p className="mt-1 text-xs text-muted">{x.note}</p>
          </div>
        ))}
      </div>
      {r.costs.saving > 0 && (
        <p className="mt-5 rounded-2xl bg-lavender p-4 text-sm font-semibold">
          You keep about {gbp(r.costs.saving)} a year for your cause — {gbpShort(r.costs.saving * 10)} over ten years.
        </p>
      )}
    </div>
  )
}

export function Checklist({ r }: { r: EngineResult }) {
  return (
    <div className="card p-7">
      <h3 className="text-xl font-semibold">Trustee checklist (CC14 · CC19)</h3>
      <ul className="mt-5 space-y-3">
        {r.checklist.map((c) => (
          <li key={c.label} className="flex gap-3">
            <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${c.ok ? 'bg-gain text-white' : 'bg-amber-soft text-ink ring-1 ring-amber'}`}>
              {c.ok ? '✓' : '!'}
            </span>
            <div>
              <p className="text-sm font-semibold">{c.label}</p>
              <p className="text-sm text-muted">{c.note}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { PROFILE_STATS }
