import type { VariantProps } from "class-variance-authority"
import type { ButtonHTMLAttributes } from "react"

import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { forwardRef } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-black/30 !text-shadow-sm",
        destructive: "bg-danger text-destructive-foreground shadow-sm",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        picker:
          "border border-input bg-transparent/30 text-primary-foreground shadow-sm hover:border-ring hover:text-accent-foreground",
        navPrev: "relative bg-primary text-primary-foreground shadow-black/30 !text-shadow-sm",
        navNext: "relative bg-primary text-primary-foreground shadow-black/30 !text-shadow-sm",
      },
      size: {
        default: "h-9 min-w-28 px-4 py-2 text-sm",
        sm: "h-8 min-w-24 px-3 text-xs",
        lg: "h-10 min-w-36 px-8",
        icon: "h-9 w-9 rounded-full text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        {variant === "navPrev" && (
          <ChevronLeftIcon className="absolute left-8 transform opacity-0 transition-transform duration-300 ease-out group-hover:translate-x-[-0.875rem] group-hover:opacity-100" />
        )}
        {props.children}
        {variant === "navNext" && (
          <ChevronRightIcon className="absolute right-8 transform opacity-0 transition-transform duration-300 ease-out group-hover:translate-x-3.5 group-hover:opacity-100" />
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
