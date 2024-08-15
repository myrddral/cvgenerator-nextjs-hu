import { cn } from "../../lib/utils"

interface LoaderProps {
  className?: string
  text?: string
  orientation?: "horizontal" | "vertical"
  size?: "sm" | "md" | "lg" | "icon"
}

interface OverlayProps {
  children: React.ReactNode
  size?: LoaderProps["size"]
}

interface WrapperProps {
  children: React.ReactNode
  orientation?: LoaderProps["orientation"]
}

interface SpinnerProps {
  size: LoaderProps["size"]
}

interface TextProps {
  text: LoaderProps["text"]
  size: LoaderProps["size"]
}

const Overlay = ({ children, size }: OverlayProps) => (
  <div
    className={cn(
      "flex w-full items-center justify-center",
      size === "icon" ? "relative h-fit" : "absolute left-0 top-0 h-screen"
    )}
  >
    {children}
  </div>
)

const Wrapper = ({ children, orientation }: WrapperProps) => (
  <div
    className={cn(
      "flex items-center justify-center space-x-1 text-base text-foreground opacity-100 duration-700 will-change-auto animate-in fade-in-30",
      {
        "flex-col": orientation === "vertical",
      }
    )}
  >
    {children}
  </div>
)

export const Spinner = ({ size }: SpinnerProps) => (
  <svg
    fill="none"
    className={cn(
      "h-16 w-16 animate-spin overflow-clip",
      size === "sm" && "h-8 w-8",
      size === "lg" && "h-24 w-24",
      size === "icon" && "h-10 w-10"
    )}
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
)

const Text = ({ text, size }: TextProps) => (
  <div
    className={cn(
      "text-base tracking-wider text-foreground",
      size === "sm" && "text-sm",
      size === "lg" && "text-lg",
      size === "icon" && "hidden"
    )}
  >
    {text}
  </div>
)

export default function Loader({ className, text, orientation = "horizontal", size = "md" }: LoaderProps) {
  return (
    <Overlay size={size}>
      <Wrapper orientation={orientation}>
        <Spinner size={size} />
        <Text text={text} size={size} />
      </Wrapper>
    </Overlay>
  )
}
