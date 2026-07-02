import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Logo from "./ui/logo"
import { HelpButton } from "./help-button"

export default function StarterCard() {
  return (
    <Card className="max-w-96">
      <CardContent className="flex flex-col items-center p-20 max-sm:p-16">
        <>
          <Logo className="w-56" />
          <h3 className="mt-2 font-semibold">Önéletrajz generátor</h3>
          <Link href="/create">
            <Button size="lg" variant="navNext" className="group relative mb-1 mt-12">
              KEZDÉS
            </Button>
          </Link>
          <HelpButton />
        </>
      </CardContent>
    </Card>
  )
}
