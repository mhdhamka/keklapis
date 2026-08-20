"use client"

import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import { calculateDailyIntakePercentage, getIngredientInfo } from "@/lib/ingredient-data"

interface Ingredient { name: string; symbol?: string; amount: number; unit?: string }

// Warm, rich color palette inspired by traditional Kek Lapis layers (butter, kaya, spices, cocoa, etc.)
const LAYER_COLORS = [
  "bg-[#8D5B4C] text-white", // Deep spice / chocolate
  "bg-[#C68B59] text-white", // Warm golden brown
  "bg-[#E5A96E] text-[#1B2A1E]", // Rich butter
  "bg-[#D2B48C] text-[#1B2A1E]", // Tan / flour
  "bg-[#EFE3C3] text-[#1B2A1E]", // Light cream / milk
  "bg-[#A47551] text-white", // Cinnamon brown
]

export function IngredientCompositionPanel({ ingredients, index = "04" }: { ingredients: any; index?: string }) {
  const t = useTranslations("ingredientPanel")
  
  const [focusedName, setFocusedName] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<"amount" | "daily">("amount")
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc")

  const normalized = useMemo(() => {
    const arr = Array.isArray(ingredients) ? ingredients : Object.entries(ingredients || {}).map(([key, val]: any) => ({
      name: key.replaceAll("_", " "),
      amount: val?.amount || val || 0,
      unit: val?.unit || "g"
    }))
    
    return arr.map((i: any) => ({
      ...i,
      info: getIngredientInfo(i.name),
      daily: calculateDailyIntakePercentage(i.name, i.amount) || 0
    })).sort((a: any, b: any) => sortOrder === "desc" ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey])
  }, [ingredients, sortKey, sortOrder])

  const totalAmount = useMemo(() => normalized.reduce((acc: number, curr: any) => acc + curr.amount, 0), [normalized])

  const toggleSort = (key: "amount" | "daily") => {
    if (sortKey === key) setSortOrder(sortOrder === "desc" ? "asc" : "desc")
    else { setSortKey(key); setSortOrder("desc") }
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-[#D5E1D0] bg-white shadow-xl shadow-[#1B2A1E]/5">
      {/* Header */}
      <div className="p-8 border-b border-[#E9F0E5] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#4A6B43] bg-[#E9F0E5] px-2.5 py-1 rounded-full">
            Layer Composition • {index}
          </span>
          <h2 className="font-display text-2xl text-[#1B2A1E] mt-2">Kek Lapis Structural Profile</h2>
        </div>
        <div className="flex gap-2">
          {["amount", "daily"].map((k) => (
            <button 
              key={k} 
              onClick={() => toggleSort(k as any)}
              className={`px-3 py-1.5 text-[10px] uppercase font-bold rounded-full border transition-all ${sortKey === k ? "bg-[#3B5336] text-white border-[#3B5336]" : "bg-white text-[#3B5336] border-[#D5E1D0] hover:bg-[#F9FBF7]"}`}
            >
              Sort by {k}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Kek Lapis Visual Stacked Layers Representation */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-[#4A6B43] px-1">
            <span>Visual Layer Stack (Proportional Weight)</span>
            <span>Total: {totalAmount.toFixed(1)}g</span>
          </div>
          
          <div className="h-14 w-full flex rounded-2xl overflow-hidden border-2 border-[#D5E1D0]/80 shadow-inner p-1 bg-[#F9FBF7] gap-1">
            {normalized.map((i: any, idx: number) => {
              const percentage = totalAmount > 0 ? (i.amount / totalAmount) * 100 : 0
              if (percentage <= 0) return null
              const isFocused = focusedName === i.name

              return (
                <div
                  key={i.name}
                  onMouseEnter={() => setFocusedName(i.name)}
                  onMouseLeave={() => setFocusedName(null)}
                  style={{ width: `${Math.max(percentage, 4)}%` }}
                  className={`h-full rounded-lg transition-all duration-300 relative group cursor-pointer flex items-center justify-center ${
                    LAYER_COLORS[idx % LAYER_COLORS.length]
                  } ${isFocused ? "ring-2 ring-[#1B2A1E] scale-y-105 z-10 shadow-lg" : "opacity-90 hover:opacity-100"}`}
                  title={`${i.info.name}: ${i.amount}g (${percentage.toFixed(1)}%)`}
                >
                  <span className="text-[10px] font-mono font-bold truncate px-1 opacity-80 group-hover:opacity-100">
                    {i.info.symbol || i.info.name.slice(0, 3)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Interactive Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-[#4A6B43] uppercase text-[10px] tracking-widest border-b border-[#E9F0E5]">
                <th className="py-3 px-4">Ingredient Layer</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Daily Intake %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9F0E5]">
              {normalized.map((i: any, idx: number) => {
                const isFocused = focusedName === i.name
                return (
                  <tr 
                    key={i.name}
                    onMouseEnter={() => setFocusedName(i.name)}
                    onMouseLeave={() => setFocusedName(null)}
                    className={`cursor-pointer transition-colors ${isFocused ? "bg-[#E9F0E5]/60" : "hover:bg-[#F9FBF7]"}`}
                  >
                    <td className="py-4 px-4 flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full shrink-0 ${LAYER_COLORS[idx % LAYER_COLORS.length].split(" ")[0]}`} />
                      <div>
                        <span className="font-semibold text-[#1B2A1E]">{i.info.name}</span>
                        <span className="ml-2 font-mono text-[10px] text-[#4A6B43]">{i.info.symbol}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-[#4A6B43]">
                      {i.amount}{i.unit}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-mono ${i.daily > 10 ? "bg-[#3B5336] text-white" : "bg-[#E9F0E5] text-[#3B5336]"}`}>
                        {i.daily.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}