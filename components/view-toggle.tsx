"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import type { ViewMode } from "@/lib/view"

export function ViewToggle({ current }: { current: ViewMode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations("sourcesView")

  const setView = (mode: ViewMode) => {
    if (mode === current) return
    const params = new URLSearchParams(searchParams.toString())
    if (mode === "cards") params.delete("view")
    else params.set("view", mode)
    router.replace(params.size ? `/?${params.toString()}` : "/", { scroll: false })
  }

  return (
    <div
      role="group"
      aria-label={t("viewToggleLabel")}
      className="inline-flex items-center rounded-xl border border-emerald-950/10 bg-emerald-950/[0.03] p-1 shadow-inner backdrop-blur-sm"
    >
      <button
        type="button"
        onClick={() => setView("cards")}
        aria-pressed={current === "cards"}
        className={[
          "inline-flex h-8 items-center gap-2 rounded-lg px-3.5 text-xs font-bold uppercase tracking-wider transition-all duration-200",
          current === "cards"
            ? "bg-emerald-900 text-white shadow-sm shadow-emerald-900/30"
            : "text-emerald-950/70 hover:text-emerald-950 hover:bg-emerald-950/5",
        ].join(" ")}
      >
        <GridGlyph className={current === "cards" ? "text-white" : "opacity-70"} />
        <span>{t("viewCards")}</span>
      </button>
      <button
        type="button"
        onClick={() => setView("table")}
        aria-pressed={current === "table"}
        className={[
          "inline-flex h-8 items-center gap-2 rounded-lg px-3.5 text-xs font-bold uppercase tracking-wider transition-all duration-200",
          current === "table"
            ? "bg-emerald-900 text-white shadow-sm shadow-emerald-900/30"
            : "text-emerald-950/70 hover:text-emerald-950 hover:bg-emerald-950/5",
        ].join(" ")}
      >
        <TableGlyph className={current === "table" ? "text-white" : "opacity-70"} />
        <span>{t("viewTable")}</span>
      </button>
    </div>
  )
}

function GridGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" className={`h-3.5 w-3.5 ${className}`} aria-hidden="true">
      <rect x="1.5" y="1.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="8" y="1.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1.5" y="8" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="8" y="8" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function TableGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" className={`h-3.5 w-3.5 ${className}`} aria-hidden="true">
      <rect x="1.5" y="2" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1.5 5.5h11M1.5 9h11M5 2v10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}