/* eslint-disable jsx-a11y/alt-text */
import { useState, useEffect } from "react"
import { Image } from "@react-pdf/renderer"

interface PortraitProps {
  src: File
  borderRadius?: number
}

export const Portrait = ({ src, borderRadius }: PortraitProps) => {
  const [imageBuffer, setImageBuffer] = useState<Buffer | null>(null)
  const [imageFormat, setImageFormat] = useState<"png" | "jpg" | null>(null)

  useEffect(() => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const arrayBuffer = reader.result as ArrayBuffer
      const buffer = Buffer.from(arrayBuffer)
      setImageBuffer(buffer)

      const fileType = src.type
      if (fileType === "image/jpeg" || fileType === "image/jpg") {
        setImageFormat("jpg")
      } else if (fileType === "image/png") {
        setImageFormat("png")
      } else {
        console.warn("Unsupported image format")
      }
    }
    reader.readAsArrayBuffer(src)
  }, [src])
  return (
    imageBuffer &&
    imageFormat && (
      <Image
        src={{ data: imageBuffer, format: imageFormat }}
        style={{
          width: "100%",
          maxHeight: 175,
          objectFit: "scale-down",
          objectPosition: "top",
          borderRadius,
        }}
      />
    )
  )
}
