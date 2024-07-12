"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Logo from "./ui/logo"
import { ChevronRightIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"

export default function StarterCard() {
  const [isHelpVisible, setIsHelpVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card className="max-w-96 bg-transparent/30">
      <CardContent className="flex flex-col items-center p-20 max-sm:p-16">
        {!isHelpVisible ? (
          <>
            <Logo className="w-56" />
            <p className="mt-2 font-semibold">Önéletrajz generátor</p>
            <Link href="/create">
              <Button
                size="lg"
                className="relative mt-12"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                KEZDÉS
                <span
                  className={cn(
                    "absolute right-8 translate-x-3.5 opacity-0",
                    isHovered ? "opacity-100 duration-500 animate-in fade-in-0 slide-in-from-left scale-125" : ""
                  )}
                >
                  <ChevronRightIcon />
                </span>
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
