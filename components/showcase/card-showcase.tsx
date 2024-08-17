const cardVariants = ["default", "withHeader"] as const
const cardSizes = ["default"] as const

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function CardShowcase() {
  return (
    <>
      <h2 className="m-2 border-b-2 font-display text-lg font-semibold tracking-wider">Cards</h2>
      <div className="flex flex-wrap gap-x-12 gap-y-8">
        {cardVariants.map((variant) => (
          <div key={variant} className="p-2">
            <h3 className="mb-2 text-sm font-semibold">variant: {variant}</h3>
            <div className="flex items-center gap-2">
              {cardSizes.map((size) => (
                <Card key={size} className="w-full max-w-full bg-transparent/30 p-6 max-sm:p-2">
                  {variant === "withHeader" && (
                    <CardHeader className="max-sm:px-4">
                      <CardTitle>CardHeader</CardTitle>
                    </CardHeader>
                  )}
                  <CardContent className="w-full p-6 max-sm:p-4 md:min-w-[400px]">
                    lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                    dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut...
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
