import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeImageUrl(image: string, width = 600, height = 400) {
  if (!image) return ""

  const value = image.trim()
  if (!value) return ""

  if (/^https?:\/\//i.test(value)) {
    return value
  }

  const origin =
    (typeof window !== "undefined" && window.location.origin) ||
    (import.meta.env.VITE_PUBLIC_BASE_URL as string | undefined) ||
    "https://www.winove.com.br"

  const toAbsoluteUrl = (path: string) => {
    const normalized = path.startsWith("/") ? path : `/${path.replace(/^\.?\//, "")}`
    try {
      return new URL(normalized, origin).href
    } catch {
      const base = origin.replace(/\/$/, "")
      return `${base}${encodeURI(normalized)}`
    }
  }

  if (
    value.startsWith("/") ||
    value.startsWith("./") ||
    value.startsWith("../") ||
    /^assets\//i.test(value)
  ) {
    return toAbsoluteUrl(value.replace(/^assets\//i, "/assets/"))
  }

  if (value.includes("/") || value.includes(".")) {
    return toAbsoluteUrl(value)
  }

  return `https://images.unsplash.com/${value}?w=${width}&h=${height}&fit=crop`
}
