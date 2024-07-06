import type { PropsWithChildren } from "react"
import { View, Text, Svg, Line } from "@react-pdf/renderer"
import { SectionTitle } from "./text-sectiontitle"

interface SectionProps extends PropsWithChildren {
  title?: string
  paddingLeft?: number
  paddingRight?: number
  paddingTop?: number
  paddingBottom?: number
  backgroundColor?: string
  minHeight?: number
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly"
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch" | "baseline"
  gap?: number
  debug?: boolean
}

export const Section = ({
  children,
  title,
  paddingLeft = 10,
  paddingRight = 10,
  paddingTop = 10,
  paddingBottom = 10,
  justifyContent = "flex-start",
  alignItems,
  minHeight,
  gap,
  debug,
}: Readonly<SectionProps>) => {
  return (
    <View
      style={{
        width: "100%",
        minHeight,
        textAlign: "justify",
        letterSpacing: 0.3,
        padding: `${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`,
        justifyContent,
        alignItems,
        gap,
      }}
      debug={debug}
    >
      <SectionTitle textAlign="right">{title?.toUpperCase()}</SectionTitle>
      {title ? (
        <View style={{ paddingRight: 10, overflow: "hidden" }}>
          <Svg height="10" width="450">
            <Line x1="0" y1="0" x2="450" y2="0" strokeWidth={1.5} stroke="currentColor" />
          </Svg>
        </View>
      ) : null}
      {children}
    </View>
  )
}
