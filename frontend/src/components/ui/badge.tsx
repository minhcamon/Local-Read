import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils.js";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold font-sans transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary-container text-surface",
        secondary:
          "border-transparent bg-secondary-container text-on-secondary-container",
        destructive:
          "border-transparent bg-error-container text-on-error-container",
        outline: "text-on-surface border border-outline-variant",
        quiet: "bg-surface-container text-secondary text-[11px] font-normal border border-outline-variant/30",
        moss: "bg-primary-fixed text-on-primary-fixed font-medium text-[11px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
