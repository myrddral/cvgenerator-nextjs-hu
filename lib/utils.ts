import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isDevMode(): boolean {
  return process.env.NODE_ENV === "development"
}

export function shouldShowDevToasts(toggle: true | false): boolean {
  return isDevMode() && toggle
}
