"use client"

import { useMemo, useState } from "react"
import { Product } from "@/lib/types/db"
import { useTranslations } from "next-intl"
import { 
  Building2, 
  Store, 
  MapPin, 
  TrendingUp, 
  Activity, 
  ChevronRight, 
  Sparkles
} from "lucide-react"

interface RegionalAnalyticsViewProps {
  products: Product[]
}

export function RegionalAnalyticsView({ products }: RegionalAnalyticsViewProps) {
  const t = useTranslations("map")
  const [selectedTab, setSelectedTab] = useState<"overview" | "breakdown">("overview")
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  // Compute stats dynamically from the filtered products
  const stats = useMemo(() => {
    const totalHubs = products.length
    if (totalHubs === 0) {
      return { 
        totalHubs: 0, 
        topRegion: "N/A", 
        activeBrandsCount: 0, 
        regionCounts: {},
        regionPercentages: {}
      }
    }

    const brandSet = new Set<string>()
    const regionCounts: Record<string, number> = {}

    products.forEach((p) => {
      if (p.brand?.brand_name) {
        brandSet.add(p.brand.brand_name)
      }
      const addr = p.source?.location_address?.toLowerCase() || "sarawak region"
      let region = "Sarawak Region"
      if (addr.includes("kuching") || addr.includes("petrajaya") || addr.includes("satok") || addr.includes("matang") || addr.includes("samariang")) {
        region = "Kuching Hub"
      } else if (addr.includes("miri")) {
        region = "Miri"
      } else if (addr.includes("sibu")) {
        region = "Sibu"
      }
      regionCounts[region] = (regionCounts[region] || 0) + 1
    })

    const sortedRegions = Object.entries(regionCounts).sort((a, b) => b[1] - a[1])
    const topRegion = sortedRegions[0]?.[0] || "Kuching Hub"

    const regionPercentages: Record<string, number> = {}
    sortedRegions.forEach(([region, count]) => {
      regionPercentages[region] = Math.round((count / totalHubs) * 100)
    })

    return {
      totalHubs,
      topRegion,
      activeBrandsCount: brandSet.size,
      regionCounts,
      regionPercentages,
    }
  }, [products])

  return (
    <div className="space-y-3 my-2 transition-all duration-300">
      
      {/* Interactive Header Switcher / Controls */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-mono tracking-wider uppercase text-muted-foreground font-semibold">
            {t.has("liveTelemetry") ? t("liveTelemetry") : "Live Telemetry"}
          </span>
        </div>

        <div className="flex bg-muted/60 p-0.5 rounded-lg border border-border/40 text-[10px] font-medium">
          <button
            onClick={() => setSelectedTab("overview")}
            className={`px-2 py-0.5 rounded-md transition-all ${
              selectedTab === "overview" 
                ? "bg-background text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedTab("breakdown")}
            className={`px-2 py-0.5 rounded-md transition-all ${
              selectedTab === "breakdown" 
                ? "bg-background text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Breakdown
          </button>
        </div>
      </div>

      {selectedTab === "overview" ? (
        <>
          {/* Analytics Summary Cards Grid */}
          <div className="grid grid-cols-3 gap-2">
            
            {/* Card 1: Total Hubs */}
            <div 
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500/[0.06] to-emerald-500/[0.01] border transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
                hoveredCard === 1 ? "border-emerald-500/40 shadow-sm scale-[1.02]" : "border-emerald-500/15"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-medium group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {t.has("activeHubs") ? t("activeHubs") : "Active Hubs"}
                </span>
                <Building2 className="w-3 h-3 text-emerald-500/60 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-base font-bold font-mono text-emerald-700 dark:text-emerald-400">
                  {stats.totalHubs}
                </span>
                <span className="text-[9px] text-emerald-600/70 font-mono">units</span>
              </div>
            </div>

            {/* Card 2: Maker Brands */}
            <div 
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500/[0.06] to-emerald-500/[0.01] border transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
                hoveredCard === 2 ? "border-emerald-500/40 shadow-sm scale-[1.02]" : "border-emerald-500/15"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-medium group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {t.has("makers") ? t("makers") : "Makers"}
                </span>
                <Store className="w-3 h-3 text-emerald-500/60 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-base font-bold font-mono text-emerald-700 dark:text-emerald-400">
                  {stats.activeBrandsCount}
                </span>
                <span className="text-[9px] text-emerald-600/70 font-mono">active</span>
              </div>
            </div>

            {/* Card 3: Top Region */}
            <div 
              onClick={() => setSelectedTab("breakdown")}
              onMouseEnter={() => setHoveredCard(3)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500/[0.06] to-emerald-500/[0.01] border transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
                hoveredCard === 3 ? "border-emerald-500/40 shadow-sm scale-[1.02]" : "border-emerald-500/15"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-medium group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {t.has("topZone") ? t("topZone") : "Top Zone"}
                </span>
                <MapPin className="w-3 h-3 text-emerald-500/60 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-bold font-display text-emerald-800 dark:text-emerald-300 truncate pr-1" title={stats.topRegion}>
                  {stats.topRegion}
                </span>
                <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform shrink-0" />
              </div>
            </div>
          </div>

          {/* Density Bar Indicator */}
          <div className="p-3 rounded-2xl bg-card border border-border/60 shadow-xs space-y-2.5 hover:border-emerald-500/30 transition-colors">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                {t.has("regionalDensityMetric") ? t("regionalDensityMetric") : "Regional Density Metric"}
              </span>
              <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                {t.has("liveFeed") ? t("liveFeed") : "Live Feed"}
              </span>
            </div>

            <div className="w-full bg-muted/80 h-2.5 rounded-full overflow-hidden p-0.5 flex shadow-inner">
              <div 
                className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-700 ease-out shadow-xs" 
                style={{ width: `${Math.min(100, (stats.totalHubs / 15) * 100)}%` }} 
              />
            </div>
            
            <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-0.5">
              <span className="leading-tight truncate max-w-[200px]">
                {t.has("densityDescription") ? t("densityDescription") : "Reflecting real-time filtered bakery concentration."}
              </span>
              <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
                {Math.round((stats.totalHubs / 15) * 100)}% capacity
              </span>
            </div>
          </div>
        </>
      ) : (
        /* Regional Breakdown State */
        <div className="p-3 rounded-2xl bg-card border border-border/60 shadow-xs space-y-3 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between text-[11px] pb-1 border-b border-border/40">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              Regional Share Distribution
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {Object.keys(stats.regionCounts).length} active zones
            </span>
          </div>

          <div className="space-y-2">
            {Object.entries(stats.regionCounts).map(([region, count]) => {
              const percentage = stats.regionPercentages[region] || 0
              return (
                <div key={region} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-medium text-foreground flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {region}
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {count} units <span className="text-emerald-600 font-semibold">({percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <button
            onClick={() => setSelectedTab("overview")}
            className="w-full mt-2 py-1.5 text-center text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/5 rounded-lg transition-colors"
          >
            ← Back to Overview
          </button>
        </div>
      )}

    </div>
  )
}