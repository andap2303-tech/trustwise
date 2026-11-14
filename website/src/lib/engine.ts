// Trustwise engine. Every number below comes from the project notebook
// (Trustwise_Project.ipynb): tangency portfolio of UCITS ETFs, mixed with a
// cash fund on the Capital Allocation Line, GARCH(1,1) volatility, stress tests.

import type { Answers, Profile } from './types'

// --- Market assumptions (notebook output, data 2014–2026) ---
export const INFLATION = 0.035 // UK CPI, Sept 2026
export const BANK_RATE = 0.04 // Bank of England base rate
export const BANK_ACCOUNT = 0.02 // assumed average rate on charity bank balances
export const CASH_FUND = 0.04 // money-market ETF (ERNS) ≈ Bank Rate

/** Share of the portfolio in the risky (tangency) part, y* = (E[Rp]−Rf)/(A·σ²), A = 30/16/10 */
export const RISKY_SHARE: Record<Profile, number> = { Careful: 0.34, Balanced: 0.64, Growth: 1 }

/** Expected return, GARCH volatility and prudent 1-in-20 bad year (−1.645σ: we do not count on the expected return), per profile. */
export const PROFILE_STATS: Record<Profile, { er: number; vol: number; bad: number }> = {
  Careful: { er: 0.055, vol: 0.054, bad: -0.089 },
  Balanced: { er: 0.085, vol: 0.101, bad: -0.1664 },
  Growth: { er: 0.121, vol: 0.157, bad: -0.258 },
}

/** Months of spending kept in cash before anything is invested (notebook BUFFER_MONTHS). */
export const BUFFER_MONTHS: Record<Profile, number> = { Careful: 12, Balanced: 6, Growth: 3 }

/** Tangency portfolio (risky part) grouped by region. Long-only, max 40% per fund, gold ≤ 10%. */
export const RISKY_WEIGHTS: { name: string; weight: number; fund: string; ter: number }[] = [
  { name: 'US equities', weight: 0.4, fund: 'S&P 500 UCITS ETF', ter: 0.0007 },
  { name: 'Japan equities', weight: 0.35, fund: 'MSCI Japan UCITS ETF', ter: 0.0012 },
  { name: 'Europe equities', weight: 0.15, fund: 'MSCI Europe UCITS ETF', ter: 0.0012 },
  { name: 'Gold', weight: 0.1, fund: 'Physical gold ETC', ter: 0.0012 },
]
export const CASH_FUND_TER = 0.0009

export const ALLOC_COLORS: Record<string, string> = {
  'US equities': '#14213D',
  'Japan equities': '#167A68',
  'Europe equities': '#3FB497',
  Gold: '#E8B04B',
  'Cash fund': '#C9D6D1',
}

/** Stress tests: risky part, world equities (ACWI) and cash, real historical returns. */
export const STRESS = [
  { name: '2008 financial crisis', risky: -0.393, world: -0.492, cash: 0.005 },
  { name: '2020 Covid crash', risky: -0.272, world: -0.333, cash: 0.003 },
  { name: '2022 rates shock', risky: -0.246, world: -0.264, cash: 0.006 },
]

// --- Pricing (business plan) ---
export const PRICES = { starter: 444, board: 1800, partner: 1440 }
export const MANAGER = { fee: 0.0075, vat: 0.2, min: 2500 } // typical discretionary manager, 0.75% + VAT, £2,500 minimum

// --- Scores ---
const HORIZON_SCORE: Record<Answers['horizon'], number> = {
  'Less than 3 years': 10, '3–5 years': 40, '5–10 years': 70, 'More than 10 years': 90,
}
const STABILITY_ADJ: Record<Answers['stability'], number> = {
  'Stable (multi-year grants, contracts)': 10, 'Varies a little': 0, 'Varies a lot (appeals, events)': -20,
}
const DROP_SCORE: Record<Answers['dropReaction'], number> = {
  'Sell to stop further losses': 10, 'Sell part of it': 35, 'Hold and wait': 65, 'Invest more while prices are low': 90,
}
const LOSS_SCORE: Record<Answers['maxLoss'], number> = {
  'Up to 5%': 15, 'Up to 10%': 35, 'Up to 20%': 65, 'More than 20% is fine': 90,
}

const clamp = (x: number) => Math.max(0, Math.min(100, x))
export const profileFromScore = (s: number): Profile => (s < 40 ? 'Careful' : s < 70 ? 'Balanced' : 'Growth')

export interface EngineResult {
  monthlySpend: number
  unrestricted: number
  monthsCovered: number
  surplus: number
  capacity: number
  tolerance: number
  limiting: 'capacity' | 'tolerance'
  profile: Profile
  bufferMonths: number
  buffer: number
  project: number
  safeCash: number
  investable: number
  y: number
  stats: { er: number; vol: number; bad: number }
  allocation: { name: string; weight: number }[]
  badYear: number
  yearlyGain: number
  erosion: number
  costs: { trustwise: number; funds: number; total: number; manager: number; saving: number; ter: number }
  stress: { name: string; portfolio: number; world: number; cash: number; loss: number }[]
  projection: { year: number; portfolio: number; low: number; high: number; bank: number; real: number }[]
  inTarget: boolean
  warnings: string[]
  checklist: { label: string; ok: boolean; note: string }[]
}

export function allocationFor(y: number) {
  return [
    ...RISKY_WEIGHTS.map((r) => ({ name: r.name, weight: r.weight * y })),
    { name: 'Cash fund', weight: 1 - y },
  ].filter((a) => a.weight > 0.0001)
}

