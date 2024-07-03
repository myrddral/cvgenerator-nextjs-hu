import Image from "next/image"

interface LogoProps {
  className?: string
}

export default function Logo({ className }: LogoProps) {
  return (
    <Image
      src="/cv_gen_logo_v1_white.webp"
      alt="Önéletrajz generátor logo"
      className={className}
      width={483}
      height={170}
      priority
      suppressHydrationWarning
    />
  )
}
