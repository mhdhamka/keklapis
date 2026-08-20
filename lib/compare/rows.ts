import type { Product } from "@/lib/types/db"
import { getIngredientInfo } from "@/lib/ingredient-data"

export type AttributeRow = {
  key: string
  label: string
  kind: "text" | "numeric"
  unit?: string
  values: (string | number | null)[] // aligned to products order; null = unknown
  // index of the "best" value in this row, or null when not comparable / tied / all null
  bestIndex: number | null
  // "higher" or "lower" is better, or null for non-comparable rows
  direction: "higher" | "lower" | null
}

export type IngredientRow = {
  key: string
  label: string
  symbol: string
  values: (number | null)[] // g per product, null = not reported
  bestIndex: number | null
  direction: "higher" | "lower"
  // max absolute value across the set, for sorting relevance
  maxAcrossSet: number
}

export type CompareRows = {
  attributes: AttributeRow[]
  ingredients: IngredientRow[]
}

// Ingredients/spices where a lower value is generally desirable.
// Everything else defaults to "higher is better".
const LOWER_IS_BETTER = new Set([
  "salt",
  "preservatives",
])

// Stable key for an ingredient name (lowercased, trimmed).
function ingredientKey(name: string): string {
  return name.toLowerCase().trim()
}

// Parse a product's ingredient/spice map into a normalized record keyed by ingredient key.
export function normalizeIngredients(product: Product): Record<string, number | null> {
  const raw = product.minerals_json
  let entries: Array<{ name: string; amount: number | null }> = []

  type IngredientEntry = { name: string; amount: number | null }

  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        entries = (parsed as IngredientEntry[]).map((m) => ({ name: m.name, amount: m.amount }))
      } else if (parsed && typeof parsed === "object") {
        entries = (Object.values(parsed) as IngredientEntry[]).map((m) => ({ name: m.name, amount: m.amount }))
      }
    } catch {
      entries = []
    }
  } else if (Array.isArray(raw)) {
    // Handling array format if already parsed
    entries = (raw as unknown as IngredientEntry[]).map((m) => ({ name: m.name, amount: m.amount }))
  } else if (raw && typeof raw === "object") {
    // Handling object map format: Record<string, { name, amount, ... }>
    entries = Object.values(raw).map((m: any) => ({
      name: m?.name ?? "",
      amount: m?.amount ?? null,
    }))
  }

  const out: Record<string, number | null> = {}
  for (const entry of entries) {
    if (!entry?.name) continue
    const key = ingredientKey(entry.name)
    out[key] = entry.amount == null ? null : Number(entry.amount)
  }
  return out
}

function fmtNum(value: number | null | undefined, digits = 1): string {
  if (value == null || Number.isNaN(value)) return "—"
  const n = Number(value)
  // Use 1 decimal for small values, 0 for large integers
  if (n >= 100) return n.toFixed(0)
  if (Number.isInteger(n)) return n.toFixed(0)
  return n.toFixed(digits)
}

function pickBest(
  values: (number | null)[],
  direction: "higher" | "lower",
): number | null {
  const valid = values
    .map((v, i) => (v == null || Number.isNaN(v) ? null : { v: v as number, i }))
    .filter((x): x is { v: number; i: number } => x !== null)
  if (valid.length < 2) return null
  let best = valid[0]
  for (const candidate of valid) {
    if (direction === "higher" && candidate.v > best.v) best = candidate
    if (direction === "lower" && candidate.v < best.v) best = candidate
  }
  // Tie? mark no single best.
  const ties = valid.filter((c) => c.v === best.v)
  if (ties.length > 1) return null
  return best.i
}

export function buildCompareRows(products: Product[]): CompareRows {
  // ---- Attribute rows mapped to the correct Product schema properties ----
  const attributes: AttributeRow[] = [
    {
      key: "cakeCategory",
      label: "cakeCategory",
      kind: "text",
      values: products.map((p) => p.cake_type ?? null),
      bestIndex: null,
      direction: null,
    },
    {
      key: "sweetnessLevel",
      label: "sweetnessLevel",
      kind: "numeric",
      values: products.map((p) => (p.sweetness == null ? null : Number(p.sweetness))),
      bestIndex: null,
      direction: null,
    },
    {
      key: "richnessDri",
      label: "richnessDri",
      kind: "numeric",
      unit: "%",
      values: products.map((p) => (p.richness_dri == null ? null : Number(p.richness_dri))),
      bestIndex: pickBest(products.map((p) => (p.richness_dri == null ? null : Number(p.richness_dri))), "higher"),
      direction: "higher",
    },
    {
      key: "sourceType",
      label: "sourceType",
      kind: "text",
      values: products.map((p) => p.source?.type ?? null),
      bestIndex: null,
      direction: null,
    },
    {
      key: "location",
      label: "location",
      kind: "text",
      values: products.map((p) => p.source?.location_address ?? null),
      bestIndex: null,
      direction: null,
    },
    {
      key: "manufacturer",
      label: "manufacturer",
      kind: "text",
      values: products.map((p) => p.manufacturer?.name ?? null),
      bestIndex: null,
      direction: null,
    },
    {
      key: "kkmApproval",
      label: "kkmApproval",
      kind: "text",
      values: products.map((p) => p.source?.kkm_approval_number ?? null),
      bestIndex: null,
      direction: null,
    },
  ]

  // ---- Ingredient / Spice rows: union across selected products ----
  const perProduct = products.map(normalizeIngredients)
  const unionKeys = new Set<string>()
  for (const map of perProduct) {
    for (const key of Object.keys(map)) unionKeys.add(key)
  }

  const ingredientRows: IngredientRow[] = []
  for (const key of unionKeys) {
    const info = getIngredientInfo(key)
    const values = perProduct.map((m) => {
      const v = m[key]
      return v == null ? null : Number(v)
    })
    const direction: "higher" | "lower" = LOWER_IS_BETTER.has(key) ? "lower" : "higher"
    const maxAcrossSet = Math.max(0, ...values.map((v) => (v == null ? 0 : v)))
    ingredientRows.push({
      key,
      label: info.name,
      symbol: info.symbol,
      values,
      bestIndex: pickBest(values, direction),
      direction,
      maxAcrossSet,
    })
  }

  // Sort ingredients by max value across the set, descending — most differentiating first.
  ingredientRows.sort((a, b) => b.maxAcrossSet - a.maxAcrossSet)

  return { attributes, ingredients: ingredientRows }
}

export function formatAttributeValue(row: AttributeRow, value: string | number | null): string {
  if (value == null) return "—"
  if (row.kind === "numeric") return fmtNum(value as number)
  return String(value)
}

export function formatIngredientValue(value: number | null): string {
  if (value == null) return "—"
  return fmtNum(value, 1)
}