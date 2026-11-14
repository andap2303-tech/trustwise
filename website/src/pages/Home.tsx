import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import HeroPhone from '../components/home/HeroPhone'
import Marquee from '../components/home/Marquee'
import SectionHeader from '../components/SectionHeader'
import StepCard from '../components/StepCard'
import { home } from '../content/copy'
import { EXAMPLE } from '../content/questions'
import { runEngine } from '../lib/engine'
import { gbp, gbpShort, pct, signedPct } from '../lib/format'
import { useAnswers } from '../state/AnswersContext'

const ex = runEngine(EXAMPLE)

export default function Home() {
  const { setAll } = useAnswers()
  const navigate = useNavigate()
  const tryExample = () => {
    setAll(EXAMPLE)
    navigate('/results')
  }

  return (
    <div className="relative overflow-x-clip">
      {/* 1. Hero */}
      <section className="relative">
        <div className="halo -top-40 -right-32 h-[28rem] w-[28rem] bg-lilac/60" />
        <div className="halo top-64 -left-40 h-80 w-80 bg-amber-soft" />
        <div className="container-page relative grid items-center gap-10 py-12 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div className="space-y-7">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-salmon" /> {home.eyebrow}
            </span>
            <h1 className="text-[2.6rem] font-bold leading-[1.05] sm:text-6xl">
              {home.title[0]} <span className="text-violet">{home.title[1]}</span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-ink-soft">{home.sub}</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/check" className="btn-primary">
                {home.cta} <span aria-hidden="true">→</span>
              </Link>
              <button onClick={tryExample} className="btn-outline">
                {home.example}
              </button>
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-muted">
              {home.trust.map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Icon name="check" className="h-4 w-4 text-gain" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <HeroPhone />
        </div>
      </section>

      <Marquee items={home.marquee} />

      {/* 2. Problem */}
      <section className="container-page py-20">
        <SectionHeader eyebrow="The problem" title={home.problemTitle} sub={home.problemSub} />
        <div className="grid gap-4 md:grid-cols-3">
          {home.stats.map((s, i) => (
            <div key={s.value} className={`rounded-card p-7 ${['bg-lavender', 'bg-salmon-soft', 'bg-amber-soft'][i]}`}>
              <p className="font-display text-5xl font-bold tracking-tight">{s.value}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{s.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">Sources: Broadstone (2024, on 2022 accounts), ONS CPI September 2026.</p>
      </section>

      {/* 3. Insight */}
      <section className="container-page">
        <div className="card grid gap-8 overflow-hidden bg-ink p-8 text-white sm:p-12 md:grid-cols-[1.3fr_1fr]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-lilac">{home.insight.eyebrow}</span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">{home.insight.title}</h2>
            <p className="mt-5 leading-relaxed text-white/75">{home.insight.text}</p>
          </div>
          <div className="space-y-3 self-center">
            {[
              { l: 'Wealth manager', v: '0.75% + VAT', s: 'min £2,500 + VAT a year', w: '100%', c: 'bg-white/30' },
              { l: 'Trustwise Board plan', v: '£1,800 / year', s: '+ ~0.10% ETF fees', w: '45%', c: 'bg-mint' },
              { l: 'Doing nothing', v: `−${pct(0.015, 1)} / year`, s: 'real loss on a 2% account', w: '30%', c: 'bg-salmon' },
            ].map((b) => (
              <div key={b.l} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="flex justify-between text-sm font-semibold">
                  <span>{b.l}</span>
                  <span>{b.v}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div className={`h-full rounded-full ${b.c}`} style={{ width: b.w }} />
                </div>
                <p className="mt-1.5 text-xs text-white/60">{b.s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How it works */}
      <section id="how" className="container-page py-20">
        <SectionHeader eyebrow="How it works" title="From bank balance to board decision in four steps." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {home.steps.map((s, i) => (
            <StepCard key={s.title} n={i + 1} title={s.title} text={s.text} />
          ))}
        </div>
      </section>

      {/* 5. The five modules */}
      <section className="container-page">
        <SectionHeader eyebrow="Inside Trustwise" title="Five modules, one board-ready answer." sub="Each module is built on a method from asset management, translated into plain English." />
        <div className="grid gap-3">
          {home.modules.map((m, i) => (
            <div key={m.name} className="card flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:gap-6">
              <span className="font-display text-3xl font-bold text-lilac-strong">0{i + 1}</span>
              <h3 className="w-48 shrink-0 text-lg font-semibold">{m.name}</h3>
              <p className="flex-1 text-[15px] text-ink-soft">{m.text}</p>
              <span className="self-start rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ink-soft sm:self-center">{m.session}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Why Trustwise */}
      <section className="container-page py-20">
        <SectionHeader eyebrow="Why Trustwise" title="Built for volunteer boards, not fund managers." center />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {home.why.map((w) => (
            <div key={w.title} className="card p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lavender text-violet">
                <Icon name={w.icon} />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Example charity */}
      <section className="container-page">
        <div className="card grid gap-8 p-8 sm:p-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <span className="eyebrow">Example</span>
            <h2 className="mt-4 text-3xl font-semibold">{EXAMPLE.charityName}</h2>
            <p className="mt-3 leading-relaxed text-ink-soft">
              A community charity with {gbpShort(EXAMPLE.income)} income and {gbpShort(EXAMPLE.reserves)} in the bank, of which{' '}
              {gbpShort(EXAMPLE.restricted)} restricted. The board would hold through a fall and accept up to 20% in a bad year.
            </p>
            <button onClick={tryExample} className="btn-primary mt-6">
              See the full result <span aria-hidden="true">→</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Tile l="Can be invested" v={gbp(ex.investable)} c="bg-ink text-white" />
            <Tile l="Profile" v={`${ex.profile} · ${pct(ex.y)} markets`} c="bg-lavender" />
            <Tile l="1-in-20 bad year" v={gbp(ex.badYear)} c="bg-salmon-soft" />
            <Tile l="In 2008" v={`${signedPct(ex.stress[0].portfolio)} vs ${signedPct(ex.stress[0].world)}`} c="bg-amber-soft" />
          </div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="container-page py-20 text-center">
        <h2 className="mx-auto max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">{home.finalTitle}</h2>
        <p className="mt-4 text-lg text-muted">{home.finalSub}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/check" className="btn-primary">
            {home.cta} <span aria-hidden="true">→</span>
          </Link>
          <Link to="/learn" className="btn-ghost">
            Read the guide first
          </Link>
        </div>
      </section>
    </div>
  )
}

function Tile({ l, v, c }: { l: string; v: string; c: string }) {
  return (
    <div className={`rounded-card p-5 ${c}`}>
      <p className="text-xs font-semibold opacity-70">{l}</p>
      <p className="mt-2 font-display text-xl font-bold leading-tight">{v}</p>
    </div>
  )
}
