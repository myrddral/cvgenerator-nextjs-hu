import type { SvgIconProps } from "../svg-icon"
import { Path, Circle } from "@react-pdf/renderer"
import { SvgIcon } from "../svg-icon"

export const MapPinIcon = ({}: SvgIconProps) => {
  return (
    <SvgIcon style={{ position: "relative", top: 1.2 }}>
      <Path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <Circle cx="12" cy="10" r="3" />
    </SvgIcon>
  )
}
