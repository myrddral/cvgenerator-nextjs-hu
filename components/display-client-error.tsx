"use client"
import { Button } from "./ui/button"

export interface ErrorDisplayProps {
  error: Error & { digest?: string }
  reset: () => void
}

export function DisplayClientError({ error, reset }: ErrorDisplayProps) {
  const handleErrorRecovery = () => reset()

  return (
    <main className="flex-center container min-h-main gap-8">
      <div>
        <h3 className="text-lg font-semibold">Hiba történt :(</h3>
        <p className="">{error.message}</p>
      </div>
      <Button onClick={handleErrorRecovery}>Vissza</Button>
    </main>
  )
}
