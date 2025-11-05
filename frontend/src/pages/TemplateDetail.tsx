import { useParams, Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { useQuery } from '@tanstack/react-query';
import { fetchTemplate } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from "@stripe/stripe-js";
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

const TemplateDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();

  const { data: template, isLoading } = useQuery({ queryKey: ['template', slug], enabled: !!slug, queryFn: () => fetchTemplate(slug as string) });

  const canonicalBase = "https://www.winove.com.br/templates";
  const canonical = slug ? `${canonicalBase}/${slug}` : canonicalBase;
  const fallbackDescription = "Veja detalhes completos de um template profissional Wix Studio desenvolvido pela Winove.";
  const seoTitle = template
    ? `${template.title} | Template Wix Studio | Winove`
    : "Template Wix Studio | Winove";
  const seoDescription = template?.description || fallbackDescription;

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

  const jsonLd = template
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: template.title,
        description: template.description,
        image: template.images?.cover,
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

  // Template meta (may come from backend as json string/object)
  const meta = (template as any).meta || {};

  // WhatsApp link builder (uses meta with sensible defaults)
  const wa = meta?.contact?.whatsappIntl ?? '5519982403845';
  const base = meta?.contact?.defaultMessage ?? 'Olá! Vim da página do Template Advocacia Blue Mode.';
  const mk = (msg: string) => {
    const href = typeof window !== 'undefined' ? window.location.href : '';
    const utm = href.includes('?') ? '&utm_source=template-advocacia' : '?utm_source=template-advocacia';
    const page = href ? href + utm : 'https://winove.com.br/templates';
    return `https://wa.me/${wa}?text=${encodeURIComponent(`${base} ${msg} | Página: ${page}`)}`;
  };

  const handlePurchase = async () => {
    try {
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      const API = import.meta.env.VITE_API_URL || "/api";

      const response = await fetch(`${API}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: template.slug }),
      });

      const text = await response.text();
      if (!text) throw new Error("Resposta vazia do servidor");
      const { sessionId } = JSON.parse(text);

      if (sessionId && stripe) {
        await stripe.redirectToCheckout({ sessionId });
      } else {
        toast({ title: "Erro", description: "Erro ao criar sessão de pagamento." });
      }
    } catch (err) {
      console.error("Erro ao redirecionar:", err);
      toast({ title: "Erro", description: "Não foi possível redirecionar." });
    }
  };

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={canonical}
        image={template?.images?.cover}
        jsonLd={jsonLd}
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
                  src={template?.images?.cover || ''}
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
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-3xl font-bold text-primary">
                        R$ {template.price.toFixed(2).replace('.', ',')}
                      </span>
                      {template.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          R$ {template.originalPrice.toFixed(2).replace('.', ',')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Pagamento único</p>
                    {/* Optional addons shown beside price */}
                    {meta?.addons && (
                      <div className="mt-3 text-sm text-muted-foreground">
                        {meta.addons.hosting && (
                          <div>Hospedagem: {meta.addons.hosting.name ?? 'Hospedagem'} — R$ {meta.addons.hosting.priceYear}{meta.addons.hosting.priceYear ? '/ano' : ''}</div>
                        )}
                        {meta.addons.email && (
                          <div>E-mail: {meta.addons.email.name ?? 'E-mail'} — R$ {meta.addons.email.priceYear ?? meta.addons.email.price}{meta.addons.email.priceYear ? '/ano' : ''}</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {/* WhatsApp CTAs (open wa.me with prefilled message + page URL) */}
                    <a
                      href={mk('Quero comprar o Template (R$ ' + template.price.toFixed(2).replace('.', ',') + ').')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full" size="lg">
                        <Download className="w-5 h-5 mr-2" />
                        {meta?.ctaTexts?.buyTemplate ?? `Comprar Template — R$ ${template.price.toFixed(2).replace('.', ',')}`}
                      </Button>
                    </a>

                    <a
                      href={mk('Quero adicionar Hospedagem Plesk 3GB (R$ 564/ano).')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button variant="outline" className="w-full" size="lg">
                        <Shield className="w-5 h-5 mr-2" />
                        {meta?.ctaTexts?.hosting ?? 'Adicionar Hospedagem Plesk 3GB — R$ 564/ano'}
                      </Button>
                    </a>

                    <a
                      href={mk('Quero adicionar E-mail corporativo 3GB (R$ 250/ano).')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button variant="outline" className="w-full" size="lg">
                        <Users className="w-5 h-5 mr-2" />
                        {meta?.ctaTexts?.email ?? 'Adicionar E-mail Corporativo 3GB — R$ 250/ano'}
                      </Button>
                    </a>

                    <a
                      href={mk('Quero o Combo: Site + Hospedagem + E-mail (1º ano R$ 1.564; renovação R$ 814/ano).')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full" size="lg">
                        <Star className="w-5 h-5 mr-2" />
                        {meta?.ctaTexts?.bundle ?? 'Combo (Site + Hospedagem + E-mail) — R$ 1.564 (1º ano)'}
                      </Button>
                    </a>

                    {/* Keep original actions (demo/purchase via checkout) below for users who prefer direct purchase */}
                    <div className="mt-2">
                      <Button 
                        onClick={handlePurchase}
                        className="w-full mt-2" 
                        size="lg"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Comprar (Checkout)
                      </Button>
                      <a 
                        href={template.demoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button variant="outline" className="w-full mt-2" size="lg">
                          <Eye className="w-5 h-5 mr-2" />
                          Ver Demo
                        </Button>
                      </a>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border space-y-3">
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
