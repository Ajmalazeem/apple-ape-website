// components/ui/button.tsx
// shadcn Button adapted to design.md tokens.
//  - `primary`  → near-black pill CTA, the doc's `button-primary`
//  - `secondary`→ underlined text link, the doc's `button-secondary`
//  - `outline`  → outlined pill (`button-pill-outline`) used for filters/tags
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-body text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-blue focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
  {
    variants: {
      variant: {
        // 14-16px Unica77, 12px 24px padding, 32px pill radius — per design.md
        primary:
          "bg-near-black text-canvas rounded-pill px-6 py-3 hover:bg-near-black/90",
        // Text-only action link; underline on hover
        secondary:
          "text-ink underline-offset-4 hover:underline px-1 py-1 rounded-xs",
        // Outlined pill, 30px radius, transparent fill, 1px dark border
        outline:
          "border border-ink bg-transparent text-ink rounded-xl px-5 py-2 hover:bg-ink hover:text-canvas",
        // Ghost — for nav links and subtle controls
        ghost:
          "text-ink hover:bg-soft-stone rounded-sm px-3 py-2",
        destructive:
          "bg-error-red text-canvas rounded-pill px-6 py-3 hover:bg-error-red/90",
      },
      size: {
        default: "h-11",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10 p-0 rounded-full",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
