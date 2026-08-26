"use client"

import { useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { Product } from "@/lib/types/db"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { ArrowIcon } from "@/components/editorial-primitives"
import { RegionalFilterBar } from "@/components/regional-filter-bar" 
import { RegionalAnalyticsView } from "@/components/regional-analytics-view"

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
)
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
)
const ZoomControl = dynamic(
  () => import("react-leaflet").then((mod) => mod.ZoomControl),
  { ssr: false }
)

import { useMap } from "react-leaflet"
import { Icon, latLngBounds } from "leaflet"
import "leaflet/dist/leaflet.css"

const kekLapisIcon = new Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='40' viewBox='0 0 32 40'%3E%3Cpath fill='%23047857' d='M16 0C7.16 0 0 7.16 0 16c0 11 16 24 16 24s16-13 16-24C32 7.16 24.84 0 16 0Z'/%3E%3Ccircle cx='16' cy='16' r='6' fill='%23a7f3d0'/%3E%3C/svg%3E",
  iconSize: [32, 40], 
  iconAnchor: [16, 40], 
  popupAnchor: [0, -36],
})

const activeKekLapisIcon = new Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='38' height='46' viewBox='0 0 32 40'%3E%3Cpath fill='%23065f46' stroke='%23fef3c7' stroke-width='3' d='M16 0C7.16 0 0 7.16 0 16c0 11 16 24 16 24s16-13 16-24C32 7.16 24.84 0 16 0Z'/%3E%3Ccircle cx='16' cy='16' r='7' fill='%23fde047'/%3E%3C/svg%3E",
  iconSize: [38, 46], 
  iconAnchor: [19, 46], 
  popupAnchor: [0, -42],
})

function FitBounds({ 
  products, 
  activeProductId, 
  userLocation 
}: { 
  products: Product[]; 
  activeProductId: string | null; 
  userLocation: [number, number] | null 
}) {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    if (userLocation) {
      map.flyTo(userLocation, 13, { duration: 1.5 })
      return
    }

    if (activeProductId) {
      const activeProduct = products.find(p => p.id === activeProductId)
      if (activeProduct?.source?.lat && activeProduct?.source?.lng) {
        const lat = Number(activeProduct.source.lat)
        const lng = Number(activeProduct.source.lng)
        map.flyTo([lat, lng], 14, { duration: 1.2 })
        return
      }
    }

    if (products.length === 0) return
    const points = products.map((product) => [Number(product.source!.lat), Number(product.source!.lng)] as [number, number])
    if (points.length === 1) { map.setView(points[0], 12); return }
    map.fitBounds(latLngBounds(points), { padding: [50, 50] })
  }, [map, products, activeProductId, userLocation])

  return null
}

