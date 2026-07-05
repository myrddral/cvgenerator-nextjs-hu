import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"
import Logo from "./ui/logo"
import { HelpButton } from "./help-button"

export default async function StarterCard() {
  const t = await getTranslations("HomePage")

  return (
    <Card className="max-w-96">
      <CardContent className="flex flex-col items-center p-20 max-sm:p-16">
        <>
          <Logo className="w-56" />
          <h3 className="mt-2 font-semibold">{t("title")}</h3>
          <Link href="/create">
            <Button size="lg" variant="navNext" className="group relative mb-1 mt-12">
              {t("start")}
            </Button>
          </Link>
          <HelpButton />
        </>
      </CardContent>
    </Card>
  )
}
