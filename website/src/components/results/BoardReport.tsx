import { useState } from 'react'
import type { EngineResult } from '../../lib/engine'
import { gbp, gbpShort, pct, signedPct, today } from '../../lib/format'
import type { Answers } from '../../lib/types'

export function reportText(a: Answers, r: EngineResult) {
  const lines = [
    `${a.charityName} — Reserves and investment summary (${today()})`,
    '',
    `1. Reserves. The charity holds ${gbp(a.reserves)} in cash, of which ${gbp(Math.min(a.restricted, a.reserves))} is restricted. Unrestricted cash covers ${r.monthsCovered.toFixed(1)} months of spending (${gbp(r.monthlySpend)} a month).`,
    `2. What stays in cash. Restricted funds, a ${r.bufferMonths}-month safety buffer (${gbp(r.buffer)})${r.project > 0 ? ` and the planned ${a.bigProject.toLowerCase()} project (${gbp(r.project)})` : ''}.`,
    `3. Long-term money. ${r.investable > 0 ? `${gbp(r.investable)} can be invested for at least 3 years.` : 'None at this stage: we recommend keeping all reserves in cash.'}`,
    `4. Risk profile. ${r.profile} (capacity ${Math.round(r.capacity)}/100, tolerance ${Math.round(r.tolerance)}/100; the lower one decides). ${pct(r.y)} in a diversified ETF portfolio, ${pct(1 - r.y)} in a cash fund.`,
    `5. Expected outcome. About ${pct(r.stats.er, 1)} a year, or ${gbpShort(r.yearlyGain)} a year more than a bank account at 2%. In a 1-in-20 bad year the loss could be ${gbp(-r.badYear)} (${signedPct(r.stats.bad)}). In 2008 this mix would have fallen ${signedPct(r.stress[0].portfolio)} vs ${signedPct(r.stress[0].world)} for world equities.`,
    `6. Costs. Around ${gbp(r.costs.total)} a year (Trustwise Board plan + fund costs of ${pct(r.costs.ter, 2)}), vs about ${gbp(r.costs.manager)} with a typical investment manager.`,
    `7. Ethics. ${a.ethics}.`,
    '',
    'Decision for the board: approve the reserves policy and the investment profile above, and review them every 12 months (CC14, CC19).',
    'This summary is decision support, not regulated investment advice.',
  ]
  return lines.join('\n')
}

export default function BoardReport({ a, r }: { a: Answers; r: EngineResult }) {
  const [copied, setCopied] = useState(false)
  const text = reportText(a, r)
  return (
    <div className="card p-7 print:shadow-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold">Board Report</h3>
          <p className="mt-1 text-sm text-muted">Ready to paste into the papers for your next trustee meeting.</p>
        </div>
        <div className="flex gap-2 print:hidden">
          <button
            className="btn-outline min-h-11 px-4 text-sm"
            onClick={() => {
              navigator.clipboard?.writeText(text).then(() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 1800)
              })
            }}
          >
            {copied ? 'Copied ✓' : 'Copy text'}
          </button>
          <button className="btn-primary min-h-11 px-4 text-sm" onClick={() => window.print()}>
            Print / save PDF
          </button>
        </div>
      </div>
      <pre className="mt-5 max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-sand/70 p-5 font-sans text-[14px] leading-relaxed text-ink-soft">{text}</pre>
    </div>
  )
}
