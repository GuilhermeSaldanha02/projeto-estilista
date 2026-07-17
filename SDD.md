# SDD — Documento de design técnico

> **Nome real em produção: "LT Studio"** (ver `PRD.md`). _Reconciliado com o código em
> 2026-07-10 — item 6 do plano de retomada._

Como o PRD é construído. Pressupõe o `CLAUDE.md` (tokens, guardrails, taxonomia).

## 1. Arquitetura

```
Dona (stylist) ──edita──▶ Sanity Studio (CMS + login dela)
                                  │
                                  ▼ (GROQ / Sanity client)
                          Next.js (App Router, SSG/ISR) ──deploy──▶ Vercel
                                  │
                          Cliente navega no celular
                                  │
                                  ▼ botão wa.me (texto pré-preenchido)
                                WhatsApp da dona  (venda + agendamento)
```

- **Renderização:** SSG para Home e Stylist; ISR (revalidate, ex.: 60s) para Categoria, Produto e Coleção, para refletir o que a dona publica sem rebuild manual.
- **Sem backend próprio.** Nenhuma rota de servidor que processe pagamento ou autentique cliente. O único "backend" é o Sanity.

> **Override de stack:** se performance virar prioridade absoluta, Astro (com ilhas React) é o substituto mais leve — mesma arquitetura de dados, mesmo CMS. Decisão consciente; o default é Next.js por confiabilidade com o agente.

## 2. Stack detalhada

- Next.js 15 (App Router), TypeScript
- Tailwind CSS; tokens de marca como CSS variables em `globals.css` e mapeados no `tailwind.config`
- Sanity (CMS headless) + `@sanity/client` + `next-sanity`
- `next/image` com URL do Sanity Image CDN **já dimensionada** como `src`
  (`urlFor(img).width(W).height(H).fit('crop').auto('format').url()`) — **nunca**
  `loader`/`sanityLoader` como prop: essa abordagem foi tentada, quebra no boundary
  RSC (Server→Client) em runtime, e foi removida (ver REGRAS em `docs/PROGRESS.md`).
- Framer Motion + Lenis (scroll suave) — decidido na Fase B do redesign (2026-07-08)
- Vercel (preview por PR)
- Fontes **decididas** (Fase 1 do redesign, 2026-07-09/10): display **Fraunces**
  (serifada, leve) + corpo **Schibsted Grotesk**, ambas via `next/font/google`

## 3. Modelo de dados (schemas do Sanity)

**product**
- `title` (string)
- `slug` (slug, de title)
- `category` (reference → category) — **um só**
- `tags` (array de reference → collection) — vários
- `images` (array de image, hotspot ligado)
- `price` (number, opcional — exibição apenas, sem checkout)
- `description` (text/portable text)
- `inStock` (boolean) — controla a regra de categoria vazia
- `featured` / `isNew` (boolean) — alimenta o bloco de novidades

**category** — `title`, `slug`, `order` (ordem no menu), `image` (opcional,
Fase 5 — portais de categoria da home; sem foto própria, a query resolve a
foto do produto mais recente da categoria via `coalesce()`)
**collection** — `title`, `slug` (Novidades, Denim, Alfaiataria, Conjuntos, Festa, Estação)
**stylistProfile** (singleton) — `name`, `tagline`, `photo`, `sections` (array de seções
  CMS-driven: `eyebrow`/`title`/`body`/`image`/`layout`/`items[]`, 7 layouts visuais).
  _`bio`, `whatsappNumber` e `bookingMessage` existiram e foram removidos — a página
  usa `siteSettings.whatsappNumber` + mensagem de agendamento fixa no código._
**siteSettings** (singleton) — `whatsappNumber`, `curatorNote`, `curatorNoteByline`.
  _`heroVideo`/`heroPoster`/`topBarText`/`topBarLink` existiram e foram removidos —
  nenhuma tela os lia; o vídeo do hero é arquivo estático em `/public`, por regra._

## 4. Rotas (poucos templates, muitas instâncias)

_Atualizado na Fase 5 (reconstrução) — `/stylist` e `/colecao/novidades` não
existem mais como rotas próprias; ambas viram redirect 301 (`next.config.ts`)._

| Rota | Template | Instâncias |
|---|---|---|
| `/` | Home (vitrine editorial — 5 seções, ver `components/home/`) | 1 |
| `/vitrine` | Catálogo completo — único lugar com filtro/ordenação | 1 |
| `/consultoria` | Personal stylist (sobre + agendar) — era `/stylist` | 1 |
| `/categoria/[slug]` | Categoria (mesmo template de `/vitrine`, sem chips) | N (das categorias) |
| `/colecao/[slug]` | Coleção (mesmo template, com chips de categoria) | por tag |
| `/produto/[slug]` | Produto | N (todas as peças) |

