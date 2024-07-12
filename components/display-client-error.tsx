"use client"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export interface ErrorDisplayProps {
  error: Error & { digest?: string }
  reset: () => void
}

export function DisplayClientError({ error, reset }: ErrorDisplayProps) {
  const handleErrorRecovery = () => reset()

  return (
    <main className="flex-center container min-h-main gap-8">
      <Card className="bg-transparent/30">
        <CardHeader>
          <CardTitle>Hiba történt :(</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-8">{error.message}</p>
          <Button onClick={handleErrorRecovery}>Vissza</Button>
        </CardContent>
      </Card>
    </main>
  )
}
