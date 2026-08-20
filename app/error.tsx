"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { EditorialErrorState } from "@/components/editorial-error-state"

export default function RootErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("errors")
  useEffect(() => { if (process.env.NODE_ENV === "production") console.error("Root error boundary caught:", error) }, [error])
  return <EditorialErrorState title={t("genericTitle")} description={t("genericDescription")} reset={reset} />
}
