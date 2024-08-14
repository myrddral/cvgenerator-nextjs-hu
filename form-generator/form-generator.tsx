import type { SectionName } from "@/lib/stores/cv-data-store.types"
import type { SectionProps } from "./generator-sections"
import type { z } from "zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import FieldFactoryWrapper from "./field-factory-wrapper"
import { sectionSchemas } from "./validation-schemas"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useFormNavigation } from "@/hooks/use-form-navigation"

interface FormGeneratorProps extends SectionProps {
  values: z.infer<(typeof sectionSchemas)[SectionName]>
  onSubmit: (data: z.infer<(typeof sectionSchemas)[SectionName]>) => void
  onDelete?: () => void
}

export default function FormGenerator({
  fields,
  sectionName,
  isMultiEntry,
  values,
  onSubmit,
  onDelete,
}: FormGeneratorProps) {
  const sectionSchema = sectionSchemas[sectionName]
  const { handleBackStep } = useFormNavigation(sectionName)
  const resolver = zodResolver(sectionSchema)
  const form = useForm<z.infer<typeof sectionSchema>>({ resolver, values })

  function handleDelete() {
    if (isMultiEntry) {
      onDelete?.()
      // const newData = data.filter((_, idx) => idx !== selectedListItem)
      // setSectionData(sectionName, newData)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid w-full grid-cols-2 gap-8"
        // Columns had to be defined via inline style because the grid-cols-2 class didn't work for some reason
        style={{ gridTemplateColumns: Object.keys(fields).length > 3 ? "repeat(2, minmax(0, 1fr))" : "1fr" }}
      >
        {/* //TODO: memoize rendered fields */}
        {Object.entries(fields).map(([key, value]) => (
          <FormField
            key={key}
            control={form.control}
            name={key as string}
            render={({ field }) => (
              <FormItem
                className="relative"
                // Textareas should be full width all the time
                // Columns had to be defined via inline style because the col-span-full class didn't work either
                style={{
                  gridColumn: value.type === "textarea" || value.type === "image" ? "1 / -1" : undefined,
                }}
              >
                <FormLabel className="text-foreground">{value.label}</FormLabel>
                <FormControl>
                  <FieldFactoryWrapper field={field} key={key} value={value} setError={form.setError} />
                </FormControl>
                <FormMessage className="absolute -bottom-5 animate-in fade-in-0" />
              </FormItem>
            )}
          />
        ))}
        <div className="mt-8 flex justify-center gap-10" style={{ gridColumn: "1 / -1" }}>
          {isMultiEntry ? (
            <>
              <Button type="submit">Mentés</Button>
              <Button type="button" variant={"destructive"} onClick={handleDelete}>
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
