import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import Modal from '../components/Modal'
import Pill from '../components/Pill'
import { usePlus } from '../state/PlusContext'

const PLANS = [
  {
    name: 'Starter',
    price: '£37',
    per: '/ month',
    sub: '£444 a year. For smaller charities getting started.',
    features: ['Reserve Check', 'Portfolio Builder (3 profiles)', 'Bad-Year Lens', 'Board Report (text)'],
    tone: 'card',
  },
  {
    name: 'Board',
    price: '£1,800',
    per: '/ year',
    sub: 'Our core plan. Everything a board needs to decide and review.',
    features: ['Everything in Starter', 'Sector Map (compare with similar charities)', 'Rebalancing monitor and alerts', 'What-if stress scenarios', 'Board pack PDF + CC14/CC19 checklist', 'Annual review reminder'],
    tone: 'core',
  },
  {
    name: 'Partner',
    price: '£1,440',
    per: '/ client / year',
    sub: 'The Board plan through your accountant, 20% off.',
    features: ['Everything in Board', 'Run by your accountant or examiner', 'Multi-client dashboard', 'Bulk import from accounts'],
    tone: 'card',
  },
]

export default function Plus() {
  const { isPlusDemo, setPlusDemo } = usePlus()
  const [open, setOpen] = useState(false)
  return (
    <div className="relative overflow-x-clip">
      <div className="halo -top-32 -right-24 h-96 w-96 bg-amber-soft" />
      <div className="container-page relative py-14 sm:py-20">
        <header className="mx-auto max-w-2xl space-y-5 text-center">
          <Pill>Pricing</Pill>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">Professional analysis, at the price of software.</h1>
          <p className="text-lg text-ink-soft">
            A typical investment manager charges 0.75% + VAT, with a £2,500 minimum. On £500k that is £4,500 a year. Trustwise Board is £1,800.
          </p>
        </header>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.name} className={`relative flex flex-col rounded-card p-8 shadow-soft ${p.tone === 'core' ? 'bg-ink text-white shadow-lift lg:-translate-y-3' : 'bg-white'}`}>
              {p.tone === 'core' && (
                <span className="absolute -top-3 left-8 rounded-full bg-salmon px-3 py-1 text-xs font-bold text-on-accent">Core plan</span>
              )}
              <h2 className="text-2xl font-semibold">{p.name}</h2>
              <p className="mt-4 font-display text-5xl font-bold">
                {p.price}
                <span className={`text-base font-medium ${p.tone === 'core' ? 'text-white/70' : 'text-muted'}`}> {p.per}</span>
              </p>
              <p className={`mt-3 text-sm ${p.tone === 'core' ? 'text-white/75' : 'text-ink-soft'}`}>{p.sub}</p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm">
                    <Icon name="check" className={`h-5 w-5 shrink-0 ${p.tone === 'core' ? 'text-mint' : 'text-gain'}`} /> {f}
                  </li>
                ))}
              </ul>
              {p.tone === 'core' ? (
                isPlusDemo ? (
                  <button className="btn mt-8 bg-white/10 text-white ring-1 ring-white/30" onClick={() => setPlusDemo(false)}>
                    Demo active ✓ · switch off
                  </button>
                ) : (
                  <button className="btn-plus mt-8" onClick={() => setOpen(true)}>
                    Unlock the Board demo
                  </button>
                )
              ) : p.name === 'Partner' ? (
                <Link to="/partners" className="btn-outline mt-8">For accountants →</Link>
              ) : (
                <Link to="/check" className="btn-outline mt-8">Start free check</Link>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 grid items-center gap-6 rounded-card bg-lavender p-8 md:grid-cols-[auto_1fr]">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet">
            <Icon name="leaf" className="h-7 w-7" />
          </span>
          <div>
            <h2 className="text-xl font-semibold">Coming in Year 3: Board+ Custom</h2>
            <p className="mt-1 text-[15px] text-ink-soft">
              Custom ethical portfolios and regulated advice through an FCA-authorised partner, and coverage of Scottish charities (OSCR). Upside — not included in our financial plan.
            </p>
          </div>
        </div>
        {isPlusDemo && (
          <p className="mt-6 text-center text-sm font-semibold text-violet">
            Board demo active. <Link to="/results" className="underline">See the extra features in your results →</Link>
          </p>
        )}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        eyebrow="Demo only"
        title="Unlock the Board plan demo?"
        body="This is a student demo: no payment is taken and nothing is stored on a server. The Board features unlock in your results and the site switches to the Board theme."
      >
        <button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
        <button
          className="btn-primary"
          onClick={() => {
            setPlusDemo(true)
            setOpen(false)
          }}
        >
          Unlock demo
        </button>
      </Modal>
    </div>
  )
}
