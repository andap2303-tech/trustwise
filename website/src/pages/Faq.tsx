import { faq } from '../content/faq'
import { faqPage } from '../content/pages'
import StubPage from './StubPage'

export default function Faq() {
  return (
    <StubPage eyebrow={faqPage.eyebrow} title={faqPage.title}>
      <div className="max-w-3xl space-y-3">
        {faq.map((f) => (
          <details key={f.q} className="card group p-6 open:shadow-lift">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
              {f.q}
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-white transition group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{f.a}</p>
          </details>
        ))}
      </div>
    </StubPage>
  )
}
