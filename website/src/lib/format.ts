// Money and percentage formatting, always in pounds: £1,250,000 · £1.3m · 8.5%

const gbpFmt = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 })

export const gbp = (n: number) => gbpFmt.format(Math.round(n))
/** Short form for big numbers: £1.3m, £450k */
export const gbpShort = (n: number) => {
  const a = Math.abs(n)
  const s = n < 0 ? '−' : ''
  if (a >= 1e9) return `${s}£${(a / 1e9).toFixed(1).replace(/\.0$/, '')}bn`
  if (a >= 1e6) return `${s}£${(a / 1e6).toFixed(1).replace(/\.0$/, '')}m`
  if (a >= 1e4) return `${s}£${Math.round(a / 1e3)}k`
  return `${s}${gbp(a)}`
}
export const pct = (x: number, digits = 0) => `${(x * 100).toFixed(digits)}%`
export const signedPct = (x: number, digits = 1) => `${x > 0 ? '+' : x < 0 ? '−' : ''}${Math.abs(x * 100).toFixed(digits)}%`
export const currencySymbol = () => '£'
export const today = () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
