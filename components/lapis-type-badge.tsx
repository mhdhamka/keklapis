import { cn } from "@/lib/utils"

export function LapisTypeBadge({ type, className }: { type: string | undefined | null; className?: string }) {
  return <span className={cn("inline-flex items-center gap-2 rounded-full bg-source-pale px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-source-foreground", className)}><span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />{type || "Unknown"}</span>
}
