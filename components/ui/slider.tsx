"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  thumbLabels?: string[]
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, thumbLabels, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center py-2",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2.5 w-full grow overflow-hidden rounded-full bg-secondary/80 shadow-inner">
      {/* Green Lumut Track Range */}
      <SliderPrimitive.Range className="absolute h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-150" />
    </SliderPrimitive.Track>
    
    {(props.value || props.defaultValue || [0]).map((_, i) => (
      <SliderPrimitive.Thumb
        key={i}
        aria-label={thumbLabels?.[i]}
        className={cn(
          "block h-5 w-5 rounded-full border-2 border-emerald-700 bg-background shadow-md",
          "ring-offset-background transition-all duration-200",
          "hover:scale-110 active:scale-95",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30",
          "disabled:pointer-events-none disabled:opacity-50"
        )}
      />
    ))}
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }