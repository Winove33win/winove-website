import { useState, useEffect } from "react";
import { ExternalLink, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { API_BASE } from "@/lib/api";
import { normalizeImageUrl } from "@/lib/utils";

interface Case {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  metrics: Array<{ label: string; value: string }>;
}

export const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [cases, setCases] = useState<Case[]>([]);

  const filters = [
    { id: "all", name: "Todos" },
    { id: "E-commerce", name: "E-commerce" },
    { id: "Branding", name: "Branding" },
    { id: "SEO", name: "SEO" },
    { id: "Google Ads", name: "Tráfego Pago" }
  ];

  useEffect(() => {
    const loadCases = async () => {
      try {
        const res = await fetch(`${API_BASE}/cases`);
        if (res.ok) {
          const data: Case[] = await res.json();
          setCases(data.slice(0, 4));
        }
      } catch (err) {
        console.error("fetch cases", err);
      }
    };
    loadCases();
  }, []);

  // Mapear cases para projetos
  const projects = cases.map(caseItem => ({
    slug: caseItem.slug,
    title: caseItem.title,
    description: caseItem.excerpt,
    image: normalizeImageUrl(caseItem.coverImage),
    tags: caseItem.tags,
    results: caseItem.metrics[0]?.value || "Ver resultados"
  }));

  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(project => project.tags.some(tag => tag === activeFilter));

  return (
    <section id="portfolio" className="py-24 bg-gradient-navy relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Portfolio & Cases
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Projetos que transformaram negócios e geraram resultados excepcionais para nossos clientes
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'bg-gradient-primary text-primary-foreground glow-primary'
                    : 'glass text-muted-foreground hover:text-foreground'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <Link
                key={project.slug}
                to={`/cases/${project.slug}`}
                className="block"
              >
                <div
                  className="glass rounded-2xl overflow-hidden hover-lift group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-10 h-10 rounded-full bg-primary/20 glass flex items-center justify-center">
                        <ExternalLink className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-foreground">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Results */}
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-semibold text-sm">
                        {project.results}
                      </span>
                      <div className="text-primary hover:text-primary/80 transition-colors duration-300 text-sm font-medium">
                        Ver Case →
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* View All Button */}
          <div className="text-center mt-12">
            <Link to="/cases" className="btn-secondary px-8 py-4 text-lg">
              Ver Todos os Cases
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
