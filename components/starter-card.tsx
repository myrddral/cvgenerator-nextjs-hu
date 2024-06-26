import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

interface StarterCardProps {
  isHelpVisible: boolean
  setIsHelpVisible: (value: boolean) => void
}

export default function StarterCard({ isHelpVisible, setIsHelpVisible }: StarterCardProps) {
  return (
    <Card
      className={cn(
        "border-white/60 bg-transparent p-24 shadow-inner backdrop-blur-sm duration-500 ease-in-out",
        { "animate-in fade-in zoom-in-75": !isHelpVisible, "animate-out fade-out zoom-out-75": isHelpVisible }
      )}
    >
      <div className="flex flex-col items-center">
        <Image
          src="/cv_gen_logo_v1_white.webp"
          alt="Önéletrajz generátor"
          className="object-fill"
          width={200}
          height={40}
          priority
          suppressHydrationWarning
        />
        <p className="mt-2 font-semibold">Önéletrajz generátor</p>
        <Link href="/create">
          <Button size="lg" className="mt-12">
            KEZDÉS
          </Button>
        </Link>
        <Button size="lg" variant={"ghost"} className="mt-2" onClick={() => setIsHelpVisible(true)}>
          Mi ez?
        </Button>
      </div>
    </Card>
  )
}
