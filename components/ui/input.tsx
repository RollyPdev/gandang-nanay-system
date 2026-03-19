import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-2xl border border-white/70 bg-white/75 px-4 py-2 text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] transition outline-none placeholder:text-muted-foreground/90 focus-visible:border-amber-300 focus-visible:ring-4 focus-visible:ring-amber-200/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
