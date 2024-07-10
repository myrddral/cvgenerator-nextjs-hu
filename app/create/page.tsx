import { EmailForm } from "@/components/email-form"
import { FormStepCard } from "@/components/ui/formstep-card"
import { allSections } from "./creator-sections"

export default function CreatePage() {
  return (
    <FormStepCard title={allSections[0].title}>
      <EmailForm />
    </FormStepCard>
  )
}
