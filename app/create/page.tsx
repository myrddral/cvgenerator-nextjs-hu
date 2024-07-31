import { EmailForm } from "@/components/email-form"
import { FormStepCard } from "@/components/ui/formstep-card"

export default function CreatePage() {
  return (
    <FormStepCard title={"A kezdéshez add meg az email címed"} className="max-w-fit max-sm:mt-12">
      <EmailForm />
    </FormStepCard>
  )
}