export function runEngine(a: Answers, override?: Profile): EngineResult {
  const monthlySpend = a.spending / 12
  const restricted = Math.min(a.restricted, a.reserves)
  const unrestricted = a.reserves - restricted
  const monthsCovered = monthlySpend > 0 ? unrestricted / monthlySpend : 0
  const surplus = a.income - a.spending

  // Capacity: can the charity afford a bad year? Horizon, income stability, coverage, surplus.
  let capacity = HORIZON_SCORE[a.horizon] + STABILITY_ADJ[a.stability]
  capacity += surplus >= 0 ? 5 : -10
  capacity += monthsCovered >= 12 ? 10 : monthsCovered < 6 ? -10 : 0
  capacity = clamp(capacity)
  // Tolerance: how would the board behave in a bad year?
  const tolerance = clamp((DROP_SCORE[a.dropReaction] + LOSS_SCORE[a.maxLoss]) / 2)
  const limiting = capacity <= tolerance ? 'capacity' : 'tolerance'
  const profile = override ?? profileFromScore(Math.min(capacity, tolerance))

  const bufferMonths = BUFFER_MONTHS[profile]
  const buffer = monthlySpend * bufferMonths
  const project = a.bigProject === 'No' ? 0 : a.bigProjectAmount
  const safeCash = Math.min(unrestricted, buffer + project)
  const investable = a.horizon === 'Less than 3 years' ? 0 : Math.max(0, unrestricted - buffer - project)

  const y = RISKY_SHARE[profile]
  const stats = PROFILE_STATS[profile]
  const allocation = allocationFor(y)
  const ter = RISKY_WEIGHTS.reduce((s, r) => s + r.weight * r.ter, 0) * y + CASH_FUND_TER * (1 - y)

  const badYear = investable * stats.bad
  const yearlyGain = investable * (stats.er - BANK_ACCOUNT)
  const erosion = a.reserves * (INFLATION - BANK_ACCOUNT)

  const funds = investable * ter
  const trustwise = PRICES.board
  const manager = investable > 0 ? Math.max(MANAGER.min, investable * MANAGER.fee) * (1 + MANAGER.vat) : 0
  const costs = { trustwise, funds, total: trustwise + funds, manager, saving: manager - (trustwise + funds), ter }

  const stress = STRESS.map((s) => {
    const portfolio = y * s.risky + (1 - y) * s.cash
    return { name: s.name, portfolio, world: s.world, cash: s.cash, loss: investable * portfolio }
  })

  // 10-year projection: expected path and a 1-in-10 good/bad band (lognormal approximation)
  const mu = Math.log(1 + stats.er) - stats.vol ** 2 / 2
  const projection = Array.from({ length: 11 }, (_, t) => ({
    year: t,
    portfolio: investable * (1 + stats.er) ** t,
    low: investable * Math.exp(mu * t - 1.2816 * stats.vol * Math.sqrt(t)),
    high: investable * Math.exp(mu * t + 1.2816 * stats.vol * Math.sqrt(t)),
    bank: investable * (1 + BANK_ACCOUNT) ** t,
    real: investable * (1 + INFLATION) ** t,
  }))

  const warnings: string[] = []
  if (a.horizon === 'Less than 3 years')
    warnings.push('With less than 3 years, the money should stay in cash or a cash fund. Investing is for money you will not need soon.')
  if (investable === 0 && a.horizon !== 'Less than 3 years')
    warnings.push(`Your unrestricted cash covers ${monthsCovered.toFixed(1)} months of spending. That is below the ${bufferMonths}-month buffer for a ${profile} profile, so we suggest building reserves before investing.`)
  if (surplus < 0)
    warnings.push(`You spent ${Math.round((-surplus / a.income) * 100)}% more than you earned last year. Check the budget before committing money for the long term.`)
  if (a.nation !== 'England & Wales')
    warnings.push(`${a.nation === 'Scotland' ? 'OSCR' : 'The Charity Commission for Northern Ireland'} sets the rules for your charity. Duties are very similar to CC14, but check their guidance.`)

  const checklist = [
    { label: 'Written reserves policy', ok: a.reservesPolicy === 'Yes, written and reviewed', note: a.reservesPolicy === 'No' ? 'CC19 expects one. Trustwise drafts it for you.' : a.reservesPolicy === 'Yes, but out of date' ? 'Review it this year: CC19 was updated in Sept 2026.' : 'Good. Review it every year.' },
    { label: 'Restricted funds kept separate', ok: true, note: `${restricted > 0 ? `£${Math.round(restricted / 1000)}k` : 'No'} restricted money stays in cash.` },
    { label: `Safety buffer of ${bufferMonths} months`, ok: monthsCovered >= bufferMonths, note: monthsCovered >= bufferMonths ? 'Covered before anything is invested.' : `You hold ${monthsCovered.toFixed(1)} months today.` },
    { label: 'Diversified investments', ok: a.current !== 'All in bank accounts', note: a.current === 'All in bank accounts' ? 'All in cash: inflation risk is not managed.' : 'Check costs and diversification each year.' },
    { label: 'Ethical policy recorded', ok: a.ethics !== 'No restrictions', note: a.ethics === 'No restrictions' ? 'Optional, but CC14 asks you to consider it.' : 'Applied to the model portfolio.' },
  ]

  return {
    monthlySpend, unrestricted, monthsCovered, surplus, capacity, tolerance, limiting, profile,
    bufferMonths, buffer, project, safeCash, investable, y, stats, allocation, badYear, yearlyGain,
    erosion, costs, stress, projection, inTarget: a.income >= 500_000 && a.income <= 10_000_000,
    warnings, checklist,
  }
}
