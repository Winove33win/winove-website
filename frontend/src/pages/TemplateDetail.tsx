import { useParams, Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { useQuery } from '@tanstack/react-query';
import { fetchTemplate } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEO } from "@/lib/seo";
import {
  ArrowLeft,
  Eye,
  CheckCircle,
  Star,
  Download,
  Shield,
  Smartphone,
  Search,
  Users,
  Clock,
  FileText,
} from "lucide-react";

type TemplateAddon = {
  id?: string;
  name?: string;
  priceYear?: number;
  storageGB?: number;
  panel?: string;
  quotaGB?: number;
  accounts?: number;
};

type TemplateBundle = {
  id?: string;
  name?: string;
  firstYear?: number;
  renewalYear?: number;
  includes?: string[];
};

const TemplateDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: template, isLoading } = useQuery({ queryKey: ['template', slug], enabled: !!slug, queryFn: () => fetchTemplate(slug as string) });

  const canonicalBase = "https://www.winove.com.br/templates";
  const canonical = slug ? `${canonicalBase}/${slug}` : canonicalBase;
  const ensureAbsoluteUrl = (url?: string | null) => {
    if (!url) return undefined;
    if (/^https?:\/\//i.test(url)) return url;
    const normalizedPath = url.startsWith("/") ? url : `/${url}`;
    return `https://www.winove.com.br${normalizedPath}`;
  };
  const fallbackDescription = "Veja detalhes completos de um template profissional Wix Studio desenvolvido pela Winove.";
  const seoTitle = template
    ? `${template.title} | Template Wix Studio | Winove`
    : "Template Wix Studio | Winove";
  const seoDescription = template?.description || fallbackDescription;
  const coverImage = ensureAbsoluteUrl(template?.images?.cover);

  // Inline skeleton to manter layout enquanto carrega
  const DetailSkeleton = () => (
    <div className="section--first px-4">
      <div className="container mx-auto">
        <div className="h-6 w-40 bg-muted/40 rounded mb-6 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* esquerda */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-lg overflow-hidden bg-muted/30 h-96 animate-pulse" />
            <div className="space-y-4">
              <div className="h-10 w-3/4 bg-muted/40 rounded animate-pulse" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="rounded-lg bg-muted/30 h-24 animate-pulse" />
                ))}
              </div>
              <div className="rounded-lg bg-muted/30 h-40 animate-pulse" />
            </div>
          </div>
          {/* direita */}
          <div className="space-y-6 lg:col-start-3 lg:row-start-1">
            <div className="rounded-lg bg-muted/30 h-64 animate-pulse" />
            <div className="rounded-lg bg-muted/30 h-32 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );

  const productJsonLd = template
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: template.title,
        description: template.description,
        image: coverImage,
        sku: template.slug,
        url: canonical,
        offers: template.price
          ? {
              "@type": "Offer",
              price: template.price,
              priceCurrency: "BRL",
              availability: "https://schema.org/InStock",
            }
          : undefined,
        brand: {
          "@type": "Organization",
          name: "Winove",
        },
      }
    : undefined;

  const breadcrumbJsonLd = slug
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Templates",
            item: canonicalBase,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: template?.title ?? "Template",
            item: canonical,
          },
        ],
      }
    : undefined;

  const jsonLd = [productJsonLd, breadcrumbJsonLd].filter(Boolean);

  if (isLoading) {
    return (
      <>
        <SEO
          title={seoTitle}
          description={seoDescription}
          canonical={canonical}
          noindex
        />
        <div className="min-h-screen bg-background text-foreground">
          <DetailSkeleton />
          <Footer />
        </div>
      </>
    );
  }

  if (!template) {
    return (
      <>
        <SEO
          title="Template não encontrado | Winove"
          description={fallbackDescription}
          canonical={canonical}
          noindex
        />
        <div className="min-h-screen bg-background text-foreground">
          <div className="section--first px-4">
            <div className="container mx-auto text-center py-16">
              <h1 className="text-2xl font-bold mb-4">Template não encontrado</h1>
              <Link to="/templates">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar para Templates
                </Button>
              </Link>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: template.currency ?? 'BRL',
  });
  const addonsRaw = (template.addons ?? {}) as Record<string, TemplateAddon>;
  const addonsList: TemplateAddon[] = Object.values(addonsRaw);
  const bundlesList: TemplateBundle[] = Array.isArray(template.bundles)
    ? (template.bundles as TemplateBundle[])
    : [];
  const hostingAddon = addonsRaw['hosting'];
  const emailAddon = addonsRaw['email'];

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={canonical}
        image={coverImage}
        jsonLd={jsonLd.length > 0 ? jsonLd : undefined}
      />
      <div className="min-h-screen bg-background text-foreground">
        <div className="section--first px-4">
          <div className="container mx-auto">
            {/* Breadcrumb */}
            <div className="mb-6">
              <Link
                to="/templates"
                className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para Templates
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Image */}
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={coverImage || ''}
                  alt={template.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <a 
                    href={template.demoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button size="lg">
                      <Eye className="w-5 h-5 mr-2" />
                      Ver Demo ao Vivo
                    </Button>
                  </a>
                </div>
              </div>

              {/* Template Info */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">{template.category}</Badge>
                  <Badge variant="outline">{template.difficulty}</Badge>
                  {template.originalPrice && (
                    <Badge className="bg-destructive text-destructive-foreground">
                      -{Math.round(((template.originalPrice - template.price) / template.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>

                <h1 className="text-4xl font-bold mb-4">{template.title}</h1>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-muted-foreground">(4.9) • 150+ vendas</span>
                </div>

                <p className="text-lg text-muted-foreground mb-6">
                  {template.description}
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="text-center p-4 rounded-lg bg-muted/30">
                    <FileText className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="font-medium">{template.pages}</div>
                    <div className="text-sm text-muted-foreground">Páginas</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/30">
                    <Smartphone className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="font-medium">100%</div>
                    <div className="text-sm text-muted-foreground">Responsivo</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/30">
                    <Search className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="font-medium">SEO</div>
                    <div className="text-sm text-muted-foreground">Otimizado</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/30">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="font-medium">30 dias</div>
                    <div className="text-sm text-muted-foreground">Suporte</div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="features" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="features">Recursos</TabsTrigger>
                  <TabsTrigger value="gallery">Galeria</TabsTrigger>
                  <TabsTrigger value="includes">Incluso</TabsTrigger>
                </TabsList>
                
                <TabsContent value="features" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Principais Recursos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(template?.features || []).map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="gallery" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(template?.images?.gallery || []).map((image, index) => (
                      <div key={index} className="rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`${template.title} - Imagem ${index + 1}`}
                          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="includes" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>O que está incluído</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {(template?.includes || []).map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            {/* Rich HTML content from DB (optional) */}
            {template?.content && (
              <div className="lg:col-span-2 lg:row-start-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Descrição Detalhada</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: template.content }} />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Sidebar */}
            <div className="space-y-6 lg:col-start-3 lg:row-start-1">
              {/* Price Card */}
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-6">
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="bg-gradient-to-r from-[#ff8a00] to-[#ffbd66] bg-clip-text text-transparent text-[32px] font-extrabold">
                        {currencyFormatter.format(template.price ?? 0)}
                      </span>
                      {template.originalPrice != null && (
                        <span className="text-lg text-muted-foreground line-through">
                          {currencyFormatter.format(template.originalPrice)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Pagamento único</p>
                  </div>

                  <div className="space-y-3">
                    {(() => {
                      const wa = template.contact?.whatsappIntl ?? '5519982403845';
                      const base = template.contact?.defaultMessage ?? 'Olá! Vim da página do Template Advocacia Blue Mode.';
                      const mk = (msg: string) => {
                        const href = typeof window !== 'undefined' ? window.location.href : '';
                        const utm = href.includes('?') ? '&utm_source=template-advocacia' : '?utm_source=template-advocacia';
                        const page = href ? `${href}${utm}` : 'https://winove.com.br/templates';
                        return `https://wa.me/${wa}?text=${encodeURIComponent(`${base} ${msg} | Página: ${page}`)}`;
                      };

                      const priceNow = currencyFormatter.format(template.price ?? 0);
                      const hostingPrice = hostingAddon?.priceYear != null ? currencyFormatter.format(hostingAddon.priceYear) : 'R$ 564,00';
                      const emailPrice = emailAddon?.priceYear != null ? currencyFormatter.format(emailAddon.priceYear) : 'R$ 250,00';
                      const bundle = bundlesList.length > 0 ? bundlesList[0] : undefined;
                      const bundleFirstYear = bundle?.firstYear != null ? currencyFormatter.format(bundle.firstYear) : 'R$ 1.564,00';
                      const bundleRenewal = bundle?.renewalYear != null ? currencyFormatter.format(bundle.renewalYear) : 'R$ 814,00';
                      const ctas = (template.ctaTexts ?? {}) as Record<string, string>;

                      return (
                        <>
                          <a
                            className="block w-full rounded-xl bg-[#ff8a00] px-4 py-4 text-center text-base font-semibold text-[#111] transition-colors hover:bg-[#ff9a21]"
                            href={mk(`Quero comprar o Template (${priceNow}).`)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {ctas.buyTemplate ?? `Comprar Template — ${priceNow}`}
                          </a>
                          <a
                            className="block w-full rounded-xl border border-[#2b3b4d] px-4 py-4 text-center text-base font-semibold text-[#e6eaf0] transition-colors hover:bg-[#121c29]"
                            href={mk(`Quero adicionar Hospedagem Plesk 3GB (${hostingPrice}/ano).`)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {ctas.hosting ?? 'Adicionar Hospedagem Plesk 3GB — R$ 564/ano'}
                          </a>
                          <a
                            className="block w-full rounded-xl border border-[#2b3b4d] px-4 py-4 text-center text-base font-semibold text-[#e6eaf0] transition-colors hover:bg-[#121c29]"
                            href={mk(`Quero adicionar E-mail corporativo 3GB (${emailPrice}/ano).`)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {ctas.email ?? 'Adicionar E-mail Corporativo 3GB — R$ 250/ano'}
                          </a>
                          <a
                            className="block w-full rounded-xl bg-[#e0b14c] px-4 py-4 text-center text-base font-semibold text-[#0c1b2a] transition-colors hover:bg-[#efc465]"
                            href={mk(`Quero o Combo: Site + Hospedagem + E-mail (1º ano ${bundleFirstYear}; renovação ${bundleRenewal}/ano).`)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {ctas.bundle ?? 'Combo (Site + Hospedagem + E-mail) — R$ 1.564 (1º ano)'}
                          </a>
                        </>
                      );
                    })()}
                  </div>

                  {addonsList.length > 0 && (
                    <div className="space-y-2 text-left">
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Opcionais</h4>
                      <div className="space-y-2">
                        {addonsList.map((addon) => {
                          const priceYear = addon?.priceYear != null ? `${currencyFormatter.format(addon.priceYear)}/ano` : null;
                          const extras = [
                            addon?.storageGB != null ? `${addon.storageGB}GB` : null,
                            addon?.panel,
                            addon?.quotaGB != null ? `${addon.quotaGB}GB` : null,
                            addon?.accounts != null ? `${addon.accounts} conta${addon.accounts > 1 ? 's' : ''}` : null,
                          ].filter(Boolean).join(' · ');
                          return (
                            <div key={addon?.id ?? addon?.name} className="rounded-xl border border-[#1f2a3a] bg-[#121b2c] px-4 py-3">
                              <div className="flex items-baseline justify-between gap-2">
                                <span className="text-sm font-semibold text-foreground">{addon?.name}</span>
                                {priceYear && <span className="text-xs font-semibold text-[#e0b14c]">{priceYear}</span>}
                              </div>
                              {extras && <p className="mt-1 text-xs text-muted-foreground">{extras}</p>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {bundlesList.length > 0 && (
                    <div className="space-y-2 text-left">
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Combos</h4>
                      <div className="space-y-2">
                        {bundlesList.map((bundle) => {
                          const firstYear = bundle?.firstYear != null ? currencyFormatter.format(bundle.firstYear) : null;
                          const renewal = bundle?.renewalYear != null ? currencyFormatter.format(bundle.renewalYear) : null;
                          return (
                            <div key={bundle?.id ?? bundle?.name} className="rounded-xl border border-[#1f2a3a] bg-[#121b2c] px-4 py-3">
                              <div className="flex flex-col gap-1 text-sm">
                                <span className="font-semibold text-foreground">{bundle?.name}</span>
                                {(firstYear || renewal) && (
                                  <span className="text-xs text-muted-foreground">
                                    {firstYear && `1º ano ${firstYear}`}
                                    {firstYear && renewal && ' • '}
                                    {renewal && `Renovação ${renewal}/ano`}
                                  </span>
                                )}
                                {Array.isArray(bundle?.includes) && bundle.includes.length > 0 && (
                                  <span className="text-xs text-muted-foreground">Inclui: {bundle.includes.join(', ')}</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-border space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>Garantia de 7 dias</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Download className="w-4 h-4 text-primary" />
                      <span>Download imediato</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-primary" />
                      <span>Suporte incluso</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(template?.tags || []).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
    </>
  );
};

export default TemplateDetail;
