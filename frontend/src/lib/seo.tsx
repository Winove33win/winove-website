import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  image?: string;
  type?: "website" | "article" | string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export function SEO({
  title,
  description,
  canonical,
  noindex,
  image,
  type = "website",
  jsonLd,
}: SEOProps) {
  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : undefined;

  return (
    <Helmet>
      {title && <title>{title}</title>}
      {title && <meta property="og:title" content={title} />}
      {title && <meta name="twitter:title" content={title} />}

      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={description} />}
      {description && <meta name="twitter:description" content={description} />}

      {canonical && <link rel="canonical" href={canonical} />}
      {canonical && <meta property="og:url" content={canonical} />}

      <meta property="og:type" content={type} />

      {image && <meta property="og:image" content={image} />}
      {image && <meta name="twitter:image" content={image} />}

      <meta name="twitter:card" content="summary_large_image" />

      {noindex && <meta name="robots" content="noindex" data-seo="true" />}

      {jsonLdString && (
        <script type="application/ld+json" data-seo-jsonld="true">
          {jsonLdString}
        </script>
      )}
    </Helmet>
  );
}
