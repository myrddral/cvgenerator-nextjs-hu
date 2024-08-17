import { forwardRef } from "react"
import type { ButtonProps } from "./button"

import { Button } from "./button"

export interface IconButtonProps extends ButtonProps {
  icon: React.ReactNode
  text: string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({ icon, text, ...props }, ref) => {
  return (
    <Button ref={ref} className="pl-0" {...props}>
      <div className="flex-center mr-1 h-full max-h-8 w-full max-w-8">{icon}</div>
      {text}
    </Button>
  )
})

IconButton.displayName = "IconButton"
