import type { PropsWithChildren } from "react"

import { Card, CardHeader, CardTitle, CardContent } from "./card"

interface FormStepCardProps extends PropsWithChildren {
  title?: string
  sub?: string
}

export function FormStepCard({ children, title, sub }: FormStepCardProps) {
  return (
    <Card className="w-full max-w-full bg-transparent/20 p-6 animate-in slide-in-from-right-44 max-sm:p-2">
      <CardHeader className="max-sm:px-4">
        <CardTitle>{title}</CardTitle>
        <p className="text-xs italic">{sub}</p>
      </CardHeader>
      <CardContent className="w-full p-6 max-sm:p-4 md:min-w-[400px]">{children}</CardContent>
    </Card>
  )
}
