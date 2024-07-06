import { EmailForm } from "@/components/email-form"
import { FormStepCard } from "@/components/ui/formstep-card"
import { allSections } from "./creator-sections"

export default function CreatePage() {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <FormStepCard title={allSections[0].title}>
        <EmailForm />
      </FormStepCard>
    </main>
  )
}
