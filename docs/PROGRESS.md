# PROGRESS.md — Estado do projeto

_Atualizado a cada sessão. É a memória do agente entre conversas._
_Última atualização: 2026-06-29 (merge main→feat/rebrand-lt-studio para unificar SEO + rebrand LT Studio)_

---

## Estado atual

Piloto com a interface essencialmente completa. Vitrine (categoria) + página de
produto + novidades + home com hero em vídeo. Venda e agendamento fecham via
WhatsApp. A dona gerencia conteúdo pelo Sanity Studio em `/studio`.

O que falta antes de entregar: polimentos finais e deploy. A página `/stylist`
tem arquitetura CMS completa — aguarda só o conteúdo real (questionário + fotos)
a ser cadastrado pela dona no Studio. Ver "Pendências" no fim.

---

## REGRAS — não violar

_Decisões já tomadas. Reverter qualquer uma destas gera retrabalho ou reintroduz
bug já resolvido._

- **Imagem do Sanity:** gerar o `src` como URL completa já dimensionada com
  `urlFor(img).width(W).height(H).fit('crop').auto('format').url()` + `images.remotePatterns`
  (`cdn.sanity.io`) no `next.config.ts`. NUNCA usar `loaderFile` global nem passar
  `loader` como prop — quebra no boundary RSC (Server→Client) em runtime. O
  `sanityLoader` foi REMOVIDO; não reintroduzir. Card de produto é proporção 3:4.
- **Vídeo do hero:** arquivo local em `/public/hero.mp4` + `/public/hero-poster.jpg`.
  NÃO migrar para o Studio sem pedido explícito. O `<video>` precisa de
  `muted loop autoPlay playsInline` (sem `muted` o autoplay é bloqueado; sem
  `playsInline` o iOS abre em tela cheia) e respeitar `prefers-reduced-motion`.
- **WhatsApp:** número vem de `siteSettings.whatsappNumber`. Mensagem de produto
  inclui o nome da peça; mensagem de agendamento é
  `"Oi! Gostaria de agendar um horário de personal styling."`. Botão se oculta se
  o número estiver vazio.
- **Regra de ouro do catálogo:** produto = 1 categoria (referência única) + N tags
  (array). Categoria sem produto em estoque some do menu — sem fallback hardcoded.
- **Validação:** confirmar sempre no BROWSER, não em HTTP 200 (a tela de erro do
  Next também responde 200). Build limpo não garante runtime.
- **Padrões de código:** `revalidate = 60` nas rotas que leem do Sanity (SDD §1);
  sem `<Link>` aninhado; páginas amigáveis "em breve" em vez de 404 cru quando
  algo não existe ou está vazio.

---

## Concluído (mergeado na main)

### #1 feat/sanity-schema — CMS + Studio embarcado

- `sanity`, `next-sanity@9.12.3`, `@sanity/client`, `@sanity/vision`
- `.env.local` — projectId `3fvggkww`, dataset `production`, apiVersion `2024-10-01` (fora do git)
- `sanity.config.ts` — Studio com structureTool + visionTool + singletons
- 5 schemas: `category`, `collection`, `product`, `stylistProfile`, `siteSettings`
- `sanity/lib/client.ts`, `sanity/lib/structure.ts`; Studio embarcado em `/studio`

### #2 feat/image-config — Pipeline de imagem Sanity

- `@sanity/image-url`; `next.config.ts` com `remotePatterns` para `cdn.sanity.io`
- `sanity/lib/image.ts` → `urlFor(source)` (builder encadeável)
- NOTA: a abordagem original deste PR (`sanityLoader`) foi posteriormente
  removida no #4. Ver REGRAS.

### #3 feat/layout-shell — Header + Nav + Footer

- `Header.tsx` (server) — busca categorias com inStock=true + `whatsappNumber` via GROQ
- `Nav.tsx` (client) — mega-menu desktop (hover + delay, acessível por teclado);
  hambúrguer mobile → lista vertical
- `Footer.tsx` — espresso, linha dourada, nome centralizado
- Regras cumpridas: sem fallback de categorias; WA oculto se vazio; teclado acessível

