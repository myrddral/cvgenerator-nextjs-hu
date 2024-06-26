import Starter from "@/components/starter"

export default function Home() {
  return (
    <main className="min-h-main container flex items-center justify-center">
      <div className="min-h-main fade-edges absolute left-0 top-0 -z-10 h-full w-full bg-[url('/grid_bg1.svg')] bg-cover bg-center bg-no-repeat" />
      <Starter />
    </main>
  )
}
