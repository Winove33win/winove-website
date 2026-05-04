import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/lib/seo";
import {
  ShoppingBag, Globe, Gift, Star, Languages, ArrowRight,
  ChevronDown, X, CheckCircle2, MessageCircle, Zap, BarChart3,
} from "lucide-react";

const WA = "https://api.whatsapp.com/send?phone=5519982403845&text=Olá! Quero saber mais sobre o AI Sommelier para minha loja.";

/* ─── Modal data ─────────────────────────────────────────────────── */
const FINDINGS = [
  {
    id: "f1",
    tag: "Descoberta 1",
    icon: ShoppingBag,
    title: "Quase 1 em 3 perguntas são operacionais",
    stat: "28%",
    color: "#7C1C2A",
    desc: "Das 687 conversas analisadas, 28% eram sobre operações da loja — entregas, pedidos em aberto, horários, reembolsos e cupons. Clientes perguntam tudo ao AI, não apenas sobre vinho.",
    examples: [
      { icon: "📦", text: '"I placed my order 5 days ago and it\'s still not ready"' },
      { icon: "🚗", text: '"Can wine be delivered to Hotel Furama at 12am?"' },
      { icon: "🛍️", text: '"Is click and collect available?"' },
      { icon: "💰", text: '"Do you have any discount codes for first orders?"' },
    ],
    takeaway: "O AI Sommelier precisa conhecer sua loja, não apenas seu catálogo.",
  },
  {
    id: "f2",
    tag: "Descoberta 2",
    icon: Star,
    title: "Pedidos de harmonização são altamente específicos",
    stat: "Contexto",
    color: "#1a5276",
    desc: "O cliente já tem o prato planejado. Ele quer a recomendação certa para aquele prato, orçamento e estilo de bebida — e espera uma resposta de especialista.",
    examples: [
      { icon: "🍖", text: '"I\'m cooking lamb shanks, what red wine under €15 can I get?"' },
      { icon: "🔥", text: '"Wine for a BBQ"' },
      { icon: "🍗", text: '"What bourbon pairs well with chicken?"' },
      { icon: "🥩", text: '"I only know it\'s beef stroganoff. Budget around €15"' },
    ],
    takeaway: "Clientes não procuram vinho — procuram a combinação certa. É o que um sommelier real faz.",
  },
  {
    id: "f3",
    tag: "Descoberta 3",
    icon: Gift,
    title: "Presentes são oportunidades de alto valor",
    stat: "↑ Ticket",
    color: "#1e8449",
    desc: "No contexto de presentear, clientes gastam mais. Querem sugestões ajustadas a uma pessoa, uma ocasião e um orçamento. A recomendação especializada fecha vendas premium.",
    examples: [
      { icon: "🥃", text: '"Whisky para um amigo que ama charutos"' },
      { icon: "🎁", text: '"Presente especial para um amigo que não vejo há muito tempo"' },
      { icon: "🌍", text: '"Writing from outside Ireland, need a Christmas gift to send to a friend"' },
      { icon: "🏮", text: '"Chinese New Year gift for around $200"' },
    ],
    takeaway: "Quanto mais preciso o contexto do presente, maior o ticket médio da venda.",
  },
  {
    id: "f4",
    tag: "Descoberta 4",
    icon: Star,
    title: "Clientes esperam orientação especializada real",
    stat: "Expert",
    color: "#7d3c98",
    desc: "Preferências nuançadas em linguagem natural — exatamente o tipo de pedido que filtros e menus tradicionais não conseguem interpretar. Clientes usam o AI como um sommelier de verdade.",
    examples: [
      { icon: "🍇", text: '"Red wine, dry, smooth, tannins, bold, dark fruits, chocolate"' },
      { icon: "🥂", text: '"A chardonnay for under $30 that is not buttery"' },
      { icon: "🌫️", text: '"Whiskey that can be enjoyed neat. Preference for smoky"' },
      { icon: "🍬", text: '"Can you recommend a wine that is sweet but not too sweet?"' },
    ],
    takeaway: '"Doce, mas não tão doce" — linguagem natural entende. Filtros tradicionais não.',
  },
  {
    id: "f5",
    tag: "Descoberta 5",
    icon: Languages,
    title: "Multilinguismo não é opcional",
    stat: "7+ idiomas",
    color: "#d35400",
    desc: "Clientes fazem perguntas naturalmente no próprio idioma e esperam resposta no mesmo idioma. Se não conseguem, a venda pode ser perdida.",
    examples: [
      { icon: "🇪🇸", text: '"Tienes tequila de México?"' },
      { icon: "🇧🇷", text: '"Preciso apresentar uma amiga"' },
      { icon: "🇩🇪", text: '"Ich weiß nur beef stroganoff"' },
      { icon: "🇬🇧", text: '"Suggest a wine from Europe that pairs well with roasted salmon"' },
    ],
    takeaway: "Multilinguismo é requisito básico — não um diferencial premium.",
  },
];

