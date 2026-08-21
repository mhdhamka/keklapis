"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { ProductCard } from "./product-card"
import { RegistryTable } from "./registry-table"
import { Product } from "@/lib/types/db"
import { RegistryGlyph } from "./editorial-primitives"
import { ViewToggle } from "./view-toggle"
import type { ViewMode } from "@/lib/view"

interface HomeContentProps {
  products: Product[]
  view: ViewMode
  sort: string
}

export function HomeContent({ products, view, sort }: HomeContentProps) {
  const t = useTranslations("sourcesView")
  const filters = useTranslations("filters")

  if (products.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-emerald-900/10 bg-emerald-950/[0.02] backdrop-blur-md py-20 px-6 text-center shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-700/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-950/5 border border-emerald-900/10 shadow-inner mb-5">
            <RegistryGlyph kind="water" className="h-8 w-8 text-emerald-800" />
          </div>
          <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">{t("noResults")}</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{t("noResultsDesc")}</p>
          <Link 
            href="/" 
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white px-5 py-2.5 text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            {filters("clearAll")}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Control bar above content */}
      <div className="flex items-center justify-between border-b border-emerald-900/10 pb-4 px-1">
        <div className="flex items-center gap-2.5">
        </div>
        <ViewToggle current={view} />
      </div>

      {/* Dynamic View Mode container */}
      <div className="transition-all duration-200">
        {view === "table" ? (
          <div className="rounded-2xl border border-emerald-900/10 bg-card backdrop-blur-sm overflow-hidden shadow-sm">
            <RegistryTable products={products} sort={sort} />
          </div>
        ) : (
          <div className="registry-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="transition-all duration-200 hover:-translate-y-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={product} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}