interface Colors {
  background: string
  foreground: string
  muted: string
  accent: string
  link: string
}

const themes = ["dark", "blood_orange"] as const

export function getThemeColors(theme: (typeof themes)[number]): Colors {
  switch (theme) {
    case "dark":
      return {
        background: "#011119",
        foreground: "#f6f6f6",
        muted: "#848484",
        accent: "#e44112",
        link: "#4066c7",
      }
    case "blood_orange":
      return {
        background: "#ffffff",
        foreground: "#2c2c2c",
        muted: "#848484",
        accent: "#e44112",
        link: "#4066c7",
      }
    default:
      return {
        background: "#ffffff",
        foreground: "#000000",
        muted: "#848484",
        accent: "#ff0000",
        link: "#0048ff",
      }
  }
}

export const colors = getThemeColors("blood_orange")
