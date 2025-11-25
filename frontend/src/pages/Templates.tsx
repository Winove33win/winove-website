import { useMemo, useState } from "react";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { fetchTemplates, Template } from '@/lib/api';
import { Search, Eye, Star, Filter } from "lucide-react";
import { SEO } from "@/lib/seo";

const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: templates = [], isLoading } = useQuery<Template[]>({
    queryKey: ['templates'],
    queryFn: fetchTemplates,
  });

  // Build dynamic category list from API data
  const categories = useMemo(() => {
    const set = new Set<string>();
    templates.forEach((t) => {
      const c = (t.category || "").toString().trim();
      if (c) set.add(c);
    });
    return ["Todos", ...Array.from(set)];
  }, [templates]);

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory =
      selectedCategory === "Todos" ||
      (template.category || '').toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (template.description || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (template.tags || []).some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const baseUrl = "https://www.winove.com.br";
  const collectionUrl = `${baseUrl}/templates`;

  const jsonLd = useMemo(() => {
    const breadcrumbList = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: baseUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Templates",
          item: collectionUrl,
        },
      ],
    };

    if (isLoading) {
      return [
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Templates Wix Studio",
          url: collectionUrl,
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              item: {
                "@type": "Product",
                name: "Template Wix Studio",
                url: collectionUrl,
                offers: {
                  "@type": "Offer",
                  priceCurrency: "BRL",
                  price: "0",
                  availability: "https://schema.org/PreOrder",
                },
                category: "Templates",
              },
            },
          ],
        },
        breadcrumbList,
      ];
    }

    const itemListElement = filteredTemplates.map((template, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: template.title,
        url: `${collectionUrl}/${template.slug}`,
        offers: {
          "@type": "Offer",
          priceCurrency: "BRL",
          price: template.price,
        },
        category: template.category,
      },
    }));

    return [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Templates Wix Studio",
        url: collectionUrl,
        itemListElement,
      },
      breadcrumbList,
    ];
  }, [baseUrl, collectionUrl, filteredTemplates, isLoading]);

  return (
    <>
      <SEO
        title="Templates Wix Studio | Winove"
        description="Acelere seu projeto com nossos templates profissionais para Wix Studio. Designs modernos, responsivos e otimizados para conversão."
        canonical={collectionUrl}
        jsonLd={jsonLd}
      />
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="section--first pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Templates Wix Studio
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Acelere seu projeto com nossos templates profissionais para Wix Studio. 
            Designs modernos, responsivos e otimizados para conversão.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="px-4 pb-8">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Categorias:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="px-4 pb-16">
        <div className="container mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {filteredTemplates.length} Template{filteredTemplates.length !== 1 ? 's' : ''} Encontrado{filteredTemplates.length !== 1 ? 's' : ''}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <div>Carregando templates...</div>
            ) : (
              filteredTemplates.map((template) => {
                return (
                  <Card key={template.slug} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
                    <CardHeader className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={template.images.cover}
                          alt={template.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <Link to={`/templates/${template.slug}`}>
                            <Button
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Demo
                            </Button>
                          </Link>
                        </div>
                        {template.originalPrice && (
                          <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
                            -{Math.round(((template.originalPrice - template.price) / template.originalPrice) * 100)}%
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {template.difficulty}
                        </Badge>
                      </div>

                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {template.title}
                      </h3>

                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {template.description}
                      </p>

                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">(4.9)</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <span>{template.pages} páginas</span>
                        <span>•</span>
                        <span>Responsivo</span>
                        <span>•</span>
                        <span>SEO</span>
                      </div>
                    </CardContent>

                    <CardFooter className="p-6 pt-0">
                      <div className="w-full space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-primary">
                                R$ {template.price.toFixed(2).replace('.', ',')}
                              </span>
                              {template.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  R$ {template.originalPrice.toFixed(2).replace('.', ',')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link to={`/templates/${template.slug}`} className="flex-1">
                            <Button variant="outline" className="w-full">
                              Ver Detalhes
                            </Button>
                          </Link>
                          <Link to={`/templates/${template.slug}`} className="flex-1">
                            <Button className="w-full btn-primary">
                              Comprar Agora
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })
            )}
          </div>
          
          {filteredTemplates.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">Nenhum template encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros ou termo de busca.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
    </>
  );
};

export default Templates;