export function HomeMapClient({ products }: { products: Product[] }) {
  const t = useTranslations("map")
  const tp = useTranslations("mapPopup")
  
  const [isMounted, setIsMounted] = useState(false)
  const [activeProductId, setActiveProductId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL")
  const [showDensityRings, setShowDensityRings] = useState(true)

  const [showFilter, setShowFilter] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const productsWithCoords = useMemo(() => products.filter((product) => {
    const { lat, lng } = product.source ?? {}
    return lat != null && lng != null && !isNaN(Number(lat)) && !isNaN(Number(lng))
  }), [products])

  const availableRegions = useMemo(() => {
    const regionsSet = new Set<string>()
    productsWithCoords.forEach(p => {
      const addr = p.source?.location_address?.toLowerCase() || ""
      if (addr.includes("kuching") || addr.includes("petrajaya") || addr.includes("satok") || addr.includes("matang")) {
        regionsSet.add("Kuching Hub")
      } else if (addr.includes("miri")) {
        regionsSet.add("Miri")
      } else if (addr.includes("sibu")) {
        regionsSet.add("Sibu")
      } else {
        regionsSet.add("Sarawak Region")
      }
    })
    return ["ALL", ...Array.from(regionsSet)]
  }, [productsWithCoords])

  const filteredProducts = useMemo(() => {
    return productsWithCoords.filter((product) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch = 
        !searchQuery.trim() ||
        product.product_name?.toLowerCase().includes(q) || 
        product.brand?.brand_name?.toLowerCase().includes(q) ||
        product.source?.location_address?.toLowerCase().includes(q)

      if (!matchesSearch) return false

      if (selectedRegion === "ALL") return true
      const addr = product.source?.location_address?.toLowerCase() || ""
      if (selectedRegion === "Kuching Hub") {
        return addr.includes("kuching") || addr.includes("petrajaya") || addr.includes("satok") || addr.includes("matang") || addr.includes("samariang")
      }
      return addr.includes(selectedRegion.toLowerCase())
    })
  }, [productsWithCoords, searchQuery, selectedRegion])

  const handleGetUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.error("Error getting location: ", error)
          alert(t("geolocationError"))
        }
      )
    } else {
      alert(t("geolocationNotSupported"))
    }
  }

  if (!isMounted) {
    return (
      <div className="h-full w-full rounded-3xl bg-card/40 border border-border/60 flex items-center justify-center">
        <span className="text-xs font-mono tracking-wider text-muted-foreground">{t("initializingMatrix")}</span>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full flex rounded-3xl overflow-hidden border border-emerald-500/35 shadow-2xl bg-background/50 backdrop-blur-xl group" role="region" aria-label={t("title")}>
      
      {/* Sidebar Drawer */}
      <div className={`absolute left-0 top-0 bottom-0 z-30 w-96 bg-card/95 backdrop-blur-2xl border-r border-border/80 transition-transform duration-500 ease-out flex flex-col shadow-2xl ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Header Section */}
        <div className="p-4 border-b border-border/60 bg-emerald-950/[0.04]">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-700 dark:text-emerald-400">{t("regionalAnalytics")}</h2>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-xl text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-700 transition-all active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          <p className="text-xs font-display font-semibold text-foreground tracking-tight">{t("locationsDirectory")}</p>
        </div>

        {/* Collapsible Action Toggles Bar */}
        <div className="px-4 py-2.5 border-b border-border/60 bg-muted/30 flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex-1 flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
              showFilter || searchQuery || selectedRegion !== "ALL"
                ? "bg-emerald-600 text-white border-emerald-500 shadow-md"
                : "bg-card text-foreground border-border/80 hover:bg-emerald-500/10 hover:text-emerald-700"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {t("toggleFilter")}
            </span>
            <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${showFilter ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className={`flex-1 flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
              showAnalytics
                ? "bg-emerald-600 text-white border-emerald-500 shadow-md"
                : "bg-card text-foreground border-border/80 hover:bg-emerald-500/10 hover:text-emerald-700"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {t("toggleAnalytics")}
            </span>
            <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${showAnalytics ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Collapsible Filter Panel */}
        {showFilter && (
          <div className="shrink-0 border-b border-border/60 bg-card/90 p-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <RegionalFilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              availableRegions={availableRegions}
              filteredCount={filteredProducts.length}
            />
          </div>
        )}

        {/* Collapsible Analytics Panel */}
        {showAnalytics && (
          <div className="shrink-0 border-b border-border/60 bg-card/90 p-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <RegionalAnalyticsView products={filteredProducts} />
          </div>
        )}

        {/* Status Count Banner */}
        <div className="px-4 py-2 bg-emerald-500/5 border-b border-emerald-500/10 flex items-center justify-between text-[11px] shrink-0">
          <span className="text-muted-foreground font-medium">{t("activeHubCount")}</span>
          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
            {t("bakeriesMapped", { count: filteredProducts.length })}
          </span>
        </div>

        {/* Scrollable Product List Container */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2.5 scrollbar-thin scrollbar-thumb-emerald-500/20 hover:scrollbar-thumb-emerald-500/40">
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground space-y-2">
              <div className="w-8 h-8 mx-auto rounded-full bg-muted/50 border border-border flex items-center justify-center text-muted-foreground">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p>{t("noMatchingLocations")}</p>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const isSelected = activeProductId === product.id
              return (
                <div
                  key={product.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveProductId(product.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setActiveProductId(product.id)
                    }
                  }}
                  className={`group/card p-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    isSelected 
                      ? "border-emerald-600 bg-emerald-500/[0.04] shadow-lg ring-2 ring-emerald-500/20 scale-[1.01]" 
                      : "border-border/60 bg-background/80 hover:border-emerald-500/40 hover:bg-muted/50 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      {product.brand?.brand_name}
                    </span>
                    {product.source?.type && (
                      <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">
                        {product.source.type}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs font-semibold text-foreground group-hover/card:text-emerald-800 dark:group-hover/card:text-emerald-300 transition-colors leading-snug">
                    {product.product_name}
                  </h3>
                  {product.source?.location_address && (
                    <p className="mt-1.5 text-[10px] text-muted-foreground line-clamp-1 flex items-center gap-1">
                      <svg className="w-3 h-3 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {product.source.location_address}
                    </p>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute left-4 top-4 z-30 flex items-center gap-2.5 rounded-2xl bg-card/95 px-4 py-3 text-xs font-semibold text-foreground shadow-2xl backdrop-blur-xl border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition-all group duration-300 active:scale-95"
        >
          <svg className="h-4 w-4 text-emerald-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>{t("showList")}</span>
          <span className="text-border group-hover:text-emerald-300">|</span>
          <span className="font-mono text-emerald-700 dark:text-emerald-400 group-hover:text-white">
            {t("hubs", { count: filteredProducts.length })}
          </span>
        </button>
      )}

      {/* Main Map */}
      <MapContainer 
        center={[2.5, 112.5]} 
        zoom={7} 
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full outline-none" 
        style={{ zIndex: 1 }}
      >
        <ZoomControl position="bottomright" />
        <FitBounds products={productsWithCoords} activeProductId={activeProductId} userLocation={userLocation} />
        
        <TileLayer 
          attribution='&copy; <a href="https://carto.com/">CARTO</a>' 
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
        />

        {userLocation && (
          <>
            <Marker position={userLocation} icon={kekLapisIcon} />
            <Circle center={userLocation} radius={5000} pathOptions={{ color: '#047857', fillColor: '#10b981', fillOpacity: 0.15 }} />
          </>
        )}

        {showDensityRings && productsWithCoords.map((product) => {
          const lat = Number(product.source!.lat)
          const lng = Number(product.source!.lng)
          return (
            <Circle 
              key={`ring-${product.id}`}
              center={[lat, lng]} 
              radius={2500} 
              pathOptions={{ color: '#059669', fillColor: '#34d399', fillOpacity: 0.08, weight: 1, dashArray: '4, 4' }} 
            />
          )
        })}

        {filteredProducts.map((product) => {
          const lat = Number(product.source!.lat)
          const lng = Number(product.source!.lng)
          const isSelected = activeProductId === product.id

          return (
            <Marker 
              key={product.id} 
              position={[lat, lng]} 
              icon={isSelected ? activeKekLapisIcon : kekLapisIcon}
              eventHandlers={{
                click: () => setActiveProductId(product.id),
              }}
            >
              <Popup className="rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/20">
                <article className="p-3.5 max-w-[240px] bg-card text-card-foreground">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold">
                      {product.brand?.brand_name}
                    </p>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted font-mono">{product.cake_type || 'Layer Cake'}</span>
                  </div>
                  <h3 className="text-xs font-display font-bold text-foreground leading-snug">
                    {product.product_name}
                  </h3>
                  {product.source!.location_address && (
                    <p className="mt-1.5 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {product.source!.location_address}
                    </p>
                  )}
                  <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between">
                    <Link 
                      href={`/registry/${product.id}`} 
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 transition-colors group/link"
                    >
                      {tp("viewDetails")} 
                      <ArrowIcon className="transition-transform duration-200 group-hover/link:translate-x-1" />
                    </Link>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-semibold text-muted-foreground hover:text-emerald-700 underline underline-offset-2"
                    >
                      {tp("directions")}
                    </a>
                  </div>
                </article>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Floating Control Buttons Hub (Bottom Left) */}
      <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2">
        <button
          onClick={() => setShowDensityRings(!showDensityRings)}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold shadow-xl backdrop-blur-xl border transition-all active:scale-95 ${showDensityRings ? "bg-emerald-600 text-white border-emerald-500 shadow-emerald-900/20" : "bg-card/95 text-foreground border-border/80 hover:bg-emerald-50 hover:text-emerald-800"}`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span>{showDensityRings ? t("hideHeatRings") : t("showHeatRings")}</span>
        </button>

        <button
          onClick={handleGetUserLocation}
          className="flex items-center gap-2 rounded-2xl bg-card/95 px-4 py-2.5 text-xs font-semibold text-foreground shadow-xl backdrop-blur-xl border border-border/80 transition-all hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 active:scale-95"
        >
          <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{t("nearMe")}</span>
        </button>

        <button
          onClick={() => { setActiveProductId(null); setUserLocation(null); setSelectedRegion("ALL"); setSearchQuery(""); }}
          className="flex items-center gap-2 rounded-2xl bg-card/95 px-4 py-2.5 text-xs font-semibold text-foreground shadow-xl backdrop-blur-xl border border-border/80 transition-all hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 active:scale-95"
        >
          <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          <span>{t("fitAll")}</span>
        </button>
      </div>
    </div>
  )
}