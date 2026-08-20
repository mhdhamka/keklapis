"use client"

import { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslations, useFormatter } from "next-intl"
import { HomeContent } from "@/components/home-content"
import { HomeMap } from "@/components/home-map"
import { HomeFilters } from "@/components/home-filters"
import { WaterMetricsHelp } from "@/components/water-metrics-help"
import { CompareDock } from "@/components/compare/compare-dock"
import type { ViewMode } from "@/lib/view"
import type { Product, Brand, Source } from "@/lib/types/db"

interface HomeClientProps {
  initialProducts: Product[]
  brands: Brand[]
  allSources: Source[]
  totalProductsCount: number
  query: string
  sort: string
  types: string[]
  brandIds: string[]
  minSweetness?: number
  maxSweetness?: number
  minRichness?: number
  maxRichness?: number
  view: ViewMode
}

export default function HomeClient({
  initialProducts,
  brands,
  allSources,
  totalProductsCount,
  query,
  sort,
  types,
  brandIds,
  minSweetness,
  maxSweetness,
  minRichness,
  maxRichness,
  view,
}: HomeClientProps) {
  const t = useTranslations("home")
  const format = useFormatter()
  const router = useRouter()
  const searchParams = useSearchParams()

  // --- Feature States ---
  const [activeHighlight, setActiveHighlight] = useState<0 | 1 | 2>(0)
  const [hoveredStat, setHoveredStat] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [showBanner, setShowBanner] = useState(true)
  const [showVisualizer, setShowVisualizer] = useState(false)

  // Read active culinary profile/category from URL search params (defaults to "All Variants")
  const activeFlavor = searchParams.get("category") || "All Variants"

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category === "All Variants") {
      params.delete("category")
    } else {
      params.set("category", category)
    }
    router.push(params.size ? `/?${params.toString()}` : "/", { scroll: false })
  }

  const highlights = [
    { title: t("highlights.0.title"), desc: t("highlights.0.desc") },
    { title: t("highlights.1.title"), desc: t("highlights.1.desc") },
    { title: t("highlights.2.title"), desc: t("highlights.2.desc") },
  ]

  // Auto-rotate highlights unless hovered
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setActiveHighlight((prev) => (prev + 1) % highlights.length as 0 | 1 | 2)
    }, 6000)
    return () => clearInterval(timer)
  }, [isPaused, highlights.length])

  // Filter initial products based on the selected culinary profile category
  const filteredProductsByProfile = initialProducts.filter((product) => {
    if (activeFlavor === "All Variants") return true
    const term = activeFlavor.toLowerCase()
    const profileMatch = product.culinary_profile?.toLowerCase().includes(term)
    const nameMatch = product.product_name?.toLowerCase().includes(term)
    const typeMatch = product.type?.toLowerCase().includes(term)
    return profileMatch || nameMatch || typeMatch
  })

  const sortedProducts = [...filteredProductsByProfile].sort((a, b) => {
    const nameA = `${a.brand ?? ""} ${a.product_name ?? ""}`
    const nameB = `${b.brand ?? ""} ${b.product_name ?? ""}`
    if (sort === "name_desc") return nameB.localeCompare(nameA)
    if (sort === "sweetness_asc") return (a.sweetness ?? Infinity) - (b.sweetness ?? Infinity)
    if (sort === "sweetness_desc") return (b.sweetness ?? -Infinity) - (a.sweetness ?? -Infinity)
    if (sort === "richness_dri_asc") return (a.richness_dri ?? Infinity) - (b.richness_dri ?? Infinity)
    if (sort === "richness_dri_desc") return (b.richness_dri ?? -Infinity) - (a.richness_dri ?? -Infinity)
    if (sort === "brand_asc") return (a.brand ?? "").localeCompare(b.brand ?? "")
    if (sort === "brand_desc") return (b.brand ?? "").localeCompare(a.brand ?? "")
    return nameA.localeCompare(nameB)
  })

  const hasFilters = Boolean(query) || brandIds.length > 0 || types.length > 0 ||
    minSweetness !== undefined || maxSweetness !== undefined || minRichness !== undefined || maxRichness !== undefined || activeFlavor !== "All Variants"

  const productsById = Object.fromEntries(sortedProducts.map((p) => [p.id, p]))

  return (
    <main id="main-content" className="min-h-screen overflow-hidden bg-background text-foreground selection:bg-emerald-500/20 selection:text-emerald-800">
      
      {/* 1. Festive Bake Day Banner */}
      {showBanner && (
        <div className="relative bg-emerald-900 px-4 py-3 text-emerald-50 pr-14 shadow-md transition-all z-50">
          <p className="text-center text-xs sm:text-sm font-medium">
            <span className="mr-3 inline-flex items-center rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm animate-pulse">
              {t("banner.badge")}
            </span>
            {t("banner.text")}
          </p>
          <button 
            onClick={() => setShowBanner(false)} 
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-emerald-800 rounded-full transition-colors text-emerald-200 hover:text-white cursor-pointer"
            aria-label={t("banner.closeAria")}
          >
             <CloseIcon />
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-emerald-500/5 via-background to-background">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 h-[400px] w-[900px] rounded-full bg-emerald-500/10 blur-[140px] pointer-events-none" />

        <div className="relative mx-auto max-w-[88rem] px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:px-12 lg:pb-24">
          
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" aria-hidden="true" />
              <span className="text-emerald-700 font-mono">{t("heroEyebrow")}</span>
              <span className="h-px w-12 sm:w-24 bg-emerald-500/30" aria-hidden="true" />
            </div>

            <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-sm">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveHighlight(idx as 0 | 1 | 2)}
                  className={`relative rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    activeHighlight === idx
                      ? "bg-emerald-600 text-white shadow-sm scale-105"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  0{idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(19rem,.65fr)] lg:gap-20">
            <div>
              <h1 className="max-w-5xl text-pretty font-display text-[clamp(2.75rem,8vw,6rem)] leading-[0.92] tracking-[-0.04em] text-foreground">
                {t("heroTitle")}
              </h1>
            </div>
            
            <div 
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="flex flex-col rounded-2xl border border-border/80 bg-card text-card-foreground shadow-xl overflow-hidden transition-all duration-300 hover:border-emerald-500/40 hover:shadow-2xl group"
            >
              <div className="flex items-center justify-between px-6 py-4 bg-muted/40 border-b border-border/60">
                <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold">
                  {highlights[activeHighlight].title}
                </span>
                {isPaused && (
                  <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 px-2 py-0.5 rounded-full animate-fade-in">
                    {t("paused")}
                  </span>
                )}
              </div>

              <div className="p-6">
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base min-h-[4.5rem] transition-opacity duration-300">
                  {highlights[activeHighlight].desc}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-muted/20 border-t border-border/40">
                <button 
                  onClick={() => {
                    document.getElementById("sources")?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className="group inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-emerald-700 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                >
                  {t("heroCtaBrowse")}
                  <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-1" />
                </button>
                <button 
                  onClick={() => setShowVisualizer(true)}
                  className="group flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                >
                  <EyeIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
                  {t("visualizerTrigger")}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 divide-y divide-border/60 rounded-2xl border border-border/80 bg-card shadow-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:mt-24 overflow-hidden">
            <InteractiveStatCard value={format.number(totalProductsCount)} label={t("statsProducts")} index="01" isHovered={hoveredStat === 0} onMouseEnter={() => setHoveredStat(0)} onMouseLeave={() => setHoveredStat(null)} />
            <InteractiveStatCard value={format.number(brands.length)} label={t("statsBrands")} index="02" isHovered={hoveredStat === 1} onMouseEnter={() => setHoveredStat(1)} onMouseLeave={() => setHoveredStat(null)} />
            <InteractiveStatCard value={format.number(allSources.length)} label={t("statsLocations")} index="03" isHovered={hoveredStat === 2} onMouseEnter={() => setHoveredStat(2)} onMouseLeave={() => setHoveredStat(null)} />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section id="map" className="scroll-mt-20 py-16 sm:py-24">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
          <div className="mb-8 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-semibold">{t("mapSectionEyebrow")}</p>
              <h2 className="mt-3 max-w-2xl font-display text-4xl leading-none tracking-[-0.035em] sm:text-6xl text-foreground">
                {t("mapSectionTitle")}
              </h2>
            </div>
            <button 
              onClick={() => document.getElementById("sources")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-emerald-600 mb-1 cursor-pointer group"
            >
              {t("heroCtaBrowse")} <ArrowIcon className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="relative h-[24rem] overflow-hidden rounded-2xl border border-border/80 bg-card shadow-md sm:h-[32rem] lg:h-[36rem]">
            <Suspense fallback={<MapSkeleton />}>
              <HomeMap products={sortedProducts} />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Sources & Filters Section */}
      <section id="sources" className="scroll-mt-32 border-t border-border/60 bg-muted/20">
        <div className="sticky top-[4.5rem] z-40 border-b border-border/80 bg-background/90 backdrop-blur-md shadow-sm">
          <div className="mx-auto max-w-[88rem] px-5 py-4 sm:px-8 lg:px-12">
            <HomeFilters
              brands={brands}
              currentQuery={query}
              currentTypes={types}
              currentBrands={brandIds}
              currentMinSweetness={minSweetness}
              currentMaxSweetness={maxSweetness}
              currentMinRichness={minRichness}
              currentMaxRichness={maxRichness}
              currentSort={sort}
              resultCount={sortedProducts.length}
            />
            
            <div className="mt-4 flex flex-wrap items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mr-2 shrink-0 font-semibold">
                {t("culinaryProfilesLabel")}
              </span>
              {["All Variants", "Traditional Spiced", "Malty & Rich", "Tangy & Fruity", "Chocolatey & Sweet", "Rich & Creamy"].map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                    activeFlavor === category
                      ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                      : "border-border bg-card text-muted-foreground hover:border-emerald-500 hover:text-foreground"
                  }`}
                >
                  {category === "All Variants" ? t("categories.all") : category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[88rem] px-5 pb-24 pt-10 sm:px-8 sm:pt-16 lg:px-12 lg:pb-32">
          
          {hasFilters && (
            <div className="mb-6 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-5 py-3.5 shadow-sm">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold">
                {t("activeFilterView", { count: sortedProducts.length })}
              </span>
              <Link href="/#sources" className="text-xs font-semibold text-muted-foreground hover:text-foreground underline underline-offset-4">
                {t("resetFilters")}
              </Link>
            </div>
          )}

          <div className="mb-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-semibold">{t("registryEyebrow")}</p>
              <h2 className="mt-3 font-display text-4xl leading-none tracking-[-0.035em] sm:text-6xl text-foreground">
                {hasFilters ? t("matchingVarieties") : t("allVarieties")}
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                {hasFilters ? t("matchingSubtitle") : t("allSubtitle")}
              </p>
            </div>
            <WaterMetricsHelp translations={{
              index: t("metricsHelp.index"), 
              trigger: t("metricsHelp.trigger"), 
              title: t("metricsHelp.title"), 
              sweetnessTitle: t("metricsHelp.sweetnessTitle"), 
              sweetnessDesc: t("metricsHelp.sweetnessDesc"), 
              sweetnessLow: t("metricsHelp.sweetnessLow"), 
              sweetnessBalanced: t("metricsHelp.sweetnessBalanced"), 
              sweetnessRich: t("metricsHelp.sweetnessRich"), 
              moistureTitle: t("metricsHelp.moistureTitle"), 
              moistureDesc: t("metricsHelp.moistureDesc"),
              moistureLight: t("metricsHelp.moistureLight"), 
              moistureStandard: t("metricsHelp.moistureStandard"), 
              moistureDense: t("metricsHelp.moistureDense"),
            }} />
          </div>

          <HomeContent products={sortedProducts} view={view} sort={sort} />
        </div>
      </section>

      {/* Visualizer Modal */}
      {showVisualizer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-card border border-border shadow-2xl text-card-foreground">
            
            <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/40">
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 animate-pulse" />
                <h3 className="font-mono text-xs tracking-widest text-emerald-700 dark:text-emerald-400 uppercase font-bold">{t("visualizer.modalTitle")}</h3>
              </div>
              <button onClick={() => setShowVisualizer(false)} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1 rounded-full hover:bg-muted">
                <CloseIcon />
              </button>
            </div>
            
            <div className="p-8 flex flex-col md:flex-row gap-10 items-center">
              <div className="relative w-40 h-48 rounded-xl overflow-hidden flex flex-col border border-border shadow-md rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
                <div className="flex-1 bg-[#4A2E15] border-b border-border/20" />
                <div className="flex-1 bg-[#D9B485] border-b border-border/20" />
                <div className="flex-1 bg-[#4A2E15] border-b border-border/20" />
                <div className="flex-1 bg-[#2C5E2E] border-b border-border/20" />
                <div className="flex-1 bg-[#D9B485] border-b border-border/20" />
                <div className="flex-1 bg-[#4A2E15] border-b border-border/20" />
                <div className="flex-1 bg-[#2C5E2E] border-b border-border/20" />
                <div className="flex-1 bg-[#4A2E15]" />
              </div>
              
              <div className="flex-1 space-y-5 w-full">
                <div>
                  <h4 className="text-xs font-mono text-emerald-700 dark:text-emerald-400 mb-1 font-semibold">{t("visualizer.complexityHeader")}</h4>
                  <p className="text-2xl font-display font-bold text-foreground">
                    {t("visualizer.masterArtisan")} <span className="text-sm font-sans font-normal text-muted-foreground ml-2">{t("visualizer.duration")}</span>
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm border-b border-border/60 pb-2">
                    <span className="text-muted-foreground">{t("visualizer.structuralLayers")}</span><span className="font-mono text-foreground font-semibold">18 - 22</span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-border/60 pb-2">
                    <span className="text-muted-foreground">{t("visualizer.butterDensity")}</span><span className="text-foreground font-medium">{t("visualizer.butterValue")}</span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-border/60 pb-2">
                    <span className="text-muted-foreground">{t("visualizer.dominantSpice")}</span><span className="text-foreground font-medium">{t("visualizer.spiceValue")}</span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-border/60 pb-2">
                    <span className="text-muted-foreground">{t("visualizer.coreBinding")}</span><span className="text-foreground font-medium">{t("visualizer.bindingValue")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <CompareDock productsById={productsById} />
    </main>
  )
}

function InteractiveStatCard({ 
  value, label, index, isHovered, onMouseEnter, onMouseLeave 
}: { 
  value: string; label: string; index: string; isHovered: boolean; onMouseEnter: () => void; onMouseLeave: () => void; 
}) {
  return (
    <div 
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`group relative flex items-end justify-between gap-4 p-6 sm:p-8 transition-all duration-200 cursor-pointer overflow-hidden ${
        isHovered ? "bg-muted/60 shadow-inner" : "bg-card hover:bg-muted/30"
      }`}
    >
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-emerald-600 transition-opacity duration-200 ${isHovered ? "opacity-100" : "opacity-0"}`} />
      <div>
        <span className={`block font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.04em] tabular-nums transition-colors duration-200 ${
          isHovered ? "text-emerald-700 dark:text-emerald-400" : "text-foreground"
        }`}>
          {value}
        </span>
        <span className="mt-2 block text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <span className={`font-mono text-xs font-bold transition-colors duration-200 ${isHovered ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground/60"}`}>
        {index}
      </span>
    </div>
  )
}

// Reusable SVGs
function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={`h-4 w-4 ${className}`} fill="none">
      <path d="M4 10h11M11 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-4 w-4 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function EyeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function MapSkeleton() {
  return <div className="h-full w-full animate-pulse bg-muted" aria-hidden="true" />
}