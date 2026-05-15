// components/ui/textarea.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[120px] w-full rounded-sm border border-hairline bg-canvas px-4 py-3 font-body text-sm",
        "text-ink placeholder:text-muted-slate",
        "focus-visible:outline-none focus-visible:border-focus-violet focus-visible:ring-2 focus-visible:ring-focus-violet/40",
        "disabled:cursor-not-allowed disabled:opacity-50 resize-y",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export { Textarea };
