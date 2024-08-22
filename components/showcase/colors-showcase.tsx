"use client"
import { useEffect, useMemo, useState } from "react"
import { Spinner } from "../ui/loader"

export default function ColorShowcase() {
  const [colors, setColors] = useState<{ name: string; value: string }[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return

    const styles = getComputedStyle(document.documentElement)
    // prettier-ignore
    const colorVars = ["--background", "--foreground", "--card", "--card-foreground", "--popover", "--popover-foreground", "--primary", "--primary-foreground", "--secondary", "--secondary-foreground", "--muted", "--muted-foreground", "--accent", "--accent-foreground", "--destructive", "--destructive-foreground", "--danger", "--danger-foreground", "--border", "--input", "--ring", "--navbar", "--shadow"]

    const colors = colorVars.map((varName) => ({
      name: varName.substring(2),
      value: styles.getPropertyValue(varName).trim(),
    }))

    setColors(colors)
  }, [])

  function ColorSwatch({ name, value }: { name: string; value: string }) {
    return (
      <div className="flex flex-col items-center">
        <div
          className="h-8 w-32 rounded-md shadow-md outline-dashed outline-2 outline-offset-4 outline-border"
          style={{ backgroundColor: `hsla(${value})` }}
        />
        <span className="mt-2 whitespace-break-spaces text-center text-xs">{name}</span>
      </div>
    )
  }

  return (
    <>
      <h2 className="font-display m-2 border-b-2 text-lg font-semibold tracking-wider">
        Color palette (current theme - incomplete!)
      </h2>
      <div className="mt-6 flex flex-wrap justify-center gap-x-12 gap-y-8">
        {colors.length === 0 ? (
          <Spinner size="md" />
        ) : (
          colors.map((color) => <ColorSwatch key={color.name} name={color.name} value={color.value} />)
        )}
      </div>
    </>
  )
}
