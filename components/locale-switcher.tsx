"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const localeLabels: Record<(typeof routing.locales)[number], string> = {
  en: "EN",
  hu: "HU",
}

export default function LocaleSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  return (
    <Select
      value={locale}
      onValueChange={(nextLocale) => {
        router.push(pathname, { locale: nextLocale as (typeof routing.locales)[number] })
      }}
    >
      <SelectTrigger className="w-16" aria-label="Switch language">
        <SelectValue>{localeLabels[locale as (typeof routing.locales)[number]]}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((l) => (
          <SelectItem key={l} value={l}>
            {localeLabels[l]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
