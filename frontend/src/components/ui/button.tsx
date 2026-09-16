import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils.js";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded font-sans text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary-container text-surface hover:bg-primary transition-all duration-200",
        destructive:
          "bg-error text-on-error hover:bg-error/90",
        outline:
          "border border-outline-variant/60 bg-transparent text-on-surface hover:bg-surface-container hover:text-primary",
        secondary:
          "bg-surface-container text-secondary hover:bg-surface-container-high hover:text-primary",
        ghost: "hover:bg-surface-container-high hover:text-primary text-on-surface-variant",
        link: "text-primary underline-offset-4 hover:underline",
        dashed: "border border-dashed border-outline text-secondary hover:text-primary hover:border-primary hover:bg-surface-container-low transition-all duration-200",
        tone: "bg-surface-container-lowest text-primary shadow-sm font-medium",
      },
      size: {
        default: "h-9 px-4 py-2 text-label-md",
        sm: "h-8 rounded px-3 text-label-sm",
        lg: "h-11 rounded px-8 text-label-lg",
        icon: "h-9 w-9 p-1.5",
        iconSm: "h-8 w-8 p-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
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
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
