# PROGRESS.md — Estado do projeto

_Atualizado a cada sessão. É a memória do agente entre conversas._
_Última atualização: 2026-07-06 (auditoria — sincroniza PROGRESS com o estado real do repo: rebrand LT Studio, /stylist CMS, SEO, contraste e Impeccable já mergeados)_

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

### feat/como-funciona — "Como funciona" 3 passos na home *(2026-07-01)*

**Objetivo:** reduzir o medo de clicar no WhatsApp explicando que o contato é simples,
não o atendimento (que já é detalhado na /stylist). NÃO duplica o diagnóstico/curadoria/
transformação da página da stylist.

**Localização:** dentro da seção espresso da home (`aria-label="Personal Styling"`),
entre o parágrafo de apresentação e o botão de agendamento.

**Conteúdo dos 3 passos:**
1. "É simples" — WhatsApp abre com mensagem pré-escrita, só enviar.
2. "A gente conversa" — Luiza entende e marca o atendimento no seu tempo.
3. "Você descobre seu estilo" — no atendimento, ela alinha roupas e objetivos.

**Design:**
- Grid `1-col mobile / 3-col desktop`, `gap-y-8 md:gap-x-8`
- Cada passo: `border-t border-cream-text/10 pt-6` — separação sutil sem cards
- Número: `text-[10px] tracking-[0.4em] uppercase text-cream-text/35` — discreto, não decorativo
- Título: `font-display text-xl font-light text-cream-text` — serif leve, consistente com a seção
- Corpo: `font-sans text-sm text-cream-text/70` — ~7:1 contraste sobre espresso (WCAG AA ✓)
- `text-left` nos passos, mantendo `text-center` no restante da seção
- Seção expandida de `py-16` para `py-20 md:py-28`
- Body text migrado de `opacity-75` para `/75` (padrão do sistema de tokens RGB)

**Hardcoded** — conteúdo fixo no JSX (não CMS); adequado para texto de processo que
raramente muda. Se a Luiza quiser editar, pode pedir em sessão futura.

---

### feat/empty-states — Empty states compartilhado *(2026-07-01)*

**Problema:** os três estados de vazio existentes (EmBreve em categoria, inline em novidades,
PecaNaoEncontrada em produto) usavam fundo branco/padrão, `text-ink/40` (falha WCAG AA ~2.4:1),
voz clínica, e só ofereciam "← Voltar ao início" como saída.

**Solução:** componente compartilhado `components/EmptyState.tsx` no registro espresso.
- Fundo `bg-espresso` — o header e footer já são espresso; a página vazia vira uma
  atmosfera coesa em vez de um vazio branco.
- Eyebrow dourado + regra de 1px (padrão do sistema).
- Headline em `font-display font-light text-cream-text` — voz editorial, não clínica.
- Body em `text-cream-text/75` (contraste >4.5:1 sobre espresso — WCAG AA aprovado).
- CTA primário borgonha + link secundário `cream-text/60` com hover `cream-text`.
- `secondaryExternal` flag para links de WhatsApp (abre em nova aba).

**Empty states atualizados:**
- `categoria/[slug]`: "Em cuidadosa seleção." (vazia) / "Categoria não encontrada." (404)
  → CTA: Ver novidades + Conheça a stylist
- `colecao/novidades`: "Novas peças em breve."
  → CTA: Conheça a stylist + ← Início
- `produto/[slug]`: "Esta peça saiu de cena."
  → CTA: Ver novidades + WhatsApp da stylist (se número configurado no CMS)

**Remoções:** `EmBreve` (categoria), `PecaNaoEncontrada` (produto), estado inline (novidades).
Imports de `Link` que só existiam para esses componentes foram removidos junto.

---

### feat/curatorial-note — Nota da Stylist (home) *(2026-07-01)*

**Funcionalidade:** seção editorial CMS-driven exibida entre Novidades e Personal Styling
na homepage. A stylist escreve a nota no Sanity Studio (Configurações do Site) e ela
aparece automaticamente. Deixar o campo vazio oculta a seção por completo.

**Arquivos alterados:**
- `sanity/schemas/siteSettings.ts` — campos `curatorNote` (text, 4 linhas) e
  `curatorNoteByline` (string opcional, ex.: "Letícia Tadei — Julho 2025")
- `components/CuratorialNote.tsx` — componente novo: section `bg-sand-100`, eyebrow dourado,
  linha divisória, texto em `font-display font-light`, byline label
- `app/(site)/page.tsx` — `settingsQuery` expandida para buscar os dois campos novos;
  tipo TypeScript atualizado; seção #3 com renderização condicional

**Design:** fundo `sand-100` cria degrau tonal suave entre o grid de produtos (areia base)
e a faixa espresso abaixo. Sem card, sem borda — o texto é a identidade da seção.

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

