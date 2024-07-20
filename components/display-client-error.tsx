"use client"
import MainContainer from "./main-container"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export interface ErrorDisplayProps {
  error: Error & { digest?: string }
  reset: () => void
}

export function DisplayClientError({ error, reset }: ErrorDisplayProps) {
  const handleErrorRecovery = () => reset()

  return (
    <div>
      <Card className="bg-transparent/30">
        <CardHeader>
          <CardTitle>Hiba történt :(</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-8">{error.message}</p>
          <Button onClick={handleErrorRecovery}>Vissza</Button>
        </CardContent>
      </Card>
    </div>
  )
}
