"use client"

import { useEffect, useMemo, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, ZoomControl } from "react-leaflet"
import { Icon, latLngBounds } from "leaflet"
import "leaflet/dist/leaflet.css"
import { Product } from "@/lib/types/db"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { ArrowIcon } from "@/components/editorial-primitives"

// Modernized emerald moss pin
const kekLapisIcon = new Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='40' viewBox='0 0 32 40'%3E%3Cpath fill='%23047857' d='M16 0C7.16 0 0 7.16 0 16c0 11 16 24 16 24s16-13 16-24C32 7.16 24.84 0 16 0Z'/%3E%3Ccircle cx='16' cy='16' r='6' fill='%23a7f3d0'/%3E%3C/svg%3E",
  iconSize: [32, 40], 
  iconAnchor: [16, 40], 
  popupAnchor: [0, -36],
})

// Highlighted pin for active list selection
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
  
  const [activeProductId, setActiveProductId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const productsWithCoords = useMemo(() => products.filter((product) => {
    const { lat, lng } = product.source ?? {}
    return lat != null && lng != null && !isNaN(Number(lat)) && !isNaN(Number(lng))
  }), [products])

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return productsWithCoords
    const q = searchQuery.toLowerCase()
    return productsWithCoords.filter(p => 
      p.product_name?.toLowerCase().includes(q) || 
      p.brand?.brand_name?.toLowerCase().includes(q) ||
      p.source?.location_address?.toLowerCase().includes(q)
    )
  }, [productsWithCoords, searchQuery])

  const handleGetUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.error("Error getting location: ", error)
          alert("Unable to retrieve your location. Please check browser permissions.")
        }
      )
    } else {
      alert("Geolocation is not supported by your browser")
    }
  }

  return (
    <div className="relative h-full w-full flex rounded-2xl overflow-hidden border border-border/60 shadow-md group" role="region" aria-label={t("title")}>
      
      {/* 1. Interactive Sidebar Drawer */}
      <div className={`absolute left-0 top-0 bottom-0 z-20 w-80 bg-card/95 backdrop-blur-md border-r border-border transition-transform duration-300 flex flex-col shadow-2xl ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold font-display text-foreground">Locations Directory</h2>
            <p className="text-[11px] text-muted-foreground">{filteredProducts.length} varieties available</p>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Hide sidebar"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Search filter inside sidebar */}
        <div className="p-3 border-b border-border/60">
          <input
            type="text"
            placeholder="Search varieties or cakes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl bg-background border border-input px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>

        {/* Scrollable list items synced to map markers */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredProducts.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No matching bakery locations found.
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
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${isSelected ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm" : "border-border/60 bg-background hover:border-emerald-500/40 hover:bg-muted/50"}`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-emerald-600 animate-pulse" : "bg-muted-foreground"}`} />
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold">
                      {product.brand?.brand_name}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-foreground leading-snug">
                    {product.product_name}
                  </h3>
                  {product.source?.location_address && (
                    <p className="mt-1 text-[10px] text-muted-foreground line-clamp-1">
                      {product.source.location_address}
                    </p>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Show List Button (Clean top-left position) */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute left-3 top-3 z-20 flex items-center gap-2 rounded-xl bg-background/95 px-3.5 py-2 text-xs font-medium text-foreground shadow-lg backdrop-blur-md border border-border/60 hover:bg-emerald-50 hover:text-emerald-800 transition-all"
        >
          <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>Show List</span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">{filteredProducts.length} Varieties</span>
          </span>
          <span className="text-border">|</span>
          <span className="text-muted-foreground text-[11px]">Sarawak & Malaysia</span>
        </button>
      )}

      {/* 2. Main Leaflet Map Canvas */}
      <MapContainer 
        center={[2.5, 112.5]} 
        zoom={7} 
        scrollWheelZoom={false}
        zoomControl={false}
        className="h-full w-full outline-none" 
        style={{ zIndex: 1 }}
      >
        <ZoomControl position="bottomleft" />
        <FitBounds products={productsWithCoords} activeProductId={activeProductId} userLocation={userLocation} />
        
        <TileLayer 
          attribution='&copy; <a href="https://carto.com/">CARTO</a>' 
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
        />

        {/* User GPS location marker & accuracy radius circle */}
        {userLocation && (
          <>
            <Marker position={userLocation} />
            <Circle center={userLocation} radius={5000} pathOptions={{ color: '#047857', fillColor: '#10b981', fillOpacity: 0.15 }} />
          </>
        )}

        {productsWithCoords.map((product) => {
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
              <Popup className="rounded-xl overflow-hidden shadow-2xl border border-emerald-900/10">
                <article className="p-3 max-w-[220px] bg-card text-card-foreground">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    <p className="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold">
                      {product.brand?.brand_name}
                    </p>
                  </div>
                  <h3 className="text-sm font-display font-medium text-foreground leading-snug">
                    {product.product_name}
                  </h3>
                  {product.source!.location_address && (
                    <p className="mt-1.5 text-[11px] text-muted-foreground line-clamp-2">
                      {product.source!.location_address}
                    </p>
                  )}
                  <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between">
                    <Link 
                      href={`/registry/${product.id}`} 
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 transition-colors group/link"
                    >
                      {t("viewDetails")} 
                      <ArrowIcon className="transition-transform duration-200 group-hover/link:translate-x-1" />
                    </Link>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-semibold text-muted-foreground hover:text-emerald-700 underline"
                    >
                      Directions
                    </a>
                  </div>
                </article>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Floating Control Buttons */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleGetUserLocation}
          className="flex items-center gap-2 rounded-xl bg-background/90 px-3.5 py-2.5 text-xs font-medium text-foreground shadow-lg backdrop-blur-md border border-border/60 transition-all hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 active:scale-95"
          title="Find bakeries near your GPS location"
        >
          <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Near Me</span>
        </button>

        <button
          onClick={() => { setActiveProductId(null); setUserLocation(null); }}
          className="flex items-center gap-2 rounded-xl bg-background/90 px-3.5 py-2.5 text-xs font-medium text-foreground shadow-lg backdrop-blur-md border border-border/60 transition-all hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 active:scale-95"
          title="Reset map view"
        >
          <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          <span>Fit All</span>
        </button>
      </div>
    </div>
  )
}