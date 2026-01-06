import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono text-sm font-bold uppercase tracking-wider transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none",
  {
    variants: {
      variant: {
        default:
          "text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-105",
        destructive:
          "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]",
        outline:
          "border-2 border-cyan-500/50 text-cyan-400 bg-transparent hover:bg-cyan-500/10 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]",
        secondary:
          "bg-slate-800/80 text-slate-300 border border-slate-700/50 hover:bg-slate-700/80 hover:text-white",
        ghost:
          "text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50",
        link: 
          "text-cyan-400 underline-offset-4 hover:underline hover:text-cyan-300",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  style,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  // Mecha chamfered corners clip-path
  const mechaClipPath = "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)"
  
  // Gradient background for default variant
  const defaultStyle = variant === "default" || variant === undefined
    ? { 
        background: "linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)",
        clipPath: mechaClipPath,
        ...style 
      }
    : { clipPath: mechaClipPath, ...style }

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      style={defaultStyle}
      {...props}
    />
  )
}

export { Button, buttonVariants }
