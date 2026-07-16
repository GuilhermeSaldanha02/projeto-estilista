---
name: LT Studio
description: Vitrine editorial de moda feminina com olhar de personal stylist — "a foto é a tela"
colors:
  esmeralda: "#0B5D46"
  esmeralda-light: "#1D9A72"
  bordo: "#7B1E3A"
  dourado: "#C2A14D"
  espresso: "#241C17"
  ink: "#1A1A1A"
  ink-soft: "#6B6152"
  sand-50: "#F5F1EA"
  sand-100: "#EBE4D6"
  cream-text: "#F4EFE6"
typography:
  display:
    fontFamily: "var(--font-display), Georgia, 'Times New Roman', serif"
    fontWeight: 450
    lineHeight: 1.15
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontWeight: 400
    fontSize: "0.625rem"
    letterSpacing: "0.3em-0.4em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontWeight: 400
    fontSize: "0.875rem"
    lineHeight: 1.6
rounded:
  none: "0px"
components:
  button-primary:
    backgroundColor: "{colors.bordo}"
    textColor: "{colors.cream-text}"
    rounded: "{rounded.none}"
  button-cta-agendar:
    backgroundColor: "{colors.esmeralda}"
    textColor: "{colors.cream-text}"
    rounded: "{rounded.none}"
---

# Design System: LT Studio (Fase 5 — Reconstrução)

Este documento descreve o sistema **vivo** — só regras em vigor hoje. Histórico
de decisões revogadas, rodadas de redesign e achados de code review mora em
`docs/PROGRESS.md`, não aqui. Se uma regra abaixo entrar em conflito com o
código, o código real vence e este arquivo precisa ser corrigido.

## 1. Tese central: "A foto é a tela"

O site não usa cor de UI como fundo de seção (banner, painel chapado atrás
de texto). Fotografia full-bleed é o terreno; cor, texto e botões são
elementos pequenos e precisos apoiados sobre ela. Escala de foto + contraste
com tipografia pequena (label 10px sobre 100vh de imagem) é o que carrega a
presença — não tamanho de letra, não painel de cor.

**Nunca:** fundo de seção inteira em bordô/esmeralda atrás de texto corrido.
**Sempre que precisar de cor forte:** vem em composição com uma foto — bloco
de cor sangrando atrás/ao redor de uma imagem (ver `FotoLadoSection`,
`ConsultingInvite`), nunca como lavagem isolada.

## 2. Cores

- **Espresso** (`#241C17`): único escuro de seção inteira do site (header,
  footer, 1 seção de conteúdo por página no máximo — hoje: `ConsultingInvite`
  na home, `TransformacaoEscuraSection` na consultoria).
- **Papel** (`sand-50 #F5F1EA` / `sand-100 #EBE4D6`): fundo dominante.
- **Bordô** (`#7B1E3A`): função *produto/desejo*. Só em: botão "Quero esta
  peça", bloco de cor atrás de foto (nunca atrás de texto puro).
- **Esmeralda** (`#0B5D46`): função *agendamento/relacionamento*. Só em:
  botão "Agendar horário". As duas funções nunca trocam de papel, e nunca
  aparecem com o mesmo peso visual no mesmo componente.
- **Dourado** (`#C2A14D`): linhas divisórias, eyebrows, ícones — nunca como
  texto sobre bordô (medido: 4,07:1, abaixo do mínimo AA 4,5:1, mesmo a 100%
  de opacidade). Seguro sobre espresso/ink. Escasso: no máximo 3 pontos por
  tela.
- **Cream-text** (`#F4EFE6`): texto sobre qualquer fundo escuro ou foto.

## 3. Tipografia

Fraunces (display) + Schibsted Grotesk (label/corpo). Peso do display:
**400–450, nunca bold/semibold** — presença vem de escala e do contraste com
a foto, não do peso da letra.

