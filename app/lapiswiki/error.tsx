"use client"
import { useTranslations } from "next-intl"
import { EditorialErrorState } from "@/components/editorial-error-state"
export default function AboutError({ reset }: { error: Error; reset: () => void }) {
  const t = useTranslations("errors")
  return <EditorialErrorState title={t("aboutTitle")} description={t("aboutDescription")} reset={reset} />
}
