// components/ui/input.tsx
// Rectangular input with thin gray border, 12-16px padding — per `contact-form-card` in design.md.
import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-11 w-full rounded-sm border border-hairline bg-canvas px-4 py-3 font-body text-sm",
        "text-ink placeholder:text-muted-slate",
        "focus-visible:outline-none focus-visible:border-focus-violet focus-visible:ring-2 focus-visible:ring-focus-violet/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
