import { useState } from 'react'
import { partners as p } from '../content/pages'
import StubPage from './StubPage'

export default function Partners() {
  const [sent, setSent] = useState(false)
  return (
    <StubPage eyebrow={p.eyebrow} title={p.title} sub={p.sub}>
      <div className="grid gap-4 md:grid-cols-3">
        {p.cards.map((c, i) => (
          <div key={c.title} className={`rounded-card p-7 ${['bg-salmon-soft', 'bg-lavender', 'bg-amber-soft'][i]}`}>
            <h2 className="text-2xl font-semibold">{c.title}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{c.text}</p>
          </div>
        ))}
      </div>
      <p className="mt-10 max-w-2xl text-lg text-ink-soft">{p.how}</p>
      <form
        className="card mt-10 grid max-w-xl gap-4 p-7"
        onSubmit={(e) => {
          e.preventDefault()
          setSent(true)
        }}
      >
        <h2 className="text-2xl font-semibold">{p.form.title}</h2>
        {sent ? (
          <p role="status" className="rounded-2xl bg-lavender p-4 font-semibold">{p.form.thanks}</p>
        ) : (
          <>
            <label className="grid gap-1.5 text-sm font-semibold">
              Organisation
              <input required className="min-h-12 rounded-xl border border-line px-4 font-normal" />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold">
              Work email
              <input required type="email" className="min-h-12 rounded-xl border border-line px-4 font-normal" />
            </label>
            <button className="btn-primary justify-self-start">Send</button>
          </>
        )}
      </form>
    </StubPage>
  )
}
