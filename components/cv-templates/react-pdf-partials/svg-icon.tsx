import type { PropsWithChildren } from "react"
import { Svg } from "@react-pdf/renderer"
import { colors } from "../template001"

export interface SvgIconProps extends PropsWithChildren {
  size?: number
  viewBox?: string
  fillColor?: string | "none"
  strokeColor?: string
  strokeWidth?: number
  strokeLineCap?: "butt" | "round" | "square"
  strokeLinejoin?: "butt" | "round" | "square"
  style?: Record<string, unknown>
  debug?: boolean
}

export const SvgIcon = ({
  children,
  style,
  viewBox = "0 0 24 24",
  size = 14,
  fillColor = "#FFF",
  strokeColor = colors.accent,
  strokeWidth = 2.5,
  strokeLineCap = "round",
  strokeLinejoin = "round",
  debug,
}: SvgIconProps) => {
  return (
    <Svg
      style={style}
      viewBox={viewBox}
      width={size}
      height={size}
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeLineCap={strokeLineCap}
      strokeLinejoin={strokeLinejoin}
      preserveAspectRatio="xMidYMid meet"
      debug={debug}
    >
      {children}
    </Svg>
  )
}
