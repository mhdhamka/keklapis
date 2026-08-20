"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { useCompare } from "./compare-store"
import { CompareTable } from "./compare-table"
import type { Product } from "@/lib/types/db"

interface CompareDockProps {
  // All products currently rendered on the page, keyed by id, so the dock can
  // resolve selected ids to full Product objects without an extra fetch.
  productsById: Record<string, Product>
}

export function CompareDock({ productsById }: CompareDockProps) {
  const t = useTranslations("comparison")
  const { ids, summaries, count, max, remove, clear } = useCompare()
  const [open, setOpen] = useState(false)

  // Close on Escape handled by the overlay itself; also lock body scroll when open.
  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  if (count === 0) return null

  const selectedProducts = ids
    .map((id) => productsById[id])
    .filter((p): p is Product => Boolean(p))

  return (
    <>
      <div
        role="region"
        aria-label={t("dockLabel")}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-emerald-900/15 bg-background/95 backdrop-blur-md shadow-[0_-8px_40px_rgba(4,47,34,0.08)] transition-all animate-in fade-in slide-in-from-bottom-4 duration-300"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex max-w-[88rem] items-center gap-4 px-5 py-3 sm:px-8 lg:px-12">
          {/* Thumbnails */}
          <ul className="flex min-w-0 flex-1 items-center gap-2.5 overflow-x-auto py-1 scrollbar-none">
            {ids.map((id) => {
              const s = summaries[id]
              if (!s) return null
              return (
                <li
                  key={id}
                  className="group relative flex shrink-0 items-center gap-2.5 rounded-lg border border-emerald-950/15 bg-emerald-950/[0.02] px-2.5 py-1.5 shadow-sm transition-all hover:border-emerald-700/40 hover:bg-emerald-950/[0.04]"
                >
                  <Thumbnail src={s.imageUrl} alt={s.brandName} />
                  <span className="hidden max-w-[10rem] truncate text-xs font-semibold text-emerald-950 sm:block">
                    {s.brandName}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(id)}
                    aria-label={t("removeFromCompare")}
                    className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-950/5 text-emerald-950/70 transition-all hover:bg-emerald-900 hover:text-white"
                  >
                    <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
                      <path d="m3 3 6 6M9 3 3 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </button>
                </li>
              )
            })}
          </ul>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden font-mono text-[11px] uppercase tracking-[0.12em] text-emerald-950/70 sm:block">
              {t("productsSelected", { count })}
            </span>
            <button
              type="button"
              onClick={clear}
              className="hidden rounded-lg border border-emerald-900/15 bg-background px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-emerald-950/70 transition-colors hover:border-emerald-900/30 hover:bg-emerald-950/5 hover:text-emerald-950 sm:inline-flex"
            >
              {t("clearAll")}
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              disabled={count < 2}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-900 px-5 text-xs font-semibold uppercase tracking-[0.08em] text-white shadow-sm transition-all hover:bg-emerald-950 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("compareButton", { count, max })}
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <CompareTable
          products={selectedProducts}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

function Thumbnail({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false)
  if (errored || !src) {
    return (
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-emerald-900/15 bg-emerald-950/5 font-mono text-[9px] text-emerald-950/60">
        —
      </span>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      className="h-8 w-8 shrink-0 rounded-md border border-emerald-900/10 bg-emerald-950/[0.02] object-contain p-0.5"
    />
  )
}