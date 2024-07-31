"use client"
import type { CvDataState } from "@/lib/stores/cv-data-store"
import type { RouteParamType, Section } from "./generator-sections"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { renderFieldComponent } from "@/form-generator/render-field"
import { getDefaultValues, logFormErrors } from "@/lib/generator-utils"
import { useCvDataStore } from "@/lib/stores/cv-data-store"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { schemas } from "./generator-schema"
import { routeParams } from "./generator-sections"

interface FormGeneratorProps {
  fields: Section["fields"]
  routeParam: RouteParamType
}

export default function FormGenerator({ fields, routeParam }: FormGeneratorProps) {
  const { setSectionData } = useCvDataStore()
  const router = useRouter()
  const sectionSchema = schemas[routeParam]
  const shouldMakeColumns = Object.keys(fields).length > 3
  const form = useForm<z.infer<typeof sectionSchema>>({
    resolver: zodResolver(sectionSchema),
    defaultValues: getDefaultValues(fields),
  })

  const [isCalendarOpen, setIsCalendarOpen] = useState<{ [key: string]: boolean }>({})

  logFormErrors(false, form.formState.errors)

  function onSubmit(data: z.infer<typeof sectionSchema>) {
    setSectionData(routeParam as keyof CvDataState, data)

    const nextSectionIndex = routeParams.indexOf(routeParam) + 1
    const nextSection = routeParams[nextSectionIndex]
    if (nextSection) {
      router.push(`/create/${nextSection}`)
    } else router.push("/show")
  }

  const handleBackClick = () => {
    const prevSectionIndex = routeParams.indexOf(routeParam) - 1
    const prevSection = routeParams[prevSectionIndex]
    if (prevSection) {
      router.push(`/create/${prevSection}`)
    } else router.push("/create/email")
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid w-full gap-8"
        // Columns had to be defined via inline style because the grid-cols-2 class didn't work for some reason
        style={{ gridTemplateColumns: shouldMakeColumns ? "repeat(2, minmax(0, 1fr))" : "1fr" }}
      >
        {/* //TODO: memoize rendered fields */}
        {Object.entries(fields).map(([key, value]) => (
          <FormField
            key={key}
            control={form.control}
            name={key as keyof z.infer<typeof sectionSchema>}
            render={({ field }) => (
              <FormItem
                className="relative"
                // Textareas should be full width all the time
                // Columns had to be defined via inline style because the col-span-full class didn't work either
                style={{ gridColumn: value.type === "textarea" ? "1 / -1" : undefined }}
              >
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
        <div className="mt-12 flex justify-center gap-8 max-sm:mt-8" style={{ gridColumn: "1 / -1" }}>
          <Button type="button" className="w-36" onClick={handleBackClick}>
            Vissza
          </Button>
          <Button type="submit" className="w-36">
            Tovább
          </Button>
        </div>
      </form>
    </Form>
  )
}
