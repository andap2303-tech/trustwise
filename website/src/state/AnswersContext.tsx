// Holds the questionnaire answers in React state, mirrored to sessionStorage
// so a page refresh doesn't lose them. Nothing is ever sent to a server.

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { Answers } from '../lib/types'

const KEY = 'trustwise.answers.v2'

function load(): Partial<Answers> {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Partial<Answers>) : {}
  } catch {
    return {}
  }
}

function save(a: Partial<Answers>) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(a))
  } catch {
    // storage unavailable (private mode) — state still works in memory
  }
}

interface Ctx {
  answers: Partial<Answers>
  setAnswer: <K extends keyof Answers>(id: K, value: Answers[K]) => void
  setAll: (a: Partial<Answers>) => void
  reset: () => void
}

const AnswersContext = createContext<Ctx | null>(null)

export function AnswersProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<Partial<Answers>>(load)

  const setAll = useCallback((a: Partial<Answers>) => {
    setAnswers(a)
    save(a)
  }, [])

  const setAnswer = useCallback(<K extends keyof Answers>(id: K, value: Answers[K]) => {
    setAnswers((prev) => {
      const next = { ...prev, [id]: value }
      save(next)
      return next
    })
  }, [])

  const reset = useCallback(() => setAll({}), [setAll])

  return (
    <AnswersContext.Provider value={{ answers, setAnswer, setAll, reset }}>
      {children}
    </AnswersContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAnswers() {
  const ctx = useContext(AnswersContext)
  if (!ctx) throw new Error('useAnswers must be used inside AnswersProvider')
  return ctx
}

/** True when every required field is present, so the engine can run. */
// eslint-disable-next-line react-refresh/only-export-components
export function isComplete(a: Partial<Answers>): a is Answers {
  const keys: (keyof Answers)[] = [
    'charityName', 'nation', 'income', 'spending', 'incomeSource', 'stability', 'reserves', 'restricted',
    'bigProject', 'bigProjectAmount', 'reservesPolicy', 'current', 'horizon', 'dropReaction', 'maxLoss', 'ethics',
  ]
  return keys.every((k) => a[k] !== undefined)
}
