// ==========================================
// Middleware: Locale cookie handling
// ==========================================
// NOTE: Auth protection is currently disabled — the auth layer
// (`@/lib/auth`) is unimplemented. When auth is added back, restore
// the PROTECTED_ROUTES / AUTH_PAGES redirect logic below.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { defaultLocale, LOCALE_COOKIE, locales } from './i18n/routing';

// Parse the Accept-Language header and pick the best supported locale.
// Falls back to defaultLocale when no match is found.
function negotiateLocale(acceptLanguage: string | null): string {
  if (!acceptLanguage) return defaultLocale;

  // Parse "en-US,en;q=0.9,ms;q=0.8" into sorted [locale, q] pairs.
  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const qParam = params.find((p) => p.trim().startsWith('q='));
      const q = qParam ? parseFloat(qParam.split('=')[1]) : 1;
      // Normalize to the base 2-letter tag (e.g. "en-US" -> "en").
      return { tag: tag.toLowerCase().split('-')[0], q };
    })
    .filter((entry) => entry.tag)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    if (locales.includes(tag as typeof locales[number])) {
      return tag;
    }
  }

  return defaultLocale;
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Respect an explicit user choice (cookie); otherwise infer from
  // the browser's Accept-Language header and persist it.
  if (!request.cookies.has(LOCALE_COOKIE)) {
    const locale = negotiateLocale(request.headers.get('accept-language'));
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
  }

  return response;
}

/**
 * Matcher configuration
 * Specify which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};