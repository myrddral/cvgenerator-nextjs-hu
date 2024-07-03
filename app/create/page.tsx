import { EmailForm } from "@/components/email-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const sections = [
  {
    title: "Személyes adatok",
    fields: [
      { label: "Név", type: "text" },
      { label: "Születési dátum", type: "date" },
      { label: "Lakcím", type: "text" },
      { label: "Telefonszám", type: "tel" },
      { label: "Email cím", type: "email" },
    ],
  },
  {
    title: "Végzettség",
    fields: [
      { label: "Intézmény neve", type: "text" },
      { label: "Szak", type: "text" },
      { label: "Szakirány", type: "text" },
      { label: "Kezdés éve", type: "number" },
      { label: "Befejezés éve", type: "number" },
    ],
  },
  {
    title: "Munkatapasztalat",
    fields: [
      { label: "Munkáltató", type: "text" },
      { label: "Beosztás", type: "text" },
      { label: "Kezdés éve", type: "number" },
      { label: "Befejezés éve", type: "number" },
    ],
  },
  {
    title: "Nyelvismeret",
    fields: [
      { label: "Nyelv", type: "text" },
      { label: "Szint", type: "text" },
    ],
  },
  {
    title: "Képességek",
    fields: [{ label: "Képesség", type: "text" }],
  },
]

export default function CreatePage() {
  return (
    <main className="container flex min-h-main flex-col items-center justify-center gap-12 p-24">
      <Card className="border-border">
        <CardHeader>
          <CardTitle>A folytatáshoz add meg az email címed</CardTitle>
        </CardHeader>
        <CardContent className="w-96">
          <EmailForm />
        </CardContent>
      </Card>
    </main>
  )
}
