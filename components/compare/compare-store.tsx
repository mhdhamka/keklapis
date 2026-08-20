"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

export const COMPARE_MAX = 4
const STORAGE_KEY = "sarawak_layer_cake:compare"

export type CompareSummary = {
  id: string
  brandName: string
  productName: string
  imageUrl: string
}

type CompareState = {
  ids: string[]
  summaries: Record<string, CompareSummary>
}

type CompareContextValue = {
  ids: string[]
  summaries: Record<string, CompareSummary>
  count: number
  max: number
  isFull: boolean
  isSelected: (id: string) => boolean
  canSelect: (id: string) => boolean
  toggle: (summary: CompareSummary) => void
  remove: (id: string) => void
  clear: () => void
}

const CompareContext = createContext<CompareContextValue | null>(null)

function readStored(): CompareState {
  if (typeof window === "undefined") return { ids: [], summaries: {} }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ids: [], summaries: {} }
    const parsed = JSON.parse(raw) as CompareState
    if (!parsed || !Array.isArray(parsed.ids) || typeof parsed.summaries !== "object") {
      return { ids: [], summaries: {} }
    }
    return { ids: parsed.ids.slice(0, COMPARE_MAX), summaries: parsed.summaries }
  } catch {
    return { ids: [], summaries: {} }
  }
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CompareState>({ ids: [], summaries: {} })
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setState(readStored())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore quota / privacy errors
    }
  }, [state, hydrated])

  const isSelected = useCallback((id: string) => state.ids.includes(id), [state.ids])
  const isFull = state.ids.length >= COMPARE_MAX
  const canSelect = useCallback((id: string) => !isFull || state.ids.includes(id), [isFull, state.ids])

  const toggle = useCallback((summary: CompareSummary) => {
    setState((prev) => {
      if (prev.ids.includes(summary.id)) {
        const ids = prev.ids.filter((id) => id !== summary.id)
        const summaries = { ...prev.summaries }
        delete summaries[summary.id]
        return { ids, summaries }
      }
      if (prev.ids.length >= COMPARE_MAX) return prev
      return {
        ids: [...prev.ids, summary.id],
        summaries: { ...prev.summaries, [summary.id]: summary },
      }
    })
  }, [])

  const remove = useCallback((id: string) => {
    setState((prev) => {
      if (!prev.ids.includes(id)) return prev
      const ids = prev.ids.filter((x) => x !== id)
      const summaries = { ...prev.summaries }
      delete summaries[id]
      return { ids, summaries }
    })
  }, [])

  const clear = useCallback(() => setState({ ids: [], summaries: {} }), [])

  const value = useMemo<CompareContextValue>(
    () => ({
      ids: state.ids,
      summaries: state.summaries,
      count: state.ids.length,
      max: COMPARE_MAX,
      isFull,
      isSelected,
      canSelect,
      toggle,
      remove,
      clear,
    }),
    [state, isFull, isSelected, canSelect, toggle, remove, clear],
  )

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error("useCompare must be used within CompareProvider")
  return ctx
}