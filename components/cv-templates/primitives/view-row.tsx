import type { PropsWithChildren } from "react"
import { View } from "@react-pdf/renderer"

interface RowProps extends PropsWithChildren {
  debug?: boolean
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly"
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch" | "baseline"
  gap?: number
  marginBottom?: number
}

export const Row = ({ children, debug, justifyContent, alignItems, gap, marginBottom }: Readonly<RowProps>) => {
  return (
    <View style={{ flexDirection: "row", width: "100%", justifyContent, alignItems, gap, marginBottom }} debug={debug}>
      {children}
    </View>
  )
}
