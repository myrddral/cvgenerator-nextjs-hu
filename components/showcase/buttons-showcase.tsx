import { Button } from "@/components/ui/button"

type ButtonVariants =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | null
  | undefined
type ButtonSizes = "default" | "sm" | "lg" | "icon" | null | undefined

const buttonVariants = ["default", "destructive", "outline", "secondary", "ghost", "link"]
const buttonSizes = ["sm", "default", "lg", "icon"]

export default function ButtonsShowcase() {
  return (
    <>
      <h2 className="m-2 font-display text-lg font-semibold tracking-wider border-b-2">Buttons</h2>
      <div className="flex flex-wrap gap-x-12 gap-y-8">
        {buttonVariants.map((variant) => (
          <div key={variant} className="p-2">
            <h3 className="mb-2 text-sm font-semibold">variant: {variant}</h3>
            <div className="flex items-center gap-2">
              {buttonSizes.map((size) => (
                <Button key={size} variant={variant as ButtonVariants} size={size as ButtonSizes}>
                  {size.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
