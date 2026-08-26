"use client"

import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import ReactECharts from "echarts-for-react"

interface MonthlyTrend {
  month: string
  demandIndex: number
  festiveKey?: string
  isPeak?: boolean
  surgeMultiplier: number
}

export function SeasonalTrendsPanel({ index = "05" }: { index?: string }) {
  const t = useTranslations("RegistryPage")
  const [activeView, setActiveView] = useState<"demand" | "festive">("demand")
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [simulationMultiplier, setSimulationMultiplier] = useState<number>(1.0)

  const rawTrends: MonthlyTrend[] = [
    { month: "Jan", demandIndex: 65, surgeMultiplier: 1.1 },
    { month: "Feb", demandIndex: 88, festiveKey: "seasonal.festivals.cny", isPeak: true, surgeMultiplier: 1.4 },
    { month: "Mar", demandIndex: 96, festiveKey: "seasonal.festivals.raya", isPeak: true, surgeMultiplier: 1.6 },
    { month: "Apr", demandIndex: 72, surgeMultiplier: 1.15 },
    { month: "May", demandIndex: 78, surgeMultiplier: 1.2 },
    { month: "Jun", demandIndex: 92, festiveKey: "seasonal.festivals.gawai", isPeak: true, surgeMultiplier: 1.45 },
    { month: "Jul", demandIndex: 58, surgeMultiplier: 1.0 },
    { month: "Aug", demandIndex: 52, surgeMultiplier: 0.95 },
    { month: "Sep", demandIndex: 62, surgeMultiplier: 1.05 },
    { month: "Oct", demandIndex: 70, festiveKey: "seasonal.festivals.deepavali", isPeak: false, surgeMultiplier: 1.2 },
    { month: "Nov", demandIndex: 75, surgeMultiplier: 1.25 },
    { month: "Dec", demandIndex: 99, festiveKey: "seasonal.festivals.yearend", isPeak: true, surgeMultiplier: 1.7 },
  ]

  const activeIndex = selectedMonth !== null ? selectedMonth : 11 // Default to December or hovered
  const currentData = rawTrends[activeIndex]
  
  const adjustedDemand = Math.min(
    100, 
    Math.round(currentData.demandIndex * (activeView === "festive" ? currentData.surgeMultiplier : simulationMultiplier))
  )

  // Configure Apache ECharts options dynamically
  const echartsOption = useMemo(() => {
    const dataValues = rawTrends.map((item, idx) => {
      const val = activeView === "demand" 
        ? Math.min(100, Math.round(item.demandIndex * simulationMultiplier))
        : Math.min(100, Math.round(item.demandIndex * item.surgeMultiplier * 0.75))
      return {
        value: val,
        itemStyle: {
          color: item.isPeak 
            ? {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [{ offset: 0, color: '#3B5336' }, { offset: 1, color: '#273824' }]
              }
            : {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [{ offset: 0, color: '#70976A' }, { offset: 1, color: 'rgba(95, 158, 108, 0.6)' }]
              },
          borderRadius: [8, 8, 0, 0]
        }
      }
    })

    return {
      grid: {
        top: 25,
        bottom: 25,
        left: 20,
        right: 20,
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const index = params[0].dataIndex;
          const monthObj = rawTrends[index];
          return `<div style="font-family: monospace; font-size: 11px; color: #1B2A1E;">
            <strong>${monthObj.month}</strong>: ${params[0].value}%<br/>
            ${monthObj.festiveKey ? ` ${t(monthObj.festiveKey as any)}` : ''}
          </div>`;
        }
      },
      xAxis: {
        type: 'category',
        data: rawTrends.map(i => i.month),
        axisLine: { lineStyle: { color: '#D5E1D0' } },
        axisTick: { show: false },
        axisLabel: { color: '#4A6B43', fontSize: 11, fontFamily: 'monospace' }
      },
      yAxis: {
        type: 'value',
        max: 100,
        splitLine: { lineStyle: { type: 'dashed', color: '#E9F0E5' } },
        axisLabel: { color: '#4A6B43', fontSize: 10, fontFamily: 'monospace' }
      },
      series: [
        {
          data: dataValues,
          type: 'bar',
          barWidth: '55%',
          animationDuration: 400
        }
      ]
    }
  }, [rawTrends, activeView, simulationMultiplier, t])

  const onChartClick = (params: any) => {
    if (typeof params.dataIndex === 'number') {
      setSelectedMonth(params.dataIndex)
    }
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-[#D5E1D0] bg-white shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E9F0E5]">
        <div>
          <h2 className="font-display text-xl sm:text-2xl tracking-[-0.03em] text-[#1B2A1E]">
            {t("seasonal.title")}
          </h2>
          <p className="text-xs text-[#4A6B43] mt-1">
            {t("seasonal.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#F4F6F0] p-1.5 rounded-2xl border border-[#D5E1D0] shadow-inner">
            <button
              onClick={() => { setActiveView("demand"); setSelectedMonth(null); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                activeView === "demand" ? "bg-white text-[#1B2A1E] shadow-sm font-bold" : "text-[#4A6B43] hover:text-[#1B2A1E]"
              }`}
            >
              {t("seasonal.tabs.demand")}
            </button>
            <button
              onClick={() => { setActiveView("festive"); setSelectedMonth(null); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                activeView === "festive" ? "bg-white text-[#1B2A1E] shadow-sm font-bold" : "text-[#4A6B43] hover:text-[#1B2A1E]"
              }`}
            >
              {t("seasonal.tabs.festive")}
            </button>
          </div>
          <span className="font-mono text-[11px] font-bold text-[#3B5336] bg-[#E9F0E5] px-2.5 py-0.5 rounded-full border border-[#D5E1D0]/60">
            {index}
          </span>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="p-6 sm:p-8 space-y-6 bg-[#F9FBF7]/50">
        
        {/* Interactive Metrics Pod */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-[#D5E1D0] shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#4A6B43] bg-[#E9F0E5] px-2 py-0.5 rounded">
                {currentData.month} {t("seasonal.telemetrySuffix")}
              </span>
              {currentData.festiveKey && activeView === "festive" && (
                <span className="font-mono text-[10px] text-[#3B5336] bg-[#3B5336]/10 px-2 py-0.5 rounded-full font-semibold">
                   {t(currentData.festiveKey as any)}
                </span>
              )}
            </div>
            <p className="text-base font-semibold text-[#1B2A1E]">
              {activeView === "demand" 
                ? t("seasonal.velocityIndex", { value: adjustedDemand }) 
                : t("seasonal.festiveSurgeFactor", { value: currentData.surgeMultiplier })}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {activeView === "demand" && (
              <div className="flex flex-col gap-1 w-full sm:w-40">
                <div className="flex justify-between text-[10px] font-mono text-[#4A6B43]">
                  <span>{t("seasonal.loadSim")}</span>
                  <span>{simulationMultiplier.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="1.5" 
                  step="0.1" 
                  value={simulationMultiplier} 
                  onChange={(e) => setSimulationMultiplier(Number(e.target.value))}
                  className="w-full accent-[#3B5336] cursor-pointer h-1.5 bg-[#D5E1D0] rounded-lg"
                />
              </div>
            )}
            <span className="font-mono text-xs px-3 py-1.5 rounded-xl bg-[#E9F0E5] border border-[#D5E1D0] text-[#3B5336] shrink-0 font-semibold">
              {activeView === "demand" ? t("seasonal.liveDemand") : t("seasonal.festiveMatrix")}
            </span>
          </div>
        </div>

        {/* ECharts Visualisation Workspace */}
        <div className="h-60 p-2 bg-white rounded-2xl border border-[#D5E1D0] shadow-inner relative overflow-hidden">
          <ReactECharts 
            option={echartsOption} 
            style={{ height: '100%', width: '100%' }}
            onEvents={{ 'click': onChartClick }}
          />
        </div>

        {/* Footer Hint */}
        <div className="flex items-center justify-between text-[11px] font-mono text-[#4A6B43] px-1">
          <span>{t("seasonal.footerHint")}</span>
          <span className="hidden sm:inline">{t("seasonal.regionalIntegration")}</span>
        </div>

      </div>
    </section>
  )
}