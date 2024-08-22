import type { SectionName } from "@/lib/stores/cv-data-store.types"
import type { z } from "zod"
import type { SectionProps } from "./form-generator.types"

import { ConfirmDialog } from "@/components/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useFormNavigation } from "@/hooks/use-form-navigation"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import FieldFactoryWrapper from "./field-factory-wrapper"
import { sectionSchemas } from "./validation-schemas"

interface FormGeneratorProps<T extends SectionProps["isMultiEntry"]> extends SectionProps {
  values: z.infer<(typeof sectionSchemas)[SectionName]>
  onSubmit: (data: z.infer<(typeof sectionSchemas)[SectionName]>) => void
  onDelete: T extends true ? () => void : undefined
  selectedItemIdx: T extends true ? number | undefined | null : undefined
}

export default function FormGenerator<T extends SectionProps["isMultiEntry"]>({
  values,
  onSubmit,
  onDelete,
  selectedItemIdx,
  ...sectionProps
}: FormGeneratorProps<T>) {
  const { fields, sectionName, isMultiEntry } = sectionProps
  const sectionSchema = sectionSchemas[sectionName]
  const { handleBackStep } = useFormNavigation(sectionName)
  const resolver = zodResolver(sectionSchema)
  const form = useForm<z.infer<typeof sectionSchema>>({ resolver, values })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid w-full grid-cols-2 flex-col gap-8 max-sm:flex"
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
                <FormMessage className="absolute bottom-0 translate-y-full animate-in fade-in-0" />
              </FormItem>
            )}
          />
        ))}
        <div className="col-span-full mb-4 mt-4 flex justify-center gap-10">
          {isMultiEntry && onDelete ? (
            <>
              <Button type="submit" variant={"default"}>
                Mentés
              </Button>
              {selectedItemIdx ? (
                <ConfirmDialog type="delete" onConfirmAction={onDelete}>
                  <Button type="button" variant={"destructive"}>
                    Törlés
                  </Button>
                </ConfirmDialog>
              ) : null}
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="navPrev"
                className="group relative px-10"
                onClick={handleBackStep}
              >
                Vissza
              </Button>
              <Button type="submit" variant="navNext" className="group relative px-10">
                Tovább
              </Button>
            </>
          )}
        </div>
      </form>
    </Form>
  )
}
