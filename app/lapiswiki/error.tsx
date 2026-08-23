"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { EditorialErrorState } from "@/components/editorial-error-state"

interface AboutErrorProps {
  error: Error & { digest?: string; status?: number }
  reset: () => void
}

export default function AboutError({ error, reset }: AboutErrorProps) {
  const t = useTranslations("errors")

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      console.error("About section error boundary caught:", error)
    }
  }, [error])

  const statusCode = error.status || (error.message.includes("404") ? 404 : error.message.includes("500") ? 500 : undefined)

  let title = t("aboutTitle", { fallback: "About Section Error" })
  let description = t("aboutDescription", { fallback: "We encountered an issue loading the about information. Please try again." })

  if (statusCode === 404) {
    title = t("notFoundTitle", { fallback: "Page Not Found" })
    description = t("notFoundDescription", { fallback: "The about page or resource you are looking for could not be found." })
  }

  return (
    <main className="min-h-[60vh] bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <EditorialErrorState 
          title={title} 
          description={description} 
          reset={reset} 
        />
        {error.digest && (
          <p className="mt-4 text-center font-mono text-[10px] text-muted-foreground/60">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </main>
  )
}