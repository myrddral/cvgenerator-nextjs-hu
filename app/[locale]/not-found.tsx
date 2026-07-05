import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

export default function NotFound() {
  const t = useTranslations("NotFoundPage")

  return (
    <div>
      <div className="drop-shadow-lg">
        <h1 className="text-center text-5xl">404</h1>
        <h2 className="mb-8 text-center text-xl">{t("title")}</h2>
        <Link href="/">
          <Button>{t("backHome")}</Button>
        </Link>
      </div>
    </div>
  )
}
