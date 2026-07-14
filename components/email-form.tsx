"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { getEmailSchema } from "@/form-generator/validation-schemas"
import { useCvDataStoreApi } from "@/providers/cv-data-store-provider"
import { useCvId, withCvParam } from "@/hooks/use-cv-id"
import { serializePersonal } from "@/lib/cv-sync"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useMemo } from "react"

export function EmailForm() {
  const router = useRouter()
  const cvId = useCvId()
  const t = useTranslations("CreateFlow")
  const storeApi = useCvDataStoreApi()
  const setPersonal = useMutation(api.cvs.setPersonal)
  const emailSchema = useMemo(() => getEmailSchema(t), [t])
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: z.infer<typeof emailSchema>) {
    const { setEmail } = storeApi.getState()
    setEmail(data.email)

    // Persist the email to Convex immediately so it survives the personal
    // section's hydration from the server, which would otherwise overwrite
    // the not-yet-saved email with the empty value still stored there.
    if (cvId) {
      const personal = storeApi.getState().personal
      await setPersonal({ cvId: cvId as Id<"cvs">, data: serializePersonal(personal) })
    }

    router.push(withCvParam("/create/personal", cvId))
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
