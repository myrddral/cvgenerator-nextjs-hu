import { cn } from "../lib/utils"

interface MainContainerProps extends React.PropsWithChildren {
  className?: string
}

export default function MainContainer({ children, className }: MainContainerProps) {
  return <main className={cn("flex-center container flex-1 p-2 mt-16 md:p-6", className)}>{children}</main>
}
