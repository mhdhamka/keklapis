"use client"

import { useState } from "react"
import { TasteProfile, calculateTasteSimilarity } from "@/lib/ai/embeddings"

interface RecommendationItem {
  document: {
    id: string
    name: string
    brand_name: string
    taste_vector?: number[]
    [key: string]: any
  }
  similarityScore: number | string
}

interface TasteRecommendationsClientProps {
  initialRecommendations: RecommendationItem[]
  currentProductId: string
}

const TASTE_PRESETS: { label: string; icon: string; profile: TasteProfile }[] = [
  { label: "Rich & Decadent", icon: "✨", profile: { sweetness: 8, richness: 250, moisture: 8, spice: 5 } },
  { label: "Subtle & Light", icon: "🍃", profile: { sweetness: 3, richness: 80, moisture: 6, spice: 1 } },
  { label: "Spiced & Traditional", icon: "🌶️", profile: { sweetness: 6, richness: 150, moisture: 5, spice: 9 } },
]

export function TasteRecommendationsClient({
  initialRecommendations,
  currentProductId,
}: TasteRecommendationsClientProps) {
  const [activePreset, setActivePreset] = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState(initialRecommendations)

  const handleSelectPreset = (preset: (typeof TASTE_PRESETS)[number]) => {
    if (activePreset === preset.label) {
      // Toggle off / reset to initial
      setActivePreset(null)
      setRecommendations(initialRecommendations)
      return
    }

    setActivePreset(preset.label)

    // Normalize preset profile into a target 4D vector matching embeddings logic
    const targetVector = [
      Math.min(Math.max(preset.profile.sweetness / 10, 0), 1),
      Math.min(Math.max(preset.profile.richness / 300, 0), 1),
      Math.min(Math.max(preset.profile.moisture / 10, 0), 1),
      Math.min(Math.max(preset.profile.spice / 10, 0), 1),
    ]

    // Re-calculate similarity score dynamically based on the preset vector
    const updated = initialRecommendations.map((item) => {
      const docVector = item.document.taste_vector
      const newScore = docVector ? calculateTasteSimilarity(targetVector, docVector) : Number(item.similarityScore)
      return {
        ...item,
        similarityScore: newScore,
      }
    }).sort((a, b) => Number(b.similarityScore) - Number(a.similarityScore))

    setRecommendations(updated)
  }

  return (
    <div className="space-y-6 pt-6 border-t border-zinc-200/80">
      {/* Interactive Quick Taste Presets Bar */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="font-mono text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Simulate Taste Profile Match
          </h4>
          {activePreset && (
            <button 
              type="button"
              onClick={() => { setActivePreset(null); setRecommendations(initialRecommendations); }}
              className="text-[11px] font-medium text-emerald-700 hover:underline cursor-pointer"
            >
              Reset view
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {TASTE_PRESETS.map((preset) => {
            const isSelected = activePreset === preset.label
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all duration-300 backdrop-blur-md cursor-pointer active:scale-95 ${
                  isSelected 
                    ? "border-emerald-600 bg-emerald-700 text-white shadow-md shadow-emerald-700/20 scale-105" 
                    : "border-zinc-200/80 bg-white/80 text-zinc-700 hover:border-emerald-600/60 hover:text-emerald-900 hover:bg-emerald-50/50 shadow-2xs"
                }`}
              >
                <span>{preset.icon}</span>
                <span>{preset.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Dynamic Recommendations Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-zinc-900">
            {activePreset ? `Tailored for "${activePreset}"` : "If you like this, try these:"}
          </h3>
          <span className="font-mono text-[10px] text-zinc-400">AI Vector Ranked</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recommendations.map(({ document, similarityScore }) => {
            const scorePercent = (Number(similarityScore) * 100).toFixed(0)
            return (
              <div 
                key={document.id} 
                className="group relative p-3.5 rounded-2xl border border-zinc-200/80 bg-white/70 backdrop-blur-xl shadow-xs transition-all duration-300 hover:border-emerald-500/50 hover:bg-white hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-medium text-sm text-zinc-900 group-hover:text-emerald-800 transition-colors">
                      {document.name}
                    </h4>
                    <p className="text-xs text-zinc-500">{document.brand_name}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-200/80 shadow-2xs">
                    {scorePercent}% match
                  </span>
                </div>

                {/* Micro Match Progress Bar */}
                <div className="mt-3 w-full bg-zinc-100 rounded-full h-1 overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(Math.max(Number(scorePercent), 5), 100)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}