### #4 feat/rotas-catalogo — Rotas de catálogo

- `ProductCard.tsx` — card 3:4, nome em Cormorant, "Quero esta peça" como `<span>`,
  hover scale, fallback sem foto
- `app/categoria/[slug]/page.tsx` — grade 2→3→4 col, ISR, `generateStaticParams`,
  página amigável se vazia/inexistente, metadata dinâmica
- `app/produto/[slug]/page.tsx` — galeria, breadcrumb, preço R$, PortableText,
  botão WhatsApp, página amigável se não encontrado
- **Fix importante (loaderFile):** a abordagem inicial usou `loaderFile` global para
  evitar passar `sanityLoader` como prop. Eliminou o erro de build RSC, mas causou
  erro de runtime `Image is missing "loader" prop`. Solução: URL completa já
  dimensionada via `urlFor().width().height().fit().url()` + `remotePatterns`. Ver REGRAS.

### #5 feat/novidades — /colecao/novidades

- GROQ `inStock == true | order(_createdAt desc) [0...12]`, sem filtro por tag/categoria
- Importa `ProductCard` existente; mesmo grid; página "em breve" se vazia
- Elimina o 404 do link "Novidades" no header

### #6 fix/nav-contraste — Contraste do Nav (WCAG AA) — PALIATIVO, SUBSTITUÍDO

- Gatilho e links do mega-menu desktop estavam quase invisíveis em repouso.
  Corrigido com `opacity-85/90` como contorno temporário.
  ⚠️ Esta regra de "usar opacity- em vez de /N" foi REVOGADA pelo fix/#14 abaixo.

### #8 + #10 feat/stylist — Página /stylist CMS-driven (na main)

- PR #8 (`feat/stylist-estrutura`) — criou a casca estrutural com placeholders e o link
  "STYLIST" no Nav (desktop e mobile). Mergeado primeiro.
- PR #9 (`feat/stylist-cms`) — reescreveu a page e o schema. Mergeado em
  `feat/stylist-estrutura` (base original da branch).
- PR #10 (`feat/stylist-cms → main`) — levou a versão CMS-driven diretamente para main,
  substituindo completamente a casca do #8. Verificado: grep limpo, build limpo, browser
  sem nenhum `[PLACEHOLDER]`.

**Estado final na main:**
- `sanity/schemas/stylistProfile.ts` — `name`, `tagline`, `photo`, `sections[]`
  (eyebrow / title / body / image / layout), `whatsappNumber`, `bookingMessage`.
  Campo `bio` removido (não tinha uso).
- `app/stylist/page.tsx` — hero lê `name`/`tagline`/`photo` do Sanity; seções
  dinâmicas via `sections[].map()` com 5 layouts visuais: `padrao`, `foto-esquerda`,
  `foto-direita`, `etapas` (espresso), `destaque-escuro` (sand-200 + botão WA).
  Estado amigável se `stylistProfile` vazio (nunca 404).
- ISR 60 s; imagens via `urlFor()`; WA via `siteSettings`.

### fix/nav-contraste-alinhamento — Tokens RGB + alinhamento + WCAG AA (em revisão)

**Bug 1 — raiz dos tokens:** `tailwind.config.ts` redefinido de `var(--token)` para
`rgb(var(--token-rgb) / <alpha-value>)`. `globals.css` ganhou as variáveis `--token-rgb`
com canais R G B separados (hex original preservado para uso CSS direto).
O modificador `/N` agora gera CSS válido em TODO o projeto (~45 ocorrências, 7 arquivos).
O contorno `opacity-85/90` do PR #6 foi normalizado para `/85`/`/90` (consistência).

**Bug 2 — mega-menu desktop:** z-index corrigido de `z-40` para `z-50` (mesmo nível
do header), eliminando o encobrimento do painel pelo stacking context do header.

**Regra revogada:** ~~"não use /N com CSS vars"~~ — `/N` agora funciona. O fix foi
na raiz (tokens com `<alpha-value>`), não paliativo. Onde havia `opacity-N` como
contorno, pode (e deve) usar `/N` diretamente.

