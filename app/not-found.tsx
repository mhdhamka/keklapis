import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { ArrowIcon, RegistryGlyph } from "@/components/editorial-primitives"

export default async function NotFound() {
  const t = await getTranslations("notFound")
  return <main id="main-content" className="editorial-texture grid min-h-[70dvh] place-items-center px-5 py-20"><section className="w-full max-w-xl border-y border-border py-12 text-center"><RegistryGlyph kind="map" className="mx-auto" /><p className="section-index mt-6">{t("eyebrow")}</p><h1 className="mt-3 font-display text-5xl tracking-[-0.04em]">{t("title")}</h1><p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">{t("description")}</p><Link href="/" className="quiet-button mt-7"><ArrowIcon direction="left" />{t("backHome")}</Link></section></main>
}
