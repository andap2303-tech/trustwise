import { Link } from 'react-router-dom'
import { GrowingTree } from '../components/Illustration'
import { about as a } from '../content/pages'
import StubPage from './StubPage'

const FACTS = [
  { v: '399,168', l: 'Charity Commission records analysed' },
  { v: '8,159', l: 'charities in our target cluster (K-means)' },
  { v: '470', l: 'charities served by Year 3' },
  { v: '£310m', l: 'of reserves we could help put to work' },
]

export default function About() {
  return (
    <StubPage eyebrow={a.eyebrow} title={a.title} sub={a.sub}>
      <div className="grid gap-5 md:grid-cols-[1fr_1.4fr]">
        <div className="card p-8">
          <GrowingTree className="mx-auto h-44" />
          <p className="mt-4 text-center font-display text-lg font-semibold">Our mission: help every charity board make its reserves work for its cause.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {FACTS.map((f, i) => (
            <div key={f.l} className={`rounded-card p-6 ${['bg-lavender', 'bg-amber-soft', 'bg-salmon-soft', 'bg-sand'][i]}`}>
              <p className="font-display text-4xl font-bold">{f.v}</p>
              <p className="mt-2 text-sm text-ink-soft">{f.l}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="card mt-6 p-8">
        <h2 className="text-2xl font-semibold">How we built it</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-ink-soft">
          Every number in this demo comes from our project notebook: cleaned price data for 9 UCITS ETFs (2012–2026), an
          efficient frontier and tangency portfolio, GARCH(1,1) volatility, stress tests on 2008, 2020 and 2022, an
          out-of-sample backtest with yearly rebalancing, and K-means clustering of the Charity Commission register. The
          code is open on our anonymous GitHub.
        </p>
        <Link to="/learn" className="btn-ghost mt-6">Read the methodology →</Link>
      </div>
    </StubPage>
  )
}
