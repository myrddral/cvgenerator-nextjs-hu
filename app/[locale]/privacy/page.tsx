import { useTranslations } from "next-intl"

export default function PrivacyPage() {
  const t = useTranslations("PrivacyPage")

  return (
    <div className="text-center">
      <h1 className="mb-8 font-display text-3xl font-bold leading-none tracking-wider drop-shadow">
        {t("title")}
      </h1>
      <p className="drop-shadow">{t("body")}</p>
    </div>
  )
}
