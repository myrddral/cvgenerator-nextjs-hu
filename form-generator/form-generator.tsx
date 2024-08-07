"use client"
import type { Employment, Language, School, Section } from "@/lib/stores/cv-data-store.types"
import type { RouteParamType, SectionProps } from "./generator-sections"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { renderFieldComponent } from "@/form-generator/render-field"
import { useFormNavigation } from "@/hooks/use-form-navigation"
import { getDefaultValues } from "@/lib/generator-utils"
import { useCvDataStore } from "@/components/providers/cv-data-store-provider"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { schemas } from "./validation-schemas"

interface FormGeneratorProps {
  fields: SectionProps["fields"]
  routeParam: RouteParamType
  isMultiEntry?: boolean
}

export default function FormGenerator({ fields, routeParam, isMultiEntry }: FormGeneratorProps) {
  const { setSectionData, addToList } = useCvDataStore((state) => state)
  const { handleForwardStep, handleBackStep } = useFormNavigation(routeParam)
  const sectionSchema = schemas[routeParam]
  const form = useForm<z.infer<typeof sectionSchema>>({
    resolver: zodResolver(sectionSchema),
    defaultValues: getDefaultValues(fields),
  })

  const [isCalendarOpen, setIsCalendarOpen] = useState<{ [key: string]: boolean }>({})

  function onSubmit(data: Omit<z.infer<typeof sectionSchema>, "email">) {
    if (isMultiEntry) {
      addToList(routeParam as Section, data as Employment | School | Language)
    } else {
      setSectionData(routeParam as Section, data)
    }

    handleForwardStep()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid w-full gap-8"
        // Columns had to be defined via inline style because the grid-cols-2 class didn't work for some reason
        style={{ gridTemplateColumns: Object.keys(fields).length > 3 ? "repeat(2, minmax(0, 1fr))" : "1fr" }}
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
          <Button type="button" className="w-36" onClick={handleBackStep}>
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
