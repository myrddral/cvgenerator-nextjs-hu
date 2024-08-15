import type { SvgIconProps } from "../svg-icon"
import { Path, Rect } from "@react-pdf/renderer"
import { SvgIcon } from "../svg-icon"

export const MailIcon = ({}: SvgIconProps) => {
  return (
    <SvgIcon strokeWidth={1.9} style={{ position: "relative", top: 2.6 }}>
      <Rect width="20" height="16" x="2" y="4" rx="2" ry="2" />
      <Path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </SvgIcon>
  )
}
