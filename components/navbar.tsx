import Link from "next/link"
import Image from "next/image"
import NavbarNavitems from "./navbar-navitems"
import { ModeToggle } from "./mode-toggle"

export default function Navbar() {
  return (
    <div className="pos-center container fixed flex h-navbar items-center justify-between gap-4 bg-navbar shadow-inner outline outline-1 outline-muted brightness-75 backdrop-blur-sm 2xl:rounded-b-lg">
      <Link href="/" className="h-fit max-w-28">
        <Image
          src="/cv_gen_logo_v1_white.webp"
          alt="Önéletrajz generátor"
          className="object-fill"
          width={200}
          height={40}
          priority
          suppressHydrationWarning
        />
      </Link>
      <div className="flex">
        <NavbarNavitems />
        {process.env.NODE_ENV === "development" ? <ModeToggle /> : null}
      </div>
    </div>
  )
}
