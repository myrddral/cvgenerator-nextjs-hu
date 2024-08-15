import type { PropsWithChildren } from "react"
import { Text } from "@react-pdf/renderer"

interface HeadingProps extends PropsWithChildren {
  marginBottom?: number
  debug?: boolean
}

export const Heading = ({ children, marginBottom, debug }: Readonly<HeadingProps>) => {
  return (
    <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom, letterSpacing: 0.8 }} debug={debug}>
      {children}
    </Text>
  )
}
