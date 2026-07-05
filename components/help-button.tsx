"use client"
import { Button } from "./ui/button"
import { useSearchParams } from "next/navigation"
import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

export function HelpButton() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const isHelpVisible = searchParams.get("help") === "true"
  const t = useTranslations("HomePage.help")

  return (
    <>
      {isHelpVisible && (
        <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-evenly rounded-lg bg-background p-6">
          <p className="text-center text-lg">{t("description")}</p>
          <Link href={pathname}>
            <Button size="lg" variant={"outline"} className="mt-2">
              {t("back")}
            </Button>
          </Link>
        </div>
      )}

      <Link href={{ pathname, query: { help: "true" } }}>
        <Button size="lg" variant={"ghost"} className={cn("mt-2", isHelpVisible && "hidden")}>
          {t("whatIsThis")}
        </Button>
      </Link>
    </>
  )
}
