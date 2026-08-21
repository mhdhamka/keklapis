import Link from "next/link"
import { getTranslations } from "next-intl/server"

export async function Footer() {
  const nav = await getTranslations("nav")
  const home = await getTranslations("home")
  const about = await getTranslations("about")
  const footer = await getTranslations("footer")

  return (
    <footer className="relative border-t border-emerald-800/40 bg-gradient-to-b from-[#0F261C] via-[#0B1E15] to-[#07130E] text-[#E2E8E0] overflow-hidden shadow-2xl">
      
      {/* Exact Multi-Layered Kek Lapis Palette Top Bar (matching image 2) */}
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
        
        {/* Top Grid Section */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          
          {/* Column 1: Brand & Subtitle Layered Widget */}
          <div className="lg:col-span-4 space-y-3">
            <p className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold px-1">
              {footer("archiveOrigin")}
            </p>
            <div className="flex flex-col rounded-2xl border border-emerald-800/40 bg-[#12241C] shadow-xl shadow-black/40 overflow-hidden backdrop-blur-md">
              
              {/* Layer 1: Brand Header */}
              <div className="px-5 py-4 bg-[#182E24] border-b border-emerald-800/30">
                <Link href="/" className="group inline-flex items-center gap-3 transition-transform hover:scale-[1.02]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600/40 via-teal-600/30 to-[#182E24]/40 text-emerald-200 shadow-sm border border-emerald-600/50 group-hover:border-emerald-400 transition-all duration-300">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <span className="font-display text-xl font-semibold tracking-tight text-white">
                    {footer("brandTitle")}
                  </span>
                </Link>
              </div>

              {/* Layer 2: Subtitle Description */}
              <div className="px-5 py-4 bg-[#12241C] border-b border-emerald-800/20">
                <p className="text-xs leading-relaxed text-emerald-100/70">
                  {home("heroSubtitle")}
                </p>
              </div>

              {/* Layer 3: Heritage Badge Footer */}
              <div className="px-5 py-3 bg-[#0D1A14] flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-400">
                  {footer("borneoStandard")}
                </span>
              </div>

            </div>
          </div>

          {/* Column 2: Navigation Links Layered Cake Widget */}
          <div className="lg:col-span-4 space-y-3">
            <p className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold px-1">
              {footer("navigationLayers")}
            </p>
            <nav 
              aria-label="Footer navigation"
              className="flex flex-col rounded-2xl border border-emerald-800/40 bg-[#12241C] shadow-xl shadow-black/40 overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-emerald-600"
            >
              {/* Cake Layer 1: Varieties */}
              <Link href="/#registry" className="group px-5 py-3.5 bg-[#182E24] border-b border-emerald-800/30 flex items-center justify-between transition-colors hover:bg-[#1E372C]">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-emerald-100/90 group-hover:text-white transition-colors">
                    {nav("allSources")}
                  </span>
                </div>
                <span className="text-emerald-500 font-mono text-xs group-hover:text-emerald-300 group-hover:translate-x-1 transition-all">→</span>
              </Link>

              {/* Cake Layer 2: Learn */}
              <Link href="/masterlapis/guide" className="group px-5 py-3.5 bg-[#12241C] border-b border-emerald-800/20 flex items-center justify-between transition-colors hover:bg-[#182E24]">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-emerald-100/90 group-hover:text-white transition-colors">
                    {nav("learn")}
                  </span>
                </div>
                <span className="text-emerald-500 font-mono text-xs group-hover:text-emerald-300 group-hover:translate-x-1 transition-all">→</span>
              </Link>

              {/* Cake Layer 3: About */}
              <Link href="/lapiswiki" className="group px-5 py-3.5 bg-[#0D1A14] flex items-center justify-between transition-colors hover:bg-[#12241C]">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-emerald-100/90 group-hover:text-white transition-colors">
                    {nav("about")}
                  </span>
                </div>
                <span className="text-emerald-500 font-mono text-xs group-hover:text-emerald-300 group-hover:translate-x-1 transition-all">→</span>
              </Link>
            </nav>
          </div>

          {/* Column 3: System Live & GitHub Layered Cake Widget */}
          <div className="lg:col-span-4 space-y-3">
            <p className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold px-1">
              {footer("systemArchitecture")}
            </p>
            <a 
              href="https://github.com/mhdhamka/keklapis" 
              target="_blank" 
              rel="noreferrer"
              className="group flex flex-col rounded-2xl border border-emerald-800/40 bg-[#12241C] shadow-xl shadow-black/40 overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-emerald-600 hover:scale-[1.02]"
            >
              {/* Cake Layer 1: Live Status Header */}
              <div className="px-5 py-3.5 bg-[#182E24] border-b border-emerald-800/30 flex items-center justify-between transition-colors group-hover:bg-[#1E372C]">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-emerald-100">
                    {footer("systemLive")}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0D1A14] text-emerald-400">
                  {footer("version")}
                </span>
              </div>

              {/* Cake Layer 2: Description Middle Slice */}
              <div className="px-5 py-4 bg-[#12241C] border-b border-emerald-800/20">
                <p className="text-xs text-emerald-100/70 leading-relaxed">
                  {footer("registryDescription")}
                </p>
              </div>

              {/* Cake Layer 3: GitHub Action Bottom Slice */}
              <div className="px-5 py-3.5 bg-[#0D1A14] flex items-center justify-between transition-colors group-hover:bg-[#12241C]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-400 font-medium">
                    {about("openSourceTitle")}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-300 font-semibold group-hover:translate-x-0.5 transition-transform">
                  {footer("githubLink")} ↗
                </span>
              </div>
            </a>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Tagline */}
        <div className="mt-16 flex flex-col gap-4 border-t border-emerald-800/30 pt-6 text-xs text-emerald-100/70 sm:flex-row sm:items-center sm:justify-between">
          <p>{footer("copyright", { year: new Date().getFullYear() })}</p>
          
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline text-emerald-700"></span>
            <span className="font-mono text-[11px] tracking-wider text-emerald-300 font-semibold bg-[#12241C] px-3 py-1 rounded-full border border-emerald-800/40 shadow-2xs">
              {footer("traditionBadge")}
            </span>
          </div>
        </div>

      </div>
    </footer>
  )
}