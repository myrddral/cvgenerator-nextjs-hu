import { useTranslations } from "next-intl"

export default function PrivacyPage() {
  const t = useTranslations("PrivacyPage")

  return (
    <div className="text-center">
      <h1 className="font-display mb-8 text-3xl font-bold leading-none tracking-wider drop-shadow">
        {t("title")}
      </h1>
      <p className="drop-shadow">{t("body")}</p>
    </div>
  )
}
