"use client"

import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import { Product } from "@/lib/types/db"

function MapLoading() {
  const t = useTranslations("common")
  return (
    <div className="flex h-full w-full animate-pulse items-center justify-center bg-muted" role="status">
      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{t("loadingMap")}</span>
    </div>
  )
}

interface HomeMapProps {
  products: Product[]
}

// Dynamically import the actual map component to avoid SSR issues
const HomeMapClient = dynamic(() => import("./home-map-client").then((mod) => mod.HomeMapClient), {
  ssr: false,
  loading: () => <MapLoading />,
})

export function HomeMap({ products }: HomeMapProps) {
  return <HomeMapClient products={products} />
}
