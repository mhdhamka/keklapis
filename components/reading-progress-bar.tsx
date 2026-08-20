"use client"

import { useState, useEffect } from "react"

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateScrollProgress = () => {
      const currentScroll = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight > 0) {
        setProgress(Number((currentScroll / scrollHeight) * 100))
      }
    }

    window.addEventListener("scroll", updateScrollProgress, { passive: true })
    return () => window.removeEventListener("scroll", updateScrollProgress)
  }, [])

  return (
    <div 
      className="fixed top-0 left-0 h-1 bg-emerald-600 z-[100] transition-all duration-150"
      style={{ width: `${progress}%` }}
    />
  )
}