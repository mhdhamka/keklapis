import { getTranslations } from "next-intl/server"

export default async function Loading() {
  const t = await getTranslations("common")
  return <main id="main-content" className="min-h-screen bg-bone" aria-busy="true"><p className="sr-only" role="status">{t("loadingPage")}</p><div className="editorial-texture border-b border-border"><div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-8 lg:px-12"><div className="h-3 w-28 animate-pulse bg-muted" /><div className="mt-7 h-20 max-w-3xl animate-pulse rounded-md bg-muted" /></div></div><div className="mx-auto grid max-w-[88rem] gap-4 px-5 py-16 sm:grid-cols-2 sm:px-8 lg:px-12"><div className="h-64 animate-pulse rounded-xl border border-border bg-card" /><div className="h-80 animate-pulse rounded-xl border border-border bg-card" /></div></main>
}
