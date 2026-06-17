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

## Pendente (próximos passos)

- [ ] **feat/layout-shell** — Header fixo espresso com menu-cascata desktop / acordeão mobile + Footer espresso; dados de categorias via GROQ
- [ ] **feat/home** — Hero com vídeo mudo (loop, muted, autoplay, poster) + seção da stylist + CTAs
- [ ] **feat/categoria** — Template `/categoria/[slug]`: grade de produtos, ISR, categoria vazia some do menu
- [ ] **feat/produto** — Template `/produto/[slug]`: fotos, descrição, botão WhatsApp com nome da peça
- [ ] **feat/colecao** — Template `/colecao/[slug]`: filtro por tag
- [ ] **feat/seo** — sitemap.ts, metadados por página, dados estruturados
- [ ] Remover `/teste-img` antes do deploy de produção (é uma página de debug)

## Próximo passo imediato

`feat/layout-shell` — header espresso com menu-cascata (desktop) / acordeão de toque (mobile) + footer.

---

## Observações

- HTML estáticos (index.html, product.html, category.html, collection.html, stylist.html) existem no raiz como referência de design — **não convertê-los até o passo de layout-shell**.
- ASSETS.md não existe ainda — criar quando houver assets reais (fotos, vídeo hero).
- next-sanity 10–13 requer Next.js 16 (canary); 9.12.3 é a versão mais recente compatível com Next.js 15.
- `sanityLoader` serve imagens direto do CDN (sem dupla otimização); usar com `urlFor(img).url()` como `src`.
