"use client"

import { useState, useEffect } from "react"

export function GuideActions() {
  const [copied, setCopied] = useState(false)
  const [progress, setProgress] = useState(0)

  // Track reading progress bar
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {/* Top Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-emerald-600 z-[100] transition-all duration-150"
        style={{ width: `${progress}%` }}
      />

      <button
        onClick={handleCopyLink}
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-all cursor-pointer shadow-sm"
        title="Copy link to article"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        {copied ? "Copied Link!" : "Share Guide"}
      </button>
    </>
  )
}