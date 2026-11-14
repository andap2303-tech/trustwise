// Demo flag for the Trustwise Board plan. No payment happens: "unlocking" just flips this flag,
// mirrored in localStorage so it survives a refresh.

import { createContext, useCallback, useContext, useLayoutEffect, useState, type ReactNode } from 'react'

const KEY = 'trustwise.boardDemo.v1'

function load(): boolean {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

interface Ctx {
  isPlusDemo: boolean
  setPlusDemo: (on: boolean) => void
}

const PlusContext = createContext<Ctx | null>(null)

export function PlusProvider({ children }: { children: ReactNode }) {
  const [isPlusDemo, setState] = useState(load)
  // Board plan users get their own colour theme (tokens in index.css)
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = isPlusDemo ? 'plus' : ''
  }, [isPlusDemo])
  const setPlusDemo = useCallback((on: boolean) => {
    setState(on)
    try {
      if (on) localStorage.setItem(KEY, '1')
      else localStorage.removeItem(KEY)
    } catch {
      // storage unavailable — flag still works for this visit
    }
  }, [])
  return <PlusContext.Provider value={{ isPlusDemo, setPlusDemo }}>{children}</PlusContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePlus() {
  const ctx = useContext(PlusContext)
  if (!ctx) throw new Error('usePlus must be used inside PlusProvider')
  return ctx
}
