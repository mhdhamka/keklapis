import Link from "next/link"
import { getTranslations } from "next-intl/server"

export async function Footer() {
  const nav = await getTranslations("nav")
  const home = await getTranslations("home")
  const about = await getTranslations("about")
  const footer = await getTranslations("footer")

  return (
    <footer className="relative border-t border-[#3B4D3C]/30 bg-gradient-to-b from-[#2C382B] via-[#243023] to-[#1B241A] text-[#E2E8E0] dark:from-[#111711] dark:via-[#0D120D] dark:to-[#080B08] dark:text-[#D5E2D8] backdrop-blur-md overflow-hidden shadow-2xl">
      
      {/* Background Lumut Glow Effects */}
      <div className="absolute top-0 left-1/4 h-72 w-72 -translate-y-1/2 rounded-full bg-[#4A6348]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 h-72 w-72 translate-y-1/2 rounded-full bg-[#3B4D3C]/20 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-[88rem] px-5 py-16 sm:px-8 lg:px-12">
        
        {/* Top Grid Section */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          
          {/* Brand & Subtitle Column */}
          <div className="lg:col-span-5 space-y-4 pr-4">
            <Link href="/" className="group inline-flex items-center gap-3.5 transition-transform hover:scale-[1.02]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4A6348]/40 via-[#3B4D3C]/30 to-[#2C382B]/40 text-[#A3B3A1] shadow-sm border border-[#5A735B]/40 group-hover:border-[#789477] transition-all duration-300">
                {/* Sarawak Layered Prism Icon */}
                <svg viewBox="0 0 24 24" className="h-6 w-6 transition-transform duration-300 group-hover:-rotate-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-display text-2xl font-semibold tracking-tight text-white">
                Kek Lapis
              </span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-[#A3B3A1]">
              {home("heroSubtitle")}
            </p>
          </div>

          {/* Navigation Links Layered Cake Widget */}
          <div className="lg:col-span-4 space-y-3">
            <p className="text-[11px] font-mono uppercase tracking-wider text-[#8FA88E] font-semibold px-1">Navigation Layers</p>
            <nav 
              aria-label="Footer navigation"
              className="flex flex-col rounded-2xl border border-[#4A6348]/40 bg-[#1F2A1E] shadow-xl shadow-black/30 overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-[#5A735B]/80"
            >
              {/* Cake Layer 1: Varieties */}
              <Link href="/#sources" className="group px-5 py-3.5 bg-[#253324] border-b border-[#3B4D3C]/60 flex items-center justify-between transition-colors hover:bg-[#2B3B2A]">
                <div className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5A735B] transition-all group-hover:bg-[#789477] group-hover:scale-150" />
                  <span className="text-sm font-medium text-[#C2D1C0] group-hover:text-white transition-colors">{nav("allSources")}</span>
                </div>
                <span className="text-[#5A735B] font-mono text-xs group-hover:text-[#8FA88E] group-hover:translate-x-1 transition-all">→</span>
              </Link>

              {/* Cake Layer 2: Learn */}
              <Link href="/learn/guide" className="group px-5 py-3.5 bg-[#1F2A1E] border-b border-[#3B4D3C]/40 flex items-center justify-between transition-colors hover:bg-[#253324]">
                <div className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5A735B] transition-all group-hover:bg-[#789477] group-hover:scale-150" />
                  <span className="text-sm font-medium text-[#C2D1C0] group-hover:text-white transition-colors">{nav("learn")}</span>
                </div>
                <span className="text-[#5A735B] font-mono text-xs group-hover:text-[#8FA88E] group-hover:translate-x-1 transition-all">→</span>
              </Link>

              {/* Cake Layer 3: About */}
              <Link href="/about" className="group px-5 py-3.5 bg-[#1A2419] flex items-center justify-between transition-colors hover:bg-[#222E21]">
                <div className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5A735B] transition-all group-hover:bg-[#789477] group-hover:scale-150" />
                  <span className="text-sm font-medium text-[#C2D1C0] group-hover:text-white transition-colors">{nav("about")}</span>
                </div>
                <span className="text-[#5A735B] font-mono text-xs group-hover:text-[#8FA88E] group-hover:translate-x-1 transition-all">→</span>
              </Link>
            </nav>
          </div>

          {/* System Live & GitHub Layered Cake Widget */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-[11px] font-mono uppercase tracking-wider text-[#8FA88E] font-semibold px-1 opacity-0 hidden lg:block">System</p>
            <a 
              href="https://github.com/mhdhamka/keklapis" 
              target="_blank" 
              rel="noreferrer"
              className="group flex flex-col rounded-2xl border border-[#4A6348]/40 bg-[#1F2A1E] shadow-xl shadow-black/30 overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-[#789477] hover:scale-[1.02]"
            >
              {/* Cake Layer 1: Live Status Header */}
              <div className="px-5 py-3.5 bg-[#253324] border-b border-[#3B4D3C]/60 flex items-center justify-between transition-colors group-hover:bg-[#2B3B2A]">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#789477] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5A735B]"></span>
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#C2D1C0]">System Live</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#3B4D3C]/50 text-[#8FA88E]">v1.0</span>
              </div>

              {/* Cake Layer 2: Description Middle Slice */}
              <div className="px-5 py-4 bg-[#1F2A1E] border-b border-[#3B4D3C]/40">
                <p className="text-xs text-[#A3B3A1] leading-relaxed">Public registry running on open-source data layers.</p>
              </div>

              {/* Cake Layer 3: GitHub Action Bottom Slice */}
              <div className="px-5 py-3.5 bg-[#1A2419] flex items-center justify-between transition-colors group-hover:bg-[#222E21]">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#789477]" />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#8FA88E] font-medium">{about("openSourceTitle")}</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform">GitHub ↗</span>
              </div>
            </a>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Tagline */}
        <div className="mt-16 flex flex-col gap-4 border-t border-[#3B4D3C]/40 pt-6 text-xs text-[#A3B3A1] sm:flex-row sm:items-center sm:justify-between">
          <p>{footer("copyright", { year: new Date().getFullYear() })}</p>
          
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline text-[#5A735B]">•</span>
            <span className="font-mono text-[11px] tracking-wider text-[#C2D1C0] font-semibold bg-[#3B4D3C]/40 px-3 py-1 rounded-full border border-[#4A6348]/40 shadow-2xs">TRADITION & HERITAGE REGISTRY</span>
          </div>
        </div>

      </div>
    </footer>
  )
}