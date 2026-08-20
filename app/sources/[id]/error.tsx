"use client"
import { useTranslations } from "next-intl"
import { EditorialErrorState } from "@/components/editorial-error-state"
export default function SourceError({ reset }: { error: Error; reset: () => void }) {
  const t = useTranslations("errors")
  return <EditorialErrorState title={t("sourceTitle")} description={t("sourceDescription")} reset={reset} backHref="/#sources" backLabel={t("backSources")} />
}
