"use client"

import { useState } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Product } from "@/lib/types/db"
import { SafeImage } from "@/components/safe-image"
import { CompareToggle } from "@/components/compare/compare-toggle"

interface ProductCardProps { product: Product; index?: number }

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const t = useTranslations("productCard")
  const imageUrl = product.images?.[0]?.url ?? "/placeholder.svg"
  const cakeType = product.source?.type ?? "Bakery"
  const compareSummary = {
    id: product.id,
    brandName: product.brand?.brand_name ?? "Independent",
    productName: product.product_name || product.brand?.brand_name || "",
    imageUrl,
  }

  return (
    <Link 
      href={`/sources/${product.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex min-h-[30rem] flex-col overflow-hidden rounded-2xl border border-[#3B4D3C]/20 bg-card/90 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[#3B4D3C]/60 hover:shadow-[0_20px_40px_-12px_rgba(59,77,60,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B4D3C]"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      {/* Ambient Lumut Glow on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-t from-[#3B4D3C]/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 pointer-events-none ${isHovered ? "opacity-100" : ""}`} />

      {/* Top Image Specimen Container */}
      <div className="relative flex min-h-60 flex-1 items-center justify-center overflow-hidden border-b border-[#3B4D3C]/10 bg-gradient-to-b from-[#F2F5F1] to-[#E6ECE4] dark:from-[#141A14] dark:to-[#0D120D] p-6 sm:min-h-64">
        
        {/* Type Badge with interactive pulse */}
        <span className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-[#3B4D3C]/10 dark:bg-[#8FA88E]/15 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#3B4D3C] dark:text-[#8FA88E] border border-[#3B4D3C]/20 shadow-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-[#3B4D3C] dark:bg-[#8FA88E] animate-pulse" />
          {cakeType}
        </span>
        
        {/* Index Counter */}
        <span className="absolute right-4 top-4 z-10 font-mono text-[10px] text-muted-foreground/80 bg-background/50 backdrop-blur-xs px-2 py-0.5 rounded-md border border-border/40">
          /{String(index + 1).padStart(2, "0")}
        </span>

        {/* Compare Toggle Widget with interactive pop */}
        <div className="absolute left-4 bottom-4 z-10 transition-transform duration-200 hover:scale-110 active:scale-95">
          <CompareToggle summary={compareSummary} />
        </div>

        {/* Interactive Floating Quick-Action Trigger with Combined ArrowGlyph */}
        <div className={`absolute right-4 bottom-4 z-10 transition-all duration-300 transform ${isHovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>
          <span className="inline-flex items-center gap-2 rounded-xl bg-[#3B4D3C] text-white dark:bg-[#8FA88E] dark:text-background px-3.5 py-2 text-[10px] font-mono font-medium shadow-md">
            View Details
            <ArrowGlyph />
          </span>
        </div>

        {/* Product Image with Dynamic Zoom & Lift */}
        <SafeImage 
          src={imageUrl} 
          alt={product.product_name || product.brand?.brand_name || "Product image"}
          width={480} 
          height={480}
          className="h-48 w-full object-contain transition-transform duration-500 ease-out group-hover:scale-110 sm:h-56 drop-shadow-md"
          loading="lazy" 
        />
      </div>

      {/* Content Body */}
      <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 bg-background/60">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#3B4D3C] dark:text-[#8FA88E] transition-colors">
                {product.brand?.brand_name ?? "Independent"}
              </p>
              <h3 className="mt-1.5 text-lg font-semibold leading-snug tracking-[-0.015em] text-foreground group-hover:text-[#3B4D3C] dark:group-hover:text-[#8FA88E] transition-colors text-pretty">
                {product.product_name || product.brand?.brand_name}
              </h3>
            </div>
          </div>

          {product.source?.location_address && (
            <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-muted-foreground group-hover:text-foreground/80 transition-colors">
              <PinGlyph />
              <span className="line-clamp-2">{product.source.location_address}</span>
            </p>
          )}
        </div>

        {/* Interactive Metrics Grid */}
        <div className="mt-5 grid grid-cols-2 border-t border-[#3B4D3C]/20 pt-4 bg-[#3B4D3C]/[0.02] -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 sm:p-5 rounded-b-2xl">
          <Metric label={t("sweetness")} value={product.sweetness != null ? Number(product.sweetness).toFixed(1) : "—"} />
          <Metric label={t("richnessDri")} value={product.richness_dri != null ? `${Number(product.richness_dri).toFixed(0)}` : "—"} unit={product.richness_dri != null ? "%" : undefined} bordered />
        </div>
      </div>
    </Link>
  )
}

function Metric({ label, value, unit, bordered }: { label: string; value: string; unit?: string; bordered?: boolean }) {
  return (
    <div className={`transition-colors duration-200 ${bordered ? "border-l border-[#3B4D3C]/20 pl-4" : "pr-4"}`}>
      <span className="block text-[10px] uppercase tracking-[0.12em] text-muted-foreground/90 font-medium">{label}</span>
      <span className="mt-1 block font-mono text-lg tabular-nums text-foreground group-hover:text-[#3B4D3C] dark:group-hover:text-[#8FA88E] transition-colors">
        {value}
        {unit && <small className="ml-1 text-[10px] text-muted-foreground">{unit}</small>}
      </span>
    </div>
  )
}

function ArrowGlyph() { 
  return (
    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-lg bg-white/10 dark:bg-black/10 text-current transition-all duration-300">
      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" fill="none">
        <path d="M5 15 15 5M8 5h7v7" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    </span>
  ) 
}

function PinGlyph() { 
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3B4D3C] dark:text-[#8FA88E] transition-transform duration-200 group-hover:scale-110" aria-hidden="true" fill="none">
      <path d="M10 18s5-5.3 5-10a5 5 0 1 0-10 0c0 4.7 5 10 5 10Z" stroke="currentColor" strokeWidth="1.7"/>
      <circle cx="10" cy="8" r="1.5" fill="currentColor"/>
    </svg>
  ) 
}