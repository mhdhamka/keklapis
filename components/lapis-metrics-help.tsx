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
    richnessDriTitle: string; 
    richnessDriDesc: string; 
    richnessDriLevel1: string; 
    richnessDriLevel2: string; 
    richnessDriLevel3: string; 
  } 
}

export function LapisMetricsHelp({ translations: t }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="group relative gap-2.5 rounded-xl px-3.5 text-muted-foreground transition-all duration-300 hover:bg-[#3B4D3C]/10 hover:text-[#3B4D3C] dark:hover:bg-[#8FA88E]/15 dark:hover:text-[#8FA88E] shadow-sm hover:shadow"
        >
          <span className="grid h-5 w-5 place-items-center rounded-full border border-current font-mono text-[10px] transition-transform duration-300 group-hover:scale-110">
            ?
          </span>
          <span className="font-medium tracking-wide">{t.trigger}</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-xl overflow-hidden rounded-[2.5rem] border border-[#3B4D3C]/20 bg-card/95 p-0 backdrop-blur-2xl shadow-2xl dark:border-[#8FA88E]/20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#3B4D3C]/5 via-transparent to-transparent pointer-events-none" />
        
        <DialogHeader className="relative border-b border-[#3B4D3C]/10 p-6 sm:p-8 pr-14 bg-gradient-to-r from-[#3B4D3C]/[0.04] to-transparent">
          <div className="flex items-center gap-2">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3B4D3C] dark:text-[#8FA88E]">
              {t.index}
            </p>
          </div>
          <DialogTitle className="mt-1 font-display text-2xl sm:text-3xl font-normal tracking-[-0.03em] text-foreground">
            {t.title}
          </DialogTitle>
        </DialogHeader>

        <div className="relative space-y-4 p-6 sm:p-8 text-sm max-h-[70vh] overflow-y-auto custom-scrollbar">
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
          <MetricHelp 
            index="03" 
            title={t.richnessDriTitle} 
            description={t.richnessDriDesc} 
            items={[t.richnessDriLevel1, t.richnessDriLevel2, t.richnessDriLevel3]} 
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

function MetricHelp({ index, title, description, items }: { index: string; title: string; description: string; items: string[] }) {
  return (
    <section className="group/sec relative overflow-hidden rounded-2xl border border-[#3B4D3C]/10 bg-background/40 p-4 sm:p-5 transition-all duration-300 hover:border-[#3B4D3C]/30 hover:bg-[#3B4D3C]/[0.03] hover:shadow-lg hover:shadow-[#3B4D3C]/[0.02]">
      <div className="grid gap-4 sm:grid-cols-[2.5rem_1fr]">
        <span className="font-mono text-xs font-bold text-[#3B4D3C] dark:text-[#8FA88E] flex items-start pt-0.5">
          {index}
        </span>
        <div>
          <h3 className="text-base font-semibold tracking-tight text-foreground group-hover/sec:text-[#3B4D3C] dark:group-hover/sec:text-[#8FA88E] transition-colors">
            {title}
          </h3>
          <p className="mt-1 leading-relaxed text-muted-foreground text-xs sm:text-sm">
            {description}
          </p>
          <ul className="mt-4 grid gap-2">
            {items.map((item, i) => (
              <li 
                key={item} 
                className="group/item flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-card/60 px-4 py-3 transition-all duration-200 hover:border-[#3B4D3C]/20 hover:bg-[#3B4D3C]/5 hover:translate-x-1"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] font-semibold text-[#3B4D3C] dark:text-[#8FA88E] bg-[#3B4D3C]/10 dark:bg-[#8FA88E]/15 px-2 py-0.5 rounded-md transition-transform group-hover/item:scale-105">
                    0{i + 1}
                  </span>
                  <span className="text-foreground/90 font-medium text-xs sm:text-sm">
                    {item}
                  </span>
                </div>
                {/* Interactive Level Meter Bar */}
                <div className="flex items-center gap-1 opacity-40 group-hover/item:opacity-100 transition-opacity">
                  <div className={`h-1 rounded-full transition-all duration-300 bg-[#3B4D3C] dark:bg-[#8FA88E] ${i === 0 ? 'w-4' : i === 1 ? 'w-8' : 'w-12'}`} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}