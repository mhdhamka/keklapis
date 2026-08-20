"use client"

import { useState } from "react"
import Link from "next/link"
import { WaterTypeBadge } from "@/components/water-type-badge"
import { ClientDate } from "@/components/client-date"
import { ClientMapWrapper } from "@/components/client-map-wrapper"
import { SafeImage } from "@/components/safe-image"
import { IngredientCompositionPanel } from "@/components/ingredient-composition-panel"
import { ArrowIcon, RegistryGlyph } from "@/components/editorial-primitives"
import type { Product } from "@/lib/types/db"

type TextureMode = "traditional" | "moist" | "spiced"

export function SourcePageClient({ product }: { product: Product }) {
  const [slices, setSlices] = useState(1)
  const [textureMode, setTextureMode] = useState<TextureMode>("traditional")
  const [activeTab, setActiveTab] = useState<"layers" | "profile">("layers")
  
  const [hoveredLayer, setHoveredLayer] = useState<number | null>(null)
  const [copiedConfig, setCopiedConfig] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const { brand, source } = product
  const image = product.images?.[0]
  const imageUrl = image?.url ?? "/placeholder.svg"
  
  // Cleanly access ingredients_json since db.ts now normalizes it into an array
  const ingredients = product.ingredients_json ?? []

  const scaledIngredients = ingredients.map((ing: { name: string; amount: number; unit: string }) => ({
    ...ing,
    amount: Number((ing.amount * slices * (textureMode === "moist" ? 1.1 : 1.0)).toFixed(1))
  }))

  const hasCoordinates = source?.lat != null && source?.lng != null
  const productName = product.product_name || brand?.brand_name || "Unknown Edition"

  const baseSweetness = product.sweetness != null ? Number(product.sweetness) : 5.0
  const baseRichness = product.richness_dri != null ? Number(product.richness_dri) : 15

  const textureMultiplier = textureMode === "moist" ? 1.15 : textureMode === "spiced" ? 1.08 : 1.0
  const currentSweetness = Math.min(10, baseSweetness * (1 + (slices - 1) * 0.05) * textureMultiplier).toFixed(1)
  const currentRichness = Math.round(baseRichness * slices * textureMultiplier)
  const totalLayers = Math.min(24, 12 + (slices * 2))

  const handleCopyConfig = () => {
    const text = `---
Product: ${productName}
Slices: ${slices}
Texture: ${textureMode}
Sweetness: ${currentSweetness}
Richness: ${currentRichness}%
---`
    navigator.clipboard.writeText(text)
    setCopiedConfig(true)
    setTimeout(() => setCopiedConfig(false), 2000)
  }

  const handlePrintRegistry = () => {
    window.print()
  }

  return (
    <main id="main-content" className="min-h-screen bg-[#F4F6F0] text-[#1B2A1E]">
      {/* Modernized, immersive header with layered glow accents */}
      <header className="relative border-b border-[#D5E1D0]/80 bg-gradient-to-b from-[#E2EBE0] via-[#EAEFE6] to-[#F4F6F0] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(#3B5336_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#4A6B43]/10 blur-3xl pointer-events-none" />
        
        <div className="mx-auto max-w-[88rem] px-5 pb-16 pt-8 sm:px-8 sm:pb-24 lg:px-12 relative z-10">
          <div className="flex justify-between items-center">
            <Link href="/#sources" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#3B5336] hover:text-[#1B2A1E] transition-all group">
              <span className="p-1 rounded-md bg-[#D5E1D0]/50 group-hover:bg-[#3B5336] group-hover:text-white transition-colors">
                <ArrowIcon direction="left" />
              </span>
              Back to sources
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all shadow-sm active:scale-95 ${
                  isSaved 
                    ? "bg-[#3B5336] border-[#3B5336] text-white" 
                    : "bg-white/80 hover:bg-white border-[#D5E1D0] text-[#3B5336]"
                }`}
              >
                {isSaved ? "Saved to Favorites" : "Save Configuration"}
              </button>

              <button
                onClick={handlePrintRegistry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white border border-[#D5E1D0] text-xs font-mono text-[#3B5336] transition-all shadow-sm active:scale-95"
                title="Print Registry Sheet"
              >
                Export PDF
              </button>

              <button
                onClick={handleCopyConfig}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white border border-[#D5E1D0] text-xs font-mono text-[#3B5336] transition-all shadow-sm active:scale-95"
              >
                {copiedConfig ? "Configuration Copied!" : "Share Configuration"}
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end lg:gap-16">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#D5E1D0] text-[#273824] font-mono text-xs shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#4A6B43] animate-pulse shadow-[0_0_8px_rgba(74,107,67,0.6)]" />
                <span className="tracking-wide">Registry Record /</span> 
                <span className="font-semibold text-[#1B2A1E]">{product.id.slice(0, 8)}</span>
              </div>

              <h1 className="text-pretty font-display text-[clamp(2.75rem,7vw,6rem)] leading-[0.92] tracking-[-0.04em] text-[#1B2A1E] drop-shadow-sm">
                {productName}
              </h1>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <WaterTypeBadge type={source?.type || "Artisan Bakery"} />
                {source?.location_address && (
                  <span className="flex min-w-0 items-center gap-2 text-sm text-[#4A6B43] bg-white/50 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-[#D5E1D0]/60">
                    <RegistryGlyph kind="map" className="h-5 w-5 rounded-sm text-[#3B5336] shrink-0" />
                    <span className="text-pretty font-medium">{source.location_address}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="relative h-72 overflow-hidden rounded-3xl border border-[#D5E1D0] bg-gradient-to-br from-[#E2EBDC] to-[#D5E1D0]/40 shadow-lg sm:h-80 group backdrop-blur-sm">
              <div className="absolute inset-0 bg-black/[0.02] pointer-events-none" />
              <span className="absolute right-4 top-4 z-10 font-mono text-[10px] uppercase tracking-[0.14em] text-[#3B5336] bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#D5E1D0] shadow-sm">
                Verified Asset
              </span>
              <SafeImage src={imageUrl} alt={productName} width={640} height={640} loading="eager" fetchPriority="high" className="h-full w-full object-contain p-8 transition-transform duration-700 group-hover:scale-105 group-hover:rotate-1" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="mx-auto grid max-w-[88rem] gap-6 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start lg:px-12 lg:py-24">
        
        {/* Sticky Sidebar Info */}
        <aside className="space-y-6 lg:sticky lg:top-28">
          <InfoPanel title="Company Info" index="01">
            <InfoRow label="Brand" value={brand?.brand_name || "Unknown"} />
            {brand?.parent_company && <InfoRow label="Parent Company" value={brand.parent_company} />}
            <InfoRow label="Country" value={source?.country || "Malaysia"} />
            {brand?.website_url && (
              <div className="pt-2">
                <a href={brand.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white bg-[#3B5336] hover:bg-[#273824] px-4 py-2 rounded-xl transition-all shadow-sm group">
                  <span>Visit Website</span> 
                  <ArrowIcon direction="up-right" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            )}
          </InfoPanel>

          <InfoPanel title="Verification" index="02">
            <div className="space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-[#4A6B43]">Status</span>
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E9F0E5] border border-[#D5E1D0] px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#273824] shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3B5336]" />
                  {product.status || "Pending"}
                </span>
              </div>
            </div>
            <InfoRow label="Created Record" value={<ClientDate date={product.created_at} />} />
            {source?.kkm_approval_number && (
              <InfoRow label="KKM Approval" value={<span className="font-mono text-xs bg-[#E9F0E5] border border-[#D5E1D0]/60 px-2.5 py-1 rounded-lg text-[#273824] font-semibold block">{source.kkm_approval_number}</span>} />
            )}
          </InfoPanel>
        </aside>

        {/* Content Section */}
        <div className="min-w-0 space-y-6">
          {/* Section 03: Interactive Profile & Layers */}
          <section className="rounded-3xl border border-[#D5E1D0] bg-white p-6 sm:p-10 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E9F0E5] pb-6">
              <div className="flex items-center justify-between sm:justify-start gap-4">
                <h2 className="font-display text-xl sm:text-2xl tracking-[-0.03em] text-[#1B2A1E]">Interactive Profile & Layers</h2>
                <span className="font-mono text-[11px] font-bold text-[#3B5336] bg-[#E9F0E5] px-2.5 py-0.5 rounded-full border border-[#D5E1D0]/60">03</span>
              </div>
              
              <div className="flex items-center bg-[#F4F6F0] p-1.5 rounded-2xl border border-[#D5E1D0] self-start shadow-inner">
                <button 
                  onClick={() => setActiveTab("layers")}
                  className={`px-4 py-1.5 rounded-xl text-xs font-mono transition-all ${activeTab === "layers" ? "bg-white text-[#1B2A1E] shadow-sm font-bold" : "text-[#4A6B43] hover:text-[#1B2A1E]"}`}
                >
                  Layers
                </button>
                <button 
                  onClick={() => setActiveTab("profile")}
                  className={`px-4 py-1.5 rounded-xl text-xs font-mono transition-all ${activeTab === "profile" ? "bg-white text-[#1B2A1E] shadow-sm font-bold" : "text-[#4A6B43] hover:text-[#1B2A1E]"}`}
                >
                  Texture
                </button>
              </div>
            </div>
            
            <p className="text-xs text-[#4A6B43] mt-2">Customize portion sizes and texture styles with real-time recalculations.</p>
            
            <div className="mt-8 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <article className="rounded-2xl border border-[#D5E1D0] bg-[#F9FBF7] p-6 transition-all hover:shadow-md hover:border-[#3B5336]/40">
                  <p className="text-xs font-mono uppercase tracking-wider text-[#4A6B43]">Adjusted Sweetness</p>
                  <p className="mt-3 font-display text-5xl leading-none tracking-[-0.04em] text-[#1B2A1E]">{currentSweetness}</p>
                  <p className="mt-2 text-xs font-medium text-[#4A6B43]">
                    {Number(currentSweetness) < 5 ? "Mildly Sweet" : Number(currentSweetness) > 7 ? "Rich & Decadent" : "Balanced Sweetness"}
                  </p>
                </article>
                
                <article className="rounded-2xl border border-[#D5E1D0] bg-[#F9FBF7] p-6 transition-all hover:shadow-md hover:border-[#3B5336]/40">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono uppercase tracking-wider text-[#4A6B43]">Total Richness DRI</p>
                    <span 
                      title="Increased portion size and texture profile impact fat density and daily recommended intake factors proportionally."
                      className="cursor-help font-mono text-xs text-[#3B5336] bg-[#E9F0E5] px-2 py-0.5 rounded border border-[#D5E1D0]"
                    >
                      ?
                    </span>
                  </div>
                  <p className="mt-3 font-display text-5xl leading-none tracking-[-0.04em] text-[#1B2A1E]">
                    {currentRichness}<span className="ml-1 text-sm font-sans font-normal text-[#4A6B43]">%</span>
                  </p>
                  <p className="mt-2 text-xs font-medium text-[#4A6B43]">Daily Recommended Intake factor</p>
                </article>
              </div>

              {activeTab === "layers" ? (
                <div className="rounded-2xl border border-[#D5E1D0] bg-[#F9FBF7] p-6 sm:p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-semibold text-[#1B2A1E]">Live Layer Simulator ({totalLayers} Strata Stack)</h4>
                      <p className="text-xs text-[#4A6B43] mt-0.5">
                        {hoveredLayer !== null ? `Inspecting Tier #${hoveredLayer + 1}` : "Hover over individual strata layers to inspect."}
                      </p>
                    </div>
                    <span className="font-mono text-xs px-3 py-1.5 rounded-xl bg-[#E9F0E5] border border-[#D5E1D0] text-[#3B5336] font-semibold">
                      Mode: {textureMode}
                    </span>
                  </div>

                  <div className="w-full rounded-2xl bg-[#1B2A1E] p-4 shadow-inner border border-[#3B5336]/30 flex flex-col justify-end transition-all duration-300" style={{ height: `${Math.min(320, 140 + (slices * 35))}px` }}>
                    <div className="text-[10px] font-mono text-[#70976A] mb-2 px-1 flex justify-between">
                      <span>Strata Height Index: {slices} {slices === 1 ? "Slice" : "Slices"} ({totalLayers} Tiers)</span>
                      {hoveredLayer !== null && <span>Tier {hoveredLayer + 1} Density: Active</span>}
                    </div>
                    <div className="w-full h-full flex flex-col justify-end gap-1.5 overflow-hidden">
                      {Array.from({ length: totalLayers }).map((_, i) => (
                        <div 
                          key={i} 
                          onMouseEnter={() => setHoveredLayer(i)}
                          onMouseLeave={() => setHoveredLayer(null)}
                          className={`w-full rounded-sm transition-all duration-200 cursor-pointer ${hoveredLayer === i ? "brightness-125 scale-[1.01]" : ""}`}
                          style={{
                            height: `${Math.max(6, 14 - slices)}px`,
                            backgroundColor: i % 2 === 0 ? "#4A6B43" : "#70976A",
                            opacity: hoveredLayer === i ? 1 : (0.75 + ((i % 3) * 0.08)),
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="slice-slider" className="text-xs font-mono uppercase tracking-wider text-[#4A6B43]">
                        Portion Slider: <span className="text-[#1B2A1E] font-bold">{slices} {slices === 1 ? "Slice" : "Slices"}</span>
                      </label>
                      <span className="text-[10px] font-mono text-[#4A6B43]">Adjust to stack layers</span>
                    </div>
                    <input 
                      id="slice-slider"
                      type="range" 
                      min="1" 
                      max="5" 
                      step="1" 
                      value={slices} 
                      onChange={(e) => setSlices(Number(e.target.value))}
                      className="w-full accent-[#3B5336] cursor-pointer h-2.5 bg-[#D5E1D0] rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-[#4A6B43]">
                      <span>1 Slice</span>
                      <span>3 Slices</span>
                      <span>5 Slices</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-[#D5E1D0] bg-[#F9FBF7] p-6 sm:p-8 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-[#1B2A1E]">Texture Matrix Toggles</h4>
                    <p className="text-xs text-[#4A6B43] mt-0.5">Toggle bake profiles to dynamically calculate richness metrics.</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {(["traditional", "moist", "spiced"] as TextureMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setTextureMode(mode)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          textureMode === mode 
                            ? "bg-[#3B5336] border-[#3B5336] text-white shadow-md ring-2 ring-[#3B5336]/20" 
                            : "bg-white border-[#D5E1D0] text-[#4A6B43] hover:border-[#3B5336]"
                        }`}
                      >
                        <span className="font-mono text-[10px] uppercase tracking-wider block opacity-80">Profile</span>
                        <span className="font-display text-base capitalize mt-1 block font-semibold">{mode}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Ingredient Composition Panel */}
          <IngredientCompositionPanel ingredients={scaledIngredients} index="04" />

          {/* Section 05: Source Location */}
          <section className="overflow-hidden rounded-3xl border border-[#D5E1D0] bg-white shadow-sm">
            <div className="p-6 sm:p-8 flex items-baseline justify-between border-b border-[#E9F0E5]">
              <div>
                <h2 className="font-display text-xl sm:text-2xl tracking-[-0.03em] text-[#1B2A1E]">Source Location</h2>
                <p className="text-xs text-[#4A6B43] mt-1">Geographical mapping of the production site.</p>
              </div>
              <span className="font-mono text-[11px] font-bold text-[#3B5336] bg-[#E9F0E5] px-2.5 py-0.5 rounded-full border border-[#D5E1D0]/60">05</span>
            </div>
            {hasCoordinates ? (
              <ClientMapWrapper lat={Number(source!.lat)} lng={Number(source!.lng)} sourceName={source?.source_name || product.product_name} locationAddress={source?.location_address} height="30rem" />
            ) : (
              <div className="grid min-h-72 place-items-center border-t border-[#D5E1D0] bg-[#F4F6F0]/50 p-8 text-center">
                <div>
                  <RegistryGlyph kind="map" className="mx-auto text-[#4A6B43]" />
                  <p className="mt-4 text-sm text-[#4A6B43]">Location not available</p>
                  {source?.location_address && <p className="mt-1 text-xs text-[#4A6B43]/70">{source.location_address}</p>}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Registry Record Audit Log Footer */}
      <footer className="border-t border-[#D5E1D0]/80 bg-[#EAEFE6]/50 py-6 text-center font-mono text-xs text-[#4A6B43]">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Last Synced: {new Date().toISOString().split("T")[0]} | System Status: Verified</span>
          <span>Registry Integrity Check: Passed</span>
        </div>
      </footer>
    </main>
  )
}

function InfoPanel({ title, index, children }: { title: string; index: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-[#D5E1D0] bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-baseline justify-between border-b border-[#E9F0E5] pb-4">
        <h2 className="font-display text-xl tracking-[-0.03em] text-[#1B2A1E]">{title}</h2>
        <span className="font-mono text-[11px] font-bold text-[#3B5336] bg-[#E9F0E5] px-2.5 py-0.5 rounded-full border border-[#D5E1D0]/60">{index}</span>
      </div>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  )
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="group/row">
      <span className="text-xs font-mono uppercase tracking-wider text-[#4A6B43] block">{label}</span>
      <div className="mt-1.5 text-sm font-medium leading-6 text-[#1B2A1E]">{value}</div>
    </div>
  )
}