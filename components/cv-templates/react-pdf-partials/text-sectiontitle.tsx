import type { PropsWithChildren } from "react"
import { Text } from "@react-pdf/renderer"
import { colors } from "../template001"

interface SectionTitleProps extends PropsWithChildren {
  marginBottom?: number
  textAlign?: "left" | "center" | "right"
  fontSize?: number
  letterSpacing?: number
  position?: "relative" | "absolute"
  left?: number | string
  top?: number | string
  debug?: boolean
}

export const SectionTitle = ({
  children,
  marginBottom,
  textAlign,
  fontSize = 12,
  letterSpacing = 1.2,
  position = "relative",
  left = "-405",
  top = "8",
  debug,
}: Readonly<SectionTitleProps>) => {
  return (
    <Text
      style={{
        marginBottom,
        textAlign,
        letterSpacing,
        position,
        fontSize,
        left,
        top,
      }}
      debug={debug}
    >
      {children}
    </Text>
  )
}
