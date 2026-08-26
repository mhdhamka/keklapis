"use client"

import React from "react"
import { useTranslations } from "next-intl"

interface RegionalFilterBarProps {
  searchQuery: string
  setSearchQuery: (q: string) => void
  selectedRegion: string
  setSelectedRegion: (reg: string) => void
  availableRegions: string[]
  filteredCount: number
}

export function RegionalFilterBar({
  searchQuery,
  setSearchQuery,
  selectedRegion,
  setSelectedRegion,
  availableRegions,
  filteredCount,
}: RegionalFilterBarProps) {
  const t = useTranslations("map")

  // Helper to translate special generic tags like "ALL" if needed, fallback to raw string
  const formatRegionName = (reg: string) => {
    if (reg === "ALL") return t("allRegions")
    return reg
  }

  return (
    <div className="p-3.5 border-b border-border/60 space-y-3 bg-muted/20">
      <div className="relative">
        <svg className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl bg-background border border-input pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all shadow-inner"
        />
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {availableRegions.map((reg) => (
          <button
            key={reg}
            onClick={() => setSelectedRegion(reg)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all ${
              selectedRegion === reg
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-background border border-border text-muted-foreground hover:text-foreground hover:border-emerald-500/30"
            }`}
          >
            {formatRegionName(reg)}
          </button>
        ))}
      </div>
    </div>
  )
}