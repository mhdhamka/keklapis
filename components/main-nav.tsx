"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import type { Locale } from "@/i18n/routing"
import { LanguageSwitcher } from "./language-switcher"

interface MainNavProps {
  initialLocale: Locale
}

export function MainNav({ initialLocale }: MainNavProps) {
  const pathname = usePathname()
  const t = useTranslations("nav")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Track window scroll for shrinking navbar header effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile navigation on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Handle escape key to close mobile drawer & lock body scroll
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false)
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => {
      window.removeEventListener("keydown", closeOnEscape)
      document.body.style.overflow = "unset"
    }
  }, [mobileOpen])

  // Localized routes array using translation keys
  const routes = [
    { href: "/#overview", label: t("home"), active: pathname === "/", bg: "bg-[#8C7355]", text: "text-white" },       // Layer 1: Warm Brown
    { href: "/#registry", label: t("allSources"), active: false, bg: "bg-[#D4C3A3]", text: "text-[#2A241F]" },    // Layer 2: Butter / Beige
    { href: "/#bakenetwork", label: t("map"), active: false, bg: "bg-[#596B5A]", text: "text-white" },   // Layer 3: Muted Sage
    { href: "/masterlapis/guide", label: t("learn"), active: false, bg: "bg-[#788877]", text: "text-white" },   // Layer 4: Light Sage
    { href: "/lapiswiki", label: t("about"), active: false, bg: "bg-[#E6DEC7]", text: "text-[#2A241F]" },    // Layer 5: Soft Cream
  ]

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300 border-b",
      scrolled
        ? "bg-background/90 backdrop-blur-xl border-border/80 shadow-sm py-0.5"
        : "bg-background/70 backdrop-blur-md border-border/40 py-2"
    )}>
      <div className="mx-auto flex h-[4.2rem] max-w-[88rem] items-center px-5 sm:px-8 lg:px-12">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="group mr-8 flex shrink-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl p-1 -m-1 transition-transform active:scale-95"
          aria-label="KekLapis home"
        >
          <BrandMark />
          <span className="font-display text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
            Kek Lapis
          </span>
        </Link>

        {/* Interactive Desktop Navigation with Individual Kek Lapis Palette Layers */}
        <nav
          className="hidden items-center md:flex relative rounded-full border border-[#8C7355]/40 shadow-md overflow-hidden p-0.5 bg-background/40"
          aria-label="Primary navigation"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {routes.map((route, index) => {
            return (
              <Link
                key={route.href}
                href={route.href}
                onMouseEnter={() => setHoveredIndex(index)}
                aria-current={route.active ? "page" : undefined}
                className={cn(
                  "relative z-10 px-4 py-2 text-xs font-medium transition-all duration-200 first:rounded-l-full last:rounded-r-full text-center flex-1 shadow-xs",
                  route.bg,
                  route.text,
                  route.active ? "ring-2 ring-white font-bold scale-[1.03] z-20 shadow-lg" : "opacity-90 hover:opacity-100 hover:brightness-105"
                )}
              >
                {route.label}
              </Link>
            )
          })}
        </nav>

        {/* Action Controls */}
        <div className="ml-auto flex items-center gap-3">
          <a
            href="/contribute"
            className="hidden items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-muted/50 hover:bg-emerald-500/10 border border-border/60 text-xs font-semibold tracking-wide text-muted-foreground transition-all hover:border-emerald-600/40 hover:text-emerald-600 dark:hover:text-emerald-400 lg:inline-flex active:scale-95 shadow-2xs group"
          >
            {t("contributeCta")}
            <span className="transition-transform group-hover:translate-x-0.5">↗</span>
          </a>
        
          <LanguageSwitcher initialLocale={initialLocale} />

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-border/80 bg-background/50 shadow-sm transition-all hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden active:scale-95"
            aria-label={t("moreOptions")}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            <MenuGlyph open={mobileOpen} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-x-0 top-[4.2rem] bottom-0 z-40 bg-background/80 backdrop-blur-xl md:hidden animate-in fade-in slide-in-from-top-3 duration-300"
          onClick={() => setMobileOpen(false)}
        >
          <nav
            id="mobile-navigation"
            className="border-b border-border/80 bg-background/95 px-6 py-8 shadow-2xl backdrop-blur-2xl rounded-b-3xl"
            aria-label={t("mobileNavigation")}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex max-w-[88rem] flex-col gap-2">
              {routes.map((route, index) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium transition-all duration-200",
                    route.active
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20 shadow-xs"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-xs opacity-40">0{index + 1}</span>
                    <span>{route.label}</span>
                  </span>
                  <span className="text-xs opacity-40">→</span>
                </Link>
              ))}

              <div className="mt-6 pt-4 border-t border-border/40 flex justify-between items-center px-2">
                <a
                  href="https://github.com/mhdhamka/keklapis"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>{t("contributeCta")}</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export function BrandMark({ small = false }: { small?: boolean }) {
  return (
    <span
      className={cn(
        "grid place-items-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-700 dark:text-emerald-400 shadow-sm transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 border border-emerald-500/20",
        small ? "h-7 w-7" : "h-9 w-9"
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className={small ? "h-4 w-4" : "h-5 w-5"} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    </span>
  )
}

function MenuGlyph({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform duration-300" aria-hidden="true">
      <path
        d={open ? "M5 5l10 10M15 5 5 15" : "M3 6h14M3 14h14"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}