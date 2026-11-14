// Questionnaire answers (one charity) and shared types.

export type Nation = 'England & Wales' | 'Scotland' | 'Northern Ireland'
export type IncomeSource = 'Donations & fundraising' | 'Grants' | 'Contracts & trading' | 'Legacies' | 'A mix of these'
export type Stability = 'Stable (multi-year grants, contracts)' | 'Varies a little' | 'Varies a lot (appeals, events)'
export type BigProject = 'No' | 'Building or property' | 'New programme' | 'IT or systems' | 'Other'
export type ReservesPolicy = 'Yes, written and reviewed' | 'Yes, but out of date' | 'No'
export type Current = 'All in bank accounts' | 'Some in a fund' | 'With an investment manager'
export type Horizon = 'Less than 3 years' | '3–5 years' | '5–10 years' | 'More than 10 years'
export type DropReaction = 'Sell to stop further losses' | 'Sell part of it' | 'Hold and wait' | 'Invest more while prices are low'
export type MaxLoss = 'Up to 5%' | 'Up to 10%' | 'Up to 20%' | 'More than 20% is fine'
export type Ethics = 'No restrictions' | 'Exclude tobacco and weapons' | 'Full ethical (ESG) screening'

export interface Answers {
  charityName: string
  nation: Nation
  income: number
  spending: number
  incomeSource: IncomeSource
  stability: Stability
  reserves: number
  restricted: number
  bigProject: BigProject
  bigProjectAmount: number
  reservesPolicy: ReservesPolicy
  current: Current
  horizon: Horizon
  dropReaction: DropReaction
  maxLoss: MaxLoss
  ethics: Ethics
}

export type Profile = 'Careful' | 'Balanced' | 'Growth'
export const PROFILES: Profile[] = ['Careful', 'Balanced', 'Growth']
