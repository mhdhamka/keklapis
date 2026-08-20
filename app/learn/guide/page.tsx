import Link from "next/link"
import ReactMarkdown from "react-markdown"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { ArrowIcon, PageIntro, RegistryGlyph } from "@/components/editorial-primitives"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("learn")
  return { title: t("articleTitle"), description: t("articleDesc"), keywords: ["mineral water Malaysia", "pH level guide", "water quality Malaysia"] }
}

export default async function GuidePage() {
  const t = await getTranslations("learn")
  const home = await getTranslations("home")
  const nav = await getTranslations("nav")

  return (
    <main id="main-content" className="min-h-screen bg-bone">
      <PageIntro index="Field guide / 01" title={t("articleTitle")} description={t("articleDesc")}>
        <Link href="/" className="text-link mt-6"><ArrowIcon direction="left" />{nav("home")}</Link>
      </PageIntro>

      <div className="mx-auto grid max-w-[88rem] gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[13rem_minmax(0,48rem)] lg:justify-center lg:gap-16 lg:px-12 lg:py-28">
        <aside className="hidden lg:block">
          <div className="sticky top-28 border-t border-border pt-5">
            <RegistryGlyph kind="book" />
            <p className="section-index mt-5">{t("readingNote")}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("readingNoteDesc")}</p>
          </div>
        </aside>

        <article className="rounded-xl border border-border bg-card px-6 py-9 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
          <ReactMarkdown components={{
            h3: ({ ...props }) => <h2 className="mb-5 mt-12 border-t border-border pt-9 font-display text-4xl leading-tight tracking-[-0.035em] first:mt-0 first:border-0 first:pt-0" {...props} />,
            h4: ({ ...props }) => <h3 className="mb-3 mt-9 text-lg font-semibold tracking-[-0.015em]" {...props} />,
            p: ({ ...props }) => <p className="mb-5 text-base leading-7 text-muted-foreground" {...props} />,
            ul: ({ ...props }) => <ul className="mb-6 space-y-3 border-l border-border pl-5 text-base leading-7 text-muted-foreground" {...props} />,
            ol: ({ ...props }) => <ol className="mb-6 list-decimal space-y-3 pl-5 text-base leading-7 text-muted-foreground marker:font-mono" {...props} />,
            li: ({ ...props }) => <li className="pl-1" {...props} />,
            strong: ({ ...props }) => <strong className="font-semibold text-foreground" {...props} />,
          }}>{t("articleContent")}</ReactMarkdown>
        </article>
      </div>

      <section className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-[88rem] flex-col gap-6 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <h2 className="font-display text-3xl tracking-[-0.035em]">{home("heroCtaBrowse")}</h2>
          <div className="flex flex-wrap gap-3"><Link href="/#sources" className="quiet-button">{home("heroCtaBrowse")}<ArrowIcon /></Link><Link href="/#map" className="outline-button">{home("heroCtaMap")}</Link></div>
        </div>
      </section>
    </main>
  )
}