- **H1 — Página** `clamp(2rem,4vw,2.75rem)`: título de página (categoria,
  produto, consultoria). No hero da home, sobe até `clamp(2.25rem,4vw,3rem)`
  por estar ancorado sobre 100vh de foto.
- **H2 — Seção** `clamp(1.5rem,3vw,2rem)`: subseções.
- **Editorial** (itálico, tier maior que H2): só a nota da stylist e
  pull-quotes — no máximo 1 por página.
- **Label** `10px`, tracking `0.3–0.4em`, uppercase: nav, eyebrows, preços,
  CTAs — a voz do sistema, não decoração.

## 4. Motion — vocabulário único

Fonte: `components/motion/tokens.ts`. Nunca duplicar ease/variants em
componente. Quatro gestos, sempre os mesmos:

1. **Reveal** (`components/motion/Reveal.tsx`): fade + `y:24→0` ao entrar na
   viewport. Uso geral.
2. **PhotoReveal** (`components/motion/PhotoReveal.tsx`): clip-path de
   cortina + scale ao entrar na viewport. Fotos editoriais.
3. **Parallax de camadas**: `useScroll`/`useTransform` do framer-motion
   (hero) ou rAF+IntersectionObserver (`PhotoParallax.tsx`, seções de
   foto lateral). **Nunca** o evento `scroll` nativo — o Lenis (smooth
   scroll global) o quebra sem lançar erro, silenciosamente. **Nunca**
   `position:sticky`/scroll-hijack — quebrou o desktop numa tentativa
   anterior (`overflow:hidden` no ancestral mata o sticky por completo).
4. **Fila com scroll-snap**: `NewArrivalsRail`, galeria mobile de produto.

Tudo respeita `useReducedMotion`/`motion-reduce:*`.

## 5. Estrutura de componentes

```
components/
├── layout/    Header, Nav, Footer — chrome global
├── motion/    tokens, Reveal, PhotoReveal, PhotoParallax, SmoothScroll
├── home/      Hero, CuratedSelection, CategoryPortals, NewArrivalsRail, ConsultingInvite
├── catalog/   CatalogView (título+contador+filtro como UMA célula da grade)
├── product/   ProductGallery, RelatedRail
├── consultoria/ StylistHero, Sections (renderer das seções dinâmicas do CMS)
└── ui/        ProductCard, EmptyState, icons — primitivos sem domínio
```

Zero componente solto na raiz de `components/`. Todo GROQ mora em
`sanity/lib/queries.ts`, nomeado — nenhuma rota escreve query inline.

## 6. Catálogo — regra do cabeçalho

Título + contador + filtro/ordenação vivem **na mesma régua/grade** que os
produtos — nunca um banner de página inteira acima de uma grade separada. Em
`/vitrine` e `/categoria/[slug]`, o cabeçalho é literalmente a primeira
célula do grid. Com 1–3 produtos, o grid ganha um `max-w` proporcional ao
número de colunas (o container encolhe, não os cards esticam) e uma legenda
"edição enxuta" — vazio com intenção declarada, nunca vazio que lê como grid
quebrado.

## 7. Do's and Don'ts

**Do:**
- Cantos retos, sem `border-radius`, em todo elemento interativo.
- `next/image` + Sanity CDN + `sizes` honesto em toda imagem.
- Um H1 por página. `headingLevel` explícito quando um componente de
  catálogo é embutido numa página que já tem H1 próprio (home).
- `lib/wa.ts` (`buildWaHref`) para todo link de WhatsApp — nunca montar a
  string à mão num componente.

**Don't:**
- Painel de cor chapado atrás de texto corrido, em qualquer seção.
- Dois CTAs do mesmo peso visual no mesmo momento de decisão (ex.: "Quero
  esta peça" e "Agendar horário" nunca lado a lado como botões iguais — a
  consultoria entra como link de texto na página de produto).
- `box-shadow` fora de overlays (mega-menu, drawer mobile).
- Nova cor de acento sem decisão explícita do dono — o sistema tem duas
  funções (bordô, esmeralda) e não precisa de uma terceira.
