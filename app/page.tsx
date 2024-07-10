import { GridBackground } from "@/components/grid-background"
import StarterCard from "@/components/starter-card"

export default function Home() {
  return (
    <main className="container flex min-h-main items-center justify-center p-6">
      {/* <div className="fade-edges absolute left-0 top-0 -z-10 h-full min-h-main w-full bg-[url('/grid_bg1.svg')] bg-cover bg-center bg-no-repeat" /> */}
      {/* <GridBackground /> */}
      <StarterCard />
    </main>
  )
}