`generateStaticParams` lê as categorias/coleções/produtos do Sanity. A
categoria só entra no menu se tiver ao menos um `product` com
`inStock = true`. Todo GROQ das rotas acima vem de `sanity/lib/queries.ts`
(centralizado, nomeado — nenhuma rota escreve query inline desde a Fase 5).

## 5. Pipeline de imagem (resolve o risco de peso)

- Toda imagem vem do Sanity Image CDN com transform na URL (largura responsiva, formato `auto` → webp/avif, qualidade ajustada).
- Renderizada por `next/image` com `sizes` correto por breakpoint e `loading="lazy"` fora da primeira dobra.
- Hero: vídeo `muted loop autoplay playsinline preload="none"` com `poster` (imagem leve) por trás do primeiro produto/CTA. Nunca intro em tela cheia. Limite o arquivo do vídeo; sirva `webm` + fallback `mp4`.

## 6. Especificação dos links de WhatsApp

Formato: `https://wa.me/<NUMERO>?text=<mensagem_url_encoded>`. Número e mensagens-base vêm do Sanity (`siteSettings`/`stylistProfile`).

**Fonte única desde a Fase 5: `lib/wa.ts`.** `buildWaHref(number, message)` —
sanitiza o número (`\D` fora, `wa.me` só aceita dígitos) e monta a URL.
`WA_MESSAGES` centraliza os textos-base. Antes da Fase 5 cada página montava
a string à mão (6 lugares diferentes); nenhuma página nova deve fazer isso de
novo — sempre importar de `lib/wa.ts`.

- **Botão de peça:** `WA_MESSAGES.peca(title)` → `"Oi! Tenho interesse na peça {title}."`
- **Botão de agendamento:** `WA_MESSAGES.agendar` → `"Oi! Gostaria de agendar um horário de personal styling."`
- **Link de texto da consultoria na página de produto:** `WA_MESSAGES.consultoriaSobrePeca(title)` (Fase 5 — substitui o antigo 2º botão que duplicava "Agendar horário" na mesma tela).

Os textos são diferentes de propósito: ao cair no celular da dona, ela já sabe se é sobre produto ou sobre styling.

## 7. Login da dona (sem auth caseira)

O login é o do **Sanity Studio** (`/studio` embarcado, ou projeto Studio separado). Vem com usuário, senha, recuperação e sessão prontos e seguros. Um usuário: a dona. Cliente não loga em lugar nenhum. Branding do Studio é gold-plating — fica padrão no v1.

## 8. Estilo e a regra do degradê

- Base areia (`--sand-200`) dominante; cards de produto sobre `--sand-50` para a roupa ler fiel.
- Faixas espresso (`--espresso`) em header/footer/destaque e no painel-cascata.
- Degradê **somente** dentro da família areia, sutil, em hero/faixas. Nunca atrás de produto, nunca cruzando famílias de cor.
- Acentos de joia (esmeralda dominante, bordô só em CTA, dourado em linhas/ícones) em dose pequena.

## 9. Performance, SEO, acessibilidade

- Orçamento: LCP rápido no 4G mobile; imagens otimizadas; JS mínimo (Framer Motion só onde precisa).
- SSG/ISR + `metadata` por página + `sitemap.ts` + dados estruturados de produto onde fizer sentido.
- Alt em toda imagem; contraste verificado sobre areia e sobre espresso; foco visível; navegação por teclado; menu-cascata acessível (acordeão real no mobile, não hover-only).

## 10. Não-objetivos técnicos

Sem gateway de pagamento, sem rota de auth de cliente, sem banco de usuários, sem carrinho, sem WhatsApp Business API. Se um pedido empurrar para qualquer um desses, pare e confirme contra o PRD.

## 11. Ferramentas e fluxo

`Open Design` (gera design system + páginas-chave) → `Claude Code` (implementa) → `Impeccable` (polish final, remove "cara de IA"). Em sequência, nunca em paralelo. Impeccable exige um arquivo de contexto de marca (`.impeccable.md`) — derive-o do PRD + tokens.

## 12. Git

Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`); branch por feature (`feat/<slug>`); uma mudança lógica por commit; PRs pequenos; preview da Vercel por PR; branch curta, merge cedo.
