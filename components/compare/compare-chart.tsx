"use client"

import { useState } from "react"
import type { Product } from "@/lib/types/db"
import { buildCompareRows } from "@/lib/compare/rows"

interface CompareChartProps {
  products: Product[]
  t: any
}

export function CompareChart({ products, t }: CompareChartProps) {
  const rows = buildCompareRows(products)
  const numericAttributes = rows.attributes.filter((row) =>
    row.values.some((v) => typeof v === "number")
  )

  // Sandbox State Controls
  const [activeMetricKey, setActiveMetricKey] = useState<string>(numericAttributes[0]?.key ?? "sweetnessLevel")
  const [chartMode, setChartMode] = useState<"layers" | "radial" | "matrix">("layers")
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  const activeAttr = numericAttributes.find((a) => a.key === activeMetricKey) || numericAttributes[0]
  const numericVals = activeAttr ? activeAttr.values.map((v) => (typeof v === "number" ? v : 0)) : []
  const maxVal = Math.max(...numericVals, 1)

  return (
    <div className="flex flex-col gap-6 p-6 sm:p-8 bg-background animate-in fade-in duration-300">
      
      {/* Sandbox Control Header Toolbar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 rounded-2xl border border-emerald-900/15 bg-background shadow-sm backdrop-blur-md">
        
        {/* Metric Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-950/60 mr-2">Metric:</span>
          {numericAttributes.map((attr) => (
            <button
              key={attr.key}
              type="button"
              onClick={() => setActiveMetricKey(attr.key)}
              className={`inline-flex h-8 items-center rounded-lg px-3 font-mono text-xs font-semibold uppercase tracking-[0.08em] transition-all ${
                activeMetricKey === attr.key
                  ? "bg-emerald-900 text-white shadow-sm scale-105"
                  : "bg-emerald-950/[0.04] text-emerald-950/70 hover:bg-emerald-950/10 hover:text-emerald-950"
              }`}
            >
              {attr.label}
            </button>
          ))}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-emerald-950/[0.04] p-1 rounded-xl border border-emerald-900/10 self-stretch lg:self-auto justify-center">
          {(["layers", "radial", "matrix"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setChartMode(mode)}
              className={`flex-1 lg:flex-none h-7 px-3 rounded-lg font-mono text-[10px] uppercase tracking-wider font-semibold transition-all ${
                chartMode === mode
                  ? "bg-emerald-900 text-white shadow-sm"
                  : "text-emerald-950/70 hover:text-emerald-950"
              }`}
            >
              {mode === "layers" ? "Lapis Slices" : mode === "radial" ? "Radar Tier" : "Matrix Lab"}
            </button>
          ))}
        </div>

      </div>

      {/* Sandbox Visualizer Canvas */}
      <div className="relative min-h-[440px] rounded-3xl border border-emerald-900/20 bg-background/80 p-6 sm:p-8 shadow-xl overflow-hidden flex flex-col justify-between">
        
        {/* Decorative Grid Pattern background */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#042f22_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Canvas Header Info */}
        <div className="relative z-10 flex items-center justify-between border-b border-emerald-900/10 pb-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-emerald-900 bg-emerald-950/5 px-2.5 py-1 rounded-md border border-emerald-900/10">
              Interactive Sandbox • {activeAttr?.label}
            </span>
            <h3 className="mt-2 font-display text-xl text-emerald-950">
              Kek Lapis Inspector: {activeAttr?.label}
            </h3>
          </div>
          {activeAttr?.unit && (
            <div className="text-right font-mono text-xs text-emerald-950/60">
              Scale Unit: <strong className="text-emerald-950">{activeAttr.unit}</strong>
            </div>
          )}
        </div>

        {/* Mode 1: Lapis Slices (Multi-layered block graph using the custom palette for layers) */}
        {chartMode === "layers" && (
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
            {products.map((product, idx) => {
              const val = numericVals[idx] ?? 0
              const percentage = Math.min(Math.max((val / maxVal) * 100, 8), 100)
              const isBest = activeAttr?.bestIndex === idx
              const brand = product.brand?.brand_name || product.product_name
              const isHovered = hoveredProduct === product.id

              return (
                <div
                  key={product.id}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  className={`group relative flex flex-col justify-between gap-4 p-5 rounded-2xl border transition-all duration-300 ${
                    isHovered
                      ? "border-emerald-900 bg-emerald-950/[0.04] shadow-lg -translate-y-1"
                      : "border-emerald-900/15 bg-emerald-950/[0.01]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-sm text-emerald-950 line-clamp-1">{brand}</span>
                    {isBest && (
                      <span className="shrink-0 bg-emerald-900 text-white font-mono text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                        Optimal
                      </span>
                    )}
                  </div>

                  {/* Multi-layered Kek Lapis Slices Representation using the requested palette */}
                  <div className="flex flex-col gap-1 w-full bg-background p-2.5 rounded-xl border border-emerald-900/10 shadow-inner">
                    <div className="flex justify-between font-mono text-xs mb-1">
                      <span className="text-emerald-950/60">Metric Score</span>
                      <strong className="text-emerald-950">{val} {activeAttr?.unit ?? ""}</strong>
                    </div>
                    {/* Layer blocks using #7A5C3E, #B3936A, #2E4A35, #5B6E53, #D4C4A8 */}
                    <div className="h-7 w-full bg-[#D4C4A8]/30 rounded-lg overflow-hidden flex gap-0.5 p-0.5 border border-emerald-900/10">
                      {Array.from({ length: 8 }).map((_, layerIdx) => {
                        const layerThreshold = (layerIdx + 1) * 12.5
                        const isActiveLayer = percentage >= layerThreshold
                        
                        // Sequence of palette colors for the custom bar slices
                        const palette = ["bg-[#7A5C3E]", "bg-[#B3936A]", "bg-[#2E4A35]", "bg-[#5B6E53]"]
                        const layerColor = palette[layerIdx % palette.length]

                        return (
                          <div
                            key={layerIdx}
                            className={`flex-1 rounded-sm transition-all duration-500 ${
                              isActiveLayer
                                ? `${layerColor} shadow-sm`
                                : "bg-[#D4C4A8]/20"
                            }`}
                          />
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-emerald-950/60">
                    <span>Index Ratio</span>
                    <span className="font-bold text-emerald-900">{Math.round(percentage)}% of Peak</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Mode 2: Radar Tier (Circular comparative tier view) */}
        {chartMode === "radial" && (
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-6 my-8">
            {products.map((product, idx) => {
              const val = numericVals[idx] ?? 0
              const percentage = Math.min(Math.max((val / maxVal) * 100, 15), 100)
              const isBest = activeAttr?.bestIndex === idx
              const brand = product.brand?.brand_name || product.product_name

              return (
                <div
                  key={product.id}
                  className="flex flex-col items-center gap-3 p-6 rounded-3xl border border-emerald-900/15 bg-background shadow-md w-48 text-center transition-transform hover:scale-105"
                >
                  {/* Circular Progress Gauge Ring */}
                  <div className="relative flex items-center justify-center h-24 w-24 rounded-full bg-emerald-950/[0.04] border-4 border-emerald-900/10">
                    <div
                      className="absolute inset-0 rounded-full border-4 border-emerald-800 transition-all duration-700"
                      style={{
                        clipPath: `polygon(0 0, 100% 0, 100% ${percentage}%, 0 ${percentage}%)`,
                      }}
                    />
                    <div className="flex flex-col items-center">
                      <span className="font-mono text-lg font-bold text-emerald-950">{val}</span>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-950/60">{activeAttr?.unit || "pts"}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-xs text-emerald-950 truncate max-w-[140px]">{brand}</span>
                    {isBest && (
                      <span className="mx-auto bg-emerald-900 text-white font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full">
                        Top Pick
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Mode 3: Matrix Lab (Interactive comparison matrix node view) */}
        {chartMode === "matrix" && (
          <div className="relative z-10 flex flex-col gap-3 my-4">
            {products.map((product, idx) => {
              const val = numericVals[idx] ?? 0
              const percentage = Math.min(Math.max((val / maxVal) * 100, 10), 100)
              const isBest = activeAttr?.bestIndex === idx
              const brand = product.brand?.brand_name || product.product_name

              return (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-4 p-4 rounded-xl border border-emerald-900/15 bg-emerald-950/[0.02] hover:bg-emerald-950/[0.05] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-[180px]">
                    <span className="font-semibold text-xs text-emerald-950 truncate">{brand}</span>
                  </div>

                  <div className="flex-1 max-w-xl mx-4">
                    <div className="relative h-3 w-full bg-emerald-950/[0.08] rounded-full overflow-hidden">
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-emerald-800 rounded-full transition-all duration-700"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isBest && (
                      <span className="bg-emerald-900 text-white font-mono text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                        Best Result
                      </span>
                    )}
                    <span className="font-mono text-sm font-bold text-emerald-900 min-w-[3rem] text-right">
                      {val} {activeAttr?.unit ?? ""}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Sandbox Footer Tips */}
        <div className="relative z-10 flex items-center justify-between pt-4 border-t border-emerald-900/10 font-mono text-[11px] text-emerald-950/70">
          <span>Sandbox Mode Active: Click metric buttons above to swap data layers instantly.</span>
          <span className="hidden sm:inline">Theme: Original Emerald with Custom Lapis Palette Slices</span>
        </div>

      </div>
    </div>
  )
}