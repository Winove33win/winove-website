import { Helmet } from "react-helmet-async";

const SITE_NAME = "Winove";
const DEFAULT_IMAGE = "https://www.winove.com.br/imagem-de-compartilhamento.png";
const TWITTER_HANDLE = "@winove_oficial";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  image?: string;
  type?: "website" | "article" | "product" | string;
  keywords?: string[];
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export function SEO({
  title,
  description,
  canonical,
  noindex = false,
  image,
  type = "website",
  keywords,
  author,
  publishedDate,
  modifiedDate,
  jsonLd,
}: SEOProps) {
  const ogImage = image || DEFAULT_IMAGE;
  const fullTitle = title ? `${title}` : SITE_NAME;
  const jsonLdArray = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet>
      {/* ── Core ──────────────────────────────────────────────────── */}
      <title>{fullTitle}</title>
      <meta name="description" content={description ?? ""} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}
      {author && <meta name="author" content={author} />}
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"} />

      {/* ── Canonical ─────────────────────────────────────────────── */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* ── Open Graph ────────────────────────────────────────────── */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title ?? SITE_NAME} />

      {/* Article-specific OG */}
      {publishedDate && <meta property="article:published_time" content={publishedDate} />}
      {modifiedDate && <meta property="article:modified_time" content={modifiedDate} />}
      {author && type === "article" && <meta property="article:author" content={author} />}

      {/* ── Twitter Card ──────────────────────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />

      {/* ── JSON-LD ───────────────────────────────────────────────── */}
      {jsonLdArray.map((schema, i) => (
        <script key={i} type="application/ld+json" data-seo-jsonld="true">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
