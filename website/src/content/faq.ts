export interface FaqItem {
  q: string
  a: string
}

export const faq: FaqItem[] = [
  { q: 'Is this investment advice?', a: 'No. Trustwise is decision support and education. It shows model portfolios by profile, using broad ETF categories, and documents the board’s reasoning. Personal recommendations are regulated advice: that is a future Board+ service with an FCA-authorised partner.' },
  { q: 'Are trustees allowed to invest reserves?', a: 'Yes. Under the Charities Act 2011 and Charity Commission guidance CC14, trustees can invest money the charity does not need soon. They must consider suitability and diversification, take advice where needed, and review investments regularly.' },
  { q: 'What happens to restricted funds?', a: 'We leave them in cash. Restricted money must be used for the purpose the donor set, and many restrictions also limit how the money can be held.' },
  { q: 'How do you choose the safety buffer?', a: 'Careful charities keep 12 months of spending in cash, Balanced 6 months, Growth 3 months. Any planned project in the next 3 years is added on top. Only the money left is invested.' },
  { q: 'Why the lower of capacity and tolerance?', a: 'Capacity is what the charity can afford to lose (time horizon, income stability, reserves). Tolerance is what the board is comfortable with. If either is low, the portfolio should be careful. Taking the lower one protects the charity from both risks.' },
  { q: 'What is a 1-in-20 bad year?', a: 'A loss that should happen about once every twenty years. We estimate it from current market volatility (a GARCH model), prudently, without counting on the expected return, and show it in pounds, so the board knows the downside before it invests.' },
  { q: 'Why ETFs?', a: 'Exchange-traded funds hold hundreds of companies in one product, at very low cost (around 0.10% a year in our portfolio). Fees matter: on £500k, the gap between 0.10% and 0.90% is £4,000 every year.' },
  { q: 'Do you store our data?', a: 'No. In this demo everything runs in your browser. Your answers never leave your device and disappear when you close the tab.' },
  { q: 'What about ethical investing?', a: 'CC14 lets trustees exclude investments that conflict with the charity’s purpose. We record your ethical policy in the board report. Fully custom ethical portfolios are coming with Board+ Custom.' },
  { q: 'How does Trustwise make money?', a: 'Subscriptions: Starter £37 a month, Board £1,800 a year, and the Partner plan for accountants at £1,440 per client. No commissions from fund providers, so our numbers never depend on what you buy.' },
]
