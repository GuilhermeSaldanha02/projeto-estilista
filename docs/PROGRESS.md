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
- [x] `next.config.ts` — configuração mínima
- [x] `app/globals.css` — CSS variables dos tokens, Tailwind directives, body com fundo areia
- [x] `app/layout.tsx` — Cormorant Garamond via `next/font/google` + metadata
- [x] `app/page.tsx` — página de prova: areia, tinta, bordô, esmeralda, espresso, dourado

### feat/sanity-schema — CMS + Studio embarcado (2026-06-17)

- [x] `sanity`, `next-sanity@9.12.3`, `@sanity/client`, `@sanity/vision` instalados (compatíveis com Next.js 15 + React 19)
- [x] `.env.local` — variáveis do projeto (projectId `3fvggkww`, dataset `production`, apiVersion `2024-10-01`) — fora do git
- [x] `sanity.config.ts` — config do Studio com structureTool + visionTool + singletons
- [x] `sanity/schemas/category.ts` — Categoria (title, slug, order)
- [x] `sanity/schemas/collection.ts` — Coleção/Tag (title, slug)
- [x] `sanity/schemas/product.ts` — Produto (title, slug, category ref, tags array ref, images com hotspot, price opcional, description, inStock, isNew, featured) + preview customizado
- [x] `sanity/schemas/stylistProfile.ts` — Singleton: Perfil da Estilista (name, photo, bio, whatsappNumber, bookingMessage)
- [x] `sanity/schemas/siteSettings.ts` — Singleton: Configurações do Site (whatsappNumber, topBarText, topBarLink, heroVideo, heroPoster)
- [x] `sanity/schemas/index.ts` — barrel dos schemas
- [x] `sanity/lib/client.ts` — Sanity client via next-sanity
- [x] `sanity/lib/structure.ts` — estrutura do Studio (singletons + lista customizada)
- [x] `app/studio/[[...tool]]/page.tsx` — server component: exporta metadata/viewport
- [x] `app/studio/[[...tool]]/StudioClient.tsx` — client component: renderiza NextStudio
- [x] Build de produção limpo: `/` estático 124 B, `/studio` dinâmico 1.51 MB

## Pendente (próximos passos)

- [ ] **CORS no manage.sanity.io** — adicionar `http://localhost:3000` para login funcionar localmente
- [ ] **feat/image-config** — configurar `next/image` para aceitar domínio Sanity CDN (`cdn.sanity.io`) no `next.config.ts`
- [ ] **feat/layout-shell** — Header com menu-cascata (espresso) + Footer; mobile = acordeão
- [ ] **feat/home** — Hero com vídeo mudo + seção da stylist
- [ ] **feat/categoria** — Template de página de categoria + grade de produtos com ISR
- [ ] **feat/produto** — Template de produto + botão WhatsApp com texto pré-preenchido por peça
- [ ] **feat/colecao** — Template de coleção/novidades (filtro por tag)
- [ ] **feat/seo** — sitemap.ts, metadados por página, dados estruturados

## Próximo passo imediato

`feat/image-config` — habilitar `next/image` para servir imagens do Sanity CDN, e em seguida `feat/layout-shell`.

---

## Observações

- HTML estáticos (index.html, product.html, category.html, collection.html, stylist.html) existem no raiz como referência de design — **não convertê-los até o passo de layout-shell**.
- ASSETS.md não existe ainda — criar quando houver assets reais (fotos, vídeo hero).
- next-sanity 10–13 requer Next.js 16 (canary); versão 9.12.3 é a mais recente compatível com Next.js 15.
