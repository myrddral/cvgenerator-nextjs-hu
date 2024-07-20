import { cn } from "../../lib/utils"

interface LoaderProps {
  className?: string
  text?: string
  orientation?: "horizontal" | "vertical"
  size?: "sm" | "md" | "lg"
}

export default function Loader({ className, text, orientation = "horizontal", size = "md" }: LoaderProps) {
  return (
    <div className="absolute left-0 top-0 flex h-screen w-full items-center justify-center">
      <div
        className={cn(
          "flex items-center justify-center space-x-1 text-base text-foreground opacity-100 will-change-auto animate-in fade-in-30 duration-700",
          {
            "flex-col": orientation === "vertical",
          }
        )}
      >
        <svg
          fill="none"
          className={cn("h-16 w-16 animate-spin", size === "sm" && "h-8 w-8", size === "lg" && "h-24 w-24")}
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z"
            fill="currentColor"
            fillRule="evenodd"
          />
        </svg>

        <div
          className={cn(
            "text-base tracking-wider text-foreground",
            size === "sm" && "text-sm",
            size === "lg" && "text-lg"
          )}
        >
          {text}
        </div>
      </div>
    </div>
  )
}
