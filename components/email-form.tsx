"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useCvDataStore } from "@/lib/stores/cv-data-store"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { emailSection } from "../form-generator/generator-sections"

const FormSchema = z.object({
  email: z.string().email({ message: "Érvénytelen email cím" }),
})

export function EmailForm() {
  const router = useRouter()
  const { setEmail } = useCvDataStore((state) => state)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: emailSection.fields.email.defaultValue,
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
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
