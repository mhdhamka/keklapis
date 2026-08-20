"use client"

import { useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { LOCALE_COOKIE, type Locale } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LanguageSwitcherProps {
  initialLocale: Locale
}

// Map each locale to its specific Kek Lapis layer background and text color
const localeStyles: Record<string, { bg: string; text: string }> = {
  ms: { bg: "bg-[#8C7355]", text: "text-white" },       // Layer 1: Warm Brown
  bms: { bg: "bg-[#D4C3A3]", text: "text-[#2A241F]" },   // Layer 2: Butter / Beige
  en: { bg: "bg-[#596B5A]", text: "text-white" },       // Layer 3: Muted Sage
}

export function LanguageSwitcher({ initialLocale }: LanguageSwitcherProps) {
  const t = useTranslations("languageSwitcher")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [currentLocale, setCurrentLocale] = useState<Locale>(initialLocale)

  // Explicit array matching the order of your defined layers
  const locales = ["ms", "bms", "en"] as const

  const switchLocale = (locale: Locale) => {
    if (locale === currentLocale) return
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; SameSite=Lax`
    setCurrentLocale(locale)
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <div
      className="flex items-center rounded-full border border-[#8C7355]/40 shadow-md overflow-hidden p-0.5 bg-background/40"
      role="group"
      aria-label={t("label")}
    >
      {locales.map((locale) => {
        const isActive = currentLocale === locale
        const style = localeStyles[locale] || { bg: "bg-[#788877]", text: "text-white" }

        return (
          <Button
            key={locale}
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={() => switchLocale(locale as Locale)}
            aria-pressed={isActive}
            lang={locale}
            className={cn(
              "relative z-10 h-8 px-4 font-mono text-[10px] font-semibold uppercase tracking-wider transition-all duration-200 first:rounded-l-full last:rounded-r-full text-center flex-1 shadow-xs cursor-pointer border-0 hover:opacity-100",
              style.bg,
              style.text,
              isActive
                ? "ring-2 ring-white font-bold scale-[1.03] z-20 shadow-lg"
                : "opacity-90 hover:brightness-105 hover:bg-transparent"
            )}
          >
            {t(locale as "ms" | "bms" | "en")}
          </Button>
        )
      })}
    </div>
  )
}