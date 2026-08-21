import Link from "next/link"
import ReactMarkdown from "react-markdown"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { ArrowIcon, PageIntro, RegistryGlyph } from "@/components/editorial-primitives"
import { GuideActions } from "@/components/guide-actions"
import { ReadingProgressBar } from "@/components/reading-progress-bar"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("learn")
  return { 
    title: t("articleTitle"), 
    description: t("articleDesc"), 
    keywords: ["kek lapis Sarawak", "layered cake Malaysia", "traditional baking techniques", "baking guide"] 
  }
}

// Helper function to turn heading text into matching anchor IDs (e.g., "1. Butter & Fat Standards" -> "butter-fat-standards")
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/^\d+\.\s*/, "") // Removes leading numbers like "1. " if present
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default async function GuidePage() {
  const t = await getTranslations("learn")
  const home = await getTranslations("home")
  const nav = await getTranslations("nav")

  // Calculate dynamic reading time based on string length of article content
  const rawContent = t("articleContent") || ""
  const words = rawContent.trim().split(/\s+/).length
  const readingTimeMinutes = Math.ceil(words / 200) // Average reading speed ~200 wpm

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground selection:bg-emerald-500/20 selection:text-emerald-900 relative">
      
      {/* Client-side reading progress bar */}
      <ReadingProgressBar />

      {/* Decorative Artisan Top Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4A2E15] via-emerald-600 to-[#D9B485] z-50" />

      {/* Page Intro with Reading Time & Category Badge */}
      <PageIntro index={t("masterclassIndex")} title={t("articleTitle")} description={t("articleDesc")}>
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-emerald-600 transition-colors cursor-pointer">
              <ArrowIcon direction="left" /> {nav("home")}
            </Link>
            <span className="text-muted-foreground/40">•</span>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-semibold">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t("readTimeLabel", { minutes: readingTimeMinutes, words })}
            </span>
          </div>

          {/* Right-Aligned Share Button & Client-side actions */}
          <GuideActions />
        </div>
      </PageIntro>

      <div className="mx-auto grid max-w-[88rem] gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[17rem_minmax(0,52rem)] lg:justify-center lg:gap-20 lg:px-12 lg:py-24">
        
        {/* Modern Sticky Sidebar with Quick Navigation & Blueprint */}
        <aside className="hidden lg:block space-y-8">
          <div className="sticky top-28 space-y-6">
            
            {/* Reading Note Header Card */}
            <div className="rounded-2xl border border-border/80 bg-card shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4A2E15] via-emerald-600 to-[#D9B485]" />
              
              <div className="p-6 space-y-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold block">
                  {t("readingNote")}
                </span>
                
                <p className="text-base leading-relaxed text-foreground font-normal">
                  {t("readingNoteDesc")}
                </p>

                {/* Quick Jump Index */}
                <div className="space-y-2 border-t border-border/60 pt-4">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">
                    {t("quickNavTitle")}
                  </span>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    <li>
                      <a href="#why-butter-quality-matters" className="hover:text-emerald-600 transition-colors block py-0.5">
                        {t("quickNavButter")}
                      </a>
                    </li>
                    <li>
                      <a href="#decoding-richness-and-density" className="hover:text-emerald-600 transition-colors block py-0.5">
                        {t("quickNavDensity")}
                      </a>
                    </li>
                    <li>
                      <a href="#top-kek-lapis-bakeries-in-sarawak" className="hover:text-emerald-600 transition-colors block py-0.5">
                        {t("quickNavBakeries")}
                      </a>
                    </li>
                    <li>
                      <a href="#how-to-choose-the-best-kek-lapis-for-you" className="hover:text-emerald-600 transition-colors block py-0.5">
                        {t("quickNavChoose")}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Kek Lapis Structure Breakdown Box styled identically */}
            <div className="rounded-2xl border border-border/80 bg-card shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4A2E15] via-emerald-600 to-[#D9B485]" />
              
              <div className="p-6 space-y-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold block">
                  {t("blueprintTitle")}
                </span>
                <ul className="space-y-2 text-xs text-muted-foreground pt-1">
                  <li className="flex items-center justify-between"><span>{t("blueprintBase")}</span> <strong className="font-mono text-foreground">{t("blueprintBaseVal")}</strong></li>
                  <li className="flex items-center justify-between"><span>{t("blueprintMethod")}</span> <strong className="font-mono text-foreground">{t("blueprintMethodVal")}</strong></li>
                  <li className="flex items-center justify-between"><span>{t("blueprintPrecision")}</span> <strong className="font-mono text-foreground">{t("blueprintPrecisionVal")}</strong></li>
                </ul>
              </div>
            </div>

          </div>
        </aside>

        {/* Main Article Content Card */}
        <article className="rounded-2xl border border-border/80 bg-card p-6 sm:p-10 lg:p-16 shadow-xl relative overflow-hidden space-y-12">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Interactive Visual Banner for Kek Lapis Craft */}
          <div className="rounded-xl border border-border bg-muted/30 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">{t("bannerSubtitle")}</span>
              <h4 className="font-display text-lg text-foreground">{t("bannerTitle")}</h4>
              <p className="text-xs text-muted-foreground">{t("bannerDesc")}</p>
            </div>
            <div className="flex gap-1.5 h-8 items-end self-center sm:self-auto" aria-hidden="true">
              <div className="w-2.5 h-full bg-emerald-700 rounded-sm animate-pulse" />
              <div className="w-2.5 h-5 bg-emerald-500 rounded-sm" />
              <div className="w-2.5 h-7 bg-emerald-600 rounded-sm" />
              <div className="w-2.5 h-4 bg-emerald-400 rounded-sm" />
              <div className="w-2.5 h-6 bg-emerald-800 rounded-sm" />
            </div>
          </div>

          <ReactMarkdown 
            components={{
              h3: ({ children, ...props }) => {
                const headingText = typeof children === "string" ? children : Array.isArray(children) ? children.join("") : ""
                const generatedId = slugify(headingText)

                return (
                  <h3 
                    id={generatedId} 
                    className="mb-6 mt-14 border-t border-border/60 pt-10 font-display text-3xl sm:text-4xl leading-tight tracking-[-0.035em] text-foreground first:mt-0 first:border-0 first:pt-0 scroll-mt-28" 
                    {...props}
                  >
                    {children}
                  </h3>
                )
              },
              h4: ({ children, ...props }) => {
                const headingText = typeof children === "string" ? children : Array.isArray(children) ? children.join("") : ""
                const generatedId = slugify(headingText)

                return (
                  <h4 
                    id={generatedId} 
                    className="mb-3 mt-8 font-display text-xl sm:text-2xl text-foreground font-semibold scroll-mt-28" 
                    {...props}
                  >
                    {children}
                  </h4>
                )
              },
              p: ({ ...props }) => <p className="mb-6 text-base leading-8 text-muted-foreground" {...props} />,
              ul: ({ ...props }) => <ul className="mb-8 space-y-3 border-l-2 border-emerald-500/40 pl-5 text-base leading-7 text-muted-foreground" {...props} />,
              ol: ({ ...props }) => <ol className="mb-8 list-decimal space-y-3 pl-5 text-base leading-7 text-muted-foreground marker:font-mono marker:text-emerald-600" {...props} />,
              li: ({ ...props }) => <li className="pl-1" {...props} />,
              strong: ({ ...props }) => <strong className="font-semibold text-foreground bg-emerald-500/10 px-1.5 py-0.5 rounded text-emerald-900 dark:text-emerald-200" {...props} />,
            }}
          >
            {t("articleContent")}
          </ReactMarkdown>

          {/* Interactive Glossary / FAQ Accordion Section */}
          <div className="border-t border-border/80 pt-10 mt-12 space-y-6">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold block mb-1">
                {t("faqSubtitle")}
              </span>
              <h3 className="font-display text-2xl tracking-tight text-foreground">{t("faqTitle")}</h3>
            </div>

            <div className="space-y-3">
              <details className="group rounded-xl border border-border/80 bg-background/50 p-4 transition-all open:bg-emerald-500/5 open:border-emerald-500/30">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-foreground text-sm sm:text-base">
                  <span>{t("faqQ1")}</span>
                  <span className="ml-6 transition-transform group-open:rotate-180 text-emerald-600">↓</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t("faqA1")}
                </p>
              </details>

              <details className="group rounded-xl border border-border/80 bg-background/50 p-4 transition-all open:bg-emerald-500/5 open:border-emerald-500/30">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-foreground text-sm sm:text-base">
                  <span>{t("faqQ2")}</span>
                  <span className="ml-6 transition-transform group-open:rotate-180 text-emerald-600">↓</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t("faqA2")}
                </p>
              </details>

              <details className="group rounded-xl border border-border/80 bg-background/50 p-4 transition-all open:bg-emerald-500/5 open:border-emerald-500/30">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-foreground text-sm sm:text-base">
                  <span>{t("faqQ3")}</span>
                  <span className="ml-6 transition-transform group-open:rotate-180 text-emerald-600">↓</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t("faqA3")}
                </p>
              </details>
            </div>
          </div>

        </article>
      </div>

      {/* Bottom Navigation Footer Section */}
      <section className="border-t border-border/80 bg-muted/20">
        <div className="mx-auto flex max-w-[88rem] flex-col gap-6 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-semibold">{t("footerSubtitle")}</span>
            <h2 className="mt-2 font-display text-3xl tracking-[-0.035em] text-foreground">{home("heroCtaBrowse")}</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/#registry" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs font-semibold text-white shadow-md transition-all cursor-pointer">
              {home("heroCtaBrowse")} <ArrowIcon />
            </Link>
            <Link href="/#bakenetwork" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-all cursor-pointer">
              {home("heroCtaMap")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}