**WCAG AA — itens corrigidos neste PR** (valores que reprovavam 4,5:1 para texto pequeno):

| Arquivo | Elemento | Antigo → Novo | Contraste |
|---|---|---|---|
| ProductCard.tsx:42 | "Foto em breve" (placeholder) | `/30` → `/65` | 1,85:1 → 4,77:1 ✓ |
| ProductCard.tsx:55 | preço do produto | `/60` → `/65` | 4,34:1 → 4,77:1 ✓ |
| produto/[slug]/page.tsx:195 | "Foto em breve" (produto) | `/30` → `/65` | 1,85:1 → 4,92:1 ✓ |
| produto/[slug]/page.tsx:161 | breadcrumb | `/40` → `/65` | 2,40:1 → 4,77:1 ✓ |
| produto/[slug]/page.tsx:226 | label categoria | `/45` → `/65` | 2,70:1 → 4,77:1 ✓ |
| produto/[slug]/page.tsx:267 | "← Voltar" | `/40` → `/65` | 2,40:1 → 4,77:1 ✓ |
| categoria/[slug]/page.tsx:93 | label "ESTILISTA" | `/40` → `/65` | 2,40:1 → 4,77:1 ✓ |
| stylist/page.tsx:289 | chamada final (PortableText) | `/60` → `/65` | 4,10:1 → 4,77:1 ✓ |

**Itens deixados para o Impeccable (não alterados):**
- `Footer.tsx:8` — `text-cream-text/40` em espresso (3,5:1). Era invisível antes do fix de raiz; agora visível mas abaixo de AA. Caso herdado, decisão de polish.
- Todas as linhas decorativas `bg-dourado/N` — ornamentos sem texto, sem alvo WCAG.

### feat/stylist-cards-e-contraste — Layouts destaque-escuro e cards (sobre feat/stylist-cms)

**Problema corrigido:** o layout `destaque-escuro` estava mal nomeado — usava fundo claro
(sand-200). O nome sugeria escuro mas a implementação era clara. Corrigido com dois layouts
distintos para o fecho da página (ritmo claro → escuro → claro).

**Novos/renomeados layouts no schema e componente:**
- `destaque-claro` _(novo valor, substitui `destaque-escuro` para novas seleções)_:
  fundo sand-200, citação itálica, texto ink, botão WhatsApp — para "Vamos começar?".
  Alias de compatibilidade: o valor antigo `destaque-escuro` ainda roteia para este
  componente (`DestaqueClaroSection`) enquanto os docs do Sanity não forem atualizados.
- `transformacao-escura` _(novo)_: fundo espresso, texto CREME em todo o wrapper
  (não apenas `[&_p]` — cobre TODOS os tipos de bloco do PortableText, evitando o bug
  de herança de cor escura). Sem botão WhatsApp. Para "O que muda".
- `cards` _(novo)_: grid 2 col desktop / 1 col mobile, fundo claro (sand-50 por card),
  texto ink, campo `items[]` no schema (array `{titulo, subtitulo}`). Para "Pra quem é".

**Campo novo no schema:** `items[]` (objeto `cardItem` com `titulo` e `subtitulo`).
Usado exclusivamente pelo layout `cards`. O campo `body` permanece disponível para os
outros layouts.

**Studio:** radio de layouts atualizado com 7 opções e labels claros.

**⚠️ PENDENTE — recadastro no Studio (ação da dona):**
1. Seção **"O que muda"** → selecionar layout **"Destaque escuro (fundo espresso, texto claro)"**
   (`transformacao-escura`).
2. Seção **"Vamos começar?"** → selecionar layout **"Destaque claro (citação, fundo areia)"**
   (`destaque-claro`).
3. Seção **"Pra quem é"** → selecionar layout **"Cards (grade de itens)"** (`cards`) e
   preencher os 4 itens abaixo no campo "Itens (layout Cards)":
   - Card 1: "Armário cheio, nada pra vestir" / "Você tem peças, mas sente que nunca acha o que combina."
   - Card 2: "Uma fase nova" / "Novo trabalho, corpo que mudou, um recomeço que pede uma nova imagem."
   - Card 3: "Sem tempo pra comprar" / "Quer se vestir melhor sem perder horas dentro de loja."
   - Card 4: "Descobrir o próprio estilo" / "Encontrar o que tem a sua cara, de verdade."
   **⚠️ Subtítulos são rascunho do Claude — PENDENTE de validação/revisão da stylist Luiza
   antes de publicar como definitivos.**

