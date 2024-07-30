/* eslint-disable jsx-a11y/alt-text */
import { Image, View } from "@react-pdf/renderer"

interface PortraitProps {
  src: string
  borderRadius?: number
}

export const Portrait = ({ src, borderRadius }: PortraitProps) => {
  return (
    <View style={{ width: "100%", maxHeight: 155, borderRadius, overflow: "hidden" }}>
      <Image
        src={src}
        style={{
          width: "100%",
          objectFit: "cover",
          objectPosition: "top",
        }}
      />
    </View>
  )
}
