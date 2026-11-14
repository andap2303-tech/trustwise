export default function StepCard({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <div className="card flex h-full flex-col gap-4 p-6">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink font-display text-lg font-semibold text-white">
        {n}
      </span>
      <h3 className="text-lg font-semibold leading-snug">{title}</h3>
      <p className="text-sm leading-relaxed text-muted">{text}</p>
      <div className="mt-auto flex gap-1 pt-2" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={`h-1 flex-1 rounded-full ${i <= n ? 'bg-ink' : 'bg-line'}`} />
        ))}
      </div>
    </div>
  )
}
