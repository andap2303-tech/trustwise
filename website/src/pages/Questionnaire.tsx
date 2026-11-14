import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Chips from '../components/Chips'
import MoneyInput from '../components/MoneyInput'
import OptionButton from '../components/OptionButton'
import ProgressBar from '../components/ProgressBar'
import { check } from '../content/copy'
import {
  MAX_AMOUNT,
  questions,
  skippedValue,
  visibleQuestions,
  type ChoiceQuestion,
  type MoneyQuestion,
  type QuestionId,
  type TextQuestion,
} from '../content/questions'
import type { Answers } from '../lib/types'
import { useAnswers } from '../state/AnswersContext'

/** Renders "**bold**" segments from the question data. */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
        part.startsWith('**') ? (
          <span key={i} className="text-salmon">
            {part.slice(2, -2)}
          </span>
        ) : (
          part
        ),
      )}
    </>
  )
}


export default function Questionnaire() {
  const navigate = useNavigate()
  const { answers, setAnswer, setAll } = useAnswers()
  const [currentId, setCurrentId] = useState<QuestionId>(questions[0].id)
  const [crunching, setCrunching] = useState(false)
  const advanceTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(advanceTimer.current), [])

  const visible = useMemo(() => visibleQuestions(answers), [answers])
  const index = Math.max(0, visible.findIndex((q) => q.id === currentId))
  const q = visible[index]

  const sectionQs = visible.filter((v) => v.section === q.section)
  const sectionProgress = (sectionQs.indexOf(q) + 1) / sectionQs.length

  /** Move to the next visible question, given the latest answers. */
  function goNext(latest: Partial<Answers>) {
    const vis = visibleQuestions(latest)
    const i = vis.findIndex((v) => v.id === currentId)
    if (i < vis.length - 1) {
      setCurrentId(vis[i + 1].id)
    } else {
      finish(latest)
    }
  }

  function goBack() {
    window.clearTimeout(advanceTimer.current)
    if (index === 0) navigate('/')
    else setCurrentId(visible[index - 1].id)
  }

  function finish(latest: Partial<Answers>) {
    // Questions that were skipped get their neutral value (0 or empty list).
    const complete: Record<string, unknown> = { ...latest }
    for (const question of questions) {
      if (question.skipIf?.(latest)) complete[question.id] = skippedValue(question)
    }
    setAll(complete as Partial<Answers>)
    setCrunching(true)
    window.setTimeout(() => navigate('/results'), 1600)
  }

  if (crunching) return <Crunching />

  return (
    <div className="relative overflow-x-clip">
      <div className="halo -top-24 -right-24 h-80 w-80 bg-lilac/60" />
      <div className="halo top-80 -left-32 h-72 w-72 bg-salmon-soft" />
      <div className="container-page relative py-8 sm:py-12">
        <div className="mx-auto max-w-xl">
          <div className="card p-5 sm:p-8">
            <div className="mb-8 flex items-center gap-3">
              <button
                type="button"
                onClick={goBack}
                className="btn-ghost min-h-11 shrink-0 px-4 text-sm"
                aria-label={check.back}
              >
                <span aria-hidden="true">←</span> {check.back}
              </button>
              <div className="flex-1">
                <ProgressBar
                  section={q.section}
                  sectionProgress={sectionProgress}
                  step={index + 1}
                  total={visible.length}
                />
              </div>
            </div>

            <div key={q.id} className="animate-rise">
              <h1 id={`q-${q.id}`} className="text-2xl font-semibold leading-snug sm:text-3xl">
                <RichText text={q.text} />
              </h1>
              {q.helper && <p className="mt-3 text-[15px] text-muted">{q.helper}</p>}

              <div className="mt-8">
                {q.type === 'money' ? (
                  <MoneyStep
                    q={q}
                    initial={answers[q.id] as number | undefined}
                    suffix={q.suffix ?? 'total'}
                    maxValue={q.id === 'restricted' ? answers.reserves : undefined}
                    onDone={(v) => {
                      setAnswer(q.id, v as never)
                      goNext({ ...answers, [q.id]: v })
                    }}
                  />
                ) : q.type === 'single' ? (
                  <SingleStep
                    q={q}
                    value={answers[q.id] as string | undefined}
                    onPick={(v) => {
                      setAnswer(q.id, v as never)
                      window.clearTimeout(advanceTimer.current)
                      advanceTimer.current = window.setTimeout(
                        () => goNext({ ...answers, [q.id]: v }),
                        300,
                      )
                    }}
                  />
                ) : (
                  <TextStep
                    q={q}
                    initial={(answers[q.id] as string | undefined) ?? ''}
                    onDone={(v) => {
                      setAnswer(q.id, v as never)
                      goNext({ ...answers, [q.id]: v })
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          <p className="mt-5 flex items-center justify-center gap-2 text-sm text-muted">
            <LockIcon /> {check.privacy}
          </p>
        </div>
      </div>
    </div>
  )
}

function MoneyStep({
  q,
  initial,
  suffix,
  maxValue,
  onDone,
}: {
  q: MoneyQuestion
  initial?: number
  suffix: string
  maxValue?: number
  onDone: (v: number) => void
}) {
  const [draft, setDraft] = useState(initial !== undefined ? String(initial) : '')
  const [error, setError] = useState<string | null>(null)
  const errId = `err-${q.id}`

  function submit(raw = draft) {
    if (raw.trim() === '') return setError(check.errors.empty)
    const n = Number(raw)
    if (n < 0) return setError(check.errors.negative)
    if (q.min && n < q.min) return setError(check.errors.zero)
    if (maxValue !== undefined && n > maxValue) return setError(check.errors.restricted)
    if (n > MAX_AMOUNT) return setError(check.errors.tooBig)
    setError(null)
    onDone(n)
  }

  return (
    <div className="space-y-5">
      <MoneyInput
        id={q.id}
        label={q.text.replace(/\*\*/g, '')}
        value={draft}
        onChange={(v) => {
          setDraft(v)
          setError(null)
        }}
        onSubmit={() => submit()}
        invalid={!!error}
        describedBy={error ? errId : undefined}
        suffix={suffix}
      />
      {error && (
        <p id={errId} role="alert" className="text-sm font-medium text-loss">
          {error}
        </p>
      )}
      <Chips
        values={q.chips}
        current={draft === '' ? null : Number(draft)}
        onPick={(v) => {
          setDraft(String(v))
          setError(null)
        }}
      />
      <div className="flex flex-col-reverse items-stretch gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => {
            setDraft(String(q.default))
            setError(null)
          }}
          className="min-h-11 rounded-full px-2 text-sm font-semibold text-violet underline-offset-4 hover:underline"
        >
          {check.typical}
        </button>
        <button type="button" onClick={() => submit()} className="btn-primary">
          {check.next} <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  )
}

function SingleStep({
  q,
  value,
  onPick,
}: {
  q: ChoiceQuestion
  value?: string
  onPick: (v: string) => void
}) {
  return (
    <div className="grid gap-3" role="radiogroup" aria-labelledby={`q-${q.id}`}>
      {q.options.map((o, i) => (
        <OptionButton key={o} index={i} label={o} selected={value === o} onClick={() => onPick(o)} />
      ))}
    </div>
  )
}

function TextStep({
  q,
  initial,
  onDone,
}: {
  q: TextQuestion
  initial: string
  onDone: (v: string) => void
}) {
  const [draft, setDraft] = useState(initial)
  const [error, setError] = useState(false)
  const submit = () => (draft.trim() === '' ? setError(true) : onDone(draft.trim()))
  return (
    <div className="space-y-5">
      <input
        autoFocus
        aria-label={q.text.replace(/\*\*/g, '')}
        value={draft}
        placeholder={q.placeholder}
        onChange={(e) => {
          setDraft(e.target.value)
          setError(false)
        }}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        maxLength={60}
        className={`w-full rounded-2xl border-2 bg-white px-5 py-4 font-display text-2xl font-semibold outline-none transition placeholder:text-line focus:border-ink ${error ? 'border-loss' : 'border-line'}`}
      />
      {error && (
        <p role="alert" className="text-sm font-medium text-loss">
          {check.errors.name}
        </p>
      )}
      <div className="flex flex-col-reverse items-stretch gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={() => setDraft('Riverside Community Trust')} className="min-h-11 rounded-full px-2 text-sm font-semibold text-violet underline-offset-4 hover:underline">
          Use an example name
        </button>
        <button type="button" className="btn-primary" onClick={submit}>
          {check.next} <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  )
}

function Crunching() {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="card w-full max-w-md p-10 text-center" role="status" aria-live="polite">
        <div className="mx-auto mb-6 h-14 w-14 animate-spin rounded-full border-4 border-lavender border-t-salmon" />
        <h1 className="text-2xl font-semibold">{check.crunching.title}</h1>
        <ul className="mt-6 flex justify-center gap-4 text-sm font-semibold">
          {check.crunching.ticks.map((t, i) => (
            <li
              key={t}
              className="animate-rise text-ink-soft"
              style={{ animationDelay: `${300 + i * 400}ms` }}
            >
              {t} <span className="text-gain">✓</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
      <rect x="3" y="7" width="10" height="7" rx="2" fill="currentColor" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.6" fill="none" />
    </svg>
  )
}

