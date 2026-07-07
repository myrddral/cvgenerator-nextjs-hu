import { useTranslations } from "next-intl"

export default function TermsPage() {
  const t = useTranslations("TermsPage")

  return (
    <div className="text-center">
      <h1 className="font-display mb-8 text-3xl font-bold leading-none tracking-wider">{t("title")}</h1>
      <p className="drop-shadow">{t("body")}</p>
    </div>
  )
}
