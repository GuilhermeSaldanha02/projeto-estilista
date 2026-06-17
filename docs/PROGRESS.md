# PROGRESS.md — Estado do projeto

_Atualizado a cada sessão. É a memória do agente entre conversas._

---

## Concluído

### feat/setup — Esqueleto base (2026-06-16)

- [x] `package.json` — Next.js 15 + React 19 + TypeScript + Tailwind CSS 3
- [x] `tsconfig.json` — strict, App Router, alias `@/*`
- [x] `.gitignore` — padrão Next.js (inclui `.env.local`)
- [x] `tailwind.config.ts` — 11 tokens de marca mapeados como CSS variables
- [x] `postcss.config.mjs` — tailwindcss + autoprefixer
- [x] `app/globals.css` — CSS variables dos tokens, Tailwind directives, body com fundo areia
- [x] `app/layout.tsx` — Cormorant Garamond via `next/font/google` + metadata
- [x] `app/page.tsx` — página de prova: areia, tinta, bordô, esmeralda, espresso, dourado

### feat/sanity-schema — CMS + Studio embarcado (2026-06-17)

- [x] `sanity`, `next-sanity@9.12.3`, `@sanity/client`, `@sanity/vision` instalados
- [x] `.env.local` — projectId `3fvggkww`, dataset `production`, apiVersion `2024-10-01` — fora do git
- [x] `sanity.config.ts` — Studio com structureTool + visionTool + singletons
- [x] 5 schemas: `category`, `collection`, `product`, `stylistProfile`, `siteSettings`
- [x] `sanity/lib/client.ts` — Sanity client via next-sanity
- [x] `sanity/lib/structure.ts` — estrutura do Studio com singletons
- [x] `/studio` — Studio embarcado, server + client component separados

### feat/image-config — Pipeline de imagem Sanity CDN (2026-06-17)

- [x] `@sanity/image-url` instalado
- [x] `next.config.ts` — `remotePatterns` autoriza `cdn.sanity.io/{projectId}/**`
- [x] `sanity/lib/image.ts`:
  - `urlFor(source)` — retorna o builder; encadeie `.width()`, `.auto()`, `.quality()`, `.url()`
  - `sanityLoader` — `ImageLoader` para `next/image` que injeta `?w=&auto=format&q=` direto no CDN, sem passar por `/_next/image`
- [x] `app/teste-img/page.tsx` — busca primeiro produto via GROQ, renderiza foto em retrato 3:4 com `next/image fill + sanityLoader + sizes`
- [x] Build de produção limpo, sem warnings

## Concluído (continuação)

### feat/layout-shell — Header + Nav + Footer (2026-06-17)

- [x] `components/layout/Header.tsx` — server component; busca categorias (só com inStock=true) e `siteSettings.whatsappNumber` via GROQ
- [x] `components/layout/Nav.tsx` — client component; mega-menu desktop (JS hover + delay 150ms, focus/blur para teclado); hambúrguer mobile → lista vertical
- [x] `components/layout/Footer.tsx` — espresso, linha dourada topo, nome centralizado
- [x] `app/layout.tsx` — envolvido com Header + Footer; offset via `<div>` (não `<main>`) para não aninhar `<main>` das páginas filhas
- [x] Build de produção limpo, TypeScript sem erros

**Regras cumpridas:** sem fallback de categorias; WA oculto se `whatsappNumber` vazio; bloco destaque usa token `bg-ink`; teclado acessível.

### feat/rotas-catalogo — Rotas de catálogo (2026-06-17)

- [x] `components/ProductCard.tsx` — card 3:4 com `urlFor` (CDN global via `loaderFile`), nome em Cormorant, "Quero esta peça" como `<span>` (nunca `<Link>` aninhado), hover scale na foto, fallback sem foto
- [x] `app/categoria/[slug]/page.tsx` — grade `2→3→4 col`, ISR `revalidate = 60` (SDD §1), `generateStaticParams` para slugs com produto em estoque, página amigável quando categoria não existe ou está vazia, metadata dinâmica
- [x] `app/produto/[slug]/page.tsx` — foto principal + miniaturas extras, breadcrumb com categoria, nome + preço (R$), PortableText, botão WhatsApp com mensagem pré-preenchida (`whatsappNumber` de `siteSettings` — oculto se vazio), página amigável se produto não encontrado, metadata dinâmica
- [x] `next.config.ts` — apenas `remotePatterns` para `cdn.sanity.io` (abordagem `loaderFile` foi removida — ver nota abaixo)
- [x] Todas as imagens Sanity geradas com `urlFor(img).width(W).height(H).fit('crop').auto('format').url()` — URL já dimensionada, sem depender de `loader` prop
- [x] Build de produção limpo + runtime 200 OK verificado: `/categoria/vestidos` e `/produto/vestido-esmeralda`

**Nota sobre loaderFile:** a abordagem inicial usou `loaderFile` global no `next.config.ts` para evitar passar `sanityLoader` como prop. Isso eliminou o erro de build RSC (funções não podem ser passadas de Server Component para Client Component), mas causou erro de runtime `Image is missing "loader" prop`. A solução correta: URL completa já com dimensões via `urlFor().width().height().fit().url()` + `remotePatterns` padrão. O `/_next/image` serve as imagens diretamente sem precisar de `loader` customizado.

**Regras cumpridas:** `dynamicParams` padrão `true`; WA oculto se `whatsappNumber` vazio; sem dado hardcoded; sem `<Link>` aninhado; `revalidate = 60` conforme SDD §1.

**Fora do escopo desta branch (não é erro):** `/colecao/novidades` ainda retorna 404 — a rota `/colecao/[slug]` não existe ainda.

## Pendente (próximos passos)

- [ ] **feat/home** — Hero com vídeo mudo (loop, muted, autoplay, poster) + seção da stylist + CTAs
- [ ] **feat/colecao** — Template `/colecao/[slug]`: filtro por tag (similar a `/categoria/[slug]`)
- [ ] **feat/seo** — sitemap.ts, metadados por página, dados estruturados
- [ ] Remover `/teste-img` antes do deploy de produção (é uma página de debug)

## Próximo passo imediato

`feat/home` — Hero + seção da stylist + CTAs (requer asset de vídeo ou foto hero).

---

## Observações

- HTML estáticos (index.html, product.html, category.html, collection.html, stylist.html) existem no raiz como referência de design — **não convertê-los até o passo de layout-shell**.
- ASSETS.md não existe ainda — criar quando houver assets reais (fotos, vídeo hero).
- next-sanity 10–13 requer Next.js 16 (canary); 9.12.3 é a versão mais recente compatível com Next.js 15.
- `sanityLoader` serve imagens direto do CDN (sem dupla otimização); usar com `urlFor(img).url()` como `src`.
