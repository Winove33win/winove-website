import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu, X, ChevronDown, Zap, Globe, Mail, MessageSquare, FileText,
  BookOpen, GraduationCap, Briefcase, LayoutTemplate, Tag, ArrowRight,
  ClipboardList, Wine, ArrowUpRight,
} from "lucide-react";

/* ─── Data ────────────────────────────────────────────────────────── */

const solutionGroups = [
  {
    label: "Presença Digital",
    color: "#3b82f6",
    items: [
      { name: "Serviços Web",  href: "/servicos",   icon: Globe,          desc: "Sites, SEO e estratégia digital" },
      { name: "Templates",     href: "/templates",  icon: LayoutTemplate, desc: "Sites prontos para decolar" },
    ],
  },
  {
    label: "Comunicação",
    color: "#10b981",
    items: [
      { name: "E-mail Corporativo", href: "/email-corporativo", icon: Mail,           desc: "E-mail com domínio próprio" },
      { name: "Chat WhatsApp",      href: "/chat-whatsapp",     icon: MessageSquare,  desc: "CRM e chatbot no WhatsApp" },
    ],
  },
  {
    label: "Sistemas",
    color: "#f59e0b",
    items: [
      { name: "Gestão Documental",    href: "/sistema-gestao-documental",   icon: FileText,    desc: "ECM e automação de documentos" },
      { name: "Sistema de Propostas", href: "/sistema-proposta-comercial",  icon: ClipboardList, desc: "Propostas que fecham vendas" },
    ],
  },
  {
    label: "IA Especializada",
    color: "#7C1C2A",
    items: [
      { name: "AI Sommelier", href: "/ai-sommelier", icon: Wine, desc: "Atendimento IA para wine & spirits" },
    ],
  },
];

const content = [
  { name: "Blog",   href: "/blog",   icon: BookOpen,      desc: "Dicas, cases e tendências digitais" },
  { name: "Cases",  href: "/cases",  icon: Briefcase,     desc: "Projetos e resultados reais" },
  { name: "Cursos", href: "/cursos", icon: GraduationCap, desc: "Aprenda com os especialistas" },
];

const WA_LINK = "https://api.whatsapp.com/send?phone=5519982403845";

/* ─── Mega-menu dropdown ──────────────────────────────────────────── */

function SolucoesDropdown({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isActive = solutionGroups.some((g) => g.items.some((i) => pathname.startsWith(i.href)));

  const open_  = () => { if (timer.current) clearTimeout(timer.current); setOpen(true); };
  const close_ = () => { timer.current = setTimeout(() => setOpen(false), 140); };

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative" onMouseEnter={open_} onMouseLeave={close_}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`relative flex items-center gap-1 text-sm font-medium transition-colors duration-200 py-1 ${
          isActive ? "text-primary" : "text-foreground/80 hover:text-foreground"
        }`}
        aria-expanded={open}
      >
        Soluções
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""} text-muted-foreground`} />
        {isActive && <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-primary" />}
      </button>

      {open && <div className="absolute top-full left-1/2 -translate-x-1/2 w-[640px] h-4" />}

      <div
        className={`absolute top-full pt-4 transition-all duration-200 origin-top ${
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{ left: "50%", transform: `translateX(-50%) ${open ? "scaleY(1)" : "scaleY(.95)"}`, width: 640 }}
      >
        <div className="flex justify-center mb-1.5">
          <div className="w-3 h-3 rotate-45 bg-background border-l border-t border-white/10" />
        </div>

        <div
          className="rounded-2xl shadow-2xl overflow-hidden"
          style={{
            background: "hsl(var(--background))",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          {/* Grid of groups */}
          <div className="grid grid-cols-2 gap-0 p-5">
            {solutionGroups.map((group) => (
              <div key={group.label} className="p-3">
                <div
                  className="text-[10px] font-bold uppercase tracking-widest mb-2.5 flex items-center gap-1.5"
                  style={{ color: group.color }}
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: group.color }} />
                  {group.label}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                          active ? "bg-primary/10" : "hover:bg-white/6"
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                          style={{ background: active ? `${group.color}25` : `${group.color}15` }}
                        >
                          <Icon className="w-4 h-4" style={{ color: group.color }} />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold leading-tight ${active ? "text-primary" : "text-foreground"}`}>
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground leading-snug">{item.desc}</p>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-60 ml-auto flex-shrink-0 transition-opacity" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer strip */}
          <div
            className="border-t px-8 py-3 flex items-center justify-between"
            style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}
          >
            <span className="text-xs text-muted-foreground">Não encontrou o que precisa?</span>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
              onClick={() => setOpen(false)}
            >
              <Zap className="w-3 h-3" /> Falar com especialista
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Conteúdo dropdown (mantido simples) ─────────────────────────── */

