import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages, getTranslations } from 'next-intl/server'
import { Toaster } from "@/components/ui/toaster"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { CompareProvider } from "@/components/compare/compare-store"
import { ANALYTICS_CONFIG } from "@/lib/features"
import { locales, type Locale } from '@/i18n/routing'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Kek Lapis Sarawak — The Ultimate Heritage Layer Cake Directory',
    template: '%s — Kek Lapis Sarawak',
  },
  description: 'The definitive registry of traditional and modern Kek Lapis Sarawak flavors. Compare ingredients, sweetness levels, textures, and artisanal bakeries from Kuching and beyond.',
  keywords: ['Kek Lapis Sarawak', 'layer cake Malaysia', 'traditional Sarawak cake', 'Kek Lapis Lumut', 'best Kek Lapis Kuching', 'KekLapis Sarawak'],
  openGraph: {
    title: 'Kek Lapis Sarawak — The Ultimate Heritage Layer Cake Directory',
    description: 'Explore authentic Sarawak layer cakes, traditional recipes, and local bakeries.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#1b4332', // Rich Kek Lapis Lumut (moss green)
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()
  const common = await getTranslations('common')
  const initialLocale = (locales.includes(locale as Locale) ? locale : 'ms') as Locale

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {ANALYTICS_CONFIG.enabled && ANALYTICS_CONFIG.websiteId && (
          <script 
            defer 
            src={ANALYTICS_CONFIG.scriptUrl} 
            data-website-id={ANALYTICS_CONFIG.websiteId}
          />
        )}
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-background text-foreground selection:bg-emerald-500/20 selection:text-emerald-800 dark:selection:text-emerald-300">
        <a href="#main-content" className="skip-link">{common('skipToContent')}</a>
        <NextIntlClientProvider messages={messages}>
          <CompareProvider>
            <MainNav initialLocale={initialLocale} />
            {children}
            <Footer />
            <Toaster />
          </CompareProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}