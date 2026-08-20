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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

// Updated based on culinary_profile values from the schema
const CAKE_TYPES = [
  { value: "Traditional Spiced", label: "typeTraditional" },
  { value: "Malty & Rich", label: "typeHorlicks" },
  { value: "Tangy & Fruity", label: "typeFruity" },
  { value: "Chocolatey & Sweet", label: "typeChocolate" },
  { value: "Rich & Creamy", label: "typeCheese" },
  { value: "Coffee Infused", label: "typeCoffee" },
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
  const ts = useTranslations("sourcesView")
  const tso = useTranslations("sort")

  const [query, setQuery] = useState(currentQuery)
  const [isOpen, setIsOpen] = useState(false)
  const [types, setTypes] = useState<string[]>(currentTypes)
  const [selectedBrands, setSelectedBrands] = useState<string[]>(currentBrands)
  const [sweetnessRange, setSweetnessRange] = useState<[number, number]>([currentMinSweetness ?? 0, currentMaxSweetness ?? 10])
  const [richnessRange, setRichnessRange] = useState<[number, number]>([currentMinRichness ?? 0, currentMaxRichness ?? 100])
  
  const [brandSearchQuery, setBrandSearchQuery] = useState("")

  // Keep internal state synced when URL search params change externally
  useEffect(() => {
    setQuery(currentQuery)
    setTypes(currentTypes)
    setSelectedBrands(currentBrands)
    setSweetnessRange([currentMinSweetness ?? 0, currentMaxSweetness ?? 10])
    setRichnessRange([currentMinRichness ?? 0, currentMaxRichness ?? 100])
  }, [currentQuery, currentTypes, currentBrands, currentMinSweetness, currentMaxSweetness, currentMinRichness, currentMaxRichness])

  const filteredBrandsList = brands.filter(b => 
    b.brand_name.toLowerCase().includes(brandSearchQuery.toLowerCase())
  )

  const applyFilters = (customOverrides?: { query?: string; types?: string[]; brands?: string[] }) => {
    const params = new URLSearchParams()
    
    const activeQuery = customOverrides?.query !== undefined ? customOverrides.query : query
    const activeTypes = customOverrides?.types !== undefined ? customOverrides.types : types
    const activeBrands = customOverrides?.brands !== undefined ? customOverrides.brands : selectedBrands

    if (activeQuery.trim()) params.set("q", activeQuery.trim())
    activeTypes.forEach((type) => params.append("type", type))
    activeBrands.forEach((brand) => params.append("brand", brand))
    
    if (sweetnessRange[0] > 0 || sweetnessRange[1] < 10) {
      params.set("min_sweetness", sweetnessRange[0].toString())
      params.set("max_sweetness", sweetnessRange[1].toString())
    }
    if (richnessRange[0] > 0 || richnessRange[1] < 100) {
      params.set("min_richness", richnessRange[0].toString())
      params.set("max_richness", richnessRange[1].toString())
    }
    if (currentSort !== "name_asc") params.set("sort", currentSort)
    
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
    setRichnessRange([0, 100])
    startTransition(() => { router.push("/") })
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
    if (value === "name_asc") params.delete("sort"); else params.set("sort", value)
    startTransition(() => {
      router.replace(params.size ? `/?${params.toString()}` : "/", { scroll: false })
    })
  }

  const activeFilterCount = types.length + selectedBrands.length +
    (sweetnessRange[0] > 0 || sweetnessRange[1] < 10 ? 1 : 0) + (richnessRange[0] > 0 || richnessRange[1] < 100 ? 1 : 0)

  return (
    <div className="flex flex-col gap-3">
      {/* Main Bar: Search + Filter Trigger + Sort */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <form className="flex min-w-0 flex-1 gap-2" onSubmit={(event) => { event.preventDefault(); applyFilters() }}>
          <div className="relative min-w-0 flex-1">
            <SearchGlyph />
            <Label htmlFor="registry-search" className="sr-only">Search variants...</Label>
            <Input 
              id="registry-search" 
              name="q" 
              autoComplete="off" 
              placeholder="Search cake variants, recipes, or ingredients..." 
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 rounded-xl border-emerald-950/15 bg-background/80 backdrop-blur-sm pl-10 pr-10 shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-emerald-900" 
            />
            {query && (
              <button 
                type="button" 
                onClick={() => { setQuery(""); applyFilters({ query: "" }); }} 
                aria-label="Reset search"
                className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <CloseGlyph />
              </button>
            )}
          </div>
          <Button 
            type="submit" 
            disabled={isPending}
            className="h-11 rounded-xl px-6 font-medium shadow-sm transition-all active:scale-95 bg-emerald-900 hover:bg-emerald-950 text-white cursor-pointer"
          >
            {isPending ? <span className="animate-pulse">Loading...</span> : "Search"}
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-11 rounded-xl border-emerald-950/15 bg-background/80 backdrop-blur-sm px-4 shadow-sm transition-all hover:bg-muted/60 cursor-pointer">
                <FilterGlyph /> 
                <span className="ml-2">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-900 font-mono text-[10px] text-white shadow-sm animate-in zoom-in-50">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            
            <SheetContent side="right" className="w-full border-l border-emerald-950/10 bg-background/95 backdrop-blur-xl p-0 sm:max-w-md flex flex-col justify-between overflow-hidden">
              
              {/* Signature 5-Color Kek Lapis Palette Accent Bar at the top of the Drawer */}
              <div className="absolute top-0 inset-x-0 h-1.5 flex z-20" aria-hidden="true">
                <div className="flex-1 bg-[#7A5C3E]" />
                <div className="flex-1 bg-[#B3936A]" />
                <div className="flex-1 bg-[#2E4A35]" />
                <div className="flex-1 bg-[#5B6E53]" />
                <div className="flex-1 bg-[#D4C4A8]" />
              </div>

              <SheetHeader className="border-b border-emerald-950/10 px-6 py-6 text-left relative bg-muted/20">
                <p className="font-mono text-emerald-900 dark:text-emerald-400 uppercase tracking-widest text-[10px] font-bold">Registry Controls</p>
                <SheetTitle className="font-display text-2xl font-bold tracking-tight text-foreground">Filter Cake Registry</SheetTitle>
              </SheetHeader>

              {/* Scrollable Filters Body */}
              <div className="flex-1 space-y-8 overflow-y-auto overscroll-contain px-6 py-6">
                
                {/* Cake Categories / Culinary Profiles */}
                <FilterSection title="Culinary Profile">
                  <div className="grid grid-cols-2 gap-2">
                    {CAKE_TYPES.map((type) => {
                      const isChecked = types.includes(type.value)
                      return (
                        <label 
                          key={type.value} 
                          htmlFor={`type-${type.value}`} 
                          className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all ${isChecked ? "border-emerald-900/60 bg-emerald-950/5 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 shadow-xs" : "border-emerald-950/10 hover:bg-muted/50 text-foreground"}`}
                        >
                          <Checkbox 
                            id={`type-${type.value}`} 
                            checked={isChecked} 
                            onCheckedChange={(checked) => setTypes(checked ? [...types, type.value] : types.filter((item) => item !== type.value))} 
                          />
                          <span className="truncate">{type.value}</span>
                        </label>
                      )
                    })}
                  </div>
                </FilterSection>

                {/* Sweetness Profile Slider */}
                <FilterSection title="Sweetness Profile" value={`${sweetnessRange[0]} — ${sweetnessRange[1]}`}>
                  <div className="space-y-4 pt-2 px-1">
                    <Slider 
                      value={sweetnessRange} 
                      min={0} 
                      max={10} 
                      step={0.5}
                      onValueChange={(value) => setSweetnessRange(value as [number, number])} 
                    />
                    <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
                      <span>Low Sugar (0)</span>
                      <span>Balanced (5)</span>
                      <span>Sweet & Rich (10)</span>
                    </div>
                  </div>
                </FilterSection>

                {/* Richness & Butter Index (DRI) Slider */}
                <FilterSection title="Richness & Butter Index (DRI)" value={`${richnessRange[0]} — ${richnessRange[1]}%`}>
                  <div className="space-y-4 pt-2 px-1">
                    <Slider 
                      value={richnessRange} 
                      min={0} 
                      max={100} 
                      step={5}
                      onValueChange={(value) => setRichnessRange(value as [number, number])} 
                    />
                    <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
                      <span>Light (0%)</span>
                      <span>Standard (50%)</span>
                      <span>Ultra-Dense (100%)</span>
                    </div>
                  </div>
                </FilterSection>

                {/* Brands Filter Section with Search Bar */}
                <FilterSection title="Master Bakeries">
                  <div className="space-y-3">
                    <Input 
                      placeholder="Search bakeries..." 
                      value={brandSearchQuery}
                      onChange={(e) => setBrandSearchQuery(e.target.value)}
                      className="h-9 rounded-lg text-xs bg-muted/40 border-emerald-950/10"
                    />
                    <div className="max-h-48 space-y-1 overflow-y-auto pr-1 rounded-xl border border-emerald-950/10 p-2 bg-muted/20">
                      {filteredBrandsList.length === 0 ? (
                        <p className="text-center text-xs text-muted-foreground py-4">No bakeries found</p>
                      ) : (
                        filteredBrandsList.map((brand) => {
                          const isChecked = selectedBrands.includes(brand.id)
                          return (
                            <label 
                              key={brand.id} 
                              htmlFor={`brand-${brand.id}`} 
                              className={`flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-xs transition-colors ${isChecked ? "bg-emerald-950/10 dark:bg-emerald-950/30 font-medium text-emerald-950 dark:text-emerald-200" : "hover:bg-muted/60 text-foreground"}`}
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

              {/* Drawer Footer Actions */}
              <div className="border-t border-emerald-950/10 bg-background/90 backdrop-blur-md p-4 flex gap-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <Button onClick={() => applyFilters()} className="h-11 flex-1 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white font-medium shadow-sm transition-all active:scale-95 cursor-pointer">
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={clearFilters} className="h-11 rounded-xl border-emerald-950/15 shadow-none hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all cursor-pointer">
                  Clear All
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort Dropdown */}
          <Select onValueChange={handleSort} value={currentSort}>
            <SelectTrigger aria-label="Sort variants" className="h-11 w-[11rem] rounded-xl border-emerald-950/15 bg-background/80 backdrop-blur-sm shadow-sm sm:w-[13rem] transition-all hover:bg-muted/50 cursor-pointer">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-emerald-950/15 shadow-xl">
              <SelectItem value="name_asc">Name: A to Z</SelectItem>
              <SelectItem value="name_desc">Name: Z to A</SelectItem>
              <SelectItem value="brand_asc">Bakery: A to Z</SelectItem>
              <SelectItem value="brand_desc">Bakery: Z to A</SelectItem>
              <SelectItem value="sweetness_asc">Sweetness: Low to High</SelectItem>
              <SelectItem value="sweetness_desc">Sweetness: High to Low</SelectItem>
              <SelectItem value="richness_dri_asc">Richness: Light to Dense</SelectItem>
              <SelectItem value="richness_dri_desc">Richness: Dense to Light</SelectItem>
            </SelectContent>
          </Select>

          <span className="ml-auto hidden whitespace-nowrap font-mono text-xs text-muted-foreground sm:block" aria-live="polite">
            {resultCount} variants found
          </span>

        </div>
      </div>

      {/* Active Filter Pills Bar (Interactive quick dismissal) */}
      {(types.length > 0 || selectedBrands.length > 0 || query || sweetnessRange[0] > 0 || sweetnessRange[1] < 10 || richnessRange[0] > 0 || richnessRange[1] < 100) && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 animate-in fade-in-50 duration-200">
          <span className="text-[11px] font-medium text-muted-foreground mr-1">Active filters:</span>
          
          {query && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-muted px-2 py-1 text-[11px] font-medium text-foreground border border-emerald-950/10">
              Query: &quot;{query}&quot;
              <button type="button" onClick={() => { setQuery(""); applyFilters({ query: "" }); }} className="text-muted-foreground hover:text-foreground">×</button>
            </span>
          )}

          {types.map(tVal => (
            <span key={tVal} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-950/5 border border-emerald-900/20 px-2 py-1 text-[11px] font-medium text-emerald-900 dark:text-emerald-300">
              {tVal}
              <button type="button" onClick={() => removeType(tVal)} className="hover:text-emerald-950 transition-colors">×</button>
            </span>
          ))}

          {selectedBrands.map(bId => {
            const brandObj = brands.find(b => b.id === bId)
            return (
              <span key={bId} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-950/5 border border-emerald-900/20 px-2 py-1 text-[11px] font-medium text-emerald-900 dark:text-emerald-300">
                {brandObj?.brand_name || bId}
                <button type="button" onClick={() => removeBrand(bId)} className="hover:text-emerald-950 transition-colors">×</button>
              </span>
            )
          })}

          <button 
            type="button"
            onClick={clearFilters}
            className="text-[11px] font-medium text-muted-foreground hover:text-destructive underline underline-offset-4 ml-2 cursor-pointer"
          >
            Clear all
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
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</h3>
        {value && <span className="font-mono text-xs font-semibold text-emerald-900 dark:text-emerald-400">{value}</span>}
      </div>
      {children}
    </section>
  )
}

function SearchGlyph() { return <svg viewBox="0 0 20 20" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" fill="none"><circle cx="8.5" cy="8.5" r="5" stroke="currentColor" strokeWidth="1.8"/><path d="m12.2 12.2 4 4" stroke="currentColor" strokeWidth="1.8"/></svg> }
function CloseGlyph() { return <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" fill="none" stroke="currentColor" strokeWidth="1.8"/></svg> }
function FilterGlyph() { return <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true" fill="none"><path d="M3 5h14M6 10h8M8 15h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> }