import Link from "next/link"

export default function Footer() {
  return (
    <footer className="container py-3 shadow-inner outline outline-1 outline-muted brightness-75 backdrop-blur-sm 2xl:rounded-t-lg">
      <div className="mb-2 flex flex-wrap justify-center gap-5 text-sm">
        <Link href="https://www.attilabeli.com">Készítette</Link>
        <Link href="/privacy">Adatvédelmi szabályzat</Link>
        <Link href="/aszf">Használati feltételek</Link>
        <Link href="/attribution">Kredit</Link>
      </div>
      <p className="text-center text-sm text-gray-500">{new Date().getFullYear()} | Attila Béli</p>
    </footer>
  )
}
