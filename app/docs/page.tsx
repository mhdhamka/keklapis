"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import "swagger-ui-react/swagger-ui.css"
import { ArrowIcon, PageIntro } from "@/components/editorial-primitives"

export default function ApiDocsPage() {
  const [mounted, setMounted] = useState(false)
  const t = useTranslations("docsPage")
  const nav = useTranslations("nav")
  useEffect(() => setMounted(true), [])

  return (
    <main id="main-content" className="api-docs min-h-screen bg-bone">
      <PageIntro index="API / v1" title={t("title")} description={t("description")}>
        <div className="mt-6 flex flex-wrap gap-5"><Link href="/" className="text-link"><ArrowIcon direction="left" />{nav("home")}</Link><a href="/api/openapi" className="text-link">{t("openApiJson")}<ArrowIcon direction="up-right" /></a></div>
      </PageIntro>
      <div className="mx-auto max-w-[88rem] px-3 py-8 sm:px-8 sm:py-12 lg:px-12">
        {!mounted ? <DocsSkeleton label={t("loading")} /> : <SwaggerRenderer />}
      </div>
    </main>
  )
}

function SwaggerRenderer() {
  const SwaggerUIComponent = require("swagger-ui-react").default
  return <div className="overflow-hidden rounded-xl border border-border bg-card p-2 sm:p-5"><SwaggerUIComponent url="/api/openapi" /></div>
}

function DocsSkeleton({ label }: { label: string }) {
  return <div className="space-y-4 rounded-xl border border-border bg-card p-6" aria-busy="true"><p className="sr-only" role="status">{label}</p><div className="h-10 w-56 animate-pulse rounded-md bg-muted" /><div className="h-24 animate-pulse rounded-md bg-muted" /><div className="h-24 animate-pulse rounded-md bg-muted" /></div>
}
