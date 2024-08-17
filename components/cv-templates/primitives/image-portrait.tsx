/* eslint-disable jsx-a11y/alt-text */
import { Image, View } from "@react-pdf/renderer"

interface PortraitProps {
  src: string
  borderRadius?: number
}

export const Portrait = ({ src, borderRadius }: PortraitProps) => {
  return (
    <View style={{ width: "100%", height: 140, borderRadius, overflow: "hidden" }}>
      <Image
        src={src}
        style={{
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
    </View>
  )
}
