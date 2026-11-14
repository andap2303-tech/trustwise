import { Link, NavLink } from 'react-router-dom'
import { nav } from '../content/copy'
import { usePlus } from '../state/PlusContext'
import Logo from './Logo'

export default function Navbar() {
  const { isPlusDemo } = usePlus()
  return (
    <header className="sticky top-0 z-40 pt-3 print:hidden">
      <div className="container-page">
        <nav className="flex h-16 items-center justify-between gap-2 rounded-full border border-white/60 bg-white/75 px-2 pl-4 shadow-soft backdrop-blur-md sm:gap-4 sm:px-3 sm:pl-5">
          <Logo />
          <ul className="hidden items-center gap-1 md:flex">
            {nav.links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition hover:bg-sand hover:text-ink"
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              to="/pricing"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-gradient-to-r from-salmon-soft to-amber-soft px-3 text-sm font-semibold text-ink ring-1 ring-salmon/30 transition hover:ring-salmon sm:px-4"
            >
              {isPlusDemo ? (
                <>
                  <span className="hidden sm:inline">Board plan ✦</span>
                  <span className="sm:hidden">✦ Board</span>
                  <span className="h-2 w-2 rounded-full bg-gain" aria-hidden="true" />
                </>
              ) : (
                <><span className="hidden sm:inline">Board plan</span><span className="sm:hidden">✦</span></>
              )}
            </Link>
            <Link to="/check" className="btn-primary min-h-11 px-4 text-sm sm:px-5">
              <span className="sm:hidden">{nav.ctaShort}</span>
              <span className="hidden sm:inline">{nav.cta}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
