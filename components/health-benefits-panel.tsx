"use client"

import { useTranslations } from "next-intl"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts"
import { PanelHeading, RegistryGlyph } from "@/components/editorial-primitives"

interface Mineral { name: string; symbol?: string; amount: number; unit?: string }
interface Props { minerals: Mineral[]; phLevel?: number | null; tds?: number | null; productName: string }

export function HealthBenefitsPanel({ minerals, phLevel, tds, productName }: Props) {
  const t = useTranslations("healthPanel")
  let score = 5
  if (phLevel != null) score += phLevel >= 6.5 && phLevel <= 8.5 ? 2 : phLevel >= 6 && phLevel <= 9 ? 1 : 0
  if (tds != null) score += tds >= 50 && tds <= 150 ? 2 : tds >= 30 && tds <= 300 ? 1 : 0
  if (minerals.length >= 8) score += 1
  else if (minerals.length >= 5) score += 0.5
  for (const key of ["calcium", "magnesium", "potassium"]) if (minerals.some((mineral) => mineral.name.toLowerCase().includes(key))) score += 0.5
  const wellnessScore = Math.min(10, Math.max(1, Math.round(score * 10) / 10))

  const radarData = [
    { category: t("phBalance"), value: phLevel != null ? phLevel >= 6.5 && phLevel <= 8.5 ? 90 : phLevel >= 6 && phLevel <= 9 ? 70 : 50 : 50 },
    { category: t("mineralRichness"), value: Math.min(100, (minerals.length / 10) * 100) },
    { category: t("purity"), value: tds != null ? tds >= 50 && tds <= 150 ? 90 : tds >= 30 && tds <= 300 ? 70 : 50 : 50 },
  ]

  const categories = [
    { id: "bone", title: t("categoryBone"), benefits: [] as string[] },
    { id: "heart", title: t("categoryHeart"), benefits: [] as string[] },
    { id: "muscle", title: t("categoryMuscle"), benefits: [] as string[] },
    { id: "hydration", title: t("categoryHydration"), benefits: [] as string[] },
    { id: "brain", title: t("categoryNervous"), benefits: [] as string[] },
    { id: "immune", title: t("categoryImmune"), benefits: [] as string[] },
  ]

  for (const mineral of minerals) {
    const name = mineral.name.toLowerCase()
    if (name.includes("calcium")) { categories[0].benefits.push(t("calciumBones", { amount: mineral.amount })); categories[1].benefits.push(t("calciumHeart")) }
    if (name.includes("magnesium")) { categories[2].benefits.push(t("magnesiumEnergy", { amount: mineral.amount })); categories[4].benefits.push(t("magnesiumNervous")) }
    if (name.includes("potassium")) { categories[1].benefits.push(t("potassiumHeart", { amount: mineral.amount })); categories[3].benefits.push(t("potassiumFluid")) }
    if (name.includes("sodium")) { categories[3].benefits.push(t("sodiumFluid", { amount: mineral.amount })); categories[4].benefits.push(t("sodiumNervous")) }
    if (name.includes("bicarbonate")) categories[3].benefits.push(t("bicarbonateBuffering"))
    if (name.includes("silica")) categories[0].benefits.push(t("silicaTissue"))
    if (name.includes("fluoride")) categories[0].benefits.push(t("fluorideTeeth", { amount: mineral.amount }))
    if (name.includes("zinc")) categories[5].benefits.push(t("zincImmune", { amount: mineral.amount }))
    if (name.includes("iron")) categories[2].benefits.push(t("ironOxygen"))
  }
  if (phLevel != null && phLevel >= 6.5 && phLevel <= 8.5) categories[3].benefits.push(t("phCommonRange", { ph: phLevel }))
  const activeCategories = categories.filter((category) => category.benefits.length > 0)

  const highlights: { text: string; benefit: string }[] = []
  if (minerals.some((mineral) => mineral.name.toLowerCase().includes("calcium") && mineral.amount > 20)) highlights.push({ text: t("highCalcium"), benefit: t("highCalciumBenefit") })
  if (minerals.some((mineral) => mineral.name.toLowerCase().includes("magnesium") && mineral.amount > 10)) highlights.push({ text: t("richMagnesium"), benefit: t("richMagnesiumBenefit") })
  if (phLevel != null && phLevel >= 7.5 && phLevel <= 8.5) highlights.push({ text: t("alkalineWater"), benefit: t("alkalineWaterBenefit") })
  if (minerals.length >= 8) highlights.push({ text: t("mineralRich"), benefit: t("mineralRichBenefit") })

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="grid gap-6 border-b border-border p-6 sm:grid-cols-[1fr_auto] sm:items-start sm:p-8">
        <PanelHeading index="05" title={t("title")} description={t("description", { productName })} />
        <div className="border-t border-border pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0"><span className="font-display text-6xl leading-none tracking-[-0.04em] tabular-nums">{wellnessScore}</span><p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{t("wellnessScore")}</p></div>
      </div>

      <div className="space-y-10 p-6 sm:p-8">
        <div className="rounded-lg border border-border bg-bone p-4">
          <p className="section-index text-center">{t("waterQualityProfile")}</p>
          <div aria-hidden="true"><ResponsiveContainer width="100%" height={260}><RadarChart data={radarData}><PolarGrid stroke="hsl(var(--border))" /><PolarAngleAxis dataKey="category" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} /><PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} /><Radar name={t("qualityScore")} dataKey="value" stroke="#66765a" fill="#66765a" fillOpacity={0.32} /></RadarChart></ResponsiveContainer></div>
          <ul className="sr-only">{radarData.map((item) => <li key={item.category}>{item.category}: {Math.round(item.value)} / 100</li>)}</ul>
        </div>

        {highlights.length > 0 && <div className="grid gap-3 sm:grid-cols-2">{highlights.map((highlight, index) => <article key={highlight.text} className="rounded-lg border border-border bg-source-pale p-5"><span className="font-mono text-[10px] text-source-foreground">0{index + 1}</span><h3 className="mt-4 text-sm font-semibold text-source-foreground">{highlight.text}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{highlight.benefit}</p></article>)}</div>}

        {activeCategories.length > 0 && <div><h3 className="font-display text-3xl tracking-[-0.03em]">{t("healthBenefitsTitle")}</h3><Accordion type="single" collapsible className="mt-5 w-full">{activeCategories.map((category, index) => <AccordionItem key={category.id} value={category.id} className="border-border"><AccordionTrigger className="py-5 hover:no-underline"><span className="flex items-center gap-3 text-left"><span className="font-mono text-[10px] text-muted-foreground">0{index + 1}</span><span className="font-medium">{category.title}</span><span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">{category.benefits.length}</span></span></AccordionTrigger><AccordionContent><ul className="space-y-2 pb-3 pl-7">{category.benefits.map((benefit) => <li key={benefit} className="border-l border-border pl-4 text-sm leading-6 text-muted-foreground">{benefit}</li>)}</ul></AccordionContent></AccordionItem>)}</Accordion></div>}

        <aside className="flex items-start gap-3 border-t border-border pt-5"><RegistryGlyph kind="info" className="h-8 w-8" /><p className="max-w-3xl text-xs leading-5 text-muted-foreground">{t("disclaimer")}</p></aside>
      </div>
    </section>
  )
}
