"use client"

import { useState, type ImgHTMLAttributes } from "react"

interface SafeImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "onError"> {
  src: string
  alt: string
  fallback?: string
}

export function SafeImage({
  src,
  alt,
  fallback = "/placeholder.svg",
  width = 1200,
  height = 1200,
  loading = "lazy",
  ...props
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src)

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      onError={() => setCurrentSrc(fallback)}
      {...props}
    />
  )
}