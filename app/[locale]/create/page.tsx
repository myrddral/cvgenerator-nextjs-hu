import { EmailForm } from "@/components/email-form"
import { FormStepCard } from "@/components/ui/formstep-card"
import { getTranslations } from "next-intl/server"

export default async function CreatePage() {
  const t = await getTranslations("CreateFlow.emailStep")

  return (
    <FormStepCard title={t("title")} className="max-w-fit flex-grow-0 max-sm:mt-12">
      <EmailForm />
    </FormStepCard>
  )
}
