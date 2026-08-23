"use client"

import { useState, Suspense, lazy } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { contributionSchema } from "@/lib/validations/contribution"

// Dynamically import map component to prevent SSR leaflet issues
const ContributionMap = lazy(() => import("@/components/contribution-map"))

interface ContributeFormProps {
  dict: {
    contribute?: {
      title?: string
      description?: string
      cardTitle?: string
      cardDesc?: string
      productName?: string
      productNamePlaceholder?: string
      productNameError?: string
      barcode?: string
      barcodePlaceholder?: string
      brand?: string
      brandPlaceholder?: string
      brandRequired?: string
      brandNotListed?: string
      addBrand?: string
      manufacturer?: string
      manufacturerPlaceholder?: string
      manufacturerRequired?: string
      manufacturerNotListed?: string
      addManufacturer?: string
      bakeryOrigin?: string
      bakeryOriginPlaceholder?: string
      bakeryOriginRequired?: string
      sourceNotListed?: string
      addSource?: string
      sweetnessLevel?: string
      sweetnessPlaceholder?: string
      richnessDri?: string
      richnessPlaceholder?: string
      productImage?: string
      productImageDesc?: string
      submitProduct?: string
      submitting?: string
      submitSuccess?: string
      submitSuccessDesc?: string
      submitFailed?: string
      rateLimitTitle?: string
      loadingError?: string
      loadingErrorDesc?: string
      addBrandTitle?: string
      addBrandDesc?: string
      brandName?: string
      brandNameRequired?: string
      brandNamePlaceholder?: string
      websiteUrl?: string
      websiteUrlPlaceholder?: string
      brandAdded?: string
      brandAddedDesc?: string
      brandAddFailed?: string
      addBrandButton?: string
      addManufacturerTitle?: string
      addManufacturerDesc?: string
      manufacturerName?: string
      manufacturerNameRequired?: string
      manufacturerNamePlaceholder?: string
      address?: string
      addressPlaceholder?: string
      manufacturerAdded?: string
      manufacturerAddedDesc?: string
      manufacturerAddFailed?: string
      addManufacturerButton?: string
      addSourceTitle?: string
      addSourceDesc?: string
      sourceName?: string
      sourceNameRequired?: string
      sourceNamePlaceholder?: string
      locationAddress?: string
      locationAddressPlaceholder?: string
      country?: string
      countryPlaceholder?: string
      sourceAdded?: string
      sourceAddedDesc?: string
      sourceAddFailed?: string
      addSourceButton?: string
      cancel?: string
      loading?: string
      productionSiteLocation?: string
      clickMapToPin?: string
      mapInstruction?: string
      return?: string
    }
    [key: string]: any
  }
}