**Fix regressão — números do "Como funciona" (EtapasSection):** *(corrigido 2026-06-29)*
- Causa real: `text-dourado/60` dependia de `--dourado-rgb` (padrão `/N` do PR#13).
  O branch feat/rebrand-lt-studio não tinha esse PR ainda → cor transparente → números invisíveis.
  Após merge do main (que incluiu PR#13), `text-dourado/60` passou a gerar CSS válido.
- Fix adicional: removido override `block.normal` do EtapasSection — ele era chamado
  DENTRO de cada list item, criando double-render (número do index+1 + número CSS counter).
  Ficou apenas `list.number` + `listItem.number` com `{index + 1}`. Simples e correto.
- REGRA: conteúdo "Como funciona" no Studio deve ser uma LISTA NUMERADA (não parágrafos).

**Fix isolamento /studio:** *(corrigido 2026-06-29)*
- Causa: `app/layout.tsx` raiz aplicava Header+Footer a TODAS as rotas, incluindo /studio.
- Fix: route group `app/(site)/` — todas as páginas do site foram movidas para cá.
  `app/(site)/layout.tsx` tem Header+Footer. `app/layout.tsx` ficou mínimo (fonts+body).
  `/studio` herda só o root mínimo → Studio renderiza sem header/footer do site.
- URLs não mudaram (route groups não adicionam segmentos à URL).

**POLISH VISUAL (cores, fontes, espaçamento, "cara de IA") = IMPECCABLE.**
Etapa final, a rodar em sessão separada. NÃO fazer por prompt avulso.

---

### chore/impeccable-setup — Init + critique + 3 fixes do top-3 *(2026-07-03)*

- `.claude/skills/impeccable/` instalado (skill de design com detector automático de
  qualidade via hook pós-edição) + `.impeccable/design.json` (estado do sistema de design).
- **Critique rodado em `app/(site)/page.tsx`:** nota **22/40** ("Acceptable"). Relatório em
  `.impeccable/critique/2026-06-30T13-57-34Z__app-site-page-tsx.md`.
  - P0: hero com dois CTAs de peso igual → paralisia de decisão.
  - P1: sem voz editorial entre hero e grade de produtos.
  - P1: sem reassurance no ponto de conversão WhatsApp.
- **3 fixes do top-3 aplicados** (nas sessões seguintes, antes deste registro):
  1. Hero com CTA dominante (resolve o P0 de dois CTAs de peso igual).
  2. Seção "Nota da Stylist" criada (`feat/curatorial-note`) — resolve o P1 de voz
     editorial, mas fica **VAZIA por padrão** (some da home) até a Luiza escrever o
     texto no Studio. Ver Placeholders.
  3. "Como funciona" — 3 passos antes do CTA de WhatsApp (`feat/como-funciona`) —
     resolve o P1 de reassurance no ponto de conversão.
- Demais achados do critique (P2 categoria sem filtro/voz, P3 eyebrow+divisória dourada
  saturados, itens de menor prioridade) ficam para a próxima rodada de `/impeccable polish`.

---

## Decisões recentes (não reverter sem discutir)

- **JSON-LD do produto fica SEM `offers`.** Decisão consciente: o site não é
  e-commerce transacional, a venda fecha no WhatsApp. Não adicionar preço/oferta
  estruturada só porque "SEO recomenda" — reintroduziria a promessa de compra no site.
- **POLISH-FIXES (Fable) — só o "Balde A" será executado:** bugs 1.1, 1.2, 1.3, 2.2,
  4.1 e 4.3. Ficam **FORA por decisão**, não por esquecimento:
  - 1.4 (offers no JSON-LD) — mesma decisão do item acima.
  - 2.1 (eyebrow dourado) — vai para o polish do Impeccable, não para o Balde A.
  - Bloco 3 (features) — fora de escopo desta rodada.
  - Bloco 5 (tipografia) — vai para o Impeccable.
- **Próximo trabalho planejado:** executar o Balde A → depois rodar `/impeccable polish`.

## Pendências — prioridade alta

- **CTA sticky no mobile da página de produto** (item 3.1 do POLISH-FIXES): o CTA
  principal de compra/contato fica abaixo da dobra no mobile — risco direto de
  conversão perdida. Prioridade máxima para a próxima rodada de trabalho.

---

## Divergências de especificação (vs. PRD/SDD — registradas aqui, PRD/SDD não editados)

- **Nome do produto:** o PRD antigo chama o projeto de "Estilista"; o nome real em
  produção é **"LT Studio"** (rebrand aplicado em `feat/rebrand-lt-studio`). Toda
  referência mental/tratativa com a dona deve usar "LT Studio".
- **Fonte display:** o SDD §2 sugeria Fraunces; o projeto usa **Cormorant Garamond**
  (`app/layout.tsx`). Divergência consciente. Ponto de atenção: revisar
  `font-light` em headings pequenos se a leitura ficar frágil — Cormorant é mais
  fina que Fraunces nesse peso.

---

## Placeholders / aguardando conteúdo real

- **Logo:** `public/logo-lt.png` é de teste (rebrand Plano A). Definitiva em SVG
  (champagne + versão escura) pendente da Luiza. Troca é pelo mesmo filename +
  regenerar `app/icon.png`.
- **Fotos de produto:** geradas por IA (Gemini), estúdio neutro — estruturais, não
  definitivas.
- **Nota da Stylist (home):** componente e schema prontos (`curatorNote` /
  `curatorNoteByline` em `siteSettings`), mas o campo está **vazio** — a seção
  não aparece até a Luiza escrever o texto no Studio.

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
