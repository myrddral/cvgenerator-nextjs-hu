import type { SvgIconProps } from "../svg-icon"
import { Circle, Path, Rect } from "@react-pdf/renderer"
import { SvgIcon } from "../svg-icon"

export const PortraitPlaceholder = ({}: SvgIconProps) => {
  return (
    <SvgIcon strokeWidth={0.4} size={170} strokeColor="grey">
      <Rect width="18" height="18" x="3" y="3" rx="2" strokeWidth={0.1} />
      <Circle cx="12" cy="10" r="3" />
      <Path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
    </SvgIcon>
  )
}
