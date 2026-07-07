"use client"
import * as React from "react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu"
import Image from "next/image"
import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

export default function NavbarNavitems() {
  const pathname = usePathname()
  const t = useTranslations("Navbar")

  return (
    <NavigationMenu>
      <NavigationMenuList className="text-navbar-foreground">
        <NavigationMenuItem className="max-sm:hidden">
          <NavigationMenuLink
            asChild
            className={navigationMenuTriggerStyle()}
            data-active={pathname.includes("/create")}
          >
            <Link href="/create">{t("newCv")}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="max-sm:hidden">
          {process.env.NODE_ENV === "development" ? (
            <>
              <NavigationMenuTrigger data-active={pathname.includes("/dev")}>
                {t("dev")}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[280px] gap-3 p-4">
                  <ListItem key="conponents" title={t("devComponentsList")} href="/dev/components-list">
                    {t("devComponentsListDescription")}
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </>
          ) : null}
        </NavigationMenuItem>
        <NavigationMenuItem className="overflow-clip rounded-full">
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link
              href="https://github.com/myrddral/cvgenerator-nextjs-hu"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/github-mark-white.svg"
                alt={t("githubAlt")}
                width={20}
                height={20}
                suppressHydrationWarning
              />
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  }
)
ListItem.displayName = "ListItem"
