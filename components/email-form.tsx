"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { getEmailSchema } from "@/form-generator/validation-schemas"
import { useCvDataStore } from "@/providers/cv-data-store-provider"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useMemo } from "react"

export function EmailForm() {
  const router = useRouter()
  const t = useTranslations("CreateFlow")
  const resetStore = useCvDataStore((state) => state.resetStore)
  const setEmail = useCvDataStore((state) => state.setEmail)
  const emailSchema = useMemo(() => getEmailSchema(t), [t])
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  })
  const resetForm = form.reset

  // when the component is mounted, reset the session storage
  // TODO: check if async reset is needed
  useEffect(() => {
    resetStore()
    resetForm()
  }, [resetStore, resetForm])

  function onSubmit(data: z.infer<typeof emailSchema>) {
    setEmail(data.email)
    router.push("/create/personal")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-12 md:max-w-[420px]">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="relative w-full">
              <FormLabel className="text-foreground">{t("emailStep.emailLabel")}</FormLabel>
              <FormControl>
                <Input placeholder={t("emailStep.emailPlaceholder")} {...field} />
              </FormControl>
              <FormMessage className="absolute -bottom-5 animate-in fade-in-0" />
            </FormItem>
          )}
        />
        <Button type="submit" className="self-end">
          {t("emailStep.submit")}
        </Button>
      </form>
    </Form>
  )
}
