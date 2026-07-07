import { getTranslations } from "next-intl/server"
import { SignInForm } from "@/components/auth/sign-in-form"
import { FormStepCard } from "@/components/ui/formstep-card"

export default async function SignInPage() {
  const t = await getTranslations("Auth")

  return (
    <FormStepCard title={t("signInTitle")} className="max-w-fit flex-grow-0 max-sm:mt-12">
      <SignInForm />
    </FormStepCard>
  )
}
