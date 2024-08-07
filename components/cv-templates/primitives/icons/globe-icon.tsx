import type { SvgIconProps } from "../svg-icon"
import { Circle, Path } from "@react-pdf/renderer"
import { SvgIcon } from "../svg-icon"

export const GlobeIcon = ({}: SvgIconProps) => {
  return (
    <SvgIcon viewBox="0 0 24 24" strokeWidth={2} style={{ position: "relative", top: 1.8 }}>
      <Circle cx="12" cy="12" r="10" />
      <Path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <Path d="M2 12h20" />
    </SvgIcon>
  )
}
