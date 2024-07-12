import type { PropsWithChildren } from "react"
import { View } from "@react-pdf/renderer"

interface ColumnProps extends PropsWithChildren {
  width?: string | number
  backgroundColor?: string
  paddingLeft?: number
  paddingRight?: number
  debug?: boolean
}

export const Column = ({
  children,
  width,
  paddingLeft,
  paddingRight,
  backgroundColor,
  debug,
}: Readonly<ColumnProps>) => {
  return (
    <View
      style={{ width, backgroundColor, padding: 10, paddingLeft, paddingRight, height: "100%" }}
      debug={debug}
    >
      {children}
    </View>
  )
}
