"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { ArrowIcon, RegistryGlyph } from "./editorial-primitives"

export function EditorialErrorState({ title, description, reset, backHref = "/", backLabel }: { title: string; description: string; reset?: () => void; backHref?: string; backLabel?: string }) {
  const t = useTranslations("errors")
  return (
    <main id="main-content" className="editorial-texture grid min-h-[70dvh] place-items-center px-5 py-20">
      <section className="w-full max-w-xl border-y border-border py-12 text-center">
        <RegistryGlyph kind="error" className="mx-auto bg-destructive/10 text-destructive" />
        <p className="section-index mt-6">{t("systemResponse")}</p>
        <h1 className="mt-3 font-display text-4xl tracking-[-0.04em] sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {reset && <button type="button" onClick={reset} className="quiet-button">{t("tryAgain")}</button>}
          <Link href={backHref} className="outline-button"><ArrowIcon direction="left" />{backLabel ?? t("backHome")}</Link>
        </div>
      </section>
    </main>
  )
}
