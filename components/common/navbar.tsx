"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import type { Locale } from "@/i18n/routing"
import { LanguageSwitcher } from "./langswitch"
import { AIChatSheet } from "../ai-chat-sheet"
import { signIn, signOut } from "next-auth/react"

interface MainNavProps {
  initialLocale: Locale
  user?: {
    name?: string | null
    email?: string | null
  } | null
}

export function MainNav({ initialLocale, user }: MainNavProps) {
  const pathname = usePathname()
  const t = useTranslations("nav")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [chatOpen, setChatOpen] = useState(false)
  
  // State for the combined menu dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Track window scroll for shrinking navbar header effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile navigation or dropdown on route change
  useEffect(() => {
    setMobileOpen(false)
    setDropdownOpen(false)
  }, [pathname])

  // Handle outside click & escape key to close dropdown / mobile drawer
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false)
        setDropdownOpen(false)
      }
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => {
      window.removeEventListener("keydown", closeOnEscape)
      document.body.style.overflow = "unset"
    }
  }, [mobileOpen])

  // Localized routes array using translation keys
  const routes = [
    { href: "/#overview", label: t("home"), active: pathname === "/", bg: "bg-[#8C7355]", text: "text-white" },
    { href: "/#registry", label: t("allSources"), active: false, bg: "bg-[#D4C3A3]", text: "text-[#2A241F]" },
    { href: "/#bakenetwork", label: t("map"), active: false, bg: "bg-[#596B5A]", text: "text-white" },
    { href: "/masterlapis/guide", label: t("learn"), active: false, bg: "bg-[#788877]", text: "text-white" },
    { href: "/lapiswiki", label: t("about"), active: false, bg: "bg-[#E6DEC7]", text: "text-[#2A241F]" },
  ]

  return (
    <>
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

          {/* Combined Menu & Controls Dropdown */}
          <div className="ml-auto flex items-center gap-3">
            <div className="relative hidden lg:block" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 hover:bg-emerald-500/10 border border-border/60 text-xs font-semibold tracking-wide text-foreground transition-all hover:border-emerald-600/40 active:scale-95 shadow-2xs group"
                aria-expanded={dropdownOpen}
              >
                <span>{t("menuControls")}</span>
                <svg className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform duration-200", dropdownOpen && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-85 rounded-2xl bg-card/95 backdrop-blur-2xl border border-border/80 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200 space-y-3">
                  
                  {/* Authentication Section Inside Dropdown (Side-by-Side Icons) */}
                  <div className="pb-2 border-b border-border/40">
                    <div className="flex items-center justify-between px-1 pb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                        {t("authentication")}
                      </span>
                      {user && (
                        <span className="text-xs font-medium text-foreground truncate max-w-[120px]">
                          {user.name || user.email}
                        </span>
                      )}
                    </div>

                    {user ? (
                      <button
                        onClick={() => signOut()}
                        className="w-full rounded-xl bg-muted px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted-foreground/20 transition-all text-center border border-border/50"
                      >
                        Sign Out
                      </button>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          title="Sign in with Google"
                          onClick={() => { setDropdownOpen(false); signIn("google"); }}
                          className="flex items-center justify-center p-2.5 rounded-xl bg-muted/40 hover:bg-muted border border-border/60 transition-all hover:scale-[1.02] active:scale-95 shadow-2xs"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.15 21.35 7.22 24 12 24z" />
                            <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.18C.43 8.13 0 9.87 0 12s.43 3.87 1.18 5.4l4.09-3.16z" />
                            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.15 2.65 1.18 6.6l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          title="Sign in with GitHub"
                          onClick={() => { setDropdownOpen(false); signIn("github"); }}
                          className="flex items-center justify-center p-2.5 rounded-xl bg-muted/40 hover:bg-muted border border-border/60 transition-all hover:scale-[1.02] active:scale-95 shadow-2xs"
                        >
                          <svg className="w-5 h-5 fill-current text-foreground" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Contribute Link */}
                  <a
                    href="/contribute"
                    className="flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all group/item border border-border/40"
                  >
                    <span className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      {t("contributeCta")}
                    </span>
                    <span className="transition-transform group-hover/item:translate-x-0.5">↗</span>
                  </a>

                  {/* AI Assistant Trigger */}
                  <button
                    type="button"
                    onClick={() => { setChatOpen(true); setDropdownOpen(false); }}
                    className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15 transition-all group/item border border-emerald-500/20 bg-emerald-500/5"
                  >
                    <span className="flex items-center gap-2.5">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover/item:scale-110" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 11v3a2 2 0 0 0 2 2h1" />
                        <path d="M21 11v3a2 2 0 0 1-2 2h-1" />
                        <path d="M6 10a6 6 0 0 1 12 0v5a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-5z" />
                        <rect x="7" y="6" width="4" height="4" rx="1" />
                        <rect x="13" y="6" width="4" height="4" rx="1" />
                        <path d="M11 8h2" />
                        <line x1="9" y1="12" x2="9" y2="14" />
                        <line x1="15" y1="12" x2="15" y2="14" />
                      </svg>
                      <span>{t("chat.assistant")}</span>
                    </span>
                    <span className="text-[10px] font-mono opacity-65 bg-emerald-500/10 px-1.5 py-0.5 rounded">AI</span>
                  </button>

                  <div className="pt-2 border-t border-border/40">
                    <div className="px-1 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                      {t("selectLanguage")}
                    </div>
                    <div className="w-full flex gap-1.5 *:flex-1">
                      <LanguageSwitcher initialLocale={initialLocale} />
                    </div>
                  </div>
                </div>
              )}
            </div>

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
      </header>

      {/* Slide-over Chat Sheet */}
      <AIChatSheet isOpen={chatOpen} onClose={() => setChatOpen(false)} t={t} />
    </>
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