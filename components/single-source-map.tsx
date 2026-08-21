"use client"

import { useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Modernized emerald moss pin matching the main map
const kekLapisIcon = new L.Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='40' viewBox='0 0 32 40'%3E%3Cpath fill='%23047857' d='M16 0C7.16 0 0 7.16 0 16c0 11 16 24 16 24s16-13 16-24C32 7.16 24.84 0 16 0Z'/%3E%3Ccircle cx='16' cy='16' r='6' fill='%23a7f3d0'/%3E%3C/svg%3E",
  iconSize: [32, 40], 
  iconAnchor: [16, 40], 
  popupAnchor: [0, -36],
})

export function SingleSourceMap({ 
  lat, 
  lng, 
  sourceName, 
  locationAddress, 
  height = "500px" 
}: { 
  lat: number; 
  lng: number; 
  sourceName?: string | null; 
  locationAddress?: string | null; 
  height?: string 
}) {
  const t = useTranslations("map")
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => setMounted(true), [])
  
  const numLat = Number(lat)
  const numLng = Number(lng)

  const markerIcon = useMemo(() => kekLapisIcon, [])

  if (!mounted) {
    return (
      <div className="grid w-full animate-pulse place-items-center border-t border-border bg-muted" style={{ height }} role="status">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{t("loadingMap")}</p>
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-hidden border-t border-border group" style={{ height }} role="region" aria-label={t("title")}>
      <MapContainer 
        center={[numLat, numLng]} 
        zoom={15} 
        zoomControl={false}
        style={{ height: "100%", width: "100%" }} 
        scrollWheelZoom={false}
        className="outline-none"
      >
        <ZoomControl position="bottomleft" />
        
        <TileLayer 
          attribution='&copy; <a href="https://carto.com/">CARTO</a>' 
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
        />

        <Marker position={[numLat, numLng]} icon={markerIcon}>
          <Popup className="rounded-xl overflow-hidden shadow-2xl border border-emerald-900/10">
            <article className="p-3 max-w-[220px] bg-card text-card-foreground">
              {sourceName && (
                <>
                  <div className="flex items-center gap-1.5 mb-1">
                    <p className="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold">
                      Location
                    </p>
                  </div>
                  <h3 className="text-sm font-display font-medium text-foreground leading-snug">
                    {sourceName}
                  </h3>
                </>
              )}

              {locationAddress && (
                <p className="mt-1.5 text-[11px] text-muted-foreground line-clamp-2">
                  {locationAddress}
                </p>
              )}

              <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted-foreground">
                  {numLat.toFixed(5)}, {numLng.toFixed(5)}
                </span>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${numLat},${numLng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 underline"
                >
                  Directions
                </a>
              </div>
            </article>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}