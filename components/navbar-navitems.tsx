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
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function NavbarNavitems() {
  const pathname = usePathname()

  return (
    <NavigationMenu>
      <NavigationMenuList className="text-navbar-foreground">
        <NavigationMenuItem>
          <Link href="/create" legacyBehavior passHref>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              data-active={pathname.includes("/create")}
            >
              Új önéletrajz
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          {process.env.NODE_ENV === "development" ? (
            <>
              <NavigationMenuTrigger data-active={pathname.includes("/dev")}>Dev</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[280px] gap-3 p-4">
                  <ListItem key="conponents" title="Komponenslista" href="/dev/components-list">
                    Az oldal komponenseinek listája
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </>
          ) : null}
        </NavigationMenuItem>
        <NavigationMenuItem className="overflow-clip rounded-full">
          <Link
            className="!p-0"
            href="https://github.com/myrddral/cvgenerator-nextjs-hu"
            target="_blank"
            rel="noopener noreferrer"
            legacyBehavior
            passHref
          >
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Image
                src="/github-mark-white.svg"
                alt="GitHub"
                width={20}
                height={20}
                suppressHydrationWarning
              />
            </NavigationMenuLink>
          </Link>
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
