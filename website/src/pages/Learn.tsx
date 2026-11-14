import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import SectionHeader from '../components/SectionHeader'
import { BANK_ACCOUNT, INFLATION, PROFILE_STATS, RISKY_SHARE, STRESS } from '../lib/engine'
import { gbp, gbpShort, pct, signedPct } from '../lib/format'
import { PROFILES } from '../lib/types'

const RULES = [
  { t: 'Invest only what you don’t need soon', d: 'Money for running costs and planned projects stays in cash (CC19 reserves policy).' },
  { t: 'Think about suitability', d: 'Is the investment right for this charity, its purpose and its time horizon? (CC14)' },
  { t: 'Diversify', d: 'Don’t put all the money in one asset, sector or country. Spread the risk.' },
  { t: 'Take advice when you need it', d: 'Trustees should get advice unless they have the expertise. Trustwise documents the reasoning.' },
  { t: 'Review regularly', d: 'Check performance, costs and the policy at least once a year, and minute the decision.' },
  { t: 'Respect restrictions and ethics', d: 'Restricted funds follow the donor’s wishes. Trustees may exclude investments that conflict with the aims.' },
]

const METHODS = [
  { s: 'Data cleaning', d: 'Daily prices for 9 London-listed UCITS ETFs from 2012, fixed for pence/pound jumps, with a sanity check on every daily move.' },
  { s: 'Efficient frontier', d: 'Mean-variance optimisation, long-only, max 40% per fund and 10% gold. The tangency portfolio has the best return per unit of risk.' },
  { s: 'Capital Allocation Line', d: 'Each profile mixes the tangency portfolio with a cash fund: y* = (E[Rp] − Rf) / (A·σ²), with risk aversion A = 30 / 16 / 10.' },
  { s: 'GARCH(1,1)', d: 'Volatility is forecast from today’s market, not a long-run average. It drives the prudent 1-in-20 bad year = −1.645 × σ (we don’t count on the expected return).' },
  { s: 'Stress tests & backtest', d: 'Real 2008, 2020 and 2022 drawdowns, and an out-of-sample backtest from 2020 with yearly re-estimation.' },
  { s: 'K-means clustering', d: 'Log income and spending ratio for 399k charities. The target cluster within £500k–£10m income has 8,159 charities.' },
]

