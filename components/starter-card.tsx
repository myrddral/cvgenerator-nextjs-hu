import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Logo from "./ui/logo"

export default function StarterCard() {
  return (
    <Card className="max-w-96">
      <CardContent className="flex flex-col items-center p-20 max-sm:p-16">
        <>
          <Logo className="w-56" />
          <h3 className="mt-2 font-semibold">Önéletrajz generátor</h3>
          <Link href="/create">
            <Button size="lg" variant="navNext" className="group relative mt-12">
              KEZDÉS
            </Button>
          </Link>
          <Link href="/create">
            <Button size="lg" variant={"ghost"} className="mt-2">
              Mi ez?
            </Button>
          </Link>
        </>

        {/* <>
            <p className="text-center text-lg">
              Ez egy fejlesztés alatt álló webalkalmazás, mellyel kényelmesen készíthetsz profi önéletrajzot,
              majd letöltheted azt PDF formátumban.
            </p>
            <Button size="lg" variant={"ghost"} className="mt-8" onClick={() => setIsHelpVisible(false)}>
              Vissza
            </Button>
          </> */}
      </CardContent>
    </Card>
  )
}
