"use client"

import { useState, useMemo, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import Link from "next/link"
import type { Product } from "@/lib/types/db"
import { SafeImage } from "@/components/safe-image"
import { CompareToggle } from "@/components/compare/compare-toggle"

interface SourcesTableProps {
  products: Product[]
  sort: string
}

type SortKey = "brand" | "sweetness" | "richness_dri"
type QuickFilter = "all" | "certified" | "high_richness"

const SORT_TO_PARAM: Record<SortKey, { asc: string; desc: string; default: string }> = {
  brand: { asc: "brand_asc", desc: "brand_desc", default: "brand_asc" },
  sweetness: { asc: "sweetness_asc", desc: "sweetness_desc", default: "sweetness_asc" },
  richness_dri: { asc: "richness_dri_asc", desc: "richness_dri_desc", default: "richness_dri_desc" },
}

export function RegistryTable({ products, sort }: SourcesTableProps) {
  const t = useTranslations("sourcesView")
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Interactive UI state for local filtering, quick tags & pagination
  const [filterQuery, setFilterQuery] = useState("")
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  const setSort = (key: SortKey) => {
    const { asc, desc, default: defaultVal } = SORT_TO_PARAM[key]
    let nextParam: string
    if (sort === asc) nextParam = desc
    else if (sort === desc) nextParam = asc
    else nextParam = defaultVal
    const params = new URLSearchParams(searchParams.toString())
    if (nextParam === "name_asc") params.delete("sort")
    else params.set("sort", nextParam)
    
    startTransition(() => {
      router.replace(params.size ? `/?${params.toString()}` : "/", { scroll: false })
    })
  }

  const sortState = (key: SortKey): "asc" | "desc" | null => {
    const { asc, desc } = SORT_TO_PARAM[key]
    if (sort === asc) return "asc"
    if (sort === desc) return "desc"
    return null
  }

  // Client-side filtering based on search query & quick filter chips
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const brand = product.brand?.brand_name ?? ""
      const productName = product.product_name ?? ""
      const sourceLocation = product.source?.location_address ?? ""

      const matchesSearch =
        filterQuery === "" ||
        brand.toLowerCase().includes(filterQuery.toLowerCase()) ||
        productName.toLowerCase().includes(filterQuery.toLowerCase()) ||
        sourceLocation.toLowerCase().includes(filterQuery.toLowerCase())

      if (!matchesSearch) return false

      if (quickFilter === "certified") {
        return Boolean(product.source?.kkm_approval_number)
      }
      if (quickFilter === "high_richness") {
        return (product.richness_dri ?? 0) >= 70
      }

      return true
    })
  }, [products, filterQuery, quickFilter])

  // Paginated records
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredProducts.slice(start, start + pageSize)
  }, [filteredProducts, currentPage, pageSize])

  return (
    <div className="space-y-6">
      {/* Modernized Interactive Toolbar & Filter Chips */}
      <div className="flex flex-col gap-4 rounded-xl border border-emerald-900/10 bg-emerald-950/[0.02] p-4 backdrop-blur-sm shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-emerald-800/60">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search brands, cakes, or locations..."
              value={filterQuery}
              onChange={(e) => {
                setFilterQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full rounded-lg border border-emerald-900/20 bg-background py-2.5 pl-10 pr-9 text-sm text-foreground shadow-sm transition-all placeholder:text-muted-foreground focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
            />
            {filterQuery && (
              <button
                onClick={() => setFilterQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-medium text-emerald-800/70 hover:text-emerald-950 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Action Reset */}
          {(filterQuery || quickFilter !== "all") && (
            <button
              onClick={() => {
                setFilterQuery("")
                setQuickFilter("all")
                setCurrentPage(1)
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors self-start sm:self-auto"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reset Filters
            </button>
          )}
        </div>

        {/* Interactive Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-900/5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-950/60 mr-1">Quick View:</span>
          <button
            onClick={() => { setQuickFilter("all"); setCurrentPage(1); }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              quickFilter === "all"
                ? "bg-emerald-900 text-white shadow-sm"
                : "bg-emerald-950/5 text-emerald-950/80 hover:bg-emerald-950/10"
            }`}
          >
            All Cakes
          </button>
          <button
            onClick={() => { setQuickFilter("certified"); setCurrentPage(1); }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              quickFilter === "certified"
                ? "bg-emerald-900 text-white shadow-sm"
                : "bg-emerald-950/5 text-emerald-950/80 hover:bg-emerald-950/10"
            }`}
          >
            KKM Certified
          </button>
          <button
            onClick={() => { setQuickFilter("high_richness"); setCurrentPage(1); }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              quickFilter === "high_richness"
                ? "bg-emerald-900 text-white shadow-sm"
                : "bg-emerald-950/5 text-emerald-950/80 hover:bg-emerald-950/10"
            }`}
          >
            High Richness (≥75%)
          </button>
        </div>
      </div>

      {/* Main Glass-styled Table Container with Lumut Green Accents */}
      <div className={`overflow-x-auto rounded-xl border border-emerald-900/10 shadow-md bg-card transition-opacity duration-200 ${isPending ? "opacity-60" : "opacity-100"}`}>
        <table className="w-full min-w-[44rem] border-collapse text-left">
          <thead className="sticky top-0 z-20 bg-emerald-950/[0.04] backdrop-blur-md border-b border-emerald-900/10">
            <tr className="font-mono text-[11px] uppercase tracking-[0.12em] text-emerald-950/70">
              <SortHeader
                scope="col"
                className="sticky left-0 z-30 min-w-[14rem] border-r border-emerald-900/10 bg-emerald-950/[0.06] backdrop-blur-md sm:min-w-[17rem] px-4"
                label={t("colBrand")}
                state={sortState("brand")}
                onClick={() => setSort("brand")}
              />
              <SortHeader
                scope="col"
                className="text-left py-3.5 px-6"
                label="Sweetness"
                state={sortState("sweetness")}
                onClick={() => setSort("sweetness")}
              />
              <SortHeader
                scope="col"
                className="text-right py-3.5 px-6"
                label="Richness"
                state={sortState("richness_dri")}
                onClick={() => setSort("richness_dri")}
              />
              <th scope="col" className="px-4 py-3.5 font-medium">
                {t("colSource")}
              </th>
              <th scope="col" className="hidden px-4 py-3.5 font-medium sm:table-cell">
                Heritage Certification
              </th>
              <th scope="col" className="px-4 py-3.5 text-center font-medium">
                <span className="sr-only">{t("colCompare")}</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-900/5">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <TableRow key={product.id} product={product} />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-16 text-center text-sm text-muted-foreground">
                  No matching Kek Lapis Sarawak records found. Try adjusting your parameters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modernized Interactive Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 pt-1 text-xs text-muted-foreground">
          <div className="font-medium">
            Showing <span className="font-semibold text-emerald-950">{(currentPage - 1) * pageSize + 1}</span> to{" "}
            <span className="font-semibold text-emerald-950">{Math.min(currentPage * pageSize, filteredProducts.length)}</span> of{" "}
            <span className="font-semibold text-emerald-950">{filteredProducts.length}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-1.5 rounded-lg border border-emerald-900/15 bg-background font-medium text-emerald-950 shadow-sm hover:bg-emerald-950/5 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              Previous
            </button>
            <span className="px-2 font-mono font-medium text-emerald-950">
              Page {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3.5 py-1.5 rounded-lg border border-emerald-900/15 bg-background font-medium text-emerald-950 shadow-sm hover:bg-emerald-950/5 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SortHeader({
  scope,
  className,
  label,
  state,
  onClick,
}: {
  scope: "col" | "row"
  className: string
  label: string
  state: "asc" | "desc" | null
  onClick: () => void
}) {
  return (
    <th scope={scope} className={`${className} py-3.5 font-medium`}>
      <button
        type="button"
        onClick={onClick}
        className="group inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-emerald-950/70 transition-colors hover:text-emerald-900"
        aria-sort={state === "asc" ? "ascending" : state === "desc" ? "descending" : "none"}
      >
        <span>{label}</span>
        <SortIcon state={state} />
      </button>
    </th>
  )
}

function SortIcon({ state }: { state: "asc" | "desc" | null }) {
  if (!state) {
    return (
      <svg viewBox="0 0 10 10" fill="none" className="h-3 w-3 opacity-30 group-hover:opacity-75 transition-opacity" aria-hidden="true">
        <path d="M5 1.5v7M2.5 4 5 1.5 7.5 4M2.5 6 5 8.5 7.5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 10 10" fill="none" className="h-3 w-3 text-emerald-800" aria-hidden="true">
      {state === "asc" ? (
        <path d="M5 8.5v-7M2.5 4 5 1.5 7.5 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M5 1.5v7M2.5 6 5 8.5 7.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  )
}

function TableRow({ product }: { product: Product }) {
  const brand = product.brand?.brand_name ?? "Independent"
  const productName = product.product_name
  const imageUrl = product.images?.[0]?.url ?? "/placeholder.svg"
  const sourceLocation = product.source?.location_address ?? "—"
  const kkm = product.source?.kkm_approval_number
  const compareSummary = {
    id: product.id,
    brandName: brand,
    productName: productName || brand,
    imageUrl,
  }

  return (
    <tr className="group transition-all hover:bg-emerald-950/[0.03]">
      {/* Sticky brand column with lumut highlight on hover */}
      <th scope="row" className="sticky left-0 z-10 min-w-[14rem] border-r border-emerald-900/10 bg-card group-hover:bg-emerald-50/50 dark:group-hover:bg-emerald-950/20 sm:min-w-[17rem] transition-colors">
        <Link href={`/registry/${product.id}`} className="flex items-center gap-3.5 px-4 py-3.5">
          <span className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg border border-emerald-900/15 bg-emerald-950/[0.02] shadow-sm transition-transform group-hover:scale-105">
            <SafeImage
              src={imageUrl}
              alt={brand}
              width={96}
              height={96}
              loading="lazy"
              className="h-full w-full object-contain p-1.5"
            />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold leading-tight tracking-tight text-foreground group-hover:text-emerald-950 line-clamp-1">{brand}</span>
            {productName && productName !== brand && (
              <span className="mt-1 block text-xs font-medium text-emerald-800/80 line-clamp-1">{productName}</span>
            )}
          </span>
        </Link>
      </th>

      {/* Sweetness */}
      <td className="px-6 py-3.5 text-left">
        <span className={`font-mono text-sm tabular-nums font-semibold ${product.sweetness == null ? "text-muted-foreground" : "text-emerald-950"}`}>
          {product.sweetness != null ? Number(product.sweetness).toFixed(1) : "—"}
        </span>
      </td>

      {/* Richness DRI */}
      <td className="px-6 py-3.5 text-right">
        <span className={`font-mono text-sm tabular-nums font-semibold ${product.richness_dri == null ? "text-muted-foreground" : "text-emerald-950"}`}>
          {product.richness_dri != null ? Number(product.richness_dri).toFixed(0) : "—"}
          {product.richness_dri != null && <span className="ml-1 text-[10px] font-normal text-emerald-800/70">%</span>}
        </span>
      </td>

      {/* Registry location */}
      <td className="px-4 py-3.5">
        <span className="block max-w-[18rem] text-xs font-medium leading-relaxed text-muted-foreground line-clamp-2">{sourceLocation}</span>
      </td>

      {/* KKM (hidden on mobile) */}
      <td className="hidden px-4 py-3.5 sm:table-cell">
        <span className="font-mono text-xs tabular-nums font-medium text-emerald-900/80 bg-emerald-950/5 px-2 py-1 rounded border border-emerald-900/10">
          {kkm ?? "—"}
        </span>
      </td>

      {/* Compare */}
      <td className="px-4 py-3.5 text-center">
        <CompareToggle summary={compareSummary} />
      </td>
    </tr>
  )
}