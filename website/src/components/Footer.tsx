import { Link } from 'react-router-dom'
import { disclaimer, footer } from '../content/copy'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-white/60 print:hidden">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1fr_2fr]">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-muted">{footer.tagline}</p>
          <p className="text-sm font-medium text-ink-soft">{footer.student}</p>
        </div>
        <div className="space-y-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footer.links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm font-medium text-ink-soft hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="max-w-2xl text-xs leading-relaxed text-muted">{disclaimer}</p>
        </div>
      </div>
    </footer>
  )
}
