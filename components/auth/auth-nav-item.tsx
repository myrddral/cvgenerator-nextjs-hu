"use client"
import { useAuthActions } from "@convex-dev/auth/react"
import { useConvexAuth } from "convex/react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"

export function AuthNavItem() {
  const { isLoading, isAuthenticated } = useConvexAuth()
  const { signOut } = useAuthActions()
  const t = useTranslations("Navbar")

  if (isLoading) {
    return null
  }

  if (isAuthenticated) {
    return (
      <Button variant="ghost" size="sm" onClick={() => void signOut()}>
        {t("signOut")}
      </Button>
    )
  }

  return (
    <Button variant="ghost" size="sm" asChild>
      <Link href="/sign-in">{t("signIn")}</Link>
    </Button>
  )
}
