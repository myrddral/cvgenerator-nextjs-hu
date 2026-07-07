"use client"

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <h2>Váratlan hiba történt!</h2>
        <button onClick={() => reset()}>Vissza az oldalra</button>
      </body>
    </html>
  )
}