/* ─── Demo chat sequence ─────────────────────────────────────────── */
const CHAT_MESSAGES = [
  { from: "user", text: "I'm cooking lamb shanks, what red wine under €15 can I get?" },
  { from: "ai",   text: "Para costelinha de cordeiro recomendo um Rioja Crianza por €12,90 🍷 — taninos macios, frutas escuras, harmoniza perfeitamente. Temos em estoque!" },
  { from: "user", text: "Tienes tequila de México?" },
  { from: "ai",   text: "¡Claro! Tenemos 3 tequilas mexicanos: Don Julio Blanco, Patrón Silver y Casa Noble Reposado. ¿Cuál prefieres? 🌵" },
  { from: "user", text: "Can wine be delivered to Hotel Furama at 12am?" },
  { from: "ai",   text: "Sim! Entregamos 24h no Hotel Furama. Taxa noturna: €5. Posso adicionar ao pedido agora? 🚀" },
];

/* ─── useInView hook ─────────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── Counter ────────────────────────────────────────────────────── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const { ref, visible } = useInView(0.5);
  useEffect(() => {
    if (!visible) return;
    const dur = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(target);
    };
    requestAnimationFrame(tick);
  }, [visible, target]);
  return <span ref={ref}>{val.toLocaleString("pt-BR")}{suffix}</span>;
}

/* ─── Modal ──────────────────────────────────────────────────────── */
function FindingModal({
  finding,
  onClose,
}: {
  finding: (typeof FINDINGS)[0] | null;
  onClose: () => void;
}) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  if (!finding) return null;
  const Icon = finding.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl"
        style={{ animation: "modalIn .35s cubic-bezier(.34,1.56,.64,1) both" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 pb-4">
          <div className="flex items-start justify-between mb-4">
            <span
              className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ background: `${finding.color}18`, color: finding.color }}
            >
              {finding.tag}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
          <div
            className="text-5xl font-black mb-2 leading-none"
            style={{ color: finding.color }}
          >
            {finding.stat}
          </div>
          <h3 className="text-xl font-bold text-gray-900 leading-snug">
            {finding.title}
          </h3>
        </div>

        {/* Body */}
        <div className="px-8 pb-8">
          <p className="text-gray-500 text-sm leading-relaxed mb-5">{finding.desc}</p>

          <div className="flex flex-col gap-2 mb-5">
            {finding.examples.map((ex, i) => (
              <div
                key={i}
                className="flex gap-3 items-start bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700"
                style={{ animation: `fadeUp .3s ${i * 0.07}s ease both` }}
              >
                <span className="text-base">{ex.icon}</span>
                <span className="italic">{ex.text}</span>
              </div>
            ))}
          </div>

          <div
            className="flex gap-3 items-start p-4 rounded-xl text-sm font-semibold"
            style={{ background: `${finding.color}10`, color: finding.color, border: `1px solid ${finding.color}25` }}
          >
            <span>✦</span>
            <span>{finding.takeaway}</span>
          </div>

          <a href={WA} target="_blank" rel="noopener noreferrer">
            <Button className="w-full mt-5 gap-2 text-white" style={{ background: finding.color }}>
              <MessageCircle size={16} /> Quero para minha loja
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Demo Chat ──────────────────────────────────────────────────── */
function DemoChat() {
  const { ref, visible } = useInView(0.3);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let i = 0;
    const next = () => {
      if (i >= CHAT_MESSAGES.length) return;
      i++;
      setShown(i);
      setTimeout(next, 1200);
    };
    setTimeout(next, 400);
  }, [visible]);

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-white/10 p-6"
      style={{ background: "linear-gradient(135deg,#1a1025,#120e1c)", boxShadow: "0 40px 80px rgba(0,0,0,.5)" }}
    >
      {/* titlebar */}
      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/10">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <span className="ml-auto text-xs text-white/30">AI Sommelier · Pinpointed</span>
      </div>
      <div className="flex flex-col gap-3 min-h-[280px]">
        {CHAT_MESSAGES.slice(0, shown).map((m, i) => (
          <div
            key={i}
            className={`flex gap-2 items-start ${m.from === "ai" ? "flex-row-reverse" : ""}`}
            style={{ animation: "fadeUp .4s ease both" }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0"
              style={{ background: m.from === "ai" ? "rgba(124,28,42,.5)" : "rgba(255,255,255,.1)" }}
            >
              {m.from === "ai" ? "🍷" : "👤"}
            </div>
            <div
              className="text-sm leading-relaxed max-w-[80%] px-3 py-2 rounded-xl"
              style={{
                background: m.from === "ai" ? "rgba(124,28,42,.25)" : "rgba(255,255,255,.07)",
                color: m.from === "ai" ? "#f0b8c0" : "rgba(255,255,255,.8)",
                borderRadius: m.from === "ai" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        {shown < CHAT_MESSAGES.length && visible && (
          <div className="flex gap-1 items-center ml-9" style={{ animation: "fadeUp .3s ease both" }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-white/40"
                style={{ animation: `typingDot 1.2s ${i * 0.2}s infinite` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────── */
export default function AiSommelier() {
  const [activeModal, setActiveModal] = useState<(typeof FINDINGS)[0] | null>(null);

  // lock scroll when modal open
  useEffect(() => {
    document.body.style.overflow = activeModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeModal]);

  return (
    <>
      <SEO
        title="AI Sommelier — Atendimento Inteligente para Lojas de Vinho e Destilados | Winove"
        description="O AI Sommelier entende harmonização, presentes, operações e até idiomas dos seus clientes. Baseado em 687 conversas reais analisadas em 3 continentes. Implantação em 3 dias."
        canonical="https://winove.com.br/ai-sommelier"
      />

      <style>{`
        @keyframes modalIn { from { opacity:0; transform:scale(.9) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes floatGlass { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-10px) rotate(2deg)} }
        @keyframes pulseRing  { 0%{transform:translate(-50%,-50%) scale(.7);opacity:.7} 100%{transform:translate(-50%,-50%) scale(1.5);opacity:0} }
        @keyframes typingDot  { 0%,80%,100%{transform:scale(.6);opacity:.3} 40%{transform:scale(1);opacity:1} }
        .reveal { opacity:0; transform:translateY(28px); transition: opacity .7s ease, transform .7s ease; }
        .reveal.in { opacity:1; transform:translateY(0); }
        .finding-card { transition: transform .25s, box-shadow .25s, border-color .25s; }
        .finding-card:hover { transform:translateY(-5px); box-shadow:0 20px 60px rgba(0,0,0,.12); }
      `}</style>

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-28 pb-20 overflow-hidden bg-[#0e0b14]">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 55% at 50% 25%, rgba(124,28,42,.3) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(184,150,46,.08) 0%, transparent 60%)",
          }}
        />

        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-7"
          style={{
            background: "rgba(124,28,42,.2)",
            border: "1px solid rgba(124,28,42,.4)",
            color: "#e8a0a8",
            animation: "fadeUp .6s ease both",
          }}
        >
          ✦ Field Study · 687 conversas reais analisadas · Jan–Mar 2026
        </div>

        <h1
          className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] text-white mb-6 max-w-4xl"
          style={{ animation: "fadeUp .7s .1s ease both" }}
        >
          O que seus clientes
          <br />
          <span style={{ color: "#c0394b" }}>realmente perguntam</span>
          <br />
          ao AI Sommelier?
        </h1>

        <p
          className="text-lg md:text-xl text-white/55 max-w-xl mb-10"
          style={{ animation: "fadeUp .7s .2s ease both" }}
        >
          Analisamos 687 conversas reais em 3 continentes. O resultado mudou o que sabemos sobre atendimento inteligente para varejistas de vinho e destilados.
        </p>

        <div
          className="flex flex-wrap gap-3 justify-center"
          style={{ animation: "fadeUp .7s .3s ease both" }}
        >
          <a href={WA} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="gap-2 text-white px-8 py-6 text-base" style={{ background: "#7C1C2A", boxShadow: "0 8px 32px rgba(124,28,42,.45)" }}>
              <MessageCircle size={18} /> Quero para minha loja
            </Button>
          </a>
          <button
            className="px-8 py-3 rounded-xl text-white/70 border border-white/15 text-base hover:bg-white/5 transition-colors"
            onClick={() => document.getElementById("descobertas")?.scrollIntoView({ behavior: "smooth" })}
          >
            Ver as descobertas <ChevronDown className="inline ml-1" size={16} />
          </button>
        </div>

        {/* Glass SVG */}
        <div className="relative mt-16" style={{ animation: "fadeUp .7s .4s ease both" }}>
          <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full border border-[rgba(124,28,42,.25)]" style={{ animation: "pulseRing 2.2s ease infinite", transform: "translate(-50%,-50%)" }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full border border-[rgba(124,28,42,.12)]" style={{ animation: "pulseRing 2.2s .8s ease infinite", transform: "translate(-50%,-50%)" }} />
          <svg viewBox="0 0 200 400" className="w-36 relative z-10" style={{ animation: "floatGlass 4s ease-in-out infinite", filter: "drop-shadow(0 0 40px rgba(124,28,42,.55))" }}>
            <defs>
              <linearGradient id="wg" x1="60" y1="70" x2="160" y2="250" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#d4526a" />
                <stop offset="100%" stopColor="#4a0d16" />
              </linearGradient>
            </defs>
            <ellipse cx="100" cy="160" rx="60" ry="90" fill="url(#wg)" opacity=".9" />
            <ellipse cx="100" cy="200" rx="58" ry="50" fill="#6b1a26" opacity=".4" />
            <path d="M100 250 L100 340" stroke="#8B2030" strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="100" cy="345" rx="44" ry="8" fill="#8B2030" opacity=".55" />
          </svg>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-white/8 bg-white/3" style={{ background: "rgba(255,255,255,.03)" }}>
        {[
          { n: 687, suf: "", label: "conversas analisadas" },
          { n: 3,   suf: "", label: "continentes" },
          { n: 28,  suf: "%", label: "perguntas operacionais" },
          { n: 7,   suf: "+", label: "idiomas detectados" },
        ].map((s, i) => (
          <div key={i} className="py-10 px-6 text-center border-r border-white/8 last:border-r-0">
            <div className="text-4xl md:text-5xl font-black" style={{ color: "#c0394b", letterSpacing: "-2px" }}>
              <Counter target={s.n} suffix={s.suf} />
            </div>
            <div className="text-xs text-white/40 font-medium mt-1.5 uppercase tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── FINDINGS ──────────────────────────────────────────────── */}
      <section id="descobertas" className="py-24 px-4 bg-[#f9f5f0]">
        <div className="max-w-5xl mx-auto">
          <RevealDiv className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4" style={{ background: "rgba(124,28,42,.1)", color: "#7C1C2A", border: "1px solid rgba(124,28,42,.18)" }}>
              5 descobertas-chave
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
              O que 687 conversas revelam
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Clique em cada descoberta para ver exemplos reais e o impacto no seu negócio.
            </p>
          </RevealDiv>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FINDINGS.map((f, i) => {
              const Icon = f.icon;
              return (
                <RevealDiv key={f.id} delay={i * 80}>
                  <button
                    className="finding-card w-full text-left bg-white rounded-2xl p-7 border-2 border-gray-100 relative overflow-hidden"
                    onClick={() => setActiveModal(f)}
                  >
                    <div className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: f.color }}>
                      {f.tag}
                      <span className="flex-1 h-px" style={{ background: `${f.color}20` }} />
                    </div>
                    <Icon size={26} className="mb-3" style={{ color: f.color }} />
                    <div className="text-3xl font-black mb-2 leading-none" style={{ color: f.color }}>{f.stat}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">{f.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{f.desc}</p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: f.color }}>
                      Ver exemplos <ArrowRight size={14} />
                    </span>
                  </button>
                </RevealDiv>
              );
            })}

            {/* CTA card */}
            <RevealDiv delay={FINDINGS.length * 80}>
              <a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className="finding-card flex flex-col justify-between w-full rounded-2xl p-7 border-2 border-transparent"
                style={{ background: "linear-gradient(135deg,#7C1C2A,#4a0d16)" }}
              >
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-white/50 mb-5">Pronto para começar?</div>
                  <Zap size={26} className="mb-3 text-white/80" />
                  <h3 className="text-lg font-bold text-white mb-2">Implante em 3 dias úteis</h3>
                  <p className="text-sm text-white/60 leading-relaxed mb-6">Personalizado com sua marca, catálogo e dados operacionais da loja.</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-white bg-white/15 border border-white/20 rounded-xl px-4 py-3">
                  <MessageCircle size={15} /> Agendar demonstração <ArrowRight size={14} className="ml-auto" />
                </div>
              </a>
            </RevealDiv>
          </div>
        </div>
      </section>

      {/* ── DEMO ──────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-[#0e0b14]">
        <div className="max-w-5xl mx-auto">
          <RevealDiv className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 text-[#e8a0a8]" style={{ background: "rgba(124,28,42,.2)", border: "1px solid rgba(124,28,42,.35)" }}>
              Live demo
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              Veja o AI Sommelier em ação
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Entende contexto, orçamento, ocasião e idioma — tudo em uma única conversa.
            </p>
          </RevealDiv>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <DemoChat />

            <div className="flex flex-col gap-6">
              {[
                { icon: "🧠", title: "Linguagem natural", desc: "Sem filtros, sem menus. O cliente conversa como com um sommelier de verdade." },
                { icon: "🏪", title: "Conhece sua loja", desc: "Horários, estoque, preços, políticas de entrega — tudo integrado e sempre atualizado." },
                { icon: "🌍", title: "7+ idiomas automáticos", desc: "Detecta o idioma e responde no mesmo idioma. Sem configuração extra." },
                { icon: "🎁", title: "Maximiza ticket médio", desc: "Identifica ocasiões de presente e sugere opções premium com base no contexto." },
              ].map((f, i) => (
                <RevealDiv key={i} delay={i * 100} className="flex gap-4 items-start">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: "rgba(124,28,42,.2)", border: "1px solid rgba(124,28,42,.3)" }}>
                    {f.icon}
                  </div>
                  <div>
                    <div className="text-white font-bold mb-1">{f.title}</div>
                    <div className="text-white/50 text-sm leading-relaxed">{f.desc}</div>
                  </div>
                </RevealDiv>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LANGUAGES ─────────────────────────────────────────────── */}
      <section className="py-20 px-4" style={{ background: "#140d1a" }}>
        <div className="max-w-5xl mx-auto">
          <RevealDiv className="mb-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 text-[#e8a0a8]" style={{ background: "rgba(124,28,42,.2)", border: "1px solid rgba(124,28,42,.35)" }}>
              Multilinguismo
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
              Se o cliente não consegue perguntar<br />no próprio idioma, a venda pode ser perdida.
            </h2>
          </RevealDiv>
          <RevealDiv className="flex flex-wrap gap-2 mb-8">
            {["🇬🇧 EN", "🇫🇷 FR", "🇩🇪 DE", "🇳🇱 NL", "🇮🇹 IT", "🇪🇸 ES", "🇧🇷 PT"].map((l) => (
              <span key={l} className="px-4 py-2 rounded-full text-sm font-semibold text-white/70 border border-white/10 hover:border-[rgba(124,28,42,.5)] hover:bg-[rgba(124,28,42,.15)] transition-colors cursor-default">
                {l}
              </span>
            ))}
          </RevealDiv>
          <RevealDiv className="grid sm:grid-cols-2 gap-3">
            {[
              { n: 1, text: "Tienes tequila de México?" },
              { n: 2, text: "Preciso apresentar uma amiga" },
              { n: 3, text: "Ich weiß nur beef stroganoff" },
              { n: 4, text: "Suggest a wine from Europe that pairs well with roasted salmon" },
            ].map((e) => (
              <div key={e.n} className="flex gap-3 items-start px-5 py-4 rounded-xl text-sm text-white/65 border border-white/8 bg-white/4">
                <span className="text-2xl font-black text-[#c0394b] leading-none flex-shrink-0">{e.n}.</span>
                <span className="italic">{e.text}</span>
              </div>
            ))}
          </RevealDiv>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-[#0e0b14]">
        <div className="max-w-2xl mx-auto">
          <RevealDiv>
            <div
              className="rounded-3xl p-12 text-center relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(124,28,42,.22), rgba(184,150,46,.08))",
                border: "1px solid rgba(124,28,42,.25)",
              }}
            >
              <p className="text-white/55 italic text-lg leading-relaxed mb-8">
                <strong className="text-white not-italic">"Clientes tratam o AI Sommelier como um membro da equipe.</strong>
                {" "}Online, esperam o mesmo nível de ajuda que teriam na loja física."
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
                Implante em 3 dias úteis
              </h2>
              <p className="text-white/45 mb-8">
                Personalizado com sua marca, catálogo e dados operacionais. 30 dias gratuitos.
              </p>
              <div className="flex flex-wrap gap-3 justify-center mb-8">
                <a href={WA} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="gap-2 text-white px-8" style={{ background: "#7C1C2A", boxShadow: "0 8px 32px rgba(124,28,42,.4)" }}>
                    <MessageCircle size={17} /> Agendar demonstração gratuita
                  </Button>
                </a>
              </div>
              <div className="flex justify-center flex-wrap gap-6">
                {["Sem custo inicial", "Setup em 3 dias", "30 dias grátis"].map((t) => (
                  <div key={t} className="flex items-center gap-1.5 text-sm text-white/35">
                    <CheckCircle2 size={14} /> {t}
                  </div>
                ))}
              </div>
            </div>
          </RevealDiv>
        </div>
      </section>

      {/* Modal */}
      {activeModal && (
        <FindingModal finding={activeModal} onClose={() => setActiveModal(null)} />
      )}
    </>
  );
}

/* ─── RevealDiv helper ───────────────────────────────────────────── */
function RevealDiv({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "in" : ""} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
