import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StarterCardHelpProps {
  isHelpVisible: boolean
  setIsHelpVisible: (value: boolean) => void
}

export default function StarterCardHelp({ isHelpVisible, setIsHelpVisible }: StarterCardHelpProps) {
  return (
    <Card
      className={cn(
        "max-w-[400px] border-white/60 bg-transparent px-12 py-8 shadow-inner backdrop-blur-sm duration-500 ease-in-out",
        { "animate-in fade-in zoom-in-75": isHelpVisible, "animate-out fade-out zoom-out-75": !isHelpVisible }
      )}
    >
      <div className="flex flex-col items-center">
        <p className="text-center text-lg">
          Ez egy fejlesztés alatt álló webalkalmazás, mellyel kényelmesen készíthetsz profi önéletrajzot, és
          letöltheted az PDF formátumban.
        </p>
        <Button size="lg" variant={"ghost"} className="mt-8" onClick={() => setIsHelpVisible(false)}>
          Vissza
        </Button>
      </div>
    </Card>
  )
}
