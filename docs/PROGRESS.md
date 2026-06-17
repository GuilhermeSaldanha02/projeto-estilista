# PROGRESS.md — Estado do projeto

_Atualizado a cada sessão. É a memória do agente entre conversas._

---

## Concluído

### feat/setup — Esqueleto base (2026-06-16)

- [x] `package.json` — Next.js 15 + React 19 + TypeScript + Tailwind CSS 3
- [x] `tsconfig.json` — strict, App Router, alias `@/*`
- [x] `.gitignore` — padrão Next.js
- [x] `tailwind.config.ts` — 11 tokens de marca mapeados como CSS variables
- [x] `postcss.config.mjs` — tailwindcss + autoprefixer
- [x] `next.config.ts` — configuração mínima (Sanity CDN virá depois)
- [x] `app/globals.css` — CSS variables dos tokens, Tailwind directives, body com fundo areia
- [x] `app/layout.tsx` — Cormorant Garamond via `next/font/google` + metadata
- [x] `app/page.tsx` — página de prova: areia, tinta, bordô, esmeralda, espresso, dourado
- [x] `docs/PROGRESS.md` — este arquivo

## Pendente (próximos passos)

- [ ] **feat/sanity-schema** — Configurar Sanity (schemas: product, category, collection, stylistProfile, siteSettings)
- [ ] **feat/layout-shell** — Header com menu-cascata + Footer com espresso
- [ ] **feat/home** — Hero com vídeo mudo + seção da stylist
- [ ] **feat/categoria** — Template de página de categoria + grade de produtos
- [ ] **feat/produto** — Template de página de produto + botão WhatsApp com texto pré-preenchido
- [ ] **feat/colecao** — Template de coleção/novidades (filtro por tag)
- [ ] **feat/seo** — sitemap.ts, metadados por página, dados estruturados

## Próximo passo imediato

`feat/sanity-schema` — instalar `@sanity/client`, `next-sanity`, iniciar o Studio embarcado, e criar os schemas do modelo de dados (SDD seção 3).

---

## Observações

- HTML estáticos (index.html, product.html, category.html, collection.html, stylist.html) existem no raiz como referência de design — **não convertê-los até o passo de layout-shell**.
- ASSETS.md não existe ainda — criar quando houver assets reais (fotos, vídeo hero).
