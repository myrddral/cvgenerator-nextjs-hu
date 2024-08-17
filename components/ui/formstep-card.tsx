import type { PropsWithChildren } from "react"

import { Card, CardHeader, CardTitle, CardContent, CardSubtitle } from "./card"
import { cn } from "@/lib/utils"

interface FormStepCardProps extends PropsWithChildren {
  title?: string
  sub?: string
  className?: string
}

export function FormStepCard({ children, title, sub, className }: FormStepCardProps) {
  return (
    <Card className={cn("w-full p-6 animate-in slide-in-from-right-44 max-sm:p-2", className)}>
      <CardHeader className="max-sm:px-4">
        <CardTitle>{title}</CardTitle>
        <CardSubtitle>{sub}</CardSubtitle>
      </CardHeader>
      <CardContent className="w-full p-6 max-sm:p-4 md:min-w-[400px]">{children}</CardContent>
    </Card>
  )
}
