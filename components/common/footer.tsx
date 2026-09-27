import Link from "next/link"
import { getTranslations } from "next-intl/server"

export async function Footer() {
  const nav = await getTranslations("nav")
  const home = await getTranslations("home")
  const about = await getTranslations("about")
  const footer = await getTranslations("footer")

  return (
    <footer className="relative border-t border-emerald-800/40 bg-gradient-to-b from-[#0F261C] via-[#0B1E15] to-[#07130E] text-[#E2E8E0] overflow-hidden shadow-2xl">
      
      {/* Exact Multi-Layered Kek Lapis Palette Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 grid grid-cols-5 z-20">
        <div className="bg-[#8C7355]" /> {/* Warm Brown */}
        <div className="bg-[#D4C3A3]" /> {/* Butter / Beige */}
        <div className="bg-[#596B5A]" /> {/* Muted Sage */}
        <div className="bg-[#788877]" /> {/* Light Sage */}
        <div className="bg-[#E6DEC7]" /> {/* Soft Cream */}
      </div>

      {/* Vibrant Jade & Emerald Ambient Glows */}
      <div className="absolute top-0 left-1/4 h-80 w-80 -translate-y-1/2 rounded-full bg-emerald-500/15 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 h-80 w-80 translate-y-1/2 rounded-full bg-teal-600/15 blur-[130px] pointer-events-none" />

      <div className="relative mx-auto max-w-[88rem] px-5 py-16 sm:px-8 lg:px-12">
        
        {/* Top Clean 3-Column Card Grid */}
        <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
          
          {/* Column 1: Brand & Subtitle Layered Widget */}
          <div className="flex flex-col rounded-3xl border border-emerald-800/40 bg-[#12241C]/80 shadow-xl shadow-black/40 overflow-hidden backdrop-blur-md">
            <div className="px-6 py-4 bg-[#182E24]/90 border-b border-emerald-800/30 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-display text-lg font-semibold tracking-tight text-white">
                {footer("brandTitle")}
              </span>
            </div>
            
            <div className="px-6 py-5 flex-1 bg-[#12241C]/40">
              <p className="text-xs leading-relaxed text-emerald-100/70">
                {home("heroSubtitle")}
              </p>
            </div>

            <div className="px-6 py-3 bg-[#0D1A14]/80 border-t border-emerald-800/30 flex items-center justify-between text-[11px] font-mono text-emerald-400">
              <span>{footer("archiveOrigin")}</span>
              <span className="text-emerald-500/70">{footer("borneoStandard")}</span>
            </div>
          </div>

          {/* Column 2: Navigation Links Layered Cake Widget */}
          <div className="flex flex-col rounded-3xl border border-emerald-800/40 bg-[#12241C]/80 shadow-xl shadow-black/40 overflow-hidden backdrop-blur-md">
            <div className="px-6 py-4 bg-[#182E24]/90 border-b border-emerald-800/30 flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                {footer("navigationLayers")}
              </span>
            </div>

            <nav aria-label="Footer navigation" className="flex flex-col flex-1 divide-y divide-emerald-800/20">
              <Link href="/#registry" className="group px-6 py-3.5 flex items-center justify-between bg-[#12241C]/40 hover:bg-[#182E24]/60 transition-colors">
                <span className="text-xs font-medium text-emerald-100/90 group-hover:text-white">{nav("allSources")}</span>
                <span className="text-emerald-500 font-mono text-xs group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link href="/masterlapis/guide" className="group px-6 py-3.5 flex items-center justify-between bg-[#12241C]/40 hover:bg-[#182E24]/60 transition-colors">
                <span className="text-xs font-medium text-emerald-100/90 group-hover:text-white">{nav("learn")}</span>
                <span className="text-emerald-500 font-mono text-xs group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link href="/lapiswiki" className="group px-6 py-3.5 flex items-center justify-between bg-[#12241C]/40 hover:bg-[#182E24]/60 transition-colors">
                <span className="text-xs font-medium text-emerald-100/90 group-hover:text-white">{nav("about")}</span>
                <span className="text-emerald-500 font-mono text-xs group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </nav>
          </div>

          {/* Column 3: System Live & GitHub Layered Cake Widget */}
          <a 
            href="https://github.com/mhdhamka/keklapis" 
            target="_blank" 
            rel="noreferrer"
            className="group flex flex-col rounded-3xl border border-emerald-800/40 bg-[#12241C]/80 shadow-xl shadow-black/40 overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-emerald-600 hover:scale-[1.01]"
          >
            <div className="px-6 py-4 bg-[#182E24]/90 border-b border-emerald-800/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-mono uppercase tracking-wider font-semibold text-emerald-100">
                  {footer("systemLive")}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0D1A14] text-emerald-400 border border-emerald-800/40">
                {footer("version")}
              </span>
            </div>

            <div className="px-6 py-5 flex-1 bg-[#12241C]/40">
              <p className="text-xs text-emerald-100/70 leading-relaxed">
                {footer("registryDescription")}
              </p>
            </div>

            <div className="px-6 py-3.5 bg-[#0D1A14]/80 border-t border-emerald-800/30 flex items-center justify-between">
              <span className="font-mono text-xs text-emerald-400 font-medium">
                {about("openSourceTitle")}
              </span>
              <span className="text-xs font-mono text-emerald-300 font-semibold group-hover:translate-x-0.5 transition-transform">
                {footer("githubLink")} ↗
              </span>
            </div>
          </a>

        </div>

        {/* Bottom Bar: Copyright & Tradition Badge */}
        <div className="mt-12 flex flex-col gap-4 border-t border-emerald-800/30 pt-6 text-xs text-emerald-100/70 sm:flex-row sm:items-center sm:justify-between">
          <p>{footer("copyright", { year: new Date().getFullYear() })}</p>
          
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-wider text-emerald-300 font-semibold bg-[#12241C] px-4 py-1.5 rounded-full border border-emerald-800/40 shadow-xs">
              {footer("traditionBadge")}
            </span>
          </div>
        </div>

      </div>
    </footer>
  )
}