- Build limpo; `/stylist` com ISR 1 min. Validação visual aguarda a dona no browser
  (desktop + mobile) após recadastrar as seções no Studio.

**Bug corrigido (fix sobre feat/stylist-cards-e-contraste):** campo `items` estava
declarado ANTES do campo `layout` no schema e sem a propriedade `hidden` condicional.
Resultado: o campo sempre aparecia no Studio (para todos os layouts) acima do radio,
em vez de aparecer apenas quando `layout === 'cards'` logo abaixo do radio.
Correção: campo `items` movido para APÓS `layout`, adicionado
`hidden: ({ parent }) => parent?.layout !== 'cards'`. Campo `body` ganhou
`hidden: ({ parent }) => parent?.layout === 'cards'` para sumir quando irrelevante.
Título do campo atualizado para "Itens dos cards". `Título` agora tem `required()`.

### #7 feat/home — Home real

- `app/page.tsx` substituiu a tela de teste. 3 blocos, ISR.
- **Hero:** vídeo `/hero.mp4` + poster, `autoPlay loop muted playsInline`,
  `prefers-reduced-motion`, gradiente para legibilidade, texto/CTAs à esquerda
- **Novidades:** `ProductCard` + GROQ `[0...8]` + link "ver todas"
- **Personal Stylist:** seção com texto PROVISÓRIO + botão de agendamento.
  É um teaser — o conteúdo real vai na futura página `/stylist`.

### #12 feat/seo — SEO técnico

- `app/robots.ts` — bloqueia `/studio`, aponta para `/sitemap.xml`
- `app/sitemap.ts` — dinâmico via Sanity: rotas estáticas + categorias com estoque + todos os produtos em estoque (ISR 1h). URL via `NEXT_PUBLIC_SITE_URL`.
- `app/layout.tsx` — `metadataBase`, `title.template '%s — Estilista'`, `openGraph` base (siteName, locale, type)
- `app/page.tsx` — title `{ absolute }` para contornar o template
- `app/colecao/novidades/page.tsx` — title simplificado (template aplica o sufixo)
- `app/categoria/[slug]/page.tsx` — title sem sufixo hardcoded; description melhorada
- `app/stylist/page.tsx` — `generateMetadata` lê `name`/`tagline` do Sanity (fallback elegante)
- `app/produto/[slug]/page.tsx` — `generateMetadata` com description extraída do PortableText + OG image via Sanity CDN; JSON-LD schema.org/Product (name, image, description, brand — SEM offers/price)

**Pendentes (documentado, não implementado):**
- **FAVICON** — aguarda ícone de marca da dona
- **OG /stylist** — pronto quando Sanity tiver foto da stylist cadastrada
- **`NEXT_PUBLIC_SITE_URL`** — deve ser configurado na Vercel no momento do deploy

---

### feat/rebrand-lt-studio — Rebrand + fix números etapas

**REBRAND "Estilista" → "LT Studio" (Plano A com logo de teste):**
- Grep final: zero ocorrências de "Estilista" visível em app/ e components/
- Trocado: metadata (title template `%s | LT Studio`), hero H1, eyebrows/aria-labels
  de fallback nas páginas categoria/produto/novidades/stylist, Footer, Nav
- NÃO trocado (intencional): package.json, projectId Sanity, slugs de URL,
  nomes de variáveis, conteúdo do Sanity (gerido pela dona)
- **Header:** logo `/logo-lt.png` substitui texto "ESTILISTA".
  Desktop: logo esquerda (66×36px) | links centro | WA direita — grid `[auto_1fr_auto]`.
  Mobile: hamburger esquerda | logo centro (55×30px) | WA direita — grid `[1fr_auto_1fr]`.
  Mega-menu: removido `max-w-lg` da coluna de categorias, `grid-cols-2 lg:grid-cols-3`
  distribui as categorias sem vão no centro da página.
