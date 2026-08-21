"use client"

import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import { calculateDailyIntakePercentage, getIngredientInfo } from "@/lib/ingredient-data"

interface Ingredient { 
  name: string
  symbol?: string 
  amount: number 
  unit?: string 
  daily_dri?: number 
}

interface IngredientPanelProps {
  ingredients: Ingredient[] | Record<string, any>
  index?: string
  sortKey?: "amount" | "daily"
  onSortChange?: (key: "amount" | "daily") => void
}

const LAYER_COLORS = [
  "bg-[#8D5B4C] text-white", 
  "bg-[#C68B59] text-white", 
  "bg-[#E5A96E] text-[#1B2A1E]", 
  "bg-[#D2B48C] text-[#1B2A1E]", 
  "bg-[#EFE3C3] text-[#1B2A1E]", 
  "bg-[#A47551] text-white", 
]

export function IngredientCompositionPanel({ 
  ingredients, 
  index = "04",
  sortKey: externalSortKey,
  onSortChange 
}: IngredientPanelProps) {
  const t = useTranslations("ingredientPanel")
  
  const [focusedName, setFocusedName] = useState<string | null>(null)
  
  // Independent internal states for sorting when props aren't fully controlled externally
  const [internalSortKey, setInternalSortKey] = useState<"amount" | "daily">("amount")
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc")
  const [searchQuery, setSearchQuery] = useState("")

  // Fallback to internal sort key if external one isn't provided
  const activeSortKey = externalSortKey ?? internalSortKey

  const handleSortToggle = (key: "amount" | "daily") => {
    if (activeSortKey === key) {
      setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
    } else {
      setInternalSortKey(key)
      setSortOrder("desc")
    }
    onSortChange?.(key)
  }

  const normalized = useMemo(() => {
    const arr = Array.isArray(ingredients) 
      ? ingredients 
      : Object.entries(ingredients || {}).map(([key, val]: any) => ({
          name: key.replaceAll("_", " "),
          amount: val?.amount || val || 0,
          unit: val?.unit || "g",
          daily_dri: val?.daily_dri
        }))
    
    return arr
      .map((i: any) => ({
        ...i,
        info: getIngredientInfo(i.name),
        daily: i.daily_dri ?? calculateDailyIntakePercentage(i.name, i.amount) ?? 0
      }))
      .filter((i: any) => 
        i.info.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        i.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a: any, b: any) => {
        const valA = activeSortKey === "amount" ? a.amount : a.daily
        const valB = activeSortKey === "amount" ? b.amount : b.daily
        
        return sortOrder === "desc" ? valB - valA : valA - valB
      })
  }, [ingredients, activeSortKey, sortOrder, searchQuery])

  const totalAmount = useMemo(() => normalized.reduce((acc: number, curr: any) => acc + curr.amount, 0), [normalized])
  const maxAmount = useMemo(() => Math.max(...normalized.map((i: any) => i.amount), 1), [normalized])

  return (
    <section className="overflow-hidden rounded-3xl border border-[#D5E1D0] bg-white shadow-xl shadow-[#1B2A1E]/5 transition-all">
      {/* Header */}
      <div className="p-6 sm:p-8 border-b border-[#E9F0E5] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#4A6B43] bg-[#E9F0E5] px-3 py-1 rounded-full border border-[#D5E1D0]/60">
              {index}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#4A6B43] bg-[#E9F0E5] px-3 py-1 rounded-full border border-[#D5E1D0]/60">
              {t("compositionDetails")}
            </span>
          </div>
          <h2 className="font-display text-2xl text-[#1B2A1E] mt-2">{t("title")}</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input 
              type="text"
              placeholder={t("noData")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-48 text-xs bg-[#F9FBF7] border border-[#D5E1D0] rounded-xl px-3 py-2 text-[#1B2A1E] placeholder-[#4A6B43]/60 focus:outline-none focus:ring-2 focus:ring-[#3B5336]/20 transition-all font-mono"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#4A6B43] hover:text-[#1B2A1E]"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex gap-1.5 bg-[#F4F6F0] p-1 rounded-xl border border-[#D5E1D0]">
            {(["amount", "daily"] as const).map((k) => (
              <button 
                key={k} 
                onClick={() => handleSortToggle(k)}
                className={`px-3 py-1.5 text-[10px] uppercase font-bold rounded-lg transition-all ${
                  activeSortKey === k 
                    ? "bg-[#3B5336] text-white shadow-xs" 
                    : "text-[#4A6B43] hover:text-[#1B2A1E]"
                }`}
              >
                {k === "amount" ? t("amount") : t("dailyPct")} {activeSortKey === k && (sortOrder === "desc" ? "↓" : "↑")}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* Visual Stacked Layers */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-mono text-[#4A6B43] px-1">
            <span>{t("visualLayerStack")}</span>
            <span className="font-bold text-[#1B2A1E]">{t("totalStackMass", { mass: totalAmount.toFixed(1) })}</span>
          </div>
          
          <div className="h-16 w-full flex rounded-2xl overflow-hidden border-2 border-[#D5E1D0]/80 shadow-inner p-1.5 bg-[#F9FBF7] gap-1">
            {normalized.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[#4A6B43]">
                {t("noData")}
              </div>
            ) : (
              normalized.map((i: any, idx: number) => {
                const percentage = totalAmount > 0 ? (i.amount / totalAmount) * 100 : 0
                if (percentage <= 0) return null
                const isFocused = focusedName === i.name

                return (
                  <div
                    key={i.name}
                    onMouseEnter={() => setFocusedName(i.name)}
                    onMouseLeave={() => setFocusedName(null)}
                    style={{ width: `${Math.max(percentage, 5)}%` }}
                    className={`h-full rounded-xl transition-all duration-300 relative group cursor-pointer flex items-center justify-center shadow-2xs ${
                      LAYER_COLORS[idx % LAYER_COLORS.length]
                    } ${isFocused ? "ring-2 ring-[#1B2A1E] scale-y-110 z-10 shadow-lg brightness-110" : "opacity-90 hover:opacity-100"}`}
                  >
                    <span className="text-[10px] font-mono font-bold truncate px-1 opacity-90 group-hover:opacity-100">
                      {i.info.symbol || i.info.name.slice(0, 3)}
                    </span>
                    
                    <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-30">
                      <div className="bg-[#1B2A1E] text-white text-[11px] font-mono rounded-xl py-1.5 px-3 shadow-xl whitespace-nowrap">
                        <p className="font-bold">{i.info.name}</p>
                        <p className="text-[#A47551]">{i.amount}{i.unit || "g"} ({percentage.toFixed(1)}%)</p>
                      </div>
                      <div className="w-2 h-2 bg-[#1B2A1E] rotate-45 -mt-1" />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto rounded-2xl border border-[#D5E1D0] bg-[#F9FBF7]/50">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-[#4A6B43] uppercase text-[10px] tracking-widest border-b border-[#D5E1D0] bg-[#F4F6F0]/80">
                <th className="py-3 px-4 font-mono font-semibold">{t("ingredient")}</th>
                <th className="py-3 px-4 font-mono font-semibold">{t("healthBenefit")}</th>
                <th className="py-3 px-4 text-right font-mono font-semibold">{t("amount")}</th>
                <th className="py-3 px-4 text-right font-mono font-semibold">{t("dailyPct")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9F0E5]">
              {normalized.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-xs font-mono text-[#4A6B43]">
                    {t("noData")}
                  </td>
                </tr>
              ) : (
                normalized.map((i: any, idx: number) => {
                  const isFocused = focusedName === i.name
                  const weightRatio = (i.amount / maxAmount) * 100

                  return (
                    <tr 
                      key={i.name}
                      onMouseEnter={() => setFocusedName(i.name)}
                      onMouseLeave={() => setFocusedName(null)}
                      className={`cursor-pointer transition-all ${isFocused ? "bg-[#E9F0E5] shadow-xs" : "hover:bg-white"}`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <span className={`w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs ${LAYER_COLORS[idx % LAYER_COLORS.length].split(" ")[0]}`} />
                          <div>
                            <span className="font-semibold text-[#1B2A1E]">{i.info.name}</span>
                            {i.info.symbol && (
                              <span className="ml-2 font-mono text-[10px] text-[#4A6B43] bg-[#E9F0E5] px-1.5 py-0.5 rounded">
                                {i.info.symbol}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 w-44">
                        <div className="w-full bg-[#D5E1D0]/50 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${LAYER_COLORS[idx % LAYER_COLORS.length].split(" ")[0]}`} 
                            style={{ width: `${Math.max(weightRatio, 4)}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right font-mono text-[#1B2A1E] font-medium">
                        {i.amount} <span className="text-xs text-[#4A6B43]">{i.unit || "g"}</span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <span className={`px-3 py-1 rounded-xl text-xs font-bold font-mono shadow-2xs inline-block ${
                          i.daily > 15 
                            ? "bg-[#3B5336] text-white" 
                            : i.daily > 5 
                            ? "bg-[#C68B59]/20 text-[#1B2A1E] border border-[#C68B59]/40" 
                            : "bg-[#E9F0E5] text-[#3B5336]"
                        }`}>
                          {i.daily.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}