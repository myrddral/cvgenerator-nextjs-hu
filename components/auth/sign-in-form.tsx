"use client"
import { useAuthActions } from "@convex-dev/auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "@/i18n/navigation"

export function SignInForm() {
  const { signIn } = useAuthActions()
  const router = useRouter()
  const t = useTranslations("Auth")
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn")
  const [formError, setFormError] = useState<string | null>(null)

  const schema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, { message: t("validation.emailRequired") })
          .email({ message: t("validation.emailInvalid") }),
        password: z.string().min(8, { message: t("validation.passwordTooShort") }),
      }),
    [t]
  )

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(data: z.infer<typeof schema>) {
    setFormError(null)
    try {
      await signIn("password", { ...data, flow })
      router.push("/")
    } catch {
      setFormError(t("invalidCredentials"))
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-8 md:max-w-[420px]">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="relative w-full">
              <FormLabel className="text-foreground">{t("emailLabel")}</FormLabel>
              <FormControl>
                <Input type="email" placeholder={t("emailPlaceholder")} {...field} />
              </FormControl>
              <FormMessage className="absolute -bottom-5 animate-in fade-in-0" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative w-full">
              <FormLabel className="text-foreground">{t("passwordLabel")}</FormLabel>
              <FormControl>
                <Input type="password" placeholder={t("passwordPlaceholder")} {...field} />
              </FormControl>
              <FormMessage className="absolute -bottom-5 animate-in fade-in-0" />
            </FormItem>
          )}
        />
        {formError ? <p className="text-[0.8rem] font-medium text-destructive">{formError}</p> : null}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {flow === "signIn" ? t("signInSubmit") : t("signUpSubmit")}
        </Button>
        <Button
          type="button"
          variant="link"
          className="self-start px-0"
          onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
        >
          {flow === "signIn" ? t("toggleToSignUp") : t("toggleToSignIn")}
        </Button>
      </form>
    </Form>
  )
}
