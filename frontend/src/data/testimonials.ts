export interface Testimonial {
  id: number;
  name: string;
  service: string;
  content: string;
  rating: number;
  date: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Leonardo",
    service: "Site de eCommerce",
    content: "Empresa fantástica com ótimo atendimento, respeito de prazos e qualidade na entrega de site do 0! Recomendo muito.",
    rating: 5,
    date: "jun. 2025",
  },
  {
    id: 2,
    name: "ProART",
    service: "Web design avançado",
    content: "Serviço altamente profissional. O Fernando é muito competente e atencioso. Fizemos uma evolução significativa em nosso website feito no Wix Studio e vamos seguir trabalhando com a Winove.",
    rating: 5,
    date: "abr. 2025",
  },
  {
    id: 3,
    name: "Larissa",
    service: "Web design avançado",
    content: "Tudo impecável. Amamos o processo e o resultado.",
    rating: 5,
    date: "dez. 2024",
  },
  {
    id: 4,
    name: "Fernando Moraes",
    service: "Web design avançado",
    content: "Design impecável, profissionais que entendem o briefing e entregam além das expectativas. Recomendo e farei novos jobs com a Winove.",
    rating: 5,
    date: "ago. 2024",
  },
  {
    id: 5,
    name: "Jessica",
    service: "Configurações da loja",
    content: "Perfeito. Muito atencioso, tirou todas as minhas dúvidas. Com certeza indico.",
    rating: 5,
    date: "set. 2024",
  },
  {
    id: 6,
    name: "MarDelPlata",
    service: "Web design avançado",
    content: "Excelente profissionais extremamente atenciosos, me ajudaram a realizar grandes mudanças importantes em nossa página. Recomendamos Winove para todos os corretores de seguros.",
    rating: 5,
    date: "set. 2024",
  },
  {
    id: 7,
    name: "Wax Lab",
    service: "Site de eCommerce",
    content: "Eu adorei o trabalho e o profissionalismo do Fernando! A entrega foi super antes do prazo e tudo ficou perfeito. Ele me ajudou em tudo e prontamente esclareceu minhas dúvidas. Só tenho a agradecer!",
    rating: 5,
    date: "ago. 2024",
  },
  {
    id: 8,
    name: "Yaffa (Candace)",
    service: "Site de eCommerce",
    content: "This company has gone above and beyond! I'm not used to working with a company without seeing them face to face. But they revamped my entire website at such an amazing price and worked with me at every step.",
    rating: 5,
    date: "jun. 2024",
  },
  {
    id: 9,
    name: "Carlos José",
    service: "Web design avançado",
    content: "Esse foi um projeto diferenciado dos tradicionais. O time da Winove captou de forma brilhante as nossas necessidades e rapidamente desenvolveu uma solução incrível.",
    rating: 5,
    date: "mai. 2024",
  },
  {
    id: 10,
    name: "Jackeline",
    service: "Site de eCommerce",
    content: "Fiquei impressionada com a agilidade e a qualidade do atendimento. O resultado final atendeu plenamente às minhas expectativas. A equipe foi extremamente paciente e atenciosa.",
    rating: 5,
    date: "jun. 2024",
  },
  {
    id: 11,
    name: "Marechal",
    service: "SEO",
    content: "Excelente profissional, pode confiar. Resolveu super rápido problemas complexos.",
    rating: 5,
    date: "fev. 2024",
  },
  {
    id: 12,
    name: "Ciência",
    service: "Acessibilidade do site",
    content: "Incrível, rápido, dinâmico, resolveu tudo em cerca de uma hora no máximo. Preço justo. Eficiente. Show! 🙏",
    rating: 5,
    date: "nov. 2023",
  },
  {
    id: 13,
    name: "Núcleo",
    service: "Web design avançado",
    content: "Equipe formidável, são muito atenciosos. Não deixaram a desejar em nada. Recomendo os serviços deles.",
    rating: 5,
    date: "ago. 2023",
  },
  {
    id: 14,
    name: "Daiana",
    service: "Web design clássico",
    content: "Equipe super comprometida, compreensiva, cumpre prazos e gostei bastante da entrega. Parabéns!",
    rating: 5,
    date: "set. 2023",
  },
  {
    id: 15,
    name: "Cris",
    service: "SEO",
    content: "Equipe cordial e ágil. Recomendo a empresa.",
    rating: 5,
    date: "jul. 2023",
  },
];

export const getTestimonial = (id: number): Testimonial | undefined =>
  testimonials.find((t) => t.id === id);
