"use client"

import type { CvDataState } from "@/lib/stores/cv-data-store"
import type { TSchemas } from "@/form-generator/generator-schema"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { FormStepCard } from "@/components/ui/formstep-card"
import { schemas } from "@/form-generator/generator-schema"
import { allSections, routeParams } from "@/form-generator/generator-sections"
import { renderFieldComponent } from "@/form-generator/render-field"
import { getDefaultValues, logFormErrors } from "@/lib/generator-utils"
import { useCvDataStore } from "@/lib/stores/cv-data-store"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

export default function SectionPage({ params }: { params: { section: string } }) {
  const router = useRouter()
  const { setSectionData } = useCvDataStore()
  const currentSection = allSections.find((section) => section.routeParam === params.section)
  const formSchema = schemas[params.section as keyof typeof schemas]
  const fields = currentSection?.fields ?? {}
  const shouldMakeGrid = Object.keys(fields).length < 3
  const form = useForm<TSchemas[keyof TSchemas]>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(fields),
  })

  logFormErrors(false, form.formState.errors)

  const [isCalendarOpen, setIsCalendarOpen] = useState<{ [key: string]: boolean }>({})

  function onSubmit(data: TSchemas[keyof TSchemas]) {
    setSectionData(params.section as keyof CvDataState, data)

    const nextSectionIndex = routeParams.indexOf(params.section) + 1
    const nextSection = routeParams[nextSectionIndex]
    if (nextSection) {
      router.push(`/create/${nextSection}`)
    } else router.push("/show")
  }

  const handleBackClick = () => {
    const prevSectionIndex = routeParams.indexOf(params.section) - 1
    const prevSection = routeParams[prevSectionIndex]
    if (prevSection) {
      router.push(`/create/${prevSection}`)
    } else router.push("/create/email")
  }

  return (
    <FormStepCard title={currentSection?.title} sub={currentSection?.sub} className="mb-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("grid w-full grid-cols-2 flex-col gap-8 max-sm:flex", { flex: shouldMakeGrid })}
        >
          {Object.entries(fields).map(([key, value]) => (
            <FormField
              key={key}
              control={form.control}
              name={key as keyof TSchemas[keyof TSchemas]}
              render={({ field }) => (
                <FormItem className={cn("relative", { "col-span-full": value.type === "textarea" })}>
                  <FormLabel className="text-foreground">{value.label}</FormLabel>
                  <FormControl>
                    {renderFieldComponent({
                      field,
                      key,
                      value,
                      isCalendarOpen,
                      setIsCalendarOpen,
                      setError: form.setError,
                    })}
                  </FormControl>
                  <FormMessage className="absolute -bottom-5 animate-in fade-in-0" />
                </FormItem>
              )}
            />
          ))}
          <div className="col-span-2 mt-12 flex justify-center gap-8 max-sm:mt-8">
            <Button type="button" className="w-36" onClick={handleBackClick}>
              Vissza
            </Button>
            <Button type="submit" className="w-36">
              Tovább
            </Button>
          </div>
        </form>
      </Form>
    </FormStepCard>
  )
}
