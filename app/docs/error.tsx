"use client"
import { useTranslations } from "next-intl"
import { EditorialErrorState } from "@/components/editorial-error-state"
export default function DocsError({ reset }: { error: Error; reset: () => void }) {
  const t = useTranslations("errors")
  return <EditorialErrorState title={t("docsTitle")} description={t("docsDescription")} reset={reset} />
}
