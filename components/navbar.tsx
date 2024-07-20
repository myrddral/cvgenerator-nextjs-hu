import NavbarNavitems from "./navbar-navitems"
import { ModeToggle } from "./mode-toggle"
import Link from "next/link"
import Logo from "./ui/logo"

export default function Navbar() {
  return (
    <header className="pos-center container fixed z-10 flex h-navbar items-center justify-between gap-4 shadow-inner outline outline-1 outline-muted brightness-75 backdrop-blur 2xl:rounded-b-lg">
      <Link href="/" className="w-28">
        <Logo />
      </Link>
      <div className="flex">
        <NavbarNavitems />
        {process.env.NODE_ENV === "development" ? <ModeToggle /> : null}
      </div>
    </header>
  )
}
