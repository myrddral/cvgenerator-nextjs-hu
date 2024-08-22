"use client"
import Link from "next/link"
import { Button } from "./ui/button"
import { useSearchParams, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function HelpButton() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const isHelpVisible = searchParams.get("help") === "true"

  return (
    <>
      {isHelpVisible && (
        <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-evenly rounded-lg bg-background p-6">
          <p className="text-center text-lg">
            Ez egy fejlesztés alatt álló webalkalmazás, mellyel kényelmesen készíthetsz profi önéletrajzot,
            majd letöltheted azt PDF formátumban.
          </p>
          <Link href={`${pathname}`}>
            <Button size="lg" variant={"outline"} className="mt-2">
              Vissza
            </Button>
          </Link>
        </div>
      )}

      <Link href={`${pathname}?help=true`}>
        <Button size="lg" variant={"ghost"} className={cn("mt-2", isHelpVisible && "hidden")}>
          Mi ez?
        </Button>
      </Link>
    </>
  )
}
