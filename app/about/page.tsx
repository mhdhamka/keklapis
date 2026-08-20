import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { ArrowIcon, PageIntro, PanelHeading, RegistryGlyph } from "@/components/editorial-primitives"

export async function generateMetadata() {
  const t = await getTranslations("about")
  return { title: t("title"), description: t("subtitle") }
}

export default async function AboutPage() {
  const t = await getTranslations("about")
  const home = await getTranslations("home")
  const product = await getTranslations("product")

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <PageIntro index={`Kek Lapis / ${t("title")}`} title={t("title")} description={t("subtitle")}>
        <Link href="/#sources" className="text-link mt-6">{home("heroCtaBrowse")}<ArrowIcon /></Link>
      </PageIntro>

      <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <section className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
          <PanelHeading index="01 / Purpose" title={t("whatWeDoTitle")} description={t("whatWeDoDesc")} />
          <div className="border-t border-border pt-7 text-lg leading-8 text-muted-foreground lg:mt-1">
            <p>{t("whatWeDoContent1")}</p>
            <p className="mt-5">{t("whatWeDoContent2")} <Link href="/#sources" className="text-link">{t("sourcesLink")}</Link>, <Link href="/#map" className="text-link">{t("mapLink")}</Link>, <Link href="/learn/guide" className="text-link">{t("learnLink")}</Link> {t("whatWeDoContent3")}</p>
          </div>
        </section>

        <section className="mt-20 grid gap-4 border-t border-border pt-10 sm:grid-cols-3 lg:mt-28">
          <DataPoint index="01" label={product("phLevel")} value="0—14" />
          <DataPoint index="02" label={product("tds")} value="mg/L" />
          <DataPoint index="03" label={product("sourceLocation")} value="MY" />
        </section>

        <section className="mt-20 grid overflow-hidden rounded-xl border border-border bg-card lg:grid-cols-[1.15fr_.85fr] lg:mt-28">
          <div className="p-7 sm:p-10 lg:p-14">
            <RegistryGlyph kind="code" />
            <h2 className="mt-8 font-display text-4xl tracking-[-0.04em] sm:text-5xl">{t("openSourceTitle")}</h2>
            <p className="mt-4 max-w-xl leading-7 text-muted-foreground">{t("openSourceContent")}</p>
            <a href="https://github.com/mhdhamka/keklapis" target="_blank" rel="noopener noreferrer" className="quiet-button mt-7">GitHub<ArrowIcon direction="up-right" /></a>
          </div>
          <div className="editorial-texture flex min-h-64 items-end border-t border-border p-7 lg:border-l lg:border-t-0 lg:p-10">
            <p className="max-w-sm font-display text-3xl leading-tight tracking-[-0.03em]">{t("openSourceDesc")}</p>
          </div>
        </section>
      </div>
    </main>
  )
}

function DataPoint({ index, label, value }: { index: string; label: string; value: string }) {
  return <article className="flex items-end justify-between border-b border-border py-6 last:border-b-0 sm:border-b-0 sm:border-r sm:px-7 sm:first:pl-0 sm:last:border-r-0"><div><p className="font-display text-4xl tracking-[-0.04em]">{value}</p><p className="mt-1 text-sm text-muted-foreground">{label}</p></div><span className="font-mono text-[10px] text-muted-foreground">{index}</span></article>
}
