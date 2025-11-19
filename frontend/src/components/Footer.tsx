import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  const quickLinks = [
    { name: "Sobre Nós", href: "#about" },
    { name: "Serviços", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Blog", href: "#blog" },
    { name: "Contato", href: "#contact" }
  ];

  const services = [
    { name: "SEO Estratégico", href: "#" },
    { name: "Tráfego Pago", href: "#" },
    { name: "Desenvolvimento Web", href: "#" },
    { name: "Branding & Design", href: "#" },
    { name: "Consultoria Digital", href: "#" }
  ];

  const socialLinks = [
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" }
  ];

  return (
    <footer className="bg-background border-t border-border/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary/8 rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <h3 className="text-3xl font-bold text-primary mb-4">Winove</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Transformamos negócios através de estratégias digitais inovadoras, 
                  tecnologia de ponta e design que conecta marcas ao seu público.
                </p>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>+55 19 98240-3845</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>criacao@winove.com.br</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>São Paulo, SP - Brasil</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="w-10 h-10 rounded-full glass border border-border/20 flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 group"
                      aria-label={social.name}
                    >
                      <IconComponent className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-6">
                Links Rápidos
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-6">
                Nossos Serviços
              </h4>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service.name}>
                    <a
                      href={service.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      {service.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-6">
                Newsletter
              </h4>
              <p className="text-muted-foreground mb-4">
                Receba insights exclusivos sobre marketing digital e estratégias de crescimento.
              </p>
              
              <div className="space-y-4">
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Seu melhor email"
                    className="flex-1 px-4 py-3 rounded-l-lg bg-secondary border border-border/20 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors duration-300"
                  />
                  <button className="px-6 py-3 bg-gradient-primary text-primary-foreground rounded-r-lg hover:bg-primary/90 transition-colors duration-300 font-medium">
                    Assinar
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Respeitamos sua privacidade. Sem spam, apenas conteúdo de valor.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/20 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-muted-foreground text-sm">
              © 2024 Winove. Todos os direitos reservados.
            </div>
            
            <div className="flex gap-6 text-sm">
              <a
                href="/politica-de-privacidade"
                className="text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                Política de Privacidade
              </a>
              <a
                href="/termos-de-uso"
                className="text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                Termos de Uso
              </a>
              <a
                href="/politica-de-cookies"
                className="text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};