export default function ContributeForm({ dict: rawDict }: ContributeFormProps) {
  // Safe fallback to prevent undefined destructuring errors
  const t = rawDict?.contribute || rawDict || {}

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  // Dynamic selection states & options lists
  const [brands, setBrands] = useState<string[]>(["Dayang Salhah", "Mira Cake House", "Kek Lapis Warisan"])
  const [manufacturers, setManufacturers] = useState<string[]>(["Hajah Salhah Enterprise", "Aunty Christina House"])
  const [origins, setOrigins] = useState<string[]>(["Kuching, Sarawak", "Miri, Sarawak", "Sibu, Sarawak"])

  // Selected values in form
  const [selectedBrand, setSelectedBrand] = useState("")
  const [selectedManufacturer, setSelectedManufacturer] = useState("")
  const [selectedOrigin, setSelectedOrigin] = useState("")

  // Modal display states
  const [activeModal, setActiveModal] = useState<"brand" | "manufacturer" | "source" | null>(null)

  // Modal form input states
  const [newBrandName, setNewBrandName] = useState("")
  const [newBrandUrl, setNewBrandUrl] = useState("")
  const [newMakerName, setNewMakerName] = useState("")
  const [newMakerAddress, setNewMakerAddress] = useState("")
  const [newSourceame, setNewSourceName] = useState("")
  const [newSourceLocation, setNewSourceLocation] = useState("")
  const [newSourceCountry, setNewSourceCountry] = useState("")

  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>({
    lat: 1.5533,
    lng: 110.3592, // Default Kuching center
  })
  const router = useRouter()

  // Handlers to handle inline modal creation submissions
  function handleAddBrand(e: React.FormEvent) {
    e.preventDefault()
    if (!newBrandName.trim()) return
    setBrands((prev) => [...prev, newBrandName.trim()])
    setSelectedBrand(newBrandName.trim())
    setNewBrandName("")
    setNewBrandUrl("")
    setActiveModal(null)
  }

  function handleAddManufacturer(e: React.FormEvent) {
    e.preventDefault()
    if (!newMakerName.trim()) return
    setManufacturers((prev) => [...prev, newMakerName.trim()])
    setSelectedManufacturer(newMakerName.trim())
    setNewMakerName("")
    setNewMakerAddress("")
    setActiveModal(null)
  }

  function handleAddSource(e: React.FormEvent) {
    e.preventDefault()
    if (!newSourceame.trim()) return
    setOrigins((prev) => [...prev, newSourceame.trim()])
    setSelectedOrigin(newSourceame.trim())
    setNewSourceName("")
    setNewSourceLocation("")
    setNewSourceCountry("")
    setActiveModal(null)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setErrorMessage(null)

    const formData = new FormData(event.currentTarget)
    const rawPayload = {
      productName: formData.get("productName"),
      brand: selectedBrand || formData.get("brand"),
      manufacturer: selectedManufacturer || formData.get("manufacturer"),
      bakeryOrigin: selectedOrigin || formData.get("bakeryOrigin"),
      sweetnessLevel: formData.get("sweetnessLevel") || undefined,
      richnessDri: formData.get("richnessDri") || undefined,
      barcode: formData.get("barcode") || undefined,
      latitude: coordinates?.lat ?? null,
      longitude: coordinates?.lng ?? null,
    }

    // Validate payload using Zod before sending
    const validationResult = contributionSchema.safeParse(rawPayload)

    if (!validationResult.success) {
      // Pull the first error message from Zod validation
      const firstError = validationResult.error.issues[0]?.message || "Invalid form data"
      setErrorMessage(firstError)
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch("/api/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validationResult.data), // Send validated clean data
      })

      const result = await res.json()
      if (result.success) {
        setSuccess(true)
      } else {
        setErrorMessage(result.error || t.submitFailed || "Submission Failed")
      }
    } catch (err) {
      console.error(err)
      setErrorMessage(t.submitFailed || "Submission Failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground py-12 px-5 sm:px-8 selection:bg-emerald-500/20 selection:text-emerald-800">
      <div className="mx-auto max-w-3xl">
        
        {/* Top Navigation & Kek Lapis Aesthetic Accent Preview */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-emerald-600 transition-colors cursor-pointer group"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span> {t.return || "Return"}
          </Link>
          
          <div className="flex h-4 w-28 rounded-full overflow-hidden border border-border shadow-xs opacity-80" aria-hidden="true">
            <div className="flex-1 bg-[#4A2E15]" />
            <div className="flex-1 bg-[#D9B485]" />
            <div className="flex-1 bg-[#4A2E15]" />
            <div className="flex-1 bg-[#2C5E2E]" />
            <div className="flex-1 bg-[#D9B485]" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
          {/* Subtle Kek Lapis Accent Bar on Top */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4A2E15] via-emerald-600 to-[#D9B485]" />

          <div className="mb-8 mt-2">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              {t.title || "Submit a Kek Lapis Variety"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t.description || "Add a new Kek Lapis recipe or brand to our registry. All submissions are reviewed."}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 rounded-xl bg-destructive/10 border border-destructive/30 p-4 text-sm text-destructive font-medium">
              {errorMessage}
            </div>
          )}

          {success ? (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-8 text-center animate-in fade-in">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md">
                ✓
              </div>
              <h3 className="font-display font-bold text-emerald-700 dark:text-emerald-400 text-xl mb-1">
                {t.submitSuccess || "Submission Successful"}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {t.submitSuccessDesc || "Your recipe variety has been submitted for review."}
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => { setSuccess(false); router.refresh(); }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  {t.submitProduct || "Submit Variety"}
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="px-5 py-2.5 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  {t.cancel || "Cancel"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Card Container Header */}
              <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-5">
                <div>
                  <h3 className="font-display font-bold text-base text-foreground">{t.cardTitle || "Recipe Details"}</h3>
                  <p className="text-xs text-muted-foreground">{t.cardDesc || "Enter the details as seen on the box or tasting menu."}</p>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 font-semibold">
                    {t.productName || "Variety Name"} <span className="text-emerald-600">*</span>
                  </label>
                  <input 
                    name="productName" 
                    placeholder={t.productNamePlaceholder || "e.g. Kek Lapis Lumut Special"}
                    required 
                    minLength={2}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Bakery / Brand Field */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                        {t.brand || "Bakery / Brand"} <span className="text-emerald-600">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setActiveModal("brand")}
                        className="text-[11px] font-semibold text-emerald-600 hover:underline cursor-pointer"
                      >
                        {t.brandNotListed || "Not listed?"}
                      </button>
                    </div>
                    <select
                      name="brand"
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                    >
                      <option value="">{t.brandPlaceholder || "Select a bakery"}</option>
                      {brands.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  {/* Master Baker Field */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                        {t.manufacturer || "Master Baker / House"}
                      </label>
                      <button
                        type="button"
                        onClick={() => setActiveModal("manufacturer")}
                        className="text-[11px] font-semibold text-emerald-600 hover:underline cursor-pointer"
                      >
                        {t.manufacturerNotListed || "Not listed?"}
                      </button>
                    </div>
                    <select
                      name="manufacturer"
                      value={selectedManufacturer}
                      onChange={(e) => setSelectedManufacturer(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                    >
                      <option value="">{t.manufacturerPlaceholder || "Select a maker"}</option>
                      {manufacturers.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {/* Bakery Origin Field */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                        {t.bakeryOrigin || "Bakery Origin"}
                      </label>
                      <button
                        type="button"
                        onClick={() => setActiveModal("source")}
                        className="text-[11px] font-semibold text-emerald-600 hover:underline cursor-pointer"
                      >
                        {t.sourceNotListed || "Not listed?"}
                      </button>
                    </div>
                    <select
                      name="bakeryOrigin"
                      value={selectedOrigin}
                      onChange={(e) => setSelectedOrigin(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                    >
                      <option value="">{t.bakeryOriginPlaceholder || "Select the origin"}</option>
                      {origins.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 font-semibold">
                      {t.sweetnessLevel || "Sweetness Level (Optional)"}
                    </label>
                    <input 
                      name="sweetnessLevel" 
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      placeholder={t.sweetnessPlaceholder || "e.g. 7.0"}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 font-semibold">
                      {t.richnessDri || "Richness (DRI g/kg) (Optional)"}
                    </label>
                    <input 
                      name="richnessDri" 
                      type="number"
                      placeholder={t.richnessPlaceholder || "e.g. 180"}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Product Photo Upload Section */}
              <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-3">
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                  {t.productImage || "Cake Photo"}
                </label>
                <p className="text-xs text-muted-foreground">{t.productImageDesc || "Upload a clear photo of the sliced cake and packaging."}</p>
                <input 
                  name="productImageFile"
                  type="file" 
                  accept="image/*"
                  className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                />
              </div>

              {/* Interactive Registry Location Map Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                    {t.productionSiteLocation || "Production Site Location"}
                  </label>
                  <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
                    {coordinates ? `${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}` : (t.clickMapToPin || "Click map to pin")}
                  </span>
                </div>
                <div className="relative h-64 w-full overflow-hidden rounded-xl border border-border bg-muted/30 shadow-inner">
                  <Suspense fallback={<div className="h-full w-full animate-pulse bg-muted flex items-center justify-center text-xs">{t.loading || "Loading form…"}</div>}>
                    <ContributionMap 
                      coordinates={coordinates} 
                      onCoordinatesChange={setCoordinates} 
                    />
                  </Suspense>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {t.mapInstruction || "Click anywhere on the map to accurately pinpoint where this authentic lapis is produced."}
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 font-semibold">
                  {t.barcode || "Barcode / Batch Code (Optional)"}
                </label>
                <input 
                  name="barcode" 
                  placeholder={t.barcodePlaceholder || "Scan or type code"}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs font-mono"
                />
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-border/60">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (t.submitting || "Submitting…") : (t.submitProduct || "Submit Variety")}
                </button>
                <Link
                  href="/"
                  className="px-6 py-3.5 bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl font-semibold text-sm transition-colors text-center"
                >
                  {t.cancel || "Cancel"}
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* --- INLINE MODALS FOR UNLISTED ITEMS --- */}

      {/* Add Brand Modal */}
      {activeModal === "brand" && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-display font-bold text-foreground mb-1">{t.addBrandTitle || "Add New Bakery"}</h3>
            <p className="text-xs text-muted-foreground mb-5">{t.addBrandDesc || "Enter the bakery details. It will be added immediately."}</p>
            <form onSubmit={handleAddBrand} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  {t.brandName || "Bakery Name"} <span className="text-emerald-600">{t.brandNameRequired || "*"}</span>
                </label>
                <input
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  placeholder={t.brandNamePlaceholder || "e.g. Dayang Salhah"}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  {t.websiteUrl || "Website URL (Optional)"}
                </label>
                <input
                  value={newBrandUrl}
                  onChange={(e) => setNewBrandUrl(e.target.value)}
                  placeholder={t.websiteUrlPlaceholder || "https://dayangsalhah.com.my"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {t.cancel || "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white cursor-pointer shadow-sm"
                >
                  {t.addBrandButton || "Add Bakery"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Master Baker Modal */}
      {activeModal === "manufacturer" && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-display font-bold text-foreground mb-1">{t.addManufacturerTitle || "Add New Master Baker"}</h3>
            <p className="text-xs text-muted-foreground mb-5">{t.addManufacturerDesc || "Enter the maker details. It will be added immediately."}</p>
            <form onSubmit={handleAddManufacturer} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  {t.manufacturerName || "Master Baker Name"} <span className="text-emerald-600">{t.manufacturerNameRequired || "*"}</span>
                </label>
                <input
                  value={newMakerName}
                  onChange={(e) => setNewMakerName(e.target.value)}
                  placeholder={t.manufacturerNamePlaceholder || "e.g. Hajah Salhah Enterprise"}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  {t.address || "Address (Optional)"}
                </label>
                <input
                  value={newMakerAddress}
                  onChange={(e) => setNewMakerAddress(e.target.value)}
                  placeholder={t.addressPlaceholder || "e.g. Petra Jaya, Kuching, Sarawak"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {t.cancel || "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white cursor-pointer shadow-sm"
                >
                  {t.addManufacturerButton || "Add Master Baker"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Bakery Origin Modal */}
      {activeModal === "source" && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-display font-bold text-foreground mb-1">{t.addSourceTitle || "Add New Bakery Origin"}</h3>
            <p className="text-xs text-muted-foreground mb-5">{t.addSourceDesc || "Enter the origin details. It will be added immediately."}</p>
            <form onSubmit={handleAddSource} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  {t.sourceName || "Origin Name"} <span className="text-emerald-600">{t.sourceNameRequired || "*"}</span>
                </label>
                <input
                  value={newSourceame}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  placeholder={t.sourceNamePlaceholder || "e.g. Satok Waterfront Kitchen"}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  {t.locationAddress || "Location / Address (Optional)"}
                </label>
                <input
                  value={newSourceLocation}
                  onChange={(e) => setNewSourceLocation(e.target.value)}
                  placeholder={t.locationAddressPlaceholder || "e.g. Kuching, Sarawak"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  {t.country || "Country / Region (Optional)"}
                </label>
                <input
                  value={newSourceCountry}
                  onChange={(e) => setNewSourceCountry(e.target.value)}
                  placeholder={t.countryPlaceholder || "e.g. Malaysia"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {t.cancel || "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white cursor-pointer shadow-sm"
                >
                  {t.addSourceButton || "Add Origin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  )
}