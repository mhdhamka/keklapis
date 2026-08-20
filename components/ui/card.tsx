* as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }
>(({ className, interactive = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Modern base container with layered depth styling inspired by Kek Lapis
      "relative flex flex-col rounded-2xl border border-[#3B4D3C]/30 bg-gradient-to-b from-[#253324] via-[#1F2A1E] to-[#1A2419] text-[#E2E8E0] shadow-xl shadow-black/20 overflow-hidden backdrop-blur-xl transition-all duration-300",
      interactive && "hover:-translate-y-1.5 hover:border-[#789477] hover:shadow-[0_20px_40px_-12px_rgba(59,77,60,0.3)] cursor-pointer group",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Top cake layer (header section with distinct slight lighter tint and border)
      "flex flex-col space-y-1.5 p-6 sm:p-7 bg-[#253324]/80 border-b border-[#3B4D3C]/50 transition-colors group-hover:bg-[#2B3B2A]/80",
      className
    )}
    {>
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-xl sm:text-2xl font-semibold leading-none tracking-tight text-white",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-[#A3B3A1] leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      // Middle cake layer content area
      "p-6 sm:p-7 bg-[#1F2A1E] border-b border-[#3B4D3C]/30 text-[#C2D1C0]", 
      className
    )} 
    {...props} 
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Bottom cake layer footer slice
      "flex items-center p-5 sm:p-6 bg-[#1A2419] text-[#8FA88E] transition-colors group-hover:bg-[#222E21]",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }