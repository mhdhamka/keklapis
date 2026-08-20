import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function ArrowIcon({ direction = "right", className }: { direction?: "left" | "right" | "up-right"; className?: string }) {
  const path = direction === "left" ? "M16 10H5m4-4-4 4 4 4" : direction === "up-right" ? "M5 15 15 5M8 5h7v7" : "M4 10h11m-4-4 4 4-4 4"
  return <svg viewBox="0 0 20 20" aria-hidden="true" className={cn("h-4 w-4", className)} fill="none"><path d={path} stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter" /></svg>
}

export function RegistryGlyph({ kind = "water", className }: { kind?: "water" | "book" | "code" | "info" | "map" | "error"; className?: string }) {
  const paths = {
    water: <><path d="M12 3.5c-2.8 4-5.2 6.5-5.2 10a5.2 5.2 0 0 0 10.4 0c0-3.5-2.4-6-5.2-10Z" /><path d="M9.5 14.2c.3 1.2 1.1 1.9 2.4 2.2" /></>,
    book: <><path d="M4 5.5c2.7-.8 5.3-.3 8 1.5v12c-2.7-1.8-5.3-2.3-8-1.5Z" /><path d="M20 5.5c-2.7-.8-5.3-.3-8 1.5v12c2.7-1.8 5.3-2.3 8-1.5Z" /></>,
    code: <><path d="m9 7-4 5 4 5" /><path d="m15 7 4 5-4 5" /></>,
    info: <><circle cx="12" cy="12" r="8" /><path d="M12 11v5M12 8h.01" /></>,
    map: <><path d="M12 21s6-6.2 6-11a6 6 0 1 0-12 0c0 4.8 6 11 6 11Z" /><circle cx="12" cy="10" r="2" /></>,
    error: <><path d="M12 4 3.5 20h17Z" /><path d="M12 9v5M12 17h.01" /></>,
  }
  return <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-md bg-survey-pale text-survey-foreground", className)} aria-hidden="true"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square" strokeLinejoin="miter">{paths[kind]}</svg></span>
}

export function PageIntro({ index, title, description, children }: { index: string; title: string; description?: string; children?: ReactNode }) {
  return (
    <header className="editorial-texture border-b border-border">
      <div className="mx-auto max-w-[88rem] px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:px-12">
        <p className="section-index">{index}</p>
        <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,.42fr)] lg:items-end lg:gap-16">
          <h1 className="max-w-5xl text-pretty font-display text-[clamp(2.75rem,7vw,6rem)] leading-[0.94] tracking-[-0.04em]">{title}</h1>
          {(description || children) && <div className="border-t border-foreground/20 pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0"><p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>{children}</div>}
        </div>
      </div>
    </header>
  )
}

export function PanelHeading({ index, title, description }: { index: string; title: string; description?: string }) {
  return <div><p className="section-index">{index}</p><h2 className="mt-3 font-display text-3xl leading-none tracking-[-0.035em] sm:text-4xl">{title}</h2>{description && <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>}</div>
}
