<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Blog Winove — Artigos e insights sobre Wix Studio e soluções digitais</title>
  <meta name="description" content="Explore artigos, cases e novidades da Winove sobre Wix Studio, automações, estratégias digitais e design para experiências online memoráveis." />
  <link rel="canonical" href="https://www.winove.com.br/blog" />
  <meta property="og:title" content="Blog Winove — Insights e novidades sobre Wix Studio" />
  <meta property="og:description" content="Descubra conteúdos sobre Wix Studio, automações e estratégias digitais criados pela equipe Winove." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://www.winove.com.br/blog" />
  <meta property="og:image" content="https://www.winove.com.br/assets/hero-background-BoObiYUn.jpg" />
  <meta name="twitter:image" content="https://www.winove.com.br/assets/hero-background-BoObiYUn.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Blog Winove — Insights e novidades sobre Wix Studio" />
  <meta name="twitter:description" content="Conteúdos estratégicos sobre Wix Studio, automações e experiências digitais." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    :root {
      color-scheme: dark;
      --page-bg: #020617;
      --page-gradient: radial-gradient(circle at top right, rgba(255, 107, 0, 0.2), transparent 55%),
        radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.12), transparent 45%),
        #020617;
      --card-bg: rgba(15, 23, 42, 0.78);
      --card-border: rgba(148, 163, 184, 0.14);
      --card-border-hover: rgba(255, 107, 0, 0.5);
      --card-shadow: 0 25px 45px rgba(15, 23, 42, 0.35);
      --accent: #ff6b00;
      --accent-soft: rgba(255, 107, 0, 0.12);
      --text-primary: #f8fafc;
      --text-secondary: #cbd5f5;
      --text-muted: #94a3b8;
      --surface-hover: rgba(15, 23, 42, 0.92);
      --skeleton-base: rgba(148, 163, 184, 0.08);
      --skeleton-shine: rgba(148, 163, 184, 0.22);
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: var(--page-gradient);
      color: var(--text-primary);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    a:hover {
      color: var(--accent);
    }

    a:focus-visible,
    button:focus-visible,
    input:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 3px;
    }

    .topbar {
      position: sticky;
      top: 0;
      z-index: 10;
      backdrop-filter: blur(16px);
      background: rgba(2, 6, 23, 0.85);
      border-bottom: 1px solid rgba(148, 163, 184, 0.1);
    }

    .topbar-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 700;
      font-size: 1.05rem;
      letter-spacing: 0.02em;
    }

    .brand-dot {
      display: inline-block;
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background: var(--accent);
    }

    .topbar-link {
      color: var(--text-muted);
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .topbar-link:hover {
      color: var(--accent);
    }

    main {
      flex: 1;
    }

    .hero {
      padding: clamp(3rem, 5vw, 5.5rem) 1.5rem clamp(2rem, 4vw, 3rem);
      text-align: center;
    }

    .hero .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.85rem;
      border-radius: 999px;
      background: var(--accent-soft);
      color: var(--accent);
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-size: 0.75rem;
    }

    .hero h1 {
      font-size: clamp(2.5rem, 6vw, 3.75rem);
      margin: 1.5rem auto 1rem;
      line-height: 1.1;
      max-width: 780px;
    }

    .hero p {
      margin: 0 auto;
      max-width: 720px;
      color: var(--text-secondary);
      font-size: clamp(1rem, 2.8vw, 1.15rem);
      line-height: 1.7;
    }

    .controls {
      max-width: 760px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .search {
      position: relative;
    }

    .search input[type="search"] {
      width: 100%;
      padding: 1rem 1.25rem 1rem 3rem;
      border-radius: 999px;
      border: 1px solid rgba(148, 163, 184, 0.2);
      background: rgba(15, 23, 42, 0.75);
      color: var(--text-primary);
      font-size: 1rem;
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }

    .search input[type="search"]::placeholder {
      color: rgba(148, 163, 184, 0.7);
    }

    .search input[type="search"]:hover {
      border-color: rgba(148, 163, 184, 0.35);
    }

    .search input[type="search"]:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 4px rgba(255, 107, 0, 0.18);
      outline: none;
    }

    .search-icon {
      position: absolute;
      top: 50%;
      left: 1.2rem;
      transform: translateY(-50%);
      width: 1.1rem;
      height: 1.1rem;
      color: rgba(148, 163, 184, 0.8);
      pointer-events: none;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      border: 0;
    }

    .posts-section {
      max-width: 1200px;
      margin: 0 auto;
      padding: clamp(2rem, 4vw, 3.5rem) 1.5rem 4rem;
    }

    .posts-grid {
      display: grid;
      gap: clamp(1.75rem, 3vw, 2.5rem);
      grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
    }

    .post-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 24px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      min-height: 100%;
      transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease, background 0.35s ease;
    }

    .post-card:hover {
      transform: translateY(-6px);
      border-color: var(--card-border-hover);
      background: var(--surface-hover);
      box-shadow: var(--card-shadow);
    }

    .post-media {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 10;
      background: radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.25), transparent 55%),
        rgba(15, 23, 42, 0.85);
    }

    .post-media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .post-media.placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(148, 163, 184, 0.8);
      font-weight: 500;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      font-size: 0.85rem;
    }

    .post-content {
      padding: clamp(1.5rem, 3vw, 2rem);
      display: flex;
      flex-direction: column;
      gap: 1.1rem;
      flex: 1;
    }

    .post-meta {
      font-size: 0.78rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }

    .post-meta .dot {
      width: 4px;
      height: 4px;
      border-radius: 999px;
      background: rgba(148, 163, 184, 0.45);
    }

    .post-title {
      font-size: clamp(1.4rem, 2.5vw, 1.65rem);
      margin: 0;
      line-height: 1.3;
      color: var(--text-primary);
    }

    .post-title a {
      color: inherit;
    }

    .post-title a:hover {
      color: var(--accent);
    }

    .post-excerpt {
      margin: 0;
      color: var(--text-secondary);
      line-height: 1.65;
      font-size: 1rem;
      flex: 1;
    }

    .post-link {
      margin-top: auto;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: var(--accent);
      transition: transform 0.3s ease, color 0.3s ease;
    }

    .post-link svg {
      width: 1.1rem;
      height: 1.1rem;
      transition: transform 0.3s ease;
    }

    .post-link:hover svg {
      transform: translateX(4px);
    }

    .empty-state {
      margin: 3rem auto 0;
      max-width: 420px;
      text-align: center;
      color: var(--text-muted);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
    }

    .empty-state.hidden {
      display: none;
    }

    .empty-state button {
      background: var(--accent);
      color: #0f172a;
      border: none;
      border-radius: 999px;
      padding: 0.85rem 1.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }

    .empty-state button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(255, 107, 0, 0.25);
    }

    .empty-state button:active {
      transform: translateY(0);
    }

    .page-footer {
      border-top: 1px solid rgba(148, 163, 184, 0.08);
      padding: 2.5rem 1.5rem;
      text-align: center;
      color: var(--text-muted);
      background: rgba(2, 6, 23, 0.85);
    }

    .page-footer a {
      color: var(--accent);
      font-weight: 600;
    }

    .page-footer a:hover {
      text-decoration: underline;
    }

    .skeleton {
      pointer-events: none;
    }

    .skeleton .post-media,
    .skeleton .skeleton-line {
      background: linear-gradient(
        100deg,
        var(--skeleton-base) 30%,
        var(--skeleton-shine) 45%,
        var(--skeleton-base) 60%
      );
      background-size: 200% 100%;
      animation: shimmer 1.6s linear infinite;
    }

    .skeleton .post-content {
      gap: 0.9rem;
    }

    .skeleton .skeleton-line {
      height: 0.85rem;
      border-radius: 999px;
    }

    .skeleton .skeleton-line.short {
      width: 40%;
    }

    .skeleton .skeleton-line.medium {
      width: 65%;
    }

    .skeleton .skeleton-line.long {
      width: 85%;
    }

    @keyframes shimmer {
      0% {
        background-position: -200px 0;
      }
      100% {
        background-position: calc(200px + 100%) 0;
      }
    }

    @media (max-width: 768px) {
      .topbar-inner {
        padding-inline: 1.125rem;
      }

      .hero {
        padding-top: 2.5rem;
      }

      .hero h1 {
        font-size: clamp(2.1rem, 6vw, 2.8rem);
      }

      .posts-section {
        padding-inline: 1.25rem;
      }
    }

    @media (max-width: 540px) {
      .topbar-inner {
        flex-direction: column;
        gap: 0.5rem;
      }

      .post-card {
        border-radius: 20px;
      }

      .post-content {
        padding: 1.35rem 1.5rem 1.5rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
  </style>
</head>
<body>
  <header class="topbar">
    <div class="topbar-inner">
      <a href="/" class="brand" aria-label="Página inicial da Winove">
        <span class="brand-dot" aria-hidden="true"></span>
        Winove
      </a>
      <a href="/" class="topbar-link">Voltar para o site</a>
    </div>
  </header>

  <main>
    <section class="hero">
      <span class="eyebrow">Blog Winove</span>
      <h1>Insights, novidades e estratégias digitais</h1>
      <p>
        Explore artigos selecionados pela equipe Winove sobre Wix Studio, automações, experiências digitais e boas práticas para transformar projetos online.
      </p>
    </section>

    <section class="controls" aria-label="Ferramentas de busca do blog">
      <div class="search">
        <label for="searchInput" class="sr-only">Buscar posts do blog</label>
        <input type="search" id="searchInput" name="search" placeholder="Buscar por título, autor ou palavra-chave" autocomplete="off" spellcheck="false" />
        <svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.71.71l.27.28v.79l5 5 1.5-1.5-5-5zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z" />
        </svg>
      </div>
    </section>

    <section class="posts-section" aria-live="polite">
      <div id="blogContainer" class="posts-grid" role="list"></div>

      <div id="emptyState" class="empty-state hidden" role="status">
        <p>Nenhum post disponível no momento.</p>
        <button type="button" id="retryButton">Tentar novamente</button>
      </div>
    </section>
  </main>

  <footer class="page-footer">
    <p>
      Pronto para acelerar a presença digital da sua empresa? <a href="/contato">Fale com a Winove</a> e descubra como podemos ajudar.
    </p>
  </footer>

  <script>
    document.addEventListener("DOMContentLoaded", () => {
      const container = document.getElementById("blogContainer");
      const searchInput = document.getElementById("searchInput");
      const emptyState = document.getElementById("emptyState");
      const emptyMessage = emptyState.querySelector("p");
      const retryButton = document.getElementById("retryButton");
      let allPosts = [];

      const escapeHtml = (value) =>
        String(value ?? "")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;");

      const formatDate = (value) => {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
          return value;
        }

        return new Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric"
        }).format(date);
      };

      const clearEmptyState = () => {
        emptyState.classList.add("hidden");
      };

      const showEmptyState = (message) => {
        emptyMessage.textContent = message;
        emptyState.classList.remove("hidden");
      };

      const createSkeleton = () => {
        const skeleton = document.createElement("article");
        skeleton.className = "post-card skeleton";
        skeleton.innerHTML = `
          <div class="post-media" aria-hidden="true"></div>
          <div class="post-content">
            <span class="skeleton-line short"></span>
            <span class="skeleton-line long"></span>
            <span class="skeleton-line medium"></span>
            <span class="skeleton-line long"></span>
          </div>
        `;
        return skeleton;
      };

      const showSkeletons = () => {
        container.innerHTML = "";
        clearEmptyState();
        for (let i = 0; i < 6; i += 1) {
          container.appendChild(createSkeleton());
        }
      };

      const updateStructuredData = (posts) => {
        const existing = document.getElementById("blogLdJson");
        if (existing) {
          existing.remove();
        }

        const ldJson = {
          "@context": "https://schema.org",
          "@type": "Blog",
          blogPost: posts.map((post) => ({
            "@type": "BlogPosting",
            headline: post.titulo,
            image: post.imagem,
            author: {
              "@type": "Person",
              name: post.autor || "Winove"
            },
            datePublished: post.criado_em,
            description: post.resumo,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://www.winove.com.br/blog/${post.slug}`
            }
          }))
        };

        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.id = "blogLdJson";
        script.textContent = JSON.stringify(ldJson);
        document.head.appendChild(script);
      };

      const renderPosts = (posts, messageOnEmpty) => {
        container.innerHTML = "";

        if (!posts.length) {
          showEmptyState(messageOnEmpty);
          return;
        }

        clearEmptyState();

        posts.forEach((post) => {
          const article = document.createElement("article");
          article.className = "post-card";
          article.setAttribute("role", "listitem");

          const formattedDate = formatDate(post.criado_em);
          const author = escapeHtml(post.autor || "Winove");
          const title = escapeHtml(post.titulo);
          const excerpt = escapeHtml(post.resumo || "");
          const slug = encodeURIComponent(post.slug);

          const hasImage = Boolean(post.imagem);
          const imageSource = hasImage ? escapeHtml(post.imagem) : "";

          article.innerHTML = `
            <div class="post-media${hasImage ? "" : " placeholder"}">
              ${hasImage
                ? `<img src="${imageSource}" alt="${title}" loading="lazy" />`
                : "<span>Sem imagem</span>"}
            </div>
            <div class="post-content">
              <span class="post-meta">
                <span>${formattedDate}</span>
                <span class="dot" aria-hidden="true"></span>
                <span>${author}</span>
              </span>
              <h2 class="post-title">
                <a href="/blog/${slug}">${title}</a>
              </h2>
              <p class="post-excerpt">${excerpt}</p>
              <a class="post-link" href="/blog/${slug}" aria-label="Leia mais sobre ${title}">
                <span>Leia mais</span>
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path fill="currentColor" d="M13 5h-2v6H5v2h6v6h2v-6h6v-2h-6z" opacity="0"></path>
                  <path fill="currentColor" d="M5 12a1 1 0 0 1 1-1h9.586l-3.293-3.293a1 1 0 0 1 1.414-1.414l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414-1.414L15.586 13H6a1 1 0 0 1-1-1z" />
                </svg>
              </a>
            </div>
          `;

          container.appendChild(article);
        });
      };

      const filterPosts = (query) => {
        const normalized = query.trim().toLowerCase();

        if (!normalized) {
          renderPosts(allPosts, "Nenhum post disponível no momento.");
          return;
        }

        const filtered = allPosts.filter((post) => {
          const composite = `${post.titulo} ${post.resumo || ""} ${post.autor || ""}`.toLowerCase();
          return composite.includes(normalized);
        });

        renderPosts(filtered, "Nenhum post corresponde à sua busca.");
      };

      const loadPosts = () => {
        showSkeletons();

        fetch("/api/blog-posts")
          .then((res) => {
            if (!res.ok) {
              throw new Error(`Status ${res.status}`);
            }
            return res.json();
          })
          .then((posts) => {
            allPosts = Array.isArray(posts) ? posts : [];

            if (!allPosts.length) {
              container.innerHTML = "";
              showEmptyState("Nenhum post disponível no momento.");
              return;
            }

            updateStructuredData(allPosts);
            renderPosts(allPosts, "Nenhum post disponível no momento.");
          })
          .catch((err) => {
            console.error("Erro ao carregar posts:", err);
            container.innerHTML = "";
            showEmptyState("Não foi possível carregar os posts. Tente novamente em instantes.");
          });
      };

      if (searchInput) {
        searchInput.addEventListener("input", (event) => {
          filterPosts(event.target.value);
        });
      }

      if (retryButton) {
        retryButton.addEventListener("click", () => {
          if (searchInput) {
            searchInput.value = "";
          }
          loadPosts();
        });
      }

      loadPosts();
    });
  </script>
</body>
</html>
