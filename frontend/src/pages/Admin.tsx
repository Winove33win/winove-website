import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { blogPosts, BlogPost } from "@/data/blogPosts";
import { cases, Case } from "@/data/cases";
import { testimonials, Testimonial } from "@/data/testimonials";
import { SEO } from "@/lib/seo";

const ADMIN_PASSWORD = "winfer333#";

export const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  // Blog form state
  const [blogForm, setBlogForm] = useState({
    title: "",
    slug: "",
    category: "",
    coverImage: "",
    excerpt: "",
    content: "",
    date: "",
    readingTime: "",
    author: "Equipe Winove"
  });

  // Case form state
  const [caseForm, setCaseForm] = useState({
    title: "",
    slug: "",
    client: "",
    tags: "",
    coverImage: "",
    excerpt: "",
    challenge: "",
    solution: "",
    results: "",
    gallery: "",
    date: "",
    metrics: [{ label: "", value: "", description: "" }]
  });

  // Testimonial form state
  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    image: "",
    rating: 5
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({
        title: "Acesso autorizado",
        description: "Bem-vindo ao painel administrativo!",
      });
    } else {
      toast({
        title: "Senha incorreta",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPost: BlogPost = {
      slug: blogForm.slug,
      title: blogForm.title,
      category: blogForm.category,
      readingTime: blogForm.readingTime,
      author: blogForm.author,
      date: blogForm.date,
      coverImage: blogForm.coverImage,
      excerpt: blogForm.excerpt,
      content: blogForm.content
    };

    // Simular adição ao array (em produção seria uma API)
    blogPosts.unshift(newPost);
    
    setBlogForm({
      title: "",
      slug: "",
      category: "",
      coverImage: "",
      excerpt: "",
      content: "",
      date: "",
      readingTime: "",
      author: "Equipe Winove"
    });

    toast({
      title: "Post adicionado!",
      description: "O novo post foi adicionado com sucesso.",
    });
  };

  const handleCaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCase: Case = {
      slug: caseForm.slug,
      title: caseForm.title,
      client: caseForm.client,
      date: caseForm.date,
      coverImage: caseForm.coverImage,
      excerpt: caseForm.excerpt,
      challenge: caseForm.challenge,
      solution: caseForm.solution,
      results: caseForm.results,
      gallery: caseForm.gallery.split(',').map(img => img.trim()),
      tags: caseForm.tags.split(',').map(tag => tag.trim()),
      metrics: caseForm.metrics.filter(metric => metric.label && metric.value)
    };

    // Simular adição ao array (em produção seria uma API)
    cases.unshift(newCase);
    
    setCaseForm({
      title: "",
      slug: "",
      client: "",
      tags: "",
      coverImage: "",
      excerpt: "",
      challenge: "",
      solution: "",
      results: "",
      gallery: "",
      date: "",
      metrics: [{ label: "", value: "", description: "" }]
    });

    toast({
      title: "Case adicionado!",
      description: "O novo case foi adicionado com sucesso.",
    });
  };

  const addMetric = () => {
    setCaseForm(prev => ({
      ...prev,
      metrics: [...prev.metrics, { label: "", value: "", description: "" }]
    }));
  };

  const updateMetric = (index: number, field: string, value: string) => {
    setCaseForm(prev => ({
      ...prev,
      metrics: prev.metrics.map((metric, i) => 
        i === index ? { ...metric, [field]: value } : metric
      )
    }));
  };

  const removeMetric = (index: number) => {
    setCaseForm(prev => ({
      ...prev,
      metrics: prev.metrics.filter((_, i) => i !== index)
    }));
  };

  const handleTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTestimonial: Testimonial = {
      id: testimonials.length + 1,
      name: testimonialForm.name,
      role: testimonialForm.role,
      company: testimonialForm.company,
      content: testimonialForm.content,
      rating: testimonialForm.rating,
      image: testimonialForm.image
    };

    // Simular adição ao array (em produção seria uma API)
    testimonials.unshift(newTestimonial);
    
    setTestimonialForm({
      name: "",
      role: "",
      company: "",
      content: "",
      image: "",
      rating: 5
    });

    toast({
      title: "Depoimento adicionado!",
      description: "O novo depoimento foi adicionado com sucesso.",
    });
  };

  if (!isAuthenticated) {
    return (
      <>
        <SEO
          title="Login administrativo | Winove"
          description="Área restrita para gestão interna da Winove."
          canonical="https://www.winove.com.br/admin"
          noindex
        />
        <div className="min-h-screen bg-background">
        <div className="section--first pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Acesso Administrativo</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Digite a senha"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Entrar
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Painel administrativo | Winove"
        description="Interface interna para gerenciamento manual de conteúdo."
        canonical="https://www.winove.com.br/admin"
        noindex
      />
      <div className="min-h-screen bg-background">
      <div className="section--first pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Painel Administrativo</h1>
              <p className="text-muted-foreground">Gerencie posts do blog, cases de sucesso e depoimentos</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Blog Post Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Adicionar Post do Blog</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBlogSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="blog-title">Título</Label>
                      <Input
                        id="blog-title"
                        value={blogForm.title}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="blog-slug">Slug</Label>
                      <Input
                        id="blog-slug"
                        value={blogForm.slug}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="exemplo-de-slug"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="blog-category">Categoria</Label>
                      <Input
                        id="blog-category"
                        value={blogForm.category}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, category: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="blog-cover">Imagem de Capa (ID do Unsplash)</Label>
                      <Input
                        id="blog-cover"
                        value={blogForm.coverImage}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, coverImage: e.target.value }))}
                        placeholder="photo-1234567890"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="blog-excerpt">Resumo</Label>
                      <Textarea
                        id="blog-excerpt"
                        value={blogForm.excerpt}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, excerpt: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="blog-content">Conteúdo HTML</Label>
                      <Textarea
                        id="blog-content"
                        value={blogForm.content}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, content: e.target.value }))}
                        rows={6}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="blog-date">Data</Label>
                        <Input
                          id="blog-date"
                          type="date"
                          value={blogForm.date}
                          onChange={(e) => setBlogForm(prev => ({ ...prev, date: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="blog-reading">Tempo de Leitura</Label>
                        <Input
                          id="blog-reading"
                          value={blogForm.readingTime}
                          onChange={(e) => setBlogForm(prev => ({ ...prev, readingTime: e.target.value }))}
                          placeholder="8 min"
                          required
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Adicionar Post
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Case Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Adicionar Case de Sucesso</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCaseSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="case-title">Título</Label>
                      <Input
                        id="case-title"
                        value={caseForm.title}
                        onChange={(e) => setCaseForm(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="case-slug">Slug</Label>
                      <Input
                        id="case-slug"
                        value={caseForm.slug}
                        onChange={(e) => setCaseForm(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="exemplo-de-case"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="case-client">Cliente</Label>
                      <Input
                        id="case-client"
                        value={caseForm.client}
                        onChange={(e) => setCaseForm(prev => ({ ...prev, client: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="case-tags">Tags (separadas por vírgula)</Label>
                      <Input
                        id="case-tags"
                        value={caseForm.tags}
                        onChange={(e) => setCaseForm(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder="E-commerce, UI/UX, Performance"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="case-cover">Imagem de Capa (ID do Unsplash)</Label>
                      <Input
                        id="case-cover"
                        value={caseForm.coverImage}
                        onChange={(e) => setCaseForm(prev => ({ ...prev, coverImage: e.target.value }))}
                        placeholder="photo-1234567890"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="case-excerpt">Resumo</Label>
                      <Textarea
                        id="case-excerpt"
                        value={caseForm.excerpt}
                        onChange={(e) => setCaseForm(prev => ({ ...prev, excerpt: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="case-challenge">Desafio</Label>
                      <Textarea
                        id="case-challenge"
                        value={caseForm.challenge}
                        onChange={(e) => setCaseForm(prev => ({ ...prev, challenge: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="case-solution">Solução</Label>
                      <Textarea
                        id="case-solution"
                        value={caseForm.solution}
                        onChange={(e) => setCaseForm(prev => ({ ...prev, solution: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="case-results">Resultados</Label>
                      <Textarea
                        id="case-results"
                        value={caseForm.results}
                        onChange={(e) => setCaseForm(prev => ({ ...prev, results: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="case-gallery">Galeria (IDs do Unsplash separados por vírgula)</Label>
                      <Input
                        id="case-gallery"
                        value={caseForm.gallery}
                        onChange={(e) => setCaseForm(prev => ({ ...prev, gallery: e.target.value }))}
                        placeholder="photo-123, photo-456, photo-789"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="case-date">Data</Label>
                      <Input
                        id="case-date"
                        type="date"
                        value={caseForm.date}
                        onChange={(e) => setCaseForm(prev => ({ ...prev, date: e.target.value }))}
                        required
                      />
                    </div>
                    
                    {/* Metrics */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Métricas</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addMetric}>
                          Adicionar Métrica
                        </Button>
                      </div>
                      
                      {caseForm.metrics.map((metric, index) => (
                        <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                          <Input
                            placeholder="Label"
                            value={metric.label}
                            onChange={(e) => updateMetric(index, 'label', e.target.value)}
                          />
                          <Input
                            placeholder="Valor"
                            value={metric.value}
                            onChange={(e) => updateMetric(index, 'value', e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Input
                              placeholder="Descrição"
                              value={metric.description}
                              onChange={(e) => updateMetric(index, 'description', e.target.value)}
                            />
                            {caseForm.metrics.length > 1 && (
                              <Button 
                                type="button" 
                                variant="destructive" 
                                size="sm"
                                onClick={() => removeMetric(index)}
                              >
                                ×
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Adicionar Case
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Testimonial Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Adicionar Depoimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="testimonial-name">Nome do Cliente</Label>
                      <Input
                        id="testimonial-name"
                        value={testimonialForm.name}
                        onChange={(e) => setTestimonialForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="testimonial-role">Cargo</Label>
                      <Input
                        id="testimonial-role"
                        value={testimonialForm.role}
                        onChange={(e) => setTestimonialForm(prev => ({ ...prev, role: e.target.value }))}
                        placeholder="Ex: CEO, Diretor, etc."
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="testimonial-company">Empresa</Label>
                      <Input
                        id="testimonial-company"
                        value={testimonialForm.company}
                        onChange={(e) => setTestimonialForm(prev => ({ ...prev, company: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="testimonial-content">Texto do Depoimento</Label>
                      <Textarea
                        id="testimonial-content"
                        value={testimonialForm.content}
                        onChange={(e) => setTestimonialForm(prev => ({ ...prev, content: e.target.value }))}
                        rows={4}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="testimonial-image">Imagem (ID do Unsplash)</Label>
                      <Input
                        id="testimonial-image"
                        value={testimonialForm.image}
                        onChange={(e) => setTestimonialForm(prev => ({ ...prev, image: e.target.value }))}
                        placeholder="photo-1234567890"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="testimonial-rating">Avaliação</Label>
                      <select
                        id="testimonial-rating"
                        value={testimonialForm.rating}
                        onChange={(e) => setTestimonialForm(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      >
                        <option value={5}>5 estrelas</option>
                        <option value={4}>4 estrelas</option>
                        <option value={3}>3 estrelas</option>
                        <option value={2}>2 estrelas</option>
                        <option value={1}>1 estrela</option>
                      </select>
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Adicionar Depoimento
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

    </div>
    </>
  );
};
