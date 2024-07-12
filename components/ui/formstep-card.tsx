import type { PropsWithChildren } from "react"

import { Card, CardHeader, CardTitle, CardContent } from "./card"
import { cn } from "@/lib/utils"

interface FormStepCardProps extends PropsWithChildren {
  title?: string
  sub?: string
  className?: string
}

export function FormStepCard({ children, title, sub, className }: FormStepCardProps) {
  return (
    <Card
      className={cn(
        "w-full max-w-full bg-transparent/30 p-6 animate-in slide-in-from-right-44 max-sm:p-2",
        className
      )}
    >
      <CardHeader className="max-sm:px-4">
        <CardTitle>{title}</CardTitle>
        <p className="text-xs italic">{sub}</p>
      </CardHeader>
      <CardContent className="w-full p-6 max-sm:p-4 md:min-w-[400px]">{children}</CardContent>
    </Card>
  )
}
