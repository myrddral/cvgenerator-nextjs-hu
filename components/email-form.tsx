"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useCvDataStore } from "@/lib/stores/cv-data-store"
import { shouldShowDevToasts } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const FormSchema = z.object({
  email: z.string().email({ message: "Érvénytelen email cím" }),
})

export function EmailForm() {
  const router = useRouter()
  const { personal, setEmail } = useCvDataStore((state) => state)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: personal.email,
    },
  })

  const isMobileDevice = () => window.innerWidth < 400
  useEffect(() => {
    if (isMobileDevice()) {
      toast({
        title: "Figyelem!",
        description: <p>Mobil eszközről egyelőre nem elérhető a legenerált önéletrajz.</p>,
      })
    }
  }, [])

  function onSubmit(data: z.infer<typeof FormSchema>) {
    shouldShowDevToasts(false) &&
      toast({
        title: "A következő értéket küldted be:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-black p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      })
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
