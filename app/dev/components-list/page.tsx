import ButtonsShowcase from "@/components/showcase/buttons-showcase"
import { Card, CardContent } from "@/components/ui/card"

export default function ComponentsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <section className="container">
        <h1 className="mb-8 text-center font-display text-3xl font-bold leading-none tracking-wider">
          Komponenslista
        </h1>
        <p className="text-center text-lg">Itt találod az összes komponenst, amit a projekt tartalmaz.</p>
        <p className="text-center text-sm italic text-muted-foreground">(bővítés alatt)</p>
      </section>
      <section className="container gap-8 pt-8">
        <Card className="bg-transparent/30">
          <CardContent>
            <ButtonsShowcase />
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
