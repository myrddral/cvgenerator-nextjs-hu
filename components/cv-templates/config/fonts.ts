"use client"
import { Font } from "@react-pdf/renderer"

const fonts = ["Beiruti"] as const

export const registerFontFamily = (font: (typeof fonts)[number]) => {
  Font.register({
    family: font,
    fonts: [
      {
        src: `/fonts/${font}-ExtraLight.ttf`,
        fontWeight: 200,
      },
      {
        src: `/fonts/${font}-Light.ttf`,
        fontWeight: 300,
      },
      {
        src: `/fonts/${font}-Regular.ttf`,
        fontWeight: 400,
      },
      {
        src: `/fonts/${font}-Medium.ttf`,
        fontWeight: 500,
      },
      {
        src: `/fonts/${font}-SemiBold.ttf`,
        fontWeight: 600,
      },
      {
        src: `/fonts/${font}-Bold.ttf`,
        fontWeight: 700,
      },
    ],
  })
}

/* Disables hyphenation */
Font.registerHyphenationCallback((word) => [word])
