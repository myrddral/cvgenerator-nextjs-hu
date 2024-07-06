import type { PropsWithChildren } from "react"
import { View } from "@react-pdf/renderer"

interface ColumnProps extends PropsWithChildren {
  width?: string | number
  backgroundColor?: string
  debug?: boolean
}

export const Column = ({ children, width, backgroundColor, debug }: Readonly<ColumnProps>) => {
  return (
    <View style={{ width, backgroundColor, flexGrow: 1, padding: 14 }} debug={debug}>
      {children}
    </View>
  )
}
