"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Props { 
  translations: { 
    index: string; 
    trigger: string; 
    title: string; 
    sweetnessTitle: string; 
    sweetnessDesc: string; 
    sweetnessLow: string; 
    sweetnessBalanced: string; 
    sweetnessRich: string; 
    moistureTitle: string; 
    moistureDesc: string; 
    moistureLight: string; 
    moistureStandard: string; 
    moistureDense: string; 
  } 
}

export function LapisMetricsHelp({ translations: t }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="group gap-2 rounded-xl text-muted-foreground transition-all duration-200 hover:bg-[#3B4D3C]/10 hover:text-[#3B4D3C] dark:hover:bg-[#8FA88E]/15 dark:hover:text-[#8FA88E]"
        >
          <span className="grid h-5 w-5 place-items-center rounded-full border border-current font-mono text-[10px] transition-transform duration-300 group-hover:scale-110">
            ?
          </span>
          <span className="font-medium">{t.trigger}</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-xl overflow-hidden rounded-3xl border border-[#3B4D3C]/20 bg-card/95 p-0 backdrop-blur-2xl shadow-2xl dark:border-[#8FA88E]/20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#3B4D3C]/5 via-transparent to-transparent pointer-events-none" />
        
        <DialogHeader className="relative border-b border-[#3B4D3C]/10 p-6 sm:p-8 pr-14 bg-gradient-to-r from-[#3B4D3C]/[0.03] to-transparent">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-[#3B4D3C] dark:text-[#8FA88E]">
            {t.index}
          </p>
          <DialogTitle className="mt-1 font-display text-2xl sm:text-3xl font-normal tracking-[-0.03em] text-foreground">
            {t.title}
          </DialogTitle>
        </DialogHeader>

        <div className="relative space-y-8 p-6 sm:p-8 text-sm max-h-[70vh] overflow-y-auto">
          <MetricHelp 
            index="01" 
            title={t.sweetnessTitle} 
            description={t.sweetnessDesc} 
            items={[t.sweetnessLow, t.sweetnessBalanced, t.sweetnessRich]} 
          />
          <MetricHelp 
            index="02" 
            title={t.moistureTitle} 
            description={t.moistureDesc} 
            items={[t.moistureLight, t.moistureStandard, t.moistureDense]} 
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

function MetricHelp({ index, title, description, items }: { index: string; title: string; description: string; items: string[] }) {
  return (
    <section className="group/sec grid gap-4 sm:grid-cols-[2.5rem_1fr] rounded-2xl p-4 sm:p-5 transition-colors duration-200 hover:bg-[#3B4D3C]/[0.02] border border-transparent hover:border-[#3B4D3C]/10">
      <span className="font-mono text-xs font-semibold text-[#3B4D3C] dark:text-[#8FA88E]">
        {index}
      </span>
      <div>
        <h3 className="text-base font-semibold tracking-tight text-foreground group-hover/sec:text-[#3B4D3C] dark:group-hover/sec:text-[#8FA88E] transition-colors">
          {title}
        </h3>
        <p className="mt-1.5 leading-relaxed text-muted-foreground">
          {description}
        </p>
        <ul className="mt-4 divide-y divide-[#3B4D3C]/10 border-y border-[#3B4D3C]/10 overflow-hidden rounded-xl bg-background/50">
          {items.map((item, i) => (
            <li key={item} className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-[#3B4D3C]/5">
              <span className="font-mono text-[10px] font-semibold text-[#3B4D3C] dark:text-[#8FA88E] bg-[#3B4D3C]/10 dark:bg-[#8FA88E]/15 px-2 py-0.5 rounded-md">
                0{i + 1}
              </span>
              <span className="text-foreground/90 font-medium text-xs sm:text-sm">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}