function ConteudoDropdown({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isActive = content.some((i) => pathname.startsWith(i.href));

  const open_  = () => { if (timer.current) clearTimeout(timer.current); setOpen(true); };
  const close_ = () => { timer.current = setTimeout(() => setOpen(false), 140); };

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative" onMouseEnter={open_} onMouseLeave={close_}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`relative flex items-center gap-1 text-sm font-medium transition-colors duration-200 py-1 ${
          isActive ? "text-primary" : "text-foreground/80 hover:text-foreground"
        }`}
        aria-expanded={open}
      >
        Conteúdo
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""} text-muted-foreground`} />
        {isActive && <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-primary" />}
      </button>

      {open && <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 h-4" />}

      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 w-64 transition-all duration-200 origin-top ${
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex justify-center mb-1.5">
          <div className="w-3 h-3 rotate-45 bg-background border-l border-t border-white/10" />
        </div>
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "hsl(var(--background))",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          {content.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 group ${
                  active ? "bg-primary/10 border-l-2 border-primary" : "hover:bg-white/5 border-l-2 border-transparent"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  active ? "bg-primary/20" : "bg-white/5 group-hover:bg-primary/10"
                }`}>
                  <Icon className={`w-4 h-4 ${active ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${active ? "text-primary" : "text-foreground group-hover:text-primary"}`}>{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Mobile menu ─────────────────────────────────────────────────── */

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = useLocation();
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(false);

  useEffect(() => {
    if (!open) { setSolutionsOpen(false); setContentOpen(false); }
  }, [open]);

  const allSolutionItems = solutionGroups.flatMap((g) =>
    g.items.map((i) => ({ ...i, groupColor: g.color, groupLabel: g.label }))
  );

  return (
    <div className={`fixed inset-0 z-40 transition-all duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className={`absolute top-0 right-0 h-full w-80 max-w-[90vw] bg-[hsl(var(--card))] border-l border-white/8 flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <span className="text-lg font-bold text-primary">Winove</span>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
          <Link to="/" onClick={onClose} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${location.pathname === "/" ? "bg-primary/10 text-primary" : "text-foreground/80 hover:bg-white/5 hover:text-foreground"}`}>
            Início
          </Link>

          {/* Soluções */}
          <div>
            <button
              onClick={() => setSolutionsOpen((o) => !o)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:bg-white/5 hover:text-foreground transition-colors"
            >
              Soluções
              <ChevronDown className={`w-4 h-4 transition-transform ${solutionsOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-200 ${solutionsOpen ? "max-h-[500px]" : "max-h-0"}`}>
              <div className="pl-2 pt-1 space-y-3">
                {solutionGroups.map((group) => (
                  <div key={group.label}>
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: group.color }}>
                      {group.label}
                    </div>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={onClose}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                            location.pathname === item.href ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                          }`}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div>
            <button
              onClick={() => setContentOpen((o) => !o)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:bg-white/5 hover:text-foreground transition-colors"
            >
              Conteúdo
              <ChevronDown className={`w-4 h-4 transition-transform ${contentOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-200 ${contentOpen ? "max-h-48" : "max-h-0"}`}>
              <div className="pl-3 pt-1 space-y-0.5">
                {content.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                        location.pathname === item.href ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <Link to="/promocoes" onClick={onClose} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${location.pathname === "/promocoes" ? "bg-primary/10 text-primary" : "text-foreground/80 hover:bg-white/5 hover:text-foreground"}`}>
            <Tag className="w-4 h-4" /> Promoções
          </Link>
        </nav>

        <div className="p-4 border-t border-white/8 space-y-3">
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="block">
            <Button className="btn-primary w-full gap-2" onClick={onClose}>
              <Zap className="w-4 h-4" /> Falar no WhatsApp
            </Button>
          </a>
          <p className="text-xs text-center text-muted-foreground">Atendimento rápido · Sem compromisso</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Header ──────────────────────────────────────────────────────── */

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () => {
      document.documentElement.style.setProperty("--header-h", `${el.getBoundingClientRect().height}px`);
      document.documentElement.classList.add("has-sticky-header");
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => { ro.disconnect(); window.removeEventListener("resize", update); };
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <div id="site-header" ref={headerRef} className="fixed top-0 left-0 z-50 w-full">
        {/* Promo bar */}
        <div className="w-full bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-3">
            <span className="text-xs md:text-sm font-medium">
              🔥 Promoções exclusivas com até 40% off — por tempo limitado
            </span>
            <Link
              to="/promocoes"
              className="hidden sm:flex items-center gap-1 text-xs font-semibold bg-primary-foreground/15 hover:bg-primary-foreground/25 border border-primary-foreground/30 rounded-full px-3 py-1 transition-all duration-200"
            >
              Ver ofertas <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Nav */}
        <header className={`w-full transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-xl border-b border-white/8 shadow-[0_2px_20px_rgba(0,0,0,0.4)]"
            : "bg-background/70 backdrop-blur-md border-b border-white/5"
        }`}>
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="text-2xl font-extrabold text-primary hover:text-primary/85 transition-colors duration-200 tracking-tight">
                Winove
              </Link>

              <nav className="hidden lg:flex items-center gap-7">
                <Link
                  to="/"
                  className={`relative text-sm font-medium transition-colors duration-200 py-1 ${location.pathname === "/" ? "text-primary" : "text-foreground/80 hover:text-foreground"}`}
                >
                  Início
                  {location.pathname === "/" && <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-primary" />}
                </Link>

                <SolucoesDropdown pathname={location.pathname} />
                <ConteudoDropdown pathname={location.pathname} />

                <Link
                  to="/promocoes"
                  className={`relative flex items-center gap-1 text-sm font-medium transition-colors duration-200 py-1 ${location.pathname === "/promocoes" ? "text-primary" : "text-foreground/80 hover:text-foreground"}`}
                >
                  <span className="relative">
                    Promoções
                    <span className="absolute -top-1.5 -right-2.5 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  </span>
                  {location.pathname === "/promocoes" && <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-primary" />}
                </Link>
              </nav>

              <div className="hidden lg:flex items-center gap-3">
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                  <Button className="btn-primary gap-2 h-9 text-sm px-5">
                    <Zap className="w-3.5 h-3.5" /> Falar no WhatsApp
                  </Button>
                </a>
              </div>

              <button
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/8 transition-colors"
                onClick={() => setMobileOpen(true)}
                aria-label="Abrir menu"
              >
                <Menu className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>
        </header>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
};
