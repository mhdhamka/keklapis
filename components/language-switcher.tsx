'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { LOCALE_COOKIE, locales, type Locale } from '@/i18n/routing'
import { Button } from '@/components/ui/button'

interface LanguageSwitcherProps {
  initialLocale: Locale
}

export function LanguageSwitcher({ initialLocale }: LanguageSwitcherProps) {
  const t = useTranslations('languageSwitcher')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [currentLocale, setCurrentLocale] = useState<Locale>(initialLocale)

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
      className="flex items-center gap-0.5 rounded-md border border-border bg-muted/60 p-0.5"
      role="group"
      aria-label={t('label')}
    >
      {locales.map((locale) => (
        <Button
          key={locale}
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={() => switchLocale(locale)}
          aria-pressed={currentLocale === locale}
          lang={locale}
          className={`h-9 min-w-9 rounded-[3px] px-2 font-mono text-[10px] font-semibold uppercase tracking-wider transition-colors ${
            currentLocale === locale
              ? 'bg-background text-foreground ring-1 ring-border'
              : 'text-muted-foreground hover:bg-background/70 hover:text-foreground'
          }`}
        >
          {t(locale as 'ms' | 'bms' | 'en')}
        </Button>
      ))}
    </div>
  )
}