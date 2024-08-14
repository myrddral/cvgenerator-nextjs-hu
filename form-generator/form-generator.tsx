import type { SectionName } from "@/lib/stores/cv-data-store.types"
import type { SectionProps } from "./form-generator.types"
import type { z } from "zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import FieldFactoryWrapper from "./field-factory-wrapper"
import { sectionSchemas } from "./validation-schemas"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useFormNavigation } from "@/hooks/use-form-navigation"
import { cn } from "@/lib/utils"

interface FormGeneratorProps extends SectionProps {
  values: z.infer<(typeof sectionSchemas)[SectionName]>
  onSubmit: (data: z.infer<(typeof sectionSchemas)[SectionName]>) => void
  onDelete?: () => void
  selectedListItem?: number | undefined
}

export default function FormGenerator({ values, onSubmit, onDelete, ...sectionProps }: FormGeneratorProps) {
  const { fields, sectionName, isMultiEntry } = sectionProps
  const sectionSchema = sectionSchemas[sectionName]
  const { handleBackStep } = useFormNavigation(sectionName)
  const resolver = zodResolver(sectionSchema)
  const form = useForm<z.infer<typeof sectionSchema>>({ resolver, values })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid w-full grid-cols-2 flex-col gap-8 max-sm:flex", { flex: false })}
      >
        {/* //TODO: memoize rendered fields */}
        {Object.entries(fields).map(([fieldKey, fieldProps]) => (
          <FormField
            key={fieldKey}
            control={form.control}
            name={fieldKey}
            render={({ field }) => (
              <FormItem
                className={cn("relative", {
                  "col-span-full": fieldProps.type === "textarea" || fieldProps.type === "image",
                })}
              >
                <FormLabel className="text-foreground">{fieldProps.label}</FormLabel>
                <FormControl>
                  <FieldFactoryWrapper
                    field={field}
                    fieldKey={fieldKey}
                    fieldProps={fieldProps}
                    setError={form.setError}
                  />
                </FormControl>
                <FormMessage className="absolute -bottom-5 animate-in fade-in-0" />
              </FormItem>
            )}
          />
        ))}
        <div className="col-span-full mt-8 flex justify-center gap-10">
          {isMultiEntry ? (
            <>
              <Button type="submit">Mentés</Button>
              <Button type="button" variant={"destructive"} onClick={() => onDelete?.()}>
                Törlés
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant={"navPrev"}
                className="group relative px-10"
                onClick={handleBackStep}
              >
                Vissza
              </Button>
              <Button type="submit" variant={"navNext"} className="group relative px-10">
                Tovább
              </Button>
            </>
          )}
        </div>
      </form>
    </Form>
  )
}