- **Footer:** logo `/logo-lt.png` (99×54px, opacity-80) sobre espresso, substituindo texto.
  Escolha: logo em vez de texto puro — mais consistência com o header. A PNG pode ter
  halo claro visível sobre o espresso (asset provisório — conferir visualmente).
- **Favicon:** `app/icon.png` gerado via sharp: 48×48, fit contain, fundo espresso.
  Next.js reconheceu automaticamente (aparece como rota `/icon.png` no build).

**REBRAND — PENDENTE:**
- Trocar `/public/logo-lt.png` pela logo DEFINITIVA da Luiza (SVG champagne + versão
  escura para fundo espresso) quando ela entregar. Mesmo filename — troca automática.
- Favicon definitivo a partir do SVG (ícone quadrado, sem halo).

**Fix regressão — números do "Como funciona" (EtapasSection):**
- Causa: `EtapasSection` renderizava números via `{index + 1}` em `listItem.number`
  (funciona se conteúdo Sanity é lista numerada) mas `block.normal` não tinha número.
  Se o conteúdo "Como funciona" foi gravado como parágrafos simples, os números sumiam.
- Fix robusto: `block.normal` em `EtapasSection` agora usa CSS counter
  (`[counter-increment:step]` + `before:content-[counter(step)]`).
  Funciona tanto para listas numeradas (index+1 explícito) quanto para parágrafos.
  Wrapper recebe `[counter-reset:step]` para garantir contagem do 1.
- Texto alinhado à esquerda (`text-left`) explícito para eliminar ambiguidade visual.

**POLISH VISUAL (cores, fontes, espaçamento, "cara de IA") = IMPECCABLE.**
Etapa final, a rodar em sessão separada DEPOIS deste rebrand. NÃO fazer por prompt avulso.

---

## Pendências

### Bloqueado por conteúdo externo

- **Página `/stylist`** — arquitetura CMS completa. A dona cria as seções no Studio
  (singleton "Perfil da Estilista"): preenche nome, tagline, foto, e adiciona seções
  escolhendo o layout. Aguarda devolutiva da personal stylist: respostas Q1-Q7 + 1-2 fotos.
  Q6 (o que ela NÃO faz) vai no body do bloco "Pra quem é" (layout `cards`).
- **Logo definitiva** — Luiza entrega SVG champagne + versão escura (para fundo espresso).
  Trocar `public/logo-lt.png` + regenerar `app/icon.png` a partir do SVG.
- **Coleção por tag** (`/colecao/[tag]` além de novidades) — depende de cadastrar
  peças com tags no Studio. Sem conteúdo, a página abre vazia.

### Independente — pode fazer a qualquer momento

- Trocar "PERSONAL STYLIST" (inglês) no hero por termo em PT, se decidido.
- **Dívida técnica — layout `etapas`:** a dona precisa digitar a lista numerada
  manualmente no PortableText (1. texto 2. texto…). Se a resposta da Q4 vier com
  muitas etapas ou com subestrutura, migrar o campo `body` para um array aninhado
  `{ título, descrição }` dentro da section do tipo `etapas`.

### Só no fim (deploy)

- Deploy na Vercel. **ATENÇÃO:** a URL de produção precisará ser adicionada como
  CORS origin em manage.sanity.io (mesmo bloqueio que ocorreu com `localhost:3000`),
  senão o site no ar aparece sem produtos/imagens.
- Testar o vídeo do hero em CELULAR real (autoplay de fundo é o ponto frágil em iOS).

---

## Assets

- **Catálogo:** 8 categorias × ~2 peças, geradas via Gemini (estúdio neutro cinza,
  proporção 3:4, paleta areia/camel/cream + esmeralda e bordô nos vestidos).
  Cadastradas no Studio. O macaquinho teve 2 variações — uma escolhida, outra descartada.
- **Hero:** vídeo gerado via Gemini (slip dress de seda, fundo taupe quente),
  comprimido para web (~680 KB) + poster estático. Em `/public`.
