"use client"

import { useState, useEffect } from "react"
import { useLocale, useTranslations } from "next-intl"

export function ClientDate({ date }: { date: string | null }) {
  const locale = useLocale()
  const t = useTranslations("product")
  const [formatted, setFormatted] = useState<string>("")
  
  useEffect(() => {
    if (date) {
      setFormatted(new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date(date)))
    } else {
      setFormatted("")
    }
  }, [date, locale])
  
  return <span aria-live="polite">{formatted || (date ? "…" : t("unknown"))}</span>
}
