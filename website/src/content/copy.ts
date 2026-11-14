// All site copy in one place. Numbers come from the project notebook and the business plan.

export const nav = {
  links: [
    { to: '/learn', label: 'Learn' },
    { to: '/partners', label: 'For accountants' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/faq', label: 'FAQ' },
  ],
  cta: 'Check your reserves',
  ctaShort: 'Start',
}

export const disclaimer =
  'Trustwise is a decision-support and education tool for charity trustees. It is not regulated investment advice and does not recommend specific products. Model portfolios use broad, low-cost UCITS ETF categories. Past performance and stress tests do not predict future returns: investments can fall as well as rise. Trustees remain responsible for their decisions under Charity Commission guidance CC14 and CC19.'

export const footer = {
  tagline: 'The investment copilot for UK charity boards.',
  student: 'Demo built for an ESCP Business School project (KX09). Anonymous submission.',
  links: [
    { to: '/check', label: 'Reserves check' },
    { to: '/learn', label: 'Learn' },
    { to: '/partners', label: 'For accountants' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/about', label: 'About' },
    { to: '/faq', label: 'FAQ' },
  ],
}

export const home = {
  eyebrow: 'For UK charity trustees',
  title: ['Your reserves should', 'work as hard as you do.'],
  sub: 'Mid-sized and larger UK charities hold £31bn in cash while inflation eats it. Trustwise tells your board how much can be invested, how, and what a bad year looks like — in five minutes, in plain English.',
  cta: 'Check your reserves',
  example: 'Try an example charity',
  trust: ['Built on CC14 & CC19', 'No data leaves your browser', '5 minutes, 16 questions'],
  marquee: ['Reserve Check', 'Portfolio Builder', 'Bad-Year Lens', 'Board Report', 'Sector Map', 'Cash is not risk-free.'],
  problemTitle: 'Cash feels safe. It isn’t.',
  problemSub: 'Most trustees are volunteers, not investors. Doing nothing feels prudent, but it has a cost that never shows up in the accounts.',
  stats: [
    { value: '£31bn', text: 'held in cash by the 12,973 charities with income above £0.5m (2022 accounts).' },
    { value: '58%', text: 'of them had no long-term investments at all in 2022 — 7,551 charities.' },
    { value: '3.5%', text: 'UK inflation (Sept 2026). Money in a bank account at 2% loses value every year.' },
  ],
  insight: {
    eyebrow: 'The insight',
    title: 'Trustees don’t avoid investing because it’s wrong. They avoid it because it’s unclear.',
    text: 'Wealth managers start at £2,500 + VAT a year and talk in jargon. Doing it yourself feels risky for a volunteer board. So the money stays in the bank. Trustwise sits in the middle: the analysis of a professional, at the price of software, with the board’s duties built in.',
  },
  steps: [
    { title: 'Tell us about the charity', text: 'Income, spending, reserves, restricted funds and the board’s view on risk. 16 short questions.' },
    { title: 'We protect what you need', text: 'Restricted funds, a safety buffer of 3–12 months of spending and any planned project stay in cash.' },
    { title: 'We size the rest', text: 'Your profile is the lower of capacity and tolerance. We mix a diversified ETF portfolio with a cash fund to match it.' },
    { title: 'Your board sees it all', text: 'Expected return, a 1-in-20 bad year in pounds, stress tests and costs, in a board-ready summary.' },
  ],
  why: [
    { icon: 'shield', title: 'Duty-first', text: 'Every step follows CC14 (investing) and CC19 (reserves). The board’s decision is documented.' },
    { icon: 'storm', title: 'Bad year in pounds', text: 'Not just percentages: see what a 1-in-20 bad year and the 2008 crash would cost you.' },
    { icon: 'pound', title: 'A fraction of the cost', text: 'Fund costs around 0.10% a year, versus 0.75% + VAT with a typical manager.' },
    { icon: 'eye', title: 'Plain English', text: 'Written for volunteer trustees, not fund managers. No jargon without an explanation.' },
  ],
  modules: [
    { name: 'Reserve Check', text: 'How much cash you really need: restricted funds, spending buffer, planned projects.', session: 'EDA · cash-flow' },
    { name: 'Portfolio Builder', text: 'Efficient frontier of 8 UCITS ETFs + cash fund, sized to your profile on the CAL.', session: 'Factor models' },
    { name: 'Bad-Year Lens', text: 'GARCH(1,1) volatility, a 1-in-20 bad year and 2008 / 2020 / 2022 stress tests.', session: 'Time series · Risk' },
    { name: 'Board Report', text: 'A one-page summary for the next board meeting, with the CC14 checklist.', session: 'NLP · reporting' },
    { name: 'Sector Map', text: 'K-means clusters of 399k Charity Commission records: compare with charities like you.', session: 'Clustering' },
  ],
  finalTitle: 'Five minutes before your next board meeting.',
  finalSub: 'No sign-up, no data stored. Just your numbers, explained.',
}

export const results = {
  notReady: { title: 'Answer a few questions first', text: 'We need your charity’s numbers to build the plan.', cta: 'Start the reserves check' },
}

export const check = {
  back: 'Back',
  next: 'Next',
  typical: 'Use a typical value',
  privacy: 'Your answers stay in this browser. Nothing is sent or stored.',
  errors: {
    empty: 'Please enter an amount (0 is fine).',
    negative: 'Amounts cannot be negative.',
    zero: 'This needs to be more than £0.',
    tooBig: 'That looks too large. Check the number of zeros.',
    restricted: 'Restricted funds cannot be more than your total cash.',
    name: 'Please type a name (or use the example).',
  },
  crunching: {
    title: 'Building your board summary…',
    ticks: ['Reserves', 'Profile', 'Portfolio', 'Stress tests'],
  },
}
