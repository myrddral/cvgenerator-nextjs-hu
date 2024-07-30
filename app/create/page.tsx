import { EmailForm } from "@/components/email-form"
import { FormStepCard } from "@/components/ui/formstep-card"
import { allSections } from "../../form-generator/generator-sections"

export default function CreatePage() {
  return (
    <FormStepCard title={allSections[0].title} className="max-w-fit max-sm:mt-12">
      <EmailForm />
    </FormStepCard>
  )
}
