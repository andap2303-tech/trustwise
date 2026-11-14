// All questionnaire questions as data. Components only render them.

import type { Answers } from '../lib/types'

export type Section = 'Your charity' | 'Money in and out' | 'Reserves' | 'Board and risk'
export const SECTIONS: Section[] = ['Your charity', 'Money in and out', 'Reserves', 'Board and risk']

export type QuestionId = keyof Answers

interface BaseQuestion {
  id: QuestionId
  section: Section
  /** Question text. Wrap the key words in **double asterisks** to bold them. */
  text: string
  helper?: string
  /** Skip this question (and set it to its fallback value) when true. */
  skipIf?: (a: Partial<Answers>) => boolean
}

export interface MoneyQuestion extends BaseQuestion {
  type: 'money'
  chips: number[]
  default: number
  min?: number
  suffix?: string
}

export interface TextQuestion extends BaseQuestion {
  type: 'text'
  placeholder: string
  default: string
}

export interface ChoiceQuestion extends BaseQuestion {
  type: 'single'
  options: string[]
}

export type Question = MoneyQuestion | TextQuestion | ChoiceQuestion

export const MAX_AMOUNT = 500_000_000

export const questions: Question[] = [
  // --- Your charity ---
  {
    id: 'charityName',
    section: 'Your charity',
    type: 'text',
    text: 'What is your **charity’s name**?',
    helper: 'Only used to personalise your board summary. Nothing leaves your browser.',
    placeholder: 'e.g. Riverside Community Trust',
    default: 'Your charity',
  },
  {
    id: 'nation',
    section: 'Your charity',
    type: 'single',
    text: 'Where is your charity **registered**?',
    helper: 'The investment rules (CC14) apply in England & Wales. Scotland and Northern Ireland have similar duties.',
    options: ['England & Wales', 'Scotland', 'Northern Ireland'],
  },
  {
    id: 'incomeSource',
    section: 'Your charity',
    type: 'single',
    text: 'Where does **most of your income** come from?',
    options: ['Donations & fundraising', 'Grants', 'Contracts & trading', 'Legacies', 'A mix of these'],
  },
  // --- Money in and out ---
  {
    id: 'income',
    section: 'Money in and out',
    type: 'money',
    text: 'What was your **total income** last year?',
    helper: 'From your latest annual accounts. Our core users are charities with £500k–£10m.',
    chips: [500_000, 1_000_000, 2_500_000, 5_000_000],
    default: 1_500_000,
    min: 1,
    suffix: '/ year',
  },
  {
    id: 'spending',
    section: 'Money in and out',
    type: 'money',
    text: 'And your **total spending** last year?',
    helper: 'Staff, programmes, rent, everything. This sets your safety buffer.',
    chips: [450_000, 900_000, 2_400_000, 5_200_000],
    default: 1_400_000,
    min: 1,
    suffix: '/ year',
  },
  {
    id: 'stability',
    section: 'Money in and out',
    type: 'single',
    text: 'How **predictable** is your income from year to year?',
    options: ['Stable (multi-year grants, contracts)', 'Varies a little', 'Varies a lot (appeals, events)'],
  },
  // --- Reserves ---
  {
    id: 'reserves',
    section: 'Reserves',
    type: 'money',
    text: 'How much **cash** does the charity hold today, in total?',
    helper: 'All bank and deposit accounts, including restricted money.',
    chips: [500_000, 1_000_000, 2_000_000, 5_000_000],
    default: 1_200_000,
    min: 0,
  },
  {
    id: 'restricted',
    section: 'Reserves',
    type: 'money',
    text: 'How much of that cash is **restricted** (given for a specific purpose)?',
    helper: 'Restricted funds must follow the donor’s wishes, so we leave them in cash.',
    chips: [0, 100_000, 250_000, 500_000],
    default: 200_000,
    min: 0,
  },
  {
    id: 'bigProject',
    section: 'Reserves',
    type: 'single',
    text: 'Is the board planning a **big spend** in the next 3 years?',
    options: ['No', 'Building or property', 'New programme', 'IT or systems', 'Other'],
  },
  {
    id: 'bigProjectAmount',
    section: 'Reserves',
    type: 'money',
    text: 'Roughly **how much** will it cost?',
    helper: 'We keep this money aside in cash, so the project never depends on markets.',
    chips: [50_000, 100_000, 250_000, 500_000],
    default: 100_000,
    min: 0,
    skipIf: (a) => a.bigProject === 'No',
  },
  {
    id: 'reservesPolicy',
    section: 'Reserves',
    type: 'single',
    text: 'Does the charity have a **reserves policy**?',
    helper: 'The Charity Commission’s updated reserves guidance (CC19) expects one.',
    options: ['Yes, written and reviewed', 'Yes, but out of date', 'No'],
  },
  {
    id: 'current',
    section: 'Reserves',
    type: 'single',
    text: 'Where is your **long-term money** today?',
    options: ['All in bank accounts', 'Some in a fund', 'With an investment manager'],
  },
  // --- Board and risk ---
  {
    id: 'horizon',
    section: 'Board and risk',
    type: 'single',
    text: 'If you invest, **how long** can the money stay invested?',
    helper: 'The longer the horizon, the more time to recover from a bad year.',
    options: ['Less than 3 years', '3–5 years', '5–10 years', 'More than 10 years'],
  },
  {
    id: 'dropReaction',
    section: 'Board and risk',
    type: 'single',
    text: 'Markets fall **20%** in a few months. What would your **board** most likely do?',
    options: ['Sell to stop further losses', 'Sell part of it', 'Hold and wait', 'Invest more while prices are low'],
  },
  {
    id: 'maxLoss',
    section: 'Board and risk',
    type: 'single',
    text: 'In a **bad year**, what is the biggest loss the board could accept on invested money?',
    options: ['Up to 5%', 'Up to 10%', 'Up to 20%', 'More than 20% is fine'],
  },
  {
    id: 'ethics',
    section: 'Board and risk',
    type: 'single',
    text: 'Does your charity have **ethical rules** for investments?',
    helper: 'CC14 lets trustees exclude investments that conflict with their purpose.',
    options: ['No restrictions', 'Exclude tobacco and weapons', 'Full ethical (ESG) screening'],
  },
]

/** A ready-made example charity for the "Try an example" button. */
export const EXAMPLE: Answers = {
  charityName: 'Riverside Community Trust',
  nation: 'England & Wales',
  incomeSource: 'A mix of these',
  income: 650_000,
  spending: 600_000,
  stability: 'Varies a little',
  reserves: 1_000_000,
  restricted: 200_000,
  bigProject: 'No',
  bigProjectAmount: 0,
  reservesPolicy: 'Yes, but out of date',
  current: 'All in bank accounts',
  horizon: '5–10 years',
  dropReaction: 'Hold and wait',
  maxLoss: 'Up to 20%',
  ethics: 'Exclude tobacco and weapons',
}

/** Questions shown for the current answers (conditional ones hidden). */
export const visibleQuestions = (a: Partial<Answers>) => questions.filter((q) => !q.skipIf?.(a))

/** Value stored for a skipped question. */
export const skippedValue = (q: Question) => (q.type === 'money' ? 0 : q.type === 'text' ? q.default : q.options[0])
