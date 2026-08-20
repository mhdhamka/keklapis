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

  return (
    <main id="main-content" className="min-h-screen bg-background selection:bg-emerald-900 selection:text-white">
      
      {/* Signature 5-Color Kek Lapis Palette Top Border Accent */}
      <div className="h-1.5 w-full flex" aria-hidden="true">
        <div className="flex-1 bg-[#7A5C3E]" />
        <div className="flex-1 bg-[#B3936A]" />
        <div className="flex-1 bg-[#2E4A35]" />
        <div className="flex-1 bg-[#5B6E53]" />
        <div className="flex-1 bg-[#D4C4A8]" />
      </div>

      {/* Hero Header Section with Editorial Flair */}
      <PageIntro index={`WikiLapis Archive / ${t("title")}`} title={t("title")} description={t("subtitle")}>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link 
            href="/#registry" 
            className="group inline-flex items-center gap-3 rounded-2xl bg-emerald-900 hover:bg-emerald-950 text-white px-6 py-3.5 text-xs font-mono font-bold uppercase tracking-wider shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
          >
            {home("heroCtaBrowse")}
            <span className="grid h-6 w-6 place-items-center rounded-xl bg-white/20 transition-transform group-hover:translate-x-0.5">
              <ArrowIcon />
            </span>
          </Link>
          <Link 
            href="/masterlapis/guide" 
            className="inline-flex items-center gap-2 rounded-2xl border border-emerald-950/10 bg-card hover:bg-muted/50 px-6 py-3.5 text-xs font-mono font-medium text-foreground transition-all duration-300 shadow-xs"
          >
            {t("learnLink")} Guide
          </Link>
        </div>
      </PageIntro>

      <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        
        {/* Section 01: Purpose & Manifesto */}
        <section className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-20 items-start">
          <PanelHeading index="Purpose" title={t("whatWeDoTitle")} description={t("whatWeDoDesc")} />
          <div className="relative rounded-3xl border border-emerald-950/10 bg-card p-8 sm:p-12 shadow-sm">
            <div className="absolute top-0 right-12 -translate-y-1/2 font-mono text-[10px] uppercase tracking-widest bg-emerald-900 text-white px-3 py-1 rounded-full shadow-sm">
              Manifesto
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground font-sans">
              <p className="font-medium text-foreground text-xl leading-snug">{t("whatWeDoContent1")}</p>
              <p>
                {t("whatWeDoContent2")}{" "}
                <Link href="/#registry" className="text-emerald-800 dark:text-emerald-400 font-semibold underline underline-offset-4 decoration-emerald-800/30 hover:decoration-emerald-800">{t("sourcesLink")}</Link>,{" "}
                <Link href="/#bakenetwork" className="text-emerald-800 dark:text-emerald-400 font-semibold underline underline-offset-4 decoration-emerald-800/30 hover:decoration-emerald-800">{t("mapLink")}</Link>,{" "}
                <Link href="/masterlapis/guide" className="text-emerald-800 dark:text-emerald-400 font-semibold underline underline-offset-4 decoration-emerald-800/30 hover:decoration-emerald-800">{t("learnLink")}</Link>{" "}
                {t("whatWeDoContent3")}
              </p>
            </div>
          </div>
        </section>

        {/* Section 02: Specimen Benchmarks Grid */}
        <section className="mt-20 grid gap-6 sm:grid-cols-3 lg:mt-28">
          <DataPoint index="01" label="Sweetness Profile" value="0—10" unit="Scale" />
          <DataPoint index="02" label="Richness Density" value="100%" unit="DRI" />
          <DataPoint index="03" label="Origin Point" value="SARAWAK" unit="MY-13" />
        </section>

        {/* Section 03: Open Source / Code Architecture */}
        <section className="mt-20 grid overflow-hidden rounded-3xl border border-emerald-950/10 bg-card shadow-md lg:grid-cols-[1.2fr_.8fr] lg:mt-28">
          <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
            <div>
              {/* Clean Modern Badge */}
              <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-950/5 border border-emerald-950/10 px-3.5 py-1.5 text-xs font-mono text-emerald-900 dark:text-emerald-300">
                <RegistryGlyph kind="code" />
                <span>Community Archive</span>
                <span className="text-muted-foreground/60">/ v2.6</span>
              </div>

              <h2 className="mt-6 font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground">{t("openSourceTitle")}</h2>
              <p className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground">{t("openSourceContent")}</p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a 
                href="https://github.com/mhdhamka/keklapis" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2.5 rounded-xl bg-foreground text-background hover:bg-emerald-900 hover:text-white px-6 py-3 text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 shadow-sm"
              >
                Explore GitHub Repository
                <ArrowIcon direction="up-right" />
              </a>
              <span className="font-mono text-[11px] text-muted-foreground tracking-wider uppercase">
                MIT License • Contributions Open
              </span>
            </div>
          </div>
          
          <div className="relative editorial-texture flex items-center justify-center p-8 sm:p-12 border-t border-emerald-950/10 bg-muted/30 lg:border-l lg:border-t-0">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/5 via-transparent to-transparent pointer-events-none" />
            <p className="relative max-w-sm font-display text-2xl sm:text-3xl leading-snug tracking-tight text-foreground/90 italic">
              &ldquo;{t("openSourceDesc")}&rdquo;
            </p>
          </div>
        </section>

      </div>
    </main>
  )
}

function DataPoint({ index, label, value, unit }: { index: string; label: string; value: string; unit: string }) {
  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-emerald-950/10 bg-card p-8 shadow-sm transition-all duration-300 hover:border-emerald-900/30 hover:shadow-md">
      <div className="flex items-start justify-between">
        <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase bg-muted/60 px-2.5 py-1 rounded-md border border-border/40">
          Specimen /{index}
        </span>
        <span className="font-mono text-xs text-emerald-800 dark:text-emerald-400 font-bold uppercase tracking-wider">
          {unit}
        </span>
      </div>
      <div className="mt-10">
        <p className="font-display text-4xl sm:text-5xl tracking-tight text-foreground group-hover:text-emerald-900 transition-colors">
          {value}
        </p>
        <p className="mt-2 text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
          {label}
        </p>
      </div>
    </article>
  )
}