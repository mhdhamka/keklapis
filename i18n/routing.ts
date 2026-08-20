export const locales = ['ms', 'bms', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'ms'
export const LOCALE_COOKIE = 'CARIAIR_LOCALE'