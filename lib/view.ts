export type ViewMode = "cards" | "table"

export function isViewMode(value: unknown): value is ViewMode {
  return value === "cards" || value === "table"
}