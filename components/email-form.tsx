"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useCvDataStore } from "./providers/cvdata-store-provider"

const FormSchema = z.object({
  email: z.string().email({ message: "Érvénytelen email cím" }),
})

export function EmailForm() {
  const router = useRouter()
  const { personal, setPersonal } = useCvDataStore((state) => state)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: personal.email,
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "A következő értéket küldted be:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-black p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
    setPersonal({
      email: data.email,
      fullName: personal.fullName,
      birthDate: personal.birthDate,
      phone: personal.phone,
      location: personal.location,
    })
    router.push("/create/personal")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-[400px] flex-col space-y-12">
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
