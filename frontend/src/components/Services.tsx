import { Search, Megaphone, Code, Palette, TrendingUp, FolderOpen } from "lucide-react";
import { useState } from "react";
export const Services = () => {
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const services = [{
    icon: Search,
    title: "SEO Estratégico",
    description: "Otimização completa para posicionar sua marca no topo dos resultados de busca.",
    features: ["Auditoria técnica", "Pesquisa de palavras-chave", "Otimização on-page", "Link building"],
    color: "from-blue-500 to-blue-600"
  }, {
    icon: Megaphone,
    title: "Gestão de Tráfego Pago",
    description: "Campanhas de alta performance no Google Ads, Facebook e outras plataformas.",
    features: ["Google Ads", "Facebook Ads", "LinkedIn Ads", "Análise de ROI"],
    color: "from-green-500 to-green-600"
  }, {
    icon: Code,
    title: "Desenvolvimento Web",
    description: "Sites e aplicações web modernas, rápidas e otimizadas para conversão.",
    features: ["Sites responsivos", "E-commerce", "Aplicações web", "Performance"],
    color: "from-purple-500 to-purple-600"
  }, {
    icon: Palette,
    title: "Branding e Design",
    description: "Identidade visual única que conecta sua marca com o público-alvo.",
    features: ["Identidade visual", "Design gráfico", "UI/UX Design", "Material gráfico"],
    color: "from-pink-500 to-pink-600"
  }, {
    icon: TrendingUp,
    title: "Consultoria de Negócios Digitais",
    description: "Estratégias personalizadas para acelerar o crescimento do seu negócio online.",
    features: ["Estratégia digital", "Análise de mercado", "Planejamento", "Growth hacking"],
    color: "from-orange-500 to-orange-600"
  }, {
    icon: FolderOpen,
    title: "Sistema de Gestão Documental",
    description: "Centralize documentos na nuvem com controle de acesso, busca avançada e backup automático.",
    features: ["Armazenamento em nuvem", "Controle de permissões", "Busca avançada", "Backup automático"],
    color: "from-red-500 to-red-700"
  }];
  return <section id="services" className="py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl" style={{
        animationDelay: '3s'
      }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Nossos Serviços
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Soluções completas e integradas para transformar sua presença digital e acelerar seus resultados
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
            const IconComponent = service.icon;
            const isHovered = hoveredService === index;
            return <div key={service.title} className={`glass rounded-2xl p-8 cursor-pointer transition-all duration-500 hover-lift animate-fade-in-up ${isHovered ? 'glow-primary scale-105' : ''}`} style={{
              animationDelay: `${index * 0.1}s`
            }} onMouseEnter={() => setHoveredService(index)} onMouseLeave={() => setHoveredService(null)}>
                  <div className="flex flex-col h-full">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${isHovered ? 'bg-gradient-primary scale-110' : 'bg-secondary'}`}>
                      <IconComponent className={`w-8 h-8 transition-colors duration-300 ${isHovered ? 'text-primary-foreground' : 'text-primary'}`} />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold mb-4 text-slate-50">
                      {service.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-6 flex-grow">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className={`transition-all duration-300 ${isHovered ? 'opacity-100 max-h-40' : 'opacity-70 max-h-0 overflow-hidden'}`}>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => <li key={feature} className="text-sm text-muted-foreground flex items-center" style={{
                      animationDelay: `${isHovered ? featureIndex * 0.05 : 0}s`,
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered ? 'translateX(0)' : 'translateX(-10px)',
                      transition: 'all 0.3s ease'
                    }}>
                            <div className="w-1 h-1 bg-primary rounded-full mr-3" />
                            {feature}
                          </li>)}
                      </ul>
                    </div>
                  </div>
                </div>;
          })}
          </div>
        </div>
      </div>
    </section>;
};