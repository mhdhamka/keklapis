"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, useMap, useMapEvents, ZoomControl } from "react-leaflet"
import { Icon } from "leaflet"
import "leaflet/dist/leaflet.css"

// Modernized emerald moss pin matching the directory design
const kekLapisIcon = new Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='40' viewBox='0 0 32 40'%3E%3Cpath fill='%23047857' d='M16 0C7.16 0 0 7.16 0 16c0 11 16 24 16 24s16-13 16-24C32 7.16 24.84 0 16 0Z'/%3E%3Ccircle cx='16' cy='16' r='6' fill='%23a7f3d0'/%3E%3C/svg%3E",
  iconSize: [32, 40], 
  iconAnchor: [16, 40], 
  popupAnchor: [0, -36],
})

// Component to handle map clicks and update coordinates
function LocationPicker({ 
  onCoordinatesChange 
}: { 
  onCoordinatesChange: (coords: { lat: number; lng: number }) => void 
}) {
  useMapEvents({
    click(e) {
      onCoordinatesChange({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      })
    },
  })
  return null
}

// Component to handle smooth repositioning when coordinates change externally
function MapFlyTo({ coordinates }: { coordinates: { lat: number; lng: number } | null }) {
  const map = useMap()

  useEffect(() => {
    if (coordinates) {
      map.flyTo([coordinates.lat, coordinates.lng], 14, { duration: 1.2 })
    }
  }, [map, coordinates])

  return null
}

interface ContributionMapProps {
  coordinates: { lat: number; lng: number } | null
  onCoordinatesChange: (coords: { lat: number; lng: number }) => void
}

export default function ContributionMap({ coordinates, onCoordinatesChange }: ContributionMapProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Prevent server-side rendering execution
  if (!isMounted) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted/20 text-xs text-muted-foreground animate-pulse">
        Loading map canvas...
      </div>
    )
  }

  // Default fallback center to Kuching, Sarawak
  const defaultCenter: [number, number] = [1.5533, 110.3592]
  const center: [number, number] = coordinates ? [coordinates.lat, coordinates.lng] : defaultCenter

  return (
    <div className="relative h-full w-full flex rounded-xl overflow-hidden border border-border/60 shadow-inner group" role="region" aria-label="Contribution Location Map">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={false}
        zoomControl={false}
        className="h-full w-full outline-none" 
        style={{ zIndex: 1 }}
      >
        <ZoomControl position="bottomleft" />
        <LocationPicker onCoordinatesChange={onCoordinatesChange} />
        <MapFlyTo coordinates={coordinates} />
        
        <TileLayer 
          attribution='&copy; <a href="https://carto.com/">CARTO</a>' 
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
        />

        {coordinates && (
          <Marker 
            position={[coordinates.lat, coordinates.lng]} 
            icon={kekLapisIcon}
          />
        )}
      </MapContainer>
    </div>
  )
}