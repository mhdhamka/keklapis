"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { tasteProfileToVector } from "@/lib/ai/embeddings"
import { TasteRecommendationsClient as TasteRecommendations } from "@/components/taste-recommendations"

interface SavedFilterPreset {
  id: string
  name: string
  query: string
  types: string[]
  selectedBrands: string[]
  sweetnessRange: [number, number]
  richnessRange: [number, number]
  isAiMatching: boolean
  moisture: number
  spice: number
}

interface HomeFiltersProps {
  brands: { id: string; brand_name: string }[]
  currentQuery: string
  currentTypes: string[]
  currentBrands: string[]
  currentMinSweetness?: number
  currentMaxSweetness?: number
  currentMinRichness?: number
  currentMaxRichness?: number
  currentSort: string
  resultCount: number
}

const CAKE_TYPES = [
  { value: "Traditional Baked", label: "styleTraditional" },
  { value: "Steamed", label: "styleSteamed" },
  { value: "Commercial", label: "styleCommercial" },
  { value: "Fruit-Embedded", label: "styleFruity" },
  { value: "Pure Butter", label: "styleButter" },
  { value: "Novelty Fusion", label: "styleFusion" },
] as const

export function HomeFilters({
  brands,
  currentQuery,
  currentTypes,
  currentBrands,
  currentMinSweetness,
  currentMaxSweetness,
  currentMinRichness,
  currentMaxRichness,
  currentSort,
  resultCount,
}: HomeFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const tf = useTranslations("filters")
  const ts = useTranslations("sort")
  const tv = useTranslations("sourcesView")
  const th = useTranslations("home")

  const [query, setQuery] = useState(currentQuery)
  const [isOpen, setIsOpen] = useState(false)
  const [types, setTypes] = useState<string[]>(currentTypes)
  const [selectedBrands, setSelectedBrands] = useState<string[]>(currentBrands)
  const [sweetnessRange, setSweetnessRange] = useState<[number, number]>([currentMinSweetness ?? 0, currentMaxSweetness ?? 10])
  const [richnessRange, setRichnessRange] = useState<[number, number]>([currentMinRichness ?? 0, currentMaxRichness ?? 300])
  
  // AI Vector / Taste Match integration state
  const [moisture, setMoisture] = useState<number>(5)
  const [spice, setSpice] = useState<number>(2)
  const [isAiMatching, setIsAiMatching] = useState(false)

  // Saved Search Collections State
  const [savedPresets, setSavedPresets] = useState<SavedFilterPreset[]>([])
  const [presetNameInput, setPresetNameInput] = useState("")
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  useEffect(() => {
    const loaded = localStorage.getItem("kek_lapis_saved_presets")
    if (loaded) {
      try { setSavedPresets(JSON.parse(loaded)) } catch (e) { console.error(e) }
    }
  }, [])

  const saveCurrentPreset = () => {
    if (!presetNameInput.trim()) return
    const newPreset: SavedFilterPreset = {
      id: Date.now().toString(),
      name: presetNameInput.trim(),
      query,
      types,
      selectedBrands,
      sweetnessRange,
      richnessRange,
      isAiMatching,
      moisture,
      spice,
    }
    const updated = [newPreset, ...savedPresets]
    setSavedPresets(updated)
    localStorage.setItem("kek_lapis_saved_presets", JSON.stringify(updated))
    setPresetNameInput("")
    setShowSaveDialog(false)
  }

  const loadPreset = (preset: SavedFilterPreset) => {
    setQuery(preset.query)
    setTypes(preset.types)
    setSelectedBrands(preset.selectedBrands)
    setSweetnessRange(preset.sweetnessRange)
    setRichnessRange(preset.richnessRange)
    setIsAiMatching(preset.isAiMatching)
    setMoisture(preset.moisture)
    setSpice(preset.spice)
    
    const params = new URLSearchParams()
    if (preset.query.trim()) params.set("q", preset.query.trim())
    preset.types.forEach(t => params.append("type", t))
    preset.selectedBrands.forEach(b => params.append("brand", b))
    if (preset.sweetnessRange[0] > 0 || preset.sweetnessRange[1] < 10) {
      params.set("min_sweetness", preset.sweetnessRange[0].toString())
      params.set("max_sweetness", preset.sweetnessRange[1].toString())
    }
    if (preset.richnessRange[0] > 0 || preset.richnessRange[1] < 300) {
      params.set("min_richness", preset.richnessRange[0].toString())
      params.set("max_richness", preset.richnessRange[1].toString())
    }
    if (preset.isAiMatching) {
      const vector = tasteProfileToVector({
        sweetness: (preset.sweetnessRange[0] + preset.sweetnessRange[1]) / 2,
        richness: (preset.richnessRange[0] + preset.richnessRange[1]) / 2,
        moisture: preset.moisture,
        spice: preset.spice,
      })
      params.set("taste_vector", vector.join(","))
    }
    startTransition(() => {
      router.push(params.size ? `/?${params.toString()}` : "/")
    })
    setIsOpen(false)
  }

  const deletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = savedPresets.filter(p => p.id !== id)
    setSavedPresets(updated)
    localStorage.setItem("kek_lapis_saved_presets", JSON.stringify(updated))
  }

  const [brandSearchQuery, setBrandSearchQuery] = useState("")

  const SORT_KEYS = [
    "nameAsc", "nameDesc", "brandAsc", "brandDesc",
    "sweetnessAsc", "sweetnessDesc", "richnessAsc", "richnessDesc",
  ] as const

  const rawSort = (currentSort || "nameAsc").replace("sort.", "").replace(/[_.-]/g, "")
  const matchedSortKey = SORT_KEYS.find(
    (k) => k.toLowerCase() === rawSort.toLowerCase()
  ) || "nameAsc"

  useEffect(() => {
    setQuery(currentQuery)
    setTypes(currentTypes)
    setSelectedBrands(currentBrands)
    setSweetnessRange([currentMinSweetness ?? 0, currentMaxSweetness ?? 10])
    setRichnessRange([currentMinRichness ?? 0, currentMaxRichness ?? 300])
  }, [currentQuery, currentTypes, currentBrands, currentMinSweetness, currentMaxSweetness, currentMinRichness, currentMaxRichness])

  const filteredBrandsList = brands.filter(b => 
    b.brand_name.toLowerCase().includes(brandSearchQuery.toLowerCase())
  )

  const applyFilters = (customOverrides?: { query?: string; types?: string[]; brands?: string[] }) => {
    const params = new URLSearchParams(searchParams.toString())
    
    const activeQuery = customOverrides?.query !== undefined ? customOverrides.query : query
    const activeTypes = customOverrides?.types !== undefined ? customOverrides.types : types
    const activeBrands = customOverrides?.brands !== undefined ? customOverrides.brands : selectedBrands

    if (activeQuery.trim()) params.set("q", activeQuery.trim())
    else params.delete("q")

    params.delete("type")
    activeTypes.forEach((type) => params.append("type", type))

    params.delete("brand")
    activeBrands.forEach((brand) => params.append("brand", brand))
    
    if (sweetnessRange[0] > 0 || sweetnessRange[1] < 10) {
      params.set("min_sweetness", sweetnessRange[0].toString())
      params.set("max_sweetness", sweetnessRange[1].toString())
    } else {
      params.delete("min_sweetness")
      params.delete("max_sweetness")
    }

    if (richnessRange[0] > 0 || richnessRange[1] < 300) {
      params.set("min_richness", richnessRange[0].toString())
      params.set("max_richness", richnessRange[1].toString())
    } else {
      params.delete("min_richness")
      params.delete("max_richness")
    }

    if (isAiMatching) {
      const vector = tasteProfileToVector({
        sweetness: (sweetnessRange[0] + sweetnessRange[1]) / 2,
        richness: (richnessRange[0] + richnessRange[1]) / 2,
        moisture,
        spice,
      })
      params.set("taste_vector", vector.join(","))
    } else {
      params.delete("taste_vector")
    }
    
    startTransition(() => {
      router.push(params.size ? `/?${params.toString()}` : "/")
    })
    setIsOpen(false)
  }

  const clearFilters = () => {
    setQuery("")
    setTypes([])
    setSelectedBrands([])
    setSweetnessRange([0, 10])
    setRichnessRange([0, 300])
    setMoisture(5)
    setSpice(2)
    setIsAiMatching(false)
    const params = new URLSearchParams(searchParams.toString())
    params.delete("q")
    params.delete("type")
    params.delete("brand")
    params.delete("min_sweetness")
    params.delete("max_sweetness")
    params.delete("min_richness")
    params.delete("max_richness")
    params.delete("taste_vector")
    startTransition(() => { router.push(params.size ? `/?${params.toString()}` : "/") })
    setIsOpen(false)
  }

  const removeType = (typeToRemove: string) => {
    const nextTypes = types.filter(t => t !== typeToRemove)
    setTypes(nextTypes)
    applyFilters({ types: nextTypes })
  }

  const removeBrand = (brandIdToRemove: string) => {
    const nextBrands = selectedBrands.filter(b => b !== brandIdToRemove)
    setSelectedBrands(nextBrands)
    applyFilters({ brands: nextBrands })
  }

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "nameAsc") params.delete("sort"); else params.set("sort", value)
    startTransition(() => {
      router.replace(params.size ? `/?${params.toString()}` : "/", { scroll: false })
    })
  }

  const activeFilterCount = types.length + selectedBrands.length +
    (sweetnessRange[0] > 0 || sweetnessRange[1] < 10 ? 1 : 0) + 
    (richnessRange[0] > 0 || richnessRange[1] < 300 ? 1 : 0) +
    (isAiMatching ? 1 : 0)

  return (
    <div className="flex flex-col gap-3">
      {/* Light Glass Bar: Search + Filter Trigger + Sort */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center p-3 rounded-2xl bg-white/80 backdrop-blur-2xl border border-white/90 shadow-[0_10px_40px_rgb(0,0,0,0.08)] transition-all">
        <form className="flex min-w-0 flex-1 gap-2" onSubmit={(event) => { event.preventDefault(); applyFilters() }}>
          <div className="relative min-w-0 flex-1 group">
            <SearchGlyph />
            <Label htmlFor="registry-search" className="sr-only">Search variants...</Label>
            <Input 
              id="registry-search" 
              name="q" 
              autoComplete="off" 
              placeholder={tv("searchPlaceholder") ?? "Search bakeries or variants..."} 
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-12 rounded-xl border-zinc-200/80 bg-white/90 backdrop-blur-xl pl-10 pr-10 text-zinc-900 placeholder:text-zinc-400 shadow-xs transition-all duration-300 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:border-emerald-600 group-hover:border-zinc-300" 
            />
            {query && (
              <button 
                type="button" 
                onClick={() => { setQuery(""); applyFilters({ query: "" }); }} 
                aria-label="Reset search"
                className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-zinc-400 transition-all hover:bg-zinc-200/60 hover:text-zinc-700 active:scale-90"
              >
                <CloseGlyph />
              </button>
            )}
          </div>
          <Button 
            type="submit" 
            disabled={isPending}
            className="h-12 rounded-xl px-6 font-medium shadow-lg transition-all duration-300 active:scale-95 bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer backdrop-blur-md hover:shadow-emerald-700/25"
          >
            {isPending ? <span className="animate-pulse flex items-center gap-2">{th("updating") ?? "Loading..."}</span> : tf("applyFilters")}
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-12 rounded-xl border-zinc-200/80 bg-white/90 backdrop-blur-xl px-4 text-zinc-700 shadow-xs transition-all duration-300 hover:bg-white hover:text-emerald-800 hover:border-emerald-600/40 cursor-pointer group">
                <FilterGlyph /> 
                <span className="ml-2 font-medium">{tf("filterButton")}</span>
                {activeFilterCount > 0 && (
                  <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700 font-mono text-[10px] text-white shadow-sm animate-in zoom-in-50 transition-transform group-hover:scale-110">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            
            <SheetContent side="right" className="w-full border-l border-zinc-200/80 bg-white/95 backdrop-blur-3xl p-0 sm:max-w-md flex flex-col justify-between overflow-hidden shadow-2xl animate-in slide-in-from-right duration-300">
              <div className="absolute top-0 inset-x-0 h-1.5 flex z-20" aria-hidden="true">
                <div className="flex-1 bg-[#7A5C3E]" />
                <div className="flex-1 bg-[#B3936A]" />
                <div className="flex-1 bg-[#2E4A35]" />
                <div className="flex-1 bg-[#5B6E53]" />
                <div className="flex-1 bg-[#D4C4A8]" />
              </div>

              <SheetHeader className="border-b border-zinc-100 px-6 py-6 text-left relative bg-white/60 backdrop-blur-md">
                <p className="font-mono text-emerald-700 uppercase tracking-widest text-[10px] font-bold">{tf("controlsLabel")}</p>
                <SheetTitle className="font-display text-2xl font-bold tracking-tight text-zinc-900">{tf("title")}</SheetTitle>
              </SheetHeader>

              <div className="flex-1 space-y-6 overflow-y-auto overscroll-contain px-6 py-6">
                {/* Saved Collections / Presets Section */}
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 backdrop-blur-md space-y-3 transition-all hover:shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-zinc-700 uppercase tracking-wider">Saved Collections & Filters</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowSaveDialog(!showSaveDialog)}
                      className="h-7 text-[11px] bg-white cursor-pointer hover:border-emerald-600 transition-all"
                    >
                      {showSaveDialog ? "Cancel" : "Save Current Filter"}
                    </Button>
                  </div>

                  {showSaveDialog && (
                    <div className="flex gap-2 pt-1 animate-in fade-in zoom-in-95 duration-200">
                      <Input 
                        placeholder="Preset name (e.g., My Rich Favorites)"
                        value={presetNameInput}
                        onChange={(e) => setPresetNameInput(e.target.value)}
                        className="h-8 text-xs bg-white focus-visible:ring-1 focus-visible:ring-emerald-600"
                      />
                      <Button size="sm" onClick={saveCurrentPreset} className="h-8 text-xs bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer">
                        Save
                      </Button>
                    </div>
                  )}

                  {savedPresets.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {savedPresets.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => loadPreset(preset)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-zinc-200 px-2.5 py-1 text-[11px] font-medium text-zinc-700 hover:border-emerald-600 hover:text-emerald-800 hover:bg-emerald-50/40 shadow-2xs cursor-pointer transition-all active:scale-95"
                        >
                          <span>{preset.name}</span>
                          <span onClick={(e) => deletePreset(preset.id, e)} className="text-zinc-400 hover:text-red-600 ml-1 font-bold">×</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <FilterSection title={tf("styleType")}>
                  <div className="grid grid-cols-2 gap-2">
                    {CAKE_TYPES.map((type) => {
                      const isChecked = types.includes(type.value)
                      const labelText = tf(type.label)
                      return (
                        <label 
                          key={type.value} 
                          htmlFor={`type-${type.value}`} 
                          className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all duration-200 backdrop-blur-md ${isChecked ? "border-emerald-600/60 bg-emerald-50/80 text-emerald-950 shadow-xs scale-[1.02]" : "border-zinc-200/80 bg-white/60 hover:bg-white text-zinc-700 hover:border-zinc-300"}`}
                        >
                          <Checkbox 
                            id={`type-${type.value}`} 
                            checked={isChecked} 
                            onCheckedChange={(checked) => setTypes(checked ? [...types, type.value] : types.filter((item) => item !== type.value))} 
                          />
                          <span className="truncate">{labelText}</span>
                        </label>
                      )
                    })}
                  </div>
                </FilterSection>

                <FilterSection title={tf("sweetnessLevel") || "Sweetness Level"} value={`${sweetnessRange[0]} — ${sweetnessRange[1]}`}>
                  <div className="space-y-4 pt-2 px-1 bg-white/60 p-4 rounded-2xl border border-zinc-200/80 backdrop-blur-md shadow-2xs">
                    <Slider 
                      value={sweetnessRange} 
                      min={0} 
                      max={10} 
                      step={0.5}
                      onValueChange={(value) => setSweetnessRange(value as [number, number])} 
                    />
                    <div className="flex justify-between font-mono text-[10px] text-zinc-500">
                      <span>{th("metricsHelp.sweetnessLow") ?? "Subtle"}</span>
                      <span>{th("metricsHelp.sweetnessBalanced") ?? "Balanced"}</span>
                      <span>{th("metricsHelp.sweetnessRich") ?? "Decadent"}</span>
                    </div>
                  </div>
                </FilterSection>

                <FilterSection title={tf("richnessLevel") || "Richness Level"} value={`${richnessRange[0]} — ${richnessRange[1]} g/kg`}>
                  <div className="space-y-4 pt-2 px-1 bg-white/60 p-4 rounded-2xl border border-zinc-200/80 backdrop-blur-md shadow-2xs">
                    <Slider 
                      value={richnessRange} 
                      min={0} 
                      max={300} 
                      step={5}
                      onValueChange={(value) => setRichnessRange(value as [number, number])} 
                    />
                    <div className="flex justify-between font-mono text-[10px] text-zinc-500">
                      <span>0 g/kg</span>
                      <span>150 g/kg</span>
                      <span>300+ g/kg</span>
                    </div>
                  </div>
                </FilterSection>

                {/* AI Vector Embeddings Taste Match Section */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 backdrop-blur-md space-y-4 transition-all hover:border-emerald-300">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-800 uppercase tracking-wider">AI Taste Vector Matching</span>
                    <Checkbox 
                      id="ai-match-toggle"
                      checked={isAiMatching}
                      onCheckedChange={(checked) => setIsAiMatching(checked === true)}
                    />
                  </div>
                  {isAiMatching && (
                    <div className="space-y-3 pt-2 text-xs animate-in fade-in duration-300">
                      <div>
                        <div className="flex justify-between text-zinc-600 mb-1">
                          <span>Moisture Level</span>
                          <span className="font-mono font-medium text-emerald-700">{moisture}/10</span>
                        </div>
                        <Slider value={[moisture]} min={0} max={10} step={1} onValueChange={([v]) => setMoisture(v)} />
                      </div>
                      <div>
                        <div className="flex justify-between text-zinc-600 mb-1">
                          <span>Spice / Aroma Intensity</span>
                          <span className="font-mono font-medium text-emerald-700">{spice}/10</span>
                        </div>
                        <Slider value={[spice]} min={0} max={10} step={1} onValueChange={([v]) => setSpice(v)} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Integrated Taste Recommendations Component */}
                <div className="rounded-2xl border border-zinc-200 bg-white/80 p-4 backdrop-blur-md space-y-3 transition-all">
                  <span className="font-mono text-xs font-bold text-zinc-700 uppercase tracking-wider">Interactive Recommendations</span>
                  <TasteRecommendations initialRecommendations={[]} currentProductId="" />
                </div>

                <FilterSection title={tf("brands")}>
                  <div className="space-y-3 bg-white/60 p-4 rounded-2xl border border-zinc-200/80 backdrop-blur-md shadow-2xs">
                    <Input 
                      placeholder="Search bakeries..." 
                      value={brandSearchQuery}
                      onChange={(e) => setBrandSearchQuery(e.target.value)}
                      className="h-9 rounded-lg text-xs bg-white/90 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 backdrop-blur-sm focus-visible:ring-1 focus-visible:ring-emerald-600"
                    />
                    <div className="max-h-48 space-y-1 overflow-y-auto pr-1 rounded-xl border border-zinc-200/80 p-2 bg-white/50 backdrop-blur-sm">
                      {filteredBrandsList.length === 0 ? (
                        <p className="text-center text-xs text-zinc-400 py-4">No bakeries found</p>
                      ) : (
                        filteredBrandsList.map((brand) => {
                          const isChecked = selectedBrands.includes(brand.id)
                          return (
                            <label 
                              key={brand.id} 
                              htmlFor={`brand-${brand.id}`} 
                              className={`flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-xs transition-all duration-200 ${isChecked ? "bg-emerald-50 font-medium text-emerald-950 scale-[1.01]" : "hover:bg-zinc-100/80 text-zinc-700"}`}
                            >
                              <Checkbox 
                                id={`brand-${brand.id}`} 
                                checked={isChecked} 
                                onCheckedChange={(checked) => setSelectedBrands(checked ? [...selectedBrands, brand.id] : selectedBrands.filter((item) => item !== brand.id))} 
                              />
                              <span className="truncate">{brand.brand_name}</span>
                            </label>
                          )
                        })
                      )}
                    </div>
                  </div>
                </FilterSection>
              </div>

              <div className="border-t border-zinc-100 bg-white/95 backdrop-blur-xl p-4 flex gap-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <Button onClick={() => applyFilters()} className="h-11 flex-1 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium shadow-md transition-all active:scale-95 cursor-pointer">
                  {tf("applyFilters")}
                </Button>
                <Button variant="outline" onClick={clearFilters} className="h-11 rounded-xl border-zinc-200 bg-white text-zinc-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all cursor-pointer">
                  {tf("clearAll")}
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Redesigned Select Dropdown Container */}
          <Select onValueChange={handleSort} value={matchedSortKey}>
            <SelectTrigger aria-label="Sort variants" className="h-12 w-[11rem] rounded-xl border-zinc-200/80 bg-white/90 backdrop-blur-xl shadow-xs sm:w-[13rem] text-zinc-700 transition-all duration-300 hover:bg-white hover:text-emerald-900 cursor-pointer focus:ring-2 focus:ring-emerald-600">
              <span className="truncate text-left text-sm font-medium">
                {ts(matchedSortKey)}
              </span>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-zinc-200/80 bg-white/95 backdrop-blur-3xl shadow-xl text-zinc-700 p-1 animate-in fade-in zoom-in-95 duration-200">
              {SORT_KEYS.map((sortKey) => (
                <SelectItem 
                  key={sortKey} 
                  value={sortKey} 
                  className="rounded-xl cursor-pointer text-xs py-2.5 focus:bg-emerald-50 focus:text-emerald-950 hover:bg-emerald-50 hover:text-emerald-950 font-medium transition-colors"
                >
                  {ts(sortKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="ml-auto hidden whitespace-nowrap font-mono text-xs text-zinc-500 sm:block px-2" aria-live="polite">
            {resultCount} variants found
          </span>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(types.length > 0 || selectedBrands.length > 0 || query || sweetnessRange[0] > 0 || sweetnessRange[1] < 10 || richnessRange[0] > 0 || richnessRange[1] < 300 || isAiMatching) && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 animate-in fade-in-50 duration-300">
          <span className="text-[11px] font-medium text-zinc-500 mr-1">{tf("activeFilters")}</span>
          
          {query && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-white/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-zinc-800 border border-zinc-200/80 shadow-2xs transition-transform hover:scale-105">
              Query: &quot;{query}&quot;
              <button type="button" onClick={() => { setQuery(""); applyFilters({ query: "" }); }} className="text-zinc-400 hover:text-zinc-700 font-bold ml-0.5">×</button>
            </span>
          )}

          {isAiMatching && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100/90 backdrop-blur-md border border-emerald-300 px-2.5 py-1 text-[11px] font-medium text-emerald-900 shadow-2xs transition-transform hover:scale-105">
              AI Taste Match Active
              <button type="button" onClick={() => { setIsAiMatching(false); applyFilters(); }} className="hover:text-emerald-950 font-bold transition-colors">×</button>
            </span>
          )}

          {types.map(tVal => (
            <span key={tVal} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50/90 backdrop-blur-md border border-emerald-200 px-2.5 py-1 text-[11px] font-medium text-emerald-800 shadow-2xs transition-transform hover:scale-105">
              {tVal}
              <button type="button" onClick={() => removeType(tVal)} className="hover:text-emerald-950 font-bold transition-colors">×</button>
            </span>
          ))}

          {selectedBrands.map(bId => {
            const brandObj = brands.find(b => b.id === bId)
            return (
              <span key={bId} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50/90 backdrop-blur-md border border-emerald-200 px-2.5 py-1 text-[11px] font-medium text-emerald-800 shadow-2xs transition-transform hover:scale-105">
                {brandObj?.brand_name || bId}
                <button type="button" onClick={() => removeBrand(bId)} className="hover:text-emerald-950 font-bold transition-colors">×</button>
              </span>
            )
          })}

          <button 
            type="button"
            onClick={clearFilters}
            className="text-[11px] font-medium text-zinc-500 hover:text-red-600 underline underline-offset-4 ml-2 cursor-pointer transition-colors"
          >
            {tf("clearAll")}
          </button>
        </div>
      )}
    </div>
  )
}

function FilterSection({ title, value, children }: { title: string; value?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">{title}</h3>
        {value && <span className="font-mono text-xs font-semibold text-emerald-700">{value}</span>}
      </div>
      {children}
    </section>
  )
}

function SearchGlyph() { return <svg viewBox="0 0 20 20" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 group-hover:text-emerald-700 transition-colors" aria-hidden="true" fill="none"><circle cx="8.5" cy="8.5" r="5" stroke="currentColor" strokeWidth="1.8"/><path d="m12.2 12.2 4 4" stroke="currentColor" strokeWidth="1.8"/></svg> }
function CloseGlyph() { return <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" fill="none" stroke="currentColor" strokeWidth="1.8"/></svg> }
function FilterGlyph() { return <svg viewBox="0 0 20 20" className="h-4 w-4 text-zinc-500 group-hover:text-emerald-700 transition-colors" aria-hidden="true" fill="none"><path d="M3 5h14M6 10h8M8 15h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> }