export default function Learn() {
  const [amount, setAmount] = useState(500_000)
  const data = Array.from({ length: 11 }, (_, t) => ({
    year: t,
    bank: amount * ((1 + BANK_ACCOUNT) / (1 + INFLATION)) ** t,
    balanced: amount * ((1 + PROFILE_STATS.Balanced.er) / (1 + INFLATION)) ** t,
  }))
  const lost = amount - data[10].bank
  return (
    <div className="relative overflow-x-clip">
      <div className="halo -top-32 -right-24 h-96 w-96 bg-lilac/50" />
      <div className="container-page relative py-14 sm:py-20">
        <header className="max-w-2xl space-y-5">
          <span className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-salmon" /> Trustee guide</span>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">Investing reserves, explained for trustees.</h1>
          <p className="text-lg leading-relaxed text-ink-soft">Five minutes to understand why cash is not risk-free, what the rules ask of you, and how Trustwise builds its numbers.</p>
        </header>

        {/* 1. Cash erosion */}
        <section className="mt-16">
          <SectionHeader eyebrow="1 · Why cash loses" title="Inflation is a slow, invisible loss." sub={`With inflation at ${pct(INFLATION, 1)} and a bank account at ${pct(BANK_ACCOUNT)}, money in the bank loses buying power every year.`} />
          <div className="card p-7">
            <label className="text-sm font-semibold" htmlFor="amt">Reserves in the bank: <span className="text-violet">{gbp(amount)}</span></label>
            <input id="amt" type="range" min={100_000} max={5_000_000} step={50_000} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="mt-2 w-full accent-[var(--color-violet)]" />
            <div className="mt-6 h-64">
              <ResponsiveContainer>
                <LineChart data={data}>
                  <CartesianGrid stroke="var(--color-line)" vertical={false} />
                  <XAxis dataKey="year" tickFormatter={(y) => `Y${y}`} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v) => gbpShort(v)} width={56} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v: number) => gbp(v)} labelFormatter={(y) => `Year ${y} (today’s money)`} />
                  <Line dataKey="balanced" name="Balanced portfolio (expected)" stroke="var(--color-violet)" strokeWidth={3} dot={false} />
                  <Line dataKey="bank" name="Bank account" stroke="var(--color-salmon)" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-4 rounded-2xl bg-salmon-soft p-4 text-sm font-semibold">
              In ten years, {gbp(amount)} in the bank buys only what {gbp(data[10].bank)} buys today: {gbpShort(lost)} of real value lost.
            </p>
          </div>
        </section>

        {/* 2. Rules */}
        <section className="mt-20">
          <SectionHeader eyebrow="2 · The rules" title="What CC14 and CC19 ask of trustees." sub="Charity Commission guidance for England & Wales. CC19 (reserves) was updated on 16 September 2026." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {RULES.map((r, i) => (
              <div key={r.t} className="card p-6">
                <span className="font-display text-2xl font-bold text-lilac-strong">0{i + 1}</span>
                <h3 className="mt-2 text-lg font-semibold">{r.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{r.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Profiles */}
        <section className="mt-20">
          <SectionHeader eyebrow="3 · Risk and return" title="Three profiles, one honest trade-off." sub="More in markets means a higher expected return and a deeper bad year. Numbers per £100,000 invested." />
          <div className="grid gap-4 md:grid-cols-3">
            {PROFILES.map((p, i) => {
              const s = PROFILE_STATS[p]
              return (
                <div key={p} className={`rounded-card p-7 ${['bg-lavender', 'bg-white shadow-soft', 'bg-amber-soft'][i]}`}>
                  <h3 className="text-2xl font-semibold">{p}</h3>
                  <p className="mt-1 text-sm text-muted">{pct(RISKY_SHARE[p])} in markets · {pct(1 - RISKY_SHARE[p])} cash fund</p>
                  <dl className="mt-5 space-y-2 text-sm">
                    <Row l="Expected return" v={`${pct(s.er, 1)} · +${gbp(100_000 * s.er)}`} />
                    <Row l="Volatility" v={pct(s.vol, 1)} />
                    <Row l="1-in-20 bad year" v={gbp(100_000 * s.bad)} bad />
                    <Row l="In 2008" v={signedPct(RISKY_SHARE[p] * STRESS[0].risky + (1 - RISKY_SHARE[p]) * STRESS[0].cash)} bad />
                  </dl>
                </div>
              )
            })}
          </div>
        </section>

        {/* 4. Methodology */}
        <section id="method" className="mt-20">
          <SectionHeader eyebrow="4 · Methodology" title="How Trustwise calculates." sub="The data science behind every number, from our project notebook." />
          <ol className="grid gap-3 md:grid-cols-2">
            {METHODS.map((m, i) => (
              <li key={m.s} className="card flex gap-4 p-6">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink font-display font-semibold text-white">{i + 1}</span>
                <div>
                  <h3 className="font-semibold">{m.s}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{m.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 rounded-2xl bg-sand p-5 text-sm leading-relaxed text-ink-soft">
            <b>Limits.</b> 12 years of data include a long bull market. Stress tests use US-listed proxies before the UK funds existed. The bad year assumes normal returns; a 2008-type crash is still deeper (fat tails next: Student-t). These are model estimates, not forecasts.
          </p>
        </section>

        <div className="mt-16 text-center">
          <Link to="/check" className="btn-primary">Check your reserves <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </div>
  )
}

function Row({ l, v, bad }: { l: string; v: string; bad?: boolean }) {
  return (
    <div className="flex justify-between gap-3 border-b border-ink/10 pb-2">
      <dt className="text-ink-soft">{l}</dt>
      <dd className={`font-semibold tabular-nums ${bad ? 'text-loss' : ''}`}>{v}</dd>
    </div>
  )
}
