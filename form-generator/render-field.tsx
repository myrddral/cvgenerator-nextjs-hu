import type { Dispatch, SetStateAction } from "react"
import type { ControllerRenderProps, FieldValues, UseFormSetError } from "react-hook-form"

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

interface FieldProps {
  type: string
  autocomplete?: string
  readonly?: boolean
  placeholder?: string
  label: string
}

interface RenderFieldProps {
  field: ControllerRenderProps
  key: string
  value: FieldProps
  isCalendarOpen: { [key: string]: boolean }
  setIsCalendarOpen: Dispatch<SetStateAction<{ [key: string]: boolean }>>
  setError: UseFormSetError<FieldValues>
}

export function renderFieldComponent(props: RenderFieldProps) {
  const { field, key, value, isCalendarOpen, setIsCalendarOpen, setError } = props

  switch (value.type) {
    case "text":
    case "tel":
    case "email":
    case "url":
      return (
        <Input
          {...field}
          type={value.type}
          autoComplete={value.autocomplete}
          placeholder={value.placeholder}
          readOnly={value.readonly}
        />
      )

    case "number":
      return (
        <Input {...field} type="number" autoComplete={value.autocomplete} placeholder={value.placeholder} />
      )

    case "textarea":
      return (
        <Textarea
          {...field}
          autoComplete={value.autocomplete}
          placeholder={value.placeholder}
          rows={8}
          className="w-full"
        />
      )

    case "date":
      return (
        <Popover open={isCalendarOpen[key] || false}>
          <PopoverTrigger asChild>
            <Button
              variant={"picker"}
              className={cn("w-full gap-4 font-normal", !field.value && "text-muted-foreground")}
              onClick={() => setIsCalendarOpen((prev) => ({ ...prev, [key]: !(prev[key] || false) }))}
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
              onDayClick={() => setIsCalendarOpen((prev) => ({ ...prev, [key]: false }))}
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
