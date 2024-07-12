interface Colors {
  background: string
  foreground: string
  primary: string
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
        primary: "#11caff",
        muted: "#848484",
        accent: "#e44112",
        link: "#4066c7",
      }
    case "blood_orange":
      return {
        background: "#f6f6f6",
        foreground: "#011119",
        primary: "#11caff",
        muted: "#848484",
        accent: "#e44112",
        link: "#4066c7",
      }
    default:
      return {
        background: "#f6f6f6",
        foreground: "#011119",
        primary: "#11caff",
        muted: "#848484",
        accent: "#e44112",
        link: "#4066c7",
      }
  }
}

export const colors = getThemeColors("blood_orange")
