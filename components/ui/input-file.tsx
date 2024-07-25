import { cn } from "@/lib/utils"
import { Input } from "./input"

interface InputFileProps {
  className?: string
}

export function InputFile({ className }: InputFileProps) {
  return (
    <Input
      id="profile-picture"
      type="file"
      className={cn("h-fit cursor-pointer border-transparent p-0", className)}
    />
  )
}
