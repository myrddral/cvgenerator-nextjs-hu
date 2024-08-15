import type { ControllerRenderProps, FieldValues, UseFormSetError } from "react-hook-form"
import type { FieldProps } from "./form-generator.types"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { InputImageFile } from "@/components/ui/input-image-file"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
import { useState } from "react"

export interface FieldFactoryWrapperProps {
  field: ControllerRenderProps
  fieldKey: string
  fieldProps: FieldProps
  setError: UseFormSetError<FieldValues>
}

export default function FieldFactoryWrapper({
  field,
  fieldKey,
  fieldProps,
  setError,
}: FieldFactoryWrapperProps) {
  const { type, autocomplete, readonly, placeholder } = fieldProps
  const [isCalendarOpen, setIsCalendarOpen] = useState<{ [fieldKey: string]: boolean }>({})

  const fieldFactory = () => {
    switch (type) {
      case "text":
      case "tel":
      case "email":
      case "url":
        return (
          <Input
            {...field}
            type={type}
            autoComplete={autocomplete}
            placeholder={placeholder}
            readOnly={readonly}
          />
        )

      case "number":
        return <Input {...field} type="number" autoComplete={autocomplete} placeholder={placeholder} />

      case "textarea":
        return (
          <Textarea
            {...field}
            autoComplete={autocomplete}
            placeholder={placeholder}
            rows={8}
            className="w-full"
          />
        )

      case "date":
        return (
          <Popover open={isCalendarOpen[fieldKey] || false}>
            <PopoverTrigger asChild>
              <Button
                variant={"picker"}
                className={cn("w-full gap-4 font-normal", !field.value && "text-muted-foreground")}
                onClick={() =>
                  setIsCalendarOpen((prev) => ({ ...prev, [fieldKey]: !(prev[fieldKey] || false) }))
                }
                // onClick={() => toggleCalendar(key)}
              >
                {field.value ? (
                  format(field.value, "yyyy-MM-dd")
                ) : (
                  <span className="mr-4">Válassz dátumot</span>
                )}
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                captionLayout="dropdown-buttons"
                selected={field.value}
                onSelect={field.onChange}
                fromDate={new Date("1900-01-01")}
                toDate={new Date()}
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                onDayClick={() =>
                  setIsCalendarOpen((prev) => ({ ...prev, [fieldKey]: !(prev[fieldKey] || false) }))
                }
                locale={hu}
                initialFocus
                fixedWeeks
              />
            </PopoverContent>
          </Popover>
        )

      case "image":
        return <InputImageFile {...field} setError={setError} />

      default:
        return null
    }
  }

  return fieldFactory()
}
