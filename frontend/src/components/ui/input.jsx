import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-slate-600 bg-slate-950/30 px-2.5 py-1 text-base text-slate-100 transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-100 placeholder:text-slate-400 focus-visible:border-violet-400 focus-visible:ring-3 focus-visible:ring-violet-400/40 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-slate-800/50 disabled:opacity-50 aria-invalid:border-red-400 aria-invalid:ring-3 aria-invalid:ring-red-400/20 md:text-sm",
        className
      )}
      {...props} />
  );
}

export { Input }
