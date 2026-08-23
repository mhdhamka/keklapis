"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { EditorialErrorState } from "@/components/editorial-error-state"

interface ErrorBoundaryProps {
  error: Error & { digest?: string; status?: number }
  reset: () => void
}

export default function RootErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  const t = useTranslations("errors")

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      console.error("Root error boundary caught:", error)
    }
  }, [error])

  // Determine specific status or error type to show tailored messaging
  const statusCode = error.status || (error.message.includes("404") ? 404 : error.message.includes("500") ? 500 : undefined)

  let title = t("genericTitle")
  let description = t("genericDescription")

  if (statusCode === 404) {
    title = t("notFoundTitle", { fallback: "Page Not Found" })
    description = t("notFoundDescription", { fallback: "The resource or page you are looking for could not be found." })
  } else if (statusCode === 500 || error.digest) {
    title = t("serverErrorTitle", { fallback: "Something Went Wrong" })
    description = t("serverErrorDescription", { fallback: "An unexpected server error occurred. Please try again later." })
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <EditorialErrorState 
          title={title} 
          description={description} 
          reset={reset} 
        />
        {/* Optional fallback code / digest indicator for debugging */}
        {error.digest && (
          <p className="mt-4 text-center font-mono text-[10px] text-muted-foreground/60">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </main>
  )
}