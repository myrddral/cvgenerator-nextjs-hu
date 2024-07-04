"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const FormSchema = z.object({
  email: z.string().email({ message: "Érvénytelen email cím" }),
})

export function EmailForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
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
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-12">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel className="transition-colors duration-150">Email cím</FormLabel>
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
