/* eslint-disable jsx-a11y/alt-text */
import { Image } from "@react-pdf/renderer"

interface PortraitProps {
  src: string
  borderRadius?: number
}

export const Portrait = ({ src, borderRadius }: PortraitProps) => {
  return (
    <Image
      src={src}
      style={{
        width: "100%",
        maxHeight: 175,
        objectFit: "scale-down",
        objectPosition: "top",
        borderRadius,
      }}
    />
  )
}
