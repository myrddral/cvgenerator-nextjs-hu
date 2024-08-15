import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <div>
      <div className="drop-shadow-lg">
        <h1 className="text-center text-5xl">404</h1>
        <h2 className="mb-8 text-center text-xl">Nincs ilyen oldal</h2>
        <Link href="/">
          <Button>Vissza a főoldalra</Button>
        </Link>
      </div>
    </div>
  )
}
