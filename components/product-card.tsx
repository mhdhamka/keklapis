"use client"

import { useState } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Product } from "@/lib/types/db"
import { SafeImage } from "@/components/safe-image"
import { CompareToggle } from "@/components/compare/compare-toggle"

interface ProductCardProps { 
  product: Product
  index?: number 
}

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
      href={`/registry/${product.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex min-h-[34rem] flex-col overflow-hidden rounded-2xl border border-emerald-950/10 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-900/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      {/* Signature 5-Color Kek Lapis Palette Accent Bar */}
      <div className="absolute top-0 inset-x-0 h-1.5 flex" aria-hidden="true">
        <div className="flex-1 bg-[#7A5C3E]" />
        <div className="flex-1 bg-[#B3936A]" />
        <div className="flex-1 bg-[#2E4A35]" />
        <div className="flex-1 bg-[#5B6E53]" />
        <div className="flex-1 bg-[#D4C4A8]" />
      </div>

      {/* Top Image Specimen Container */}
      <div className="relative flex min-h-72 flex-1 items-center justify-center overflow-hidden border-b border-emerald-950/10 bg-muted/30 p-6">
        
        {/* Type Badge */}
        <span className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-emerald-950/5 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-900 dark:text-emerald-300 border border-emerald-950/10 shadow-xs">
          {cakeType}
        </span>
        
        {/* Index Counter */}
        <span className="absolute right-4 top-4 z-10 font-mono text-[10px] text-muted-foreground bg-background/80 backdrop-blur-xs px-2 py-0.5 rounded-md border border-border/40">
          /{String(index + 1).padStart(2, "0")}
        </span>

        {/* Compare Toggle Widget */}
        <div className="absolute left-4 bottom-4 z-10 transition-transform duration-200 hover:scale-110 active:scale-95">
          <CompareToggle summary={compareSummary} />
        </div>

        {/* View Specimen Hover Action with the Exact App Green */}
        <div className={`absolute right-4 bottom-4 z-10 transition-all duration-300 transform ${isHovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>
          <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white px-3.5 py-2 text-[10px] font-mono font-medium shadow-md transition-colors">
            {t("viewSpecimen")}
            <ArrowGlyph />
          </span>
        </div>

        {/* Product Image */}
        <SafeImage 
          src={imageUrl} 
          alt={product.product_name || product.brand?.brand_name || "Product image"}
          width={1200} 
          height={1200}
          className="h-72 w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 sm:h-80 drop-shadow-md"
          loading="lazy" 
        />
      </div>

      {/* Content Body */}
      <div className="p-6 flex flex-col justify-between flex-1 bg-card">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-800 dark:text-emerald-400">
                {product.brand?.brand_name ?? "Independent"}
              </p>
              <h3 className="mt-1.5 text-lg font-bold leading-snug tracking-tight text-foreground group-hover:text-emerald-900 transition-colors line-clamp-1">
                {product.product_name || product.brand?.brand_name}
              </h3>
            </div>
          </div>

          {product.source?.location_address && (
            <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <PinGlyph />
              <span className="line-clamp-2">{product.source.location_address}</span>
            </p>
          )}
        </div>

        {/* Metrics Footer */}
        <div className="mt-6 grid grid-cols-2 border-t border-emerald-950/10 pt-4 bg-muted/20 -mx-6 -mb-6 p-5 rounded-b-2xl">
          <Metric label={t("sweetness")} value={product.sweetness != null ? Number(product.sweetness).toFixed(1) : "—"} />
          <Metric label={t("richnessDri")} value={product.richness_dri != null ? `${Number(product.richness_dri).toFixed(0)}` : "—"} unit={product.richness_dri != null ? "%" : undefined} bordered />
        </div>
      </div>
    </Link>
  )
}

function Metric({ label, value, unit, bordered }: { label: string; value: string; unit?: string; bordered?: boolean }) {
  return (
    <div className={`transition-colors duration-200 ${bordered ? "border-l border-emerald-950/10 pl-4" : "pr-4"}`}>
      <span className="block text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-semibold">{label}</span>
      <span className="mt-1 block font-mono text-base font-bold tabular-nums text-foreground">
        {value}
        {unit && <small className="ml-1 text-[10px] font-normal text-muted-foreground">{unit}</small>}
      </span>
    </div>
  )
}

function ArrowGlyph() { 
  return (
    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-lg bg-white/20 text-current transition-all duration-300">
      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" fill="none">
        <path d="M5 15 15 5M8 5h7v7" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    </span>
  ) 
}

function PinGlyph() { 
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-800" aria-hidden="true" fill="none">
      <path d="M10 18s5-5.3 5-10a5 5 0 1 0-10 0c0 4.7 5 10 5 10Z" stroke="currentColor" strokeWidth="1.7"/>
      <circle cx="10" cy="8" r="1.5" fill="currentColor"/>
    </svg>
  ) 
}