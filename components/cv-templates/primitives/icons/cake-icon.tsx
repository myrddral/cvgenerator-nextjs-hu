import type { SvgIconProps } from "../svg-icon"
import { Path } from "@react-pdf/renderer"
import { SvgIcon } from "../svg-icon"

export const CakeIcon = ({}: SvgIconProps) => {
  return (
    <SvgIcon viewBox="1 3 21 22" strokeWidth={1.9} style={{ position: "relative", top: 0 }}>
      <Path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
      <Path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
      <Path d="M2 21h20" />
      <Path d="M7 8v3" />
      <Path d="M12 8v3" />
      <Path d="M17 8v3" />
      <Path d="M7 4h.01" />
      <Path d="M12 4h.01" />
      <Path d="M17 4h.01" />
    </SvgIcon>
  )
}
