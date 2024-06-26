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
    <main className="min-h-main flex flex-col items-center p-24">
      <section className="container">
        <h1 className="mb-8 text-center font-display text-3xl font-bold leading-none tracking-wider">
          form step 1
        </h1>
      </section>
    </main>
  )
}
