import type { PropsWithChildren } from "react"
import { Text } from "@react-pdf/renderer"

interface SubHeadingProps extends PropsWithChildren {
  marginBottom?: number
  color?: string
  debug?: boolean
}

export const SubHeading = ({ children, marginBottom, color, debug }: Readonly<SubHeadingProps>) => {
  return (
    <Text
      style={{ fontSize: 18, fontWeight: "semibold", color, marginBottom, letterSpacing: 0.8 }}
      debug={debug}
    >
      {children}
    </Text>
  )
}
