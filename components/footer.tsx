import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

export default function Footer() {
  const t = useTranslations("Footer")

  return (
    <footer className="container py-3 shadow-inner outline outline-1 outline-muted brightness-75 backdrop-blur 2xl:rounded-t-lg">
      <div className="mb-2 flex flex-wrap justify-center gap-5 text-sm">
        <Link href="https://www.attilabeli.com" prefetch={false}>
          {t("madeBy")}
        </Link>
        <Link href="/privacy" prefetch={false}>
          {t("privacyPolicy")}
        </Link>
        <Link href="/terms" prefetch={false}>
          {t("termsOfUse")}
        </Link>
        <Link href="/attribution" prefetch={false}>
          {t("attribution")}
        </Link>
      </div>
      <p className="text-center text-sm text-gray-500">{new Date().getFullYear()} | Attila Béli</p>
    </footer>
  )
}
