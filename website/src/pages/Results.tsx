import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import BoardFeatures from '../components/results/BoardFeatures'
import BoardReport from '../components/results/BoardReport'
import {
  AllocationCard,
  BadYearCard,
  Checklist,
  CostCard,
  Headline,
  ProfilePicker,
  ProjectionCard,
  ReserveSplit,
  StressCard,
} from '../components/results/Cards'
import { results as copy } from '../content/copy'
import { runEngine } from '../lib/engine'
import { gbpShort } from '../lib/format'
import type { Profile } from '../lib/types'
import { isComplete, useAnswers } from '../state/AnswersContext'

export default function Results() {
  const { answers, reset } = useAnswers()
  const navigate = useNavigate()
  const [override, setOverride] = useState<Profile | undefined>()

  const base = useMemo(() => (isComplete(answers) ? runEngine(answers) : null), [answers])
  const r = useMemo(() => (isComplete(answers) ? runEngine(answers, override) : null), [answers, override])

  if (!isComplete(answers) || !r || !base) {
    return (
      <div className="container-page flex min-h-[60vh] items-center justify-center py-16">
        <div className="card max-w-md p-10 text-center">
          <h1 className="text-3xl font-semibold">{copy.notReady.title}</h1>
          <p className="mt-3 text-muted">{copy.notReady.text}</p>
          <Link to="/check" className="btn-primary mt-6">
            {copy.notReady.cta} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    )
  }

  const a = answers
  return (
    <div className="relative overflow-x-clip">
      <div className="halo -top-32 -left-24 h-96 w-96 bg-lilac/50" />
      <div className="container-page relative py-10 sm:py-14">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-salmon" /> Your board summary · {a.nation}
          </span>
          <div className="flex gap-2">
            <Link to="/check" className="btn-ghost min-h-11 px-4 text-sm">Edit answers</Link>
            <button
              className="btn-outline min-h-11 px-4 text-sm"
              onClick={() => {
                reset()
                navigate('/check')
              }}
            >
              Start over
            </button>
          </div>
        </div>

        <div className="animate-rise">
          <Headline name={a.charityName} r={r} />
        </div>

        {r.warnings.length > (r.investable > 0 ? 0 : 1) && (
          <div className="mt-5 space-y-2">
            {r.warnings.slice(r.investable > 0 ? 0 : 1).map((w) => (
              <p key={w} className="flex gap-3 rounded-2xl bg-amber-soft p-4 text-sm font-medium text-ink-soft ring-1 ring-amber/40">
                <span aria-hidden="true">⚠️</span> {w}
              </p>
            ))}
          </div>
        )}

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <ReserveSplit r={r} reserves={a.reserves} restricted={Math.min(a.restricted, a.reserves)} />
          <ProfilePicker r={base} chosen={r.profile} onChange={(p) => setOverride(p === base.profile ? undefined : p)} />
        </div>
        {override && (
          <p className="mt-3 text-sm font-medium text-salmon">
            You are previewing the {override} profile. Our suggestion for {a.charityName} is {base.profile}.
          </p>
        )}

        {r.investable > 0 && (
          <>
            <div className="mt-5 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
              <AllocationCard r={r} />
              <BadYearCard r={r} />
            </div>
            <div className="mt-5">
              <ProjectionCard r={r} />
            </div>
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <StressCard r={r} />
              <CostCard r={r} />
            </div>
          </>
        )}

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.4fr]">
          <Checklist r={r} />
          <BoardReport a={a} r={r} />
        </div>

        <BoardFeatures a={a} r={r} />

        <section className="mt-14 print:hidden">
          <h2 className="text-3xl font-semibold">Next steps</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { icon: 'doc', t: 'Take it to the board', d: 'Share the Board Report. Trustees approve the reserves policy and the profile, and minute the decision.' },
              { icon: 'users', t: 'Check with your accountant', d: 'Many independent examiners already use Trustwise with their charity clients (Partner plan).', link: '/partners' },
              { icon: 'chart', t: 'Invest and review yearly', d: `Buy the funds through a charity-friendly platform${r.investable > 0 ? ` (${gbpShort(r.investable)} to invest)` : ''}. We remind you to rebalance.` },
            ].map((s, i) => (
              <div key={s.t} className="card p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white">
                  <Icon name={s.icon} className="h-5 w-5" />
                </span>
                <p className="mt-4 text-xs font-semibold text-muted">Step {i + 1}</p>
                <h3 className="text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.d}</p>
                {s.link && (
                  <Link to={s.link} className="mt-3 inline-block text-sm font-semibold text-violet hover:underline">
                    For accountants →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
