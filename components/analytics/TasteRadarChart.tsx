"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import type { Product } from "@/lib/types/db"
import { buildCompareRows } from "@/lib/compare/rows"

interface TasteRadarChartProps {
  products: Product[]
  t: any
}

const PRODUCT_COLORS = [
  { stroke: "#047857", fill: "#10b981", badge: "bg-emerald-600", ring: "ring-emerald-600/30" }, // Emerald / Primary
  { stroke: "#b45309", fill: "#f59e0b", badge: "bg-amber-500", ring: "ring-amber-500/30" },   // Amber
  { stroke: "#3f6212", fill: "#65a30d", badge: "bg-lime-600", ring: "ring-lime-600/30" },    // Lumut / Olive Green
  { stroke: "#be185d", fill: "#ec4899", badge: "bg-pink-500", ring: "ring-pink-500/30" },    // Pink
]

export function TasteRadarChart({ products, t }: TasteRadarChartProps) {
  const tComp = useTranslations("comparison")
  const [activeProductId, setActiveProductId] = useState<string | null>(null)
  
  const compareRows = buildCompareRows(products)
  const tasteKeys = ["sweetnessLevel", "richnessDri", "spiceLevel", "moistureLevel", "complexityScore"]
  
  const [activeMetrics, setActiveMetrics] = useState<Record<string, boolean>>({
    Sweetness: true,
    Richness: true,
    Spiciness: true,
    Moisture: true,
    Complexity: true,
  })

  const masterData = tasteKeys.map((key) => {
    const row = compareRows.attributes.find((r) => r.key === key)
    const subjectMap: Record<string, string> = {
      sweetnessLevel: tComp("sweetnessLevel"),
      richnessDri: tComp("richnessDri"),
      spiceLevel: "Spiciness",
      moistureLevel: "Moisture",
      complexityScore: "Complexity",
    }
    const subjectName = subjectMap[key] || key

    return {
      subject: subjectName,
      ...products.reduce((acc, p, idx) => {
        const val = row ? row.values[idx] : 5
        return { ...acc, [p.id]: Number(val ?? 5) }
      }, {}),
      fullMark: 10,
    }
  })

  const data = masterData.filter((item) => activeMetrics[item.subject])
  const activeMetricCount = Object.values(activeMetrics).filter(Boolean).length

  const toggleMetric = (subject: string) => {
    setActiveMetrics((prev) => ({ ...prev, [subject]: !prev[subject] }))
  }

  const setAllMetrics = (status: boolean) => {
    setActiveMetrics({
      Sweetness: status,
      Richness: status,
      Spiciness: status,
      Moisture: status,
      Complexity: status,
    })
  }

  return (
    <div className="flex flex-col w-full bg-gradient-to-b from-background to-emerald-950/[0.02] border border-emerald-900/10 p-6 rounded-3xl shadow-xl shadow-emerald-950/5">
      {/* Metric Filter Pills & Quick Presets Controls */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-emerald-900/10 text-emerald-900 font-mono text-[10px] uppercase font-semibold">
            {tComp("productsSelected", { count: products.length })}
          </span>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAllMetrics(true)}
              className="text-[10px] font-mono uppercase tracking-wider text-emerald-900 hover:text-emerald-700 transition-colors font-medium"
            >
              {tComp("clearAll") ? "Select All" : "Select All"}
            </button>
            <span className="text-emerald-900/30">•</span>
            <button
              type="button"
              onClick={() => setAllMetrics(false)}
              className="text-[10px] font-mono uppercase tracking-wider text-emerald-900 hover:text-emerald-700 transition-colors font-medium"
            >
              {tComp("clearAll")}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {Object.keys(activeMetrics).map((metric) => {
              const isActive = activeMetrics[metric]
              return (
                <button
                  key={metric}
                  type="button"
                  onClick={() => toggleMetric(metric)}
                  className={`px-3 py-1 rounded-full text-xs font-mono uppercase tracking-[0.08em] transition-all border shadow-2xs ${
                    isActive
                      ? "bg-emerald-900 text-white border-emerald-900 shadow-sm ring-2 ring-emerald-900/20"
                      : "bg-background text-emerald-950/60 border-emerald-900/15 hover:border-emerald-900/40 hover:text-emerald-950"
                  }`}
                >
                  {metric === "Sweetness" ? tComp("sweetnessLevel") : metric === "Richness" ? tComp("richnessDri") : metric}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="relative w-full h-[360px] flex items-center justify-center">
        {activeMetricCount === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-6 border border-dashed border-emerald-900/20 rounded-2xl bg-emerald-950/[0.02]">
            <p className="text-sm font-medium text-emerald-950 mb-1">No Metrics Selected</p>
            <p className="text-xs text-emerald-950/60 max-w-xs mb-3">
              Please enable at least one evaluation metric from the filter pills above to render the chart.
            </p>
            <button
              type="button"
              onClick={() => setAllMetrics(true)}
              className="px-4 py-1.5 rounded-xl bg-emerald-900 text-white text-xs font-medium shadow-sm hover:bg-emerald-800 transition-all"
            >
              Restore All Metrics
            </button>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
              <PolarGrid stroke="#065f46" strokeOpacity={0.15} />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "#042f2e", fontSize: 11, fontWeight: 600 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 10]}
                stroke="#065f46"
                strokeOpacity={0.3}
                tick={{ fill: "#047857", fontSize: 9, fontFamily: "monospace" }}
              />

              <Tooltip content={<CustomTooltip products={products} tComp={tComp} />} />

              {products.map((p, idx) => {
                const colorConfig = PRODUCT_COLORS[idx % PRODUCT_COLORS.length]
                const isDimmed = activeProductId !== null && activeProductId !== p.id
                const isHighlighted = activeProductId === p.id

                return (
                  <Radar
                    key={p.id}
                    name={p.brand?.brand_name || p.product_name || `Product ${idx + 1}`}
                    dataKey={p.id}
                    stroke={colorConfig.stroke}
                    strokeWidth={isHighlighted ? 3.5 : 2}
                    fill={colorConfig.fill}
                    fillOpacity={isHighlighted ? 0.55 : isDimmed ? 0.03 : 0.22}
                    style={{ transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)" }}
                  />
                )
              })}
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Interactive Legend Footer */}
      <div className="mt-4 pt-4 border-t border-emerald-900/10 flex flex-wrap items-center justify-center gap-3">
        <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-emerald-950/60 mr-2">
          {tComp("sectionIndex")}:
        </span>

        {products.map((p, idx) => {
          const colorConfig = PRODUCT_COLORS[idx % PRODUCT_COLORS.length]
          const labelName = p.brand?.brand_name || p.product_name || `Product ${idx + 1}`
          const isSelected = activeProductId === p.id
          const isTraditional = p.cake_category?.toLowerCase().includes("traditional") || p.sourceType === "traditional"

          return (
            <button
              key={p.id}
              type="button"
              onMouseEnter={() => setActiveProductId(p.id)}
              onMouseLeave={() => setActiveProductId(null)}
              onClick={() => setActiveProductId(isSelected ? null : p.id)}
              className={`inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all transform active:scale-95 ${
                isSelected
                  ? `border-emerald-900 bg-emerald-950/10 text-emerald-950 shadow-sm ring-2 ${colorConfig.ring}`
                  : "border-emerald-900/15 bg-background text-emerald-950/80 hover:bg-emerald-950/5 hover:border-emerald-900/30"
              }`}
            >
              <span className={`h-2.5 w-2.5 rounded-full shadow-2xs ${colorConfig.badge}`} />
              <div className="flex flex-col text-left">
                <span className="max-w-[130px] truncate font-semibold">{labelName}</span>
                <span className="text-[9px] font-mono text-emerald-950/60 uppercase tracking-wide">
                  {isTraditional ? tComp("traditionalLabel").split(" ")[0] : "Modern"} Variant
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function CustomTooltip({ active, payload, label, products, tComp }: any) {
  if (!active || !payload || !payload.length) return null

  const scores = payload.map((item: any) => Number(item.value))
  const avgScore = (scores.reduce((a: number, b: number) => a + b, 0) / scores.length).toFixed(1)

  return (
    <div className="rounded-2xl bg-emerald-950/95 border border-emerald-800/80 p-3.5 shadow-2xl backdrop-blur-xl text-white min-w-[220px]">
      <div className="flex items-center justify-between border-b border-emerald-800/60 pb-2 mb-2.5">
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-emerald-300 font-semibold">
          {label}
        </p>
        <span className="font-mono text-[10px] text-emerald-400/90 bg-emerald-900/50 px-2 py-0.5 rounded-md">
          Avg: {avgScore}
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        {payload.map((item: any, idx: number) => {
          const product = products.find((p: any) => p.id === item.dataKey)
          const brandName = product?.brand?.brand_name || item.name
          const colorConfig = PRODUCT_COLORS[idx % PRODUCT_COLORS.length]
          const isTraditional = product?.cake_category?.toLowerCase().includes("traditional") || product?.sourceType === "traditional"
          const diff = Number(item.value) - Number(avgScore)
          const diffString = diff > 0 ? `+${diff.toFixed(1)}` : diff < 0 ? `${diff.toFixed(1)}` : "Equal"

          return (
            <div key={item.dataKey} className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${colorConfig.badge}`} />
                <div className="flex flex-col">
                  <span className="text-emerald-100/90 truncate max-w-[110px] font-medium">{brandName}</span>
                  <span className="text-[9px] font-mono text-emerald-400/70 uppercase">
                    {isTraditional ? tComp("traditionalLabel").split(" ")[0] : "Modern"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span
                  className={`font-mono text-[10px] px-1.5 py-0.2 rounded ${
                    diff > 0
                      ? "text-emerald-300 bg-emerald-500/10"
                      : diff < 0
                      ? "text-amber-300 bg-amber-500/10"
                      : "text-emerald-400/70"
                  }`}
                >
                  {diffString}
                </span>
                <span className="font-mono font-bold text-white text-sm">{item.value}<span className="text-[10px] opacity-60">/10</span></span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}