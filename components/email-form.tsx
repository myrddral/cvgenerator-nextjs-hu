"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { emailSchema } from "@/form-generator/generator-schema"
import { useCvDataStore } from "@/lib/stores/cv-data-store"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { emailSection } from "../form-generator/generator-sections"
import { useEffect } from "react"

export function EmailForm() {
  const router = useRouter()
  const reset = useCvDataStore((state) => state.reset)
  const setEmail = useCvDataStore((state) => state.setEmail)
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: emailSection.fields.email.defaultValue,
    },
  })

  // when the component is mounted, reset the session storage
  useEffect(() => {
    reset()
  }, [reset])

  function onSubmit(data: z.infer<typeof emailSchema>) {
    setEmail(data.email)
    router.push("/create/personal")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-12 md:max-w-[420px]">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="relative w-full">
              <FormLabel className="text-foreground">Email cím</FormLabel>
              <FormControl>
                <Input placeholder="email@domain.hu" {...field} />
              </FormControl>
              <FormMessage className="absolute -bottom-5 animate-in fade-in-0" />
            </FormItem>
          )}
        />
        <Button type="submit" className="self-end">
          Tovább
        </Button>
      </form>
    </Form>
  )
}
