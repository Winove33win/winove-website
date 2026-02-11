import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeImageUrl(image: string, width = 600, height = 400) {
  if (!image) return ""

  const value = image.trim()
  if (!value) return ""

  const slugAliases: Record<string, string> = {
    "template-palestra": "template-palestra-completo",
    "template-palestra-basico": "template-palestra-basico",
    "template-palestra-completo": "template-palestra-completo",
    "template-de-psicologia": "template-psicologia",
    "template-psicologia": "template-psicologia",
    "template-personal-traine": "template-personal-trainer",
    "template-personal-trainer": "template-personal-trainer",
    "template-logistico": "template-logistico",
    "template-landingpage-logistica": "template-landingpage-logistica",
    "template-eventos": "template-eventos",
    "templates-eventos": "templates-eventos",
    "template-fotografia": "template-fotografia",
    "template-advocacia": "template-advocacia",
    "vida-e-saude": "vida-e-saude",
    "design-movei-de-luxo": "design-movei-de-luxo",
    "high-velocity-performance": "high-velocity-performance",
  }

  const cleanSegment = (segment: string) =>
    segment
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase()

  const mapLegacyWinoveTemplatePath = (url: URL) => {
    const [firstSegmentRaw, ...restSegmentsRaw] = url.pathname.split("/").filter(Boolean)
    if (!firstSegmentRaw || restSegmentsRaw.length === 0) {
      return ""
    }

    const firstSegment = cleanSegment(decodeURIComponent(firstSegmentRaw))
    const slug = slugAliases[firstSegment] || firstSegment
    const filePath = restSegmentsRaw.map((segment) => decodeURIComponent(segment)).join("/")
    return encodeURI(`https://winove.com.br/assets/templates/${slug}/${filePath}`)
  }

  if (/^https?:\/\//i.test(value)) {
    try {
      const normalizedUrl = new URL(value)
      const host = normalizedUrl.hostname.toLowerCase()
      const isWinoveHost = host === "winove.com.br" || host === "www.winove.com.br"

      if (isWinoveHost && !normalizedUrl.pathname.startsWith("/assets/templates/")) {
        const rewritten = mapLegacyWinoveTemplatePath(normalizedUrl)
        if (rewritten) {
          return rewritten
        }
      }
    } catch {
      return value
    }

    return value
  }
  if (value.startsWith("//")) {
    return `https:${value}`
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
