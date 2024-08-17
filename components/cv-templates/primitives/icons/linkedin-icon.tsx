import type { SvgIconProps } from "../svg-icon"
import { Path, Rect, Circle } from "@react-pdf/renderer"
import { SvgIcon } from "../svg-icon"

export const LinkedInIcon = ({}: SvgIconProps) => {
  return (
    <SvgIcon viewBox="0 0 24 24" strokeWidth={2} style={{ position: "relative", top: 1.8 }}>
      <Path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <Rect width="4" height="12" x="2" y="9" />
      <Circle cx="4" cy="4" r="2" />
    </SvgIcon>
  )
}
