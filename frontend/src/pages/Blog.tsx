import BlogList from "@/components/BlogList";

export default function BlogPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <div className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-navy via-background to-background">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -left-12 top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute inset-y-12 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-primary/20 to-transparent lg:block" />
        </div>

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/80 backdrop-blur">
            Conteúdos e tendências
          </span>
          <div className="space-y-4 text-balance">
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Insights para potencializar a presença digital da sua marca
            </h1>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
              Reunimos estratégias, estudos de caso e novidades do universo digital para inspirar decisões mais inteligentes.
              Explore os conteúdos abaixo e encontre o próximo passo para evoluir a comunicação da sua empresa.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-24">
        <BlogList />
      </div>
    </main>
  );
}
