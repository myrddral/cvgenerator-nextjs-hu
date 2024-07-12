import { Svg, Defs, Stop, Rect, LinearGradient } from "@react-pdf/renderer"
import { styles } from "../../config/styles"

interface LinearGradProps {
  direction: "toRight" | "toLeft" | "toTop" | "toBottom"
  from: string
  to: string
}

export default function LinearGradBg({ direction, from, to }: LinearGradProps) {
  return (
    <Svg
      viewBox="0 0 100 100"
      width={"100%"}
      height={"100%"}
      style={styles.viewBackground}
      preserveAspectRatio="none"
    >
      <Defs>
        <LinearGradient id="linearGradBg" x1="0" y1="0" x2="0" y2="0">
          <Stop offset="0%" stopColor={from} />
          <Stop offset="0%" stopColor={to} />
        </LinearGradient>
      </Defs>

      <Rect fill="url('#linearGradBg')" height={"100%"} width={"100%"} />
    </Svg>
  )
}
