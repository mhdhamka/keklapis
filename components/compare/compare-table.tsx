"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import type { Product } from "@/lib/types/db"
import {
  buildCompareRows,
  formatAttributeValue,
  formatIngredientValue,
  type AttributeRow,
  type IngredientRow,
} from "@/lib/compare/rows"

interface CompareTableProps {
  products: Product[]
  onClose: () => void
}

export function CompareTable({ products, onClose }: CompareTableProps) {
  const t = useTranslations("comparison")
  const tAttr = useTranslations("product")
  const rows = buildCompareRows(products)

  // Interactive toggle: filter rows to only show differences between selected cakes
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  // Resolve translated labels for Kek Lapis attributes
  const attrLabel = (row: AttributeRow): string => {
    switch (row.label) {
      case "cakeCategory":
        return t("cakeCategory") // e.g. Traditional / Modern Spiced
      case "sweetnessLevel":
        return t("sweetnessLevel") // e.g. Balanced / Rich
      case "richnessDri":
        return t("richnessDri") // e.g. Richness density & DRI
      case "sourceType":
        return t("sourceType") // e.g. Oven Baked / Steamed Layer
      case "location":
        return t("location") // e.g. Kuching, Sarawak
      case "manufacturer":
        return t("manufacturer")
      case "kkmApproval":
        return tAttr("halalCertified")
      default:
        return row.label
    }
  }

  // Filter rows if user toggles "Show only differences"
  const filteredAttributes = rows.attributes.filter((row) => {
    if (!showOnlyDifferences) return true
    const firstVal = row.values[0]
    return row.values.some((v) => v !== firstVal)
  })

  const filteredIngredients = rows.ingredients.filter((row) => {
    if (!showOnlyDifferences) return true
    const firstVal = row.values[0]
    return row.values.some((v) => v !== firstVal)
  })

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("title")}
      className="fixed inset-0 z-[60] overflow-y-auto bg-emerald-950/45 p-4 backdrop-blur-sm sm:p-6 lg:p-10 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="mx-auto my-auto flex w-full max-w-[92rem] flex-col overflow-hidden rounded-2xl border border-emerald-900/20 bg-background shadow-[0_20px_50px_rgba(4,47,34,0.12)] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Interactive Controls */}
        <header className="flex shrink-0 flex-col gap-4 border-b border-emerald-900/15 bg-background px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/[0.04] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-emerald-900 border border-emerald-900/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-700 animate-pulse" />
              {t("sectionIndex")}
            </span>
            <h2 className="mt-3 font-display text-2xl leading-none tracking-[-0.035em] text-emerald-950 sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-6 text-emerald-950/70">
              {t("description")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Interactive Toggle for Differences */}
            <button
              type="button"
              onClick={() => setShowOnlyDifferences(!showOnlyDifferences)}
              className={`inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-xs font-semibold uppercase tracking-[0.08em] transition-all ${
                showOnlyDifferences
                  ? "border-emerald-900 bg-emerald-900 text-white shadow-sm"
                  : "border-emerald-900/20 bg-background text-emerald-950 hover:bg-emerald-950/5"
              }`}
            >
              <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
                <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              {showOnlyDifferences ? t("showingDifferences") : t("showDifferencesOnly")}
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label={t("close")}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-emerald-900/15 bg-background text-emerald-950/70 transition-colors hover:bg-emerald-950/5 hover:text-emerald-950"
            >
              <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
                <path d="m4 4 8 8M12 4 4 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </header>

        {/* Body — Horizontally scrollable table area */}
        <div className="w-full overflow-x-auto bg-background">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead className="sticky top-0 z-30 bg-background/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(4,47,34,0.1)]">
              <tr>
                <th
                  scope="col"
                  className="sticky left-0 z-40 w-40 min-w-[9rem] border-b border-r border-emerald-900/15 bg-background px-3 py-4 sm:w-52 sm:min-w-[12rem] sm:px-4"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-emerald-950/70">
                    {t("property")}
                  </span>
                </th>
                {products.map((p) => (
                  <th
                    key={p.id}
                    scope="col"
                    className="w-40 min-w-[9rem] border-b border-emerald-900/15 bg-background px-3 py-4 align-bottom sm:w-52 sm:min-w-[12rem] sm:px-4"
                  >
                    <ProductColumnHeader product={p} />
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Attribute rows */}
              {filteredAttributes.length === 0 ? (
                <tr>
                  <th scope="row" className="sticky left-0 border-b border-r border-emerald-900/15 bg-background px-3 py-6 sm:px-4" />
                  <td colSpan={products.length} className="border-b border-emerald-900/15 px-3 py-12 text-center text-sm text-emerald-950/70">
                    {t("noDifferencesFound")}
                  </td>
                </tr>
              ) : (
                filteredAttributes.map((row) => (
                  <tr key={row.key} className="group transition-colors hover:bg-emerald-955/[0.02]">
                    <th
                      scope="row"
                      className="sticky left-0 z-20 border-b border-r border-emerald-900/15 bg-background px-3 py-3.5 sm:px-4"
                    >
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-emerald-950/70">
                        {attrLabel(row)}
                      </span>
                    </th>
                    {row.values.map((value, i) => {
                      const isBest = row.bestIndex != null && row.bestIndex === i
                      const text = formatAttributeValue(row, value)
                      return (
                        <td
                          key={i}
                          className={[
                            "border-b border-emerald-900/15 px-3 py-3.5 align-top transition-colors sm:px-4",
                            isBest ? "bg-emerald-950/[0.04] font-medium" : "bg-emerald-950/[0.01]",
                          ].join(" ")}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={[
                                "font-mono text-sm tabular-nums",
                                value == null ? "text-emerald-950/40" : "text-emerald-950",
                              ].join(" ")}
                            >
                              {text}
                            </span>
                            {row.unit && value != null && (
                              <span className="text-[10px] text-emerald-950/60">{row.unit}</span>
                            )}
                            {isBest && (
                              <span className="rounded-full bg-emerald-900 px-2.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.08em] text-white shadow-sm">
                                {row.direction === "lower" ? t("lightest") : t("richest")}
                              </span>
                            )}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))
              )}

              {/* Ingredient / Signature Spices Section Header */}
              <tr>
                <th
                  scope="row"
                  colSpan={products.length + 1}
                  className="sticky left-0 border-b border-emerald-900/15 bg-emerald-950/[0.03] px-3 py-3 sm:px-4"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-emerald-950 font-semibold">
                    {t("signatureIngredientsAndSpices")}
                  </span>
                  <span className="ml-3 font-mono text-[10px] text-emerald-950/70">
                    {t("ingredientCompositionGrams")}
                  </span>
                </th>
              </tr>

              {/* Ingredient / Component rows */}
              {filteredIngredients.length === 0 ? (
                <tr>
                  <th scope="row" className="sticky left-0 border-b border-r border-emerald-900/15 bg-background px-3 py-4 sm:px-4" />
                  <td colSpan={products.length} className="border-b border-emerald-900/15 px-3 py-8 text-center text-sm text-emerald-950/70 sm:px-4">
                    {t("noIngredientData")}
                  </td>
                </tr>
              ) : (
                filteredIngredients.map((row) => (
                  <tr key={row.key} className="transition-colors hover:bg-emerald-950/[0.02]">
                    <th
                      scope="row"
                      className="sticky left-0 z-20 border-b border-r border-emerald-900/15 bg-background px-3 py-3.5 sm:px-4"
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-semibold text-emerald-950 text-xs">{row.label}</span>
                        <span className="font-mono text-[10px] text-emerald-950/70">{row.symbol}</span>
                      </span>
                    </th>
                    {row.values.map((value, i) => {
                      const isBest = row.bestIndex != null && row.bestIndex === i
                      return (
                        <td
                          key={i}
                          className={[
                            "border-b border-emerald-900/15 px-3 py-3.5 align-top transition-colors sm:px-4",
                            isBest ? "bg-emerald-950/[0.04] font-medium" : "bg-emerald-950/[0.01]",
                          ].join(" ")}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={[
                                "font-mono text-sm tabular-nums",
                                value == null ? "text-emerald-950/40" : "text-emerald-950",
                              ].join(" ")}
                            >
                              {formatIngredientValue(value)}
                            </span>
                            {value != null && (
                              <span className="text-[10px] text-emerald-950/70">g</span>
                            )}
                            {isBest && (
                              <span className="rounded-full bg-emerald-900 px-2.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.08em] text-white shadow-sm">
                                {row.direction === "lower" ? t("lowest") : t("highest")}
                              </span>
                            )}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <footer className="flex shrink-0 items-center justify-between gap-4 border-t border-emerald-900/15 bg-background px-5 py-4 sm:px-8">
          <p className="hidden text-xs text-emerald-950/70 sm:block">{t("highlightLegend")}</p>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto inline-flex h-10 items-center rounded-xl border border-emerald-900/15 bg-background px-5 text-xs font-semibold uppercase tracking-[0.08em] text-emerald-950 transition-colors hover:bg-emerald-950/5"
          >
            {t("close")}
          </button>
        </footer>
      </div>
    </div>
  )
}

function ProductColumnHeader({ product }: { product: Product }) {
  const imageUrl = product.images?.[0]?.url ?? "/placeholder.svg"
  const brand = product.brand?.brand_name ?? "Independent Baker"
  const productName = product.product_name

  return (
    <Link
      href={`/sources/${product.id}`}
      className="group/header flex flex-col gap-2.5 p-1 transition-all"
    >
      <span className="relative block aspect-square w-full overflow-hidden rounded-xl border border-emerald-900/15 bg-emerald-950/[0.02] shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={brand}
          loading="lazy"
          className="h-full w-full object-contain p-2.5 transition-transform duration-300 group-hover/header:scale-105"
        />
      </span>
      <span className="block text-sm font-semibold leading-snug tracking-[-0.015em] text-emerald-950 line-clamp-2">
        {brand}
      </span>
      {productName && productName !== brand && (
        <span className="-mt-1 block text-[10px] leading-tight text-emerald-950/70 line-clamp-1">
          {productName}
        </span>
      )}
      <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald-900 group-hover/header:underline">
        View details
        <svg viewBox="0 0 12 12" fill="none" className="h-2.5 w-2.5">
          <path d="M3 9 9 3M5 3h4v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  )
}