import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(isoString: string) {
  const date = new Date(isoString)
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short", // Using short month name
    hour: "2-digit",
    minute: "2-digit",
  })
}
