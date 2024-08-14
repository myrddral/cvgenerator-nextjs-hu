import type { Styles } from "@react-pdf/renderer"
import { StyleSheet } from "@react-pdf/renderer"
import { colors } from "./colors"

const templates = ["template001"] as const

const getTemplateStyles = (template: (typeof templates)[number]): Styles => {
  switch (template) {
    case "template001":
      return {
        page: {
          flexDirection: "row",
          color: colors.foreground,
          backgroundColor: colors.background,
          fontFamily: "Beiruti",
          fontSize: 12,
        },
        section: {
          padding: 10,
          flexGrow: 1,
        },
        link: {
          color: colors.link,
          letterSpacing: 0.2,
        },
        wrapper: {
          flexDirection: "row",
          flex: 3,
          width: "100%",
          gap: 4,
        },
        viewBackground: {
          position: "absolute",
          minWidth: "100%",
          minHeight: "100%",
        },
      }
    default:
      return {}
  }
}

export const styles = StyleSheet.create(getTemplateStyles("template001"))
