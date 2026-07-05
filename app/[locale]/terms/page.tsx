import { useTranslations } from "next-intl"

export default function TermsPage() {
  const t = useTranslations("TermsPage")

  return (
    <div className="text-center">
      <h1 className="mb-8 font-display text-3xl font-bold leading-none tracking-wider">
        {t("title")}
      </h1>
      <p className="drop-shadow">{t("body")}</p>
    </div>
  )
}
