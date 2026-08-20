"use client"

import { useTranslations } from "next-intl"
import { useCompare, type CompareSummary } from "./compare-store"

interface CompareToggleProps {
  summary: CompareSummary
}

export function CompareToggle({ summary }: CompareToggleProps) {
  const t = useTranslations("comparison")
  const { isSelected, canSelect, toggle } = useCompare()
  const selected = isSelected(summary.id)
  const disabled = !selected && !canSelect(summary.id)

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (disabled) return
    toggle(summary)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      event.stopPropagation()
      if (!disabled) toggle(summary)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={selected ? t("removeFromCompare") : t("addToCompare")}
      title={disabled ? t("compareFull") : selected ? t("removeFromCompare") : t("addToCompare")}
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? "bg-survey text-white"
          : "bg-background/90 text-muted-foreground backdrop-blur-sm hover:text-foreground",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
      ].join(" ")}
    >
      <span aria-hidden="true" className="grid h-3 w-3 place-items-center">
        {selected ? (
          <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
            <path d="M2.5 6 5 8.5 9.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
          </svg>
        ) : (
          <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
            <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
          </svg>
        )}
      </span>
      {selected ? t("added") : t("add")}
    </button>
  )
}