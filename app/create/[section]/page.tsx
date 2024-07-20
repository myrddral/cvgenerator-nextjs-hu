"use client"

import type { CvDataStore } from "@/lib/stores/cv-data-store"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { FormStepCard } from "@/components/ui/formstep-card"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useCvDataStore } from "@/lib/stores/cv-data-store"
import { cn, shouldShowDevToasts } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { schemas } from "../creator-schema"
import { allSections, routeParams } from "../creator-sections"
import { useEffect, useState } from "react"

export default function SectionPage({ params }: { params: { section: string } }) {
  const router = useRouter()
  const { personal, setPersonal, setSkills, setExperience, setEducation, setLanguages, setPassions } =
    useCvDataStore()
  const currentSection = allSections.find((section) => section.routeParam === params.section)
  const formSchema = schemas[params.section as keyof typeof schemas]
  const fields = currentSection?.fields ?? {}
  const shouldMakeGrid = Object.keys(fields).length < 3
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, value.defaultValue])),
      email: personal.email,
    },
  })

  const [isCalendarOpen, setIsCalendarOpen] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    const e = form.formState.errors
    shouldShowDevToasts(true) &&
      Object.keys(e).length &&
      toast({
        title: "Hiba történt a validálás során",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-black p-4">
            <code className="text-white">{JSON.stringify(e, null, 2)}</code>
          </pre>
        ),
      })
  }, [form.formState.errors])

  function onSubmit(data: z.infer<typeof formSchema>) {
    shouldShowDevToasts(false) &&
      toast({
        title: "A következő értéket küldted be:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-black p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      })

    switch (params.section) {
      case "personal":
        setPersonal(data as CvDataStore["personal"])
        break
      case "skills":
        setSkills(data as CvDataStore["skills"])
        break
      case "experience":
        setExperience(data as CvDataStore["experience"])
        break
      case "education":
        setEducation(data as CvDataStore["education"])
        break
      case "languages":
        setLanguages(data as CvDataStore["languages"])
        break
      case "passions":
        setPassions(data as CvDataStore["passions"])
    }
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

  const getPlaceholder = (section: string) => {
    switch (section) {
      case "skills":
        return "Mihez értesz? Miben van gyakorlati tapasztalatod?"
      case "experience":
        return "Milyen feladatokat végeztél? Milyen eredményeket értél el?"
      case "passions":
        return "Pl.: Olvasás, sport, hangszerek, szakmai fórumok, önkéntes tevékenységek"
    }
  }

  return (
    <FormStepCard title={currentSection?.title} sub={currentSection?.sub} className="mb-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("grid w-full grid-cols-2 flex-col gap-8 max-sm:flex", { flex: shouldMakeGrid })}
        >
          {Object.entries(fields).map(([key, value]) => {
            return (
              <FormField
                key={key}
                control={form.control}
                name={key as any}
                render={({ field }) => (
                  <FormItem className={cn("relative", { "col-span-full": value.type === "textarea" })}>
                    <FormLabel className="text-foreground">{value.label}</FormLabel>
                    {["text", "tel", "email", "url"].includes(value.type) ? (
                      <FormControl>
                        <Input
                          type={value.type}
                          autoComplete={value.autocomplete}
                          {...field}
                          readOnly={value.readonly}
                        />
                      </FormControl>
                    ) : null}
                    {value.type === "number" ? (
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    ) : null}
                    {value.type === "textarea" ? (
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={getPlaceholder(params.section)}
                          rows={8}
                          className="w-full"
                        />
                      </FormControl>
                    ) : null}
                    {value.type === "date" ? (
                      <Popover open={isCalendarOpen[key] || false}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              onClick={() =>
                                setIsCalendarOpen((prev) => ({ ...prev, [key]: !(prev[key] || false) }))
                              }
                            >
                              {field.value ? format(field.value, "yyyy-MM-dd") : <span>Válassz dátumot</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
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
                    ) : null}
                    <FormMessage className="absolute -bottom-5 animate-in fade-in-0" />
                  </FormItem>
                )}
              />
            )
          })}
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
