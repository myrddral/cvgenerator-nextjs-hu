import type { PropsWithChildren } from "react"

import { Card, CardHeader, CardTitle, CardContent } from "./card"

interface FormStepCardProps extends PropsWithChildren {
  title?: string
}

export function FormStepCard({ children, title }: FormStepCardProps) {
  return (
    <Card className="p-6 animate-in slide-in-from-right-44 max-sm:p-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="w-full p-6 max-sm:p-4">{children}</CardContent>
    </Card>
  )
}
