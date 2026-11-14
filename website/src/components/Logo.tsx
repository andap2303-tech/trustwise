import { Link } from 'react-router-dom'
import { Mark } from './home/PhoneFrame'

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="inline-flex items-center gap-2.5 rounded-lg" aria-label="Trustwise home">
      <Mark className="h-8 w-8" />
      <span className={`font-display text-[19px] font-bold tracking-tight ${light ? 'text-white' : 'text-ink'}`}>
        TRUST<span className="text-violet">WISE</span>
      </span>
    </Link>
  )
}
