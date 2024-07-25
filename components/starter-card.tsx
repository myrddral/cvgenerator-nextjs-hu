"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ChevronRightIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { useState } from "react"
import Logo from "./ui/logo"

export default function StarterCard() {
  const [isHelpVisible, setIsHelpVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card className="max-w-96">
      <CardContent className="flex flex-col items-center p-20 max-sm:p-16">
        {!isHelpVisible ? (
          <>
            <Logo className="w-56" />
            <h3 className="mt-2 font-semibold">Önéletrajz generátor</h3>
            <Link href="/create">
              <Button
                size="lg"
                className="relative mt-12"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                KEZDÉS
                <ChevronRightIcon
                  className={cn(
                    "absolute right-8 translate-x-3.5",
                    isHovered
                      ? "scale-125 opacity-100 duration-500 animate-in fade-in-0 slide-in-from-left"
                      : "opacity-0"
                  )}
                />
              </Button>
            </Link>
            <Button size="lg" variant={"ghost"} className="mt-2" onClick={() => setIsHelpVisible(true)}>
              Mi ez?
            </Button>
          </>
        ) : (
          <>
            <p className="text-center text-lg">
              Ez egy fejlesztés alatt álló webalkalmazás, mellyel kényelmesen készíthetsz profi önéletrajzot,
              majd letöltheted azt PDF formátumban.
            </p>
            <Button size="lg" variant={"ghost"} className="mt-8" onClick={() => setIsHelpVisible(false)}>
              Vissza
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
