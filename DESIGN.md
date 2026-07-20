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
  tela. **Campo translúcido em degradê** (Fase 5i, decisão do dono, ver
  `NewArrivalsRail.tsx`): dourado também pode aparecer como fundo de um
  cabeçalho de seção, mas só em degradê (`from-dourado/25 via-dourado/10
  to-transparent`), nunca cor sólida/chapada — isso reintroduziria o "painel
  chapado atrás de texto" que já deu "agonia visual" no hero. Conta como 1
  dos 3 pontos de dourado permitidos por tela; a banda deve ficar contida na
  coluna de conteúdo (`max-w-1440`), nunca sangrar até a borda da viewport,
  senão o dourado forte cai fora do alcance do título em telas largas.
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
├── catalog/   CatalogView (cabeçalho FORA da grade — ver §6)
├── product/   ProductGallery, RelatedRail
├── consultoria/ StylistHero, Sections (renderer das seções dinâmicas do CMS)
└── ui/        ProductCard, SectionHeading, HorizontalRail, EmptyState, icons — primitivos sem domínio
```

Zero componente solto na raiz de `components/`. Todo GROQ mora em
`sanity/lib/queries.ts`, nomeado — nenhuma rota escreve query inline.

## 6. Cabeçalho de seção — padrão único do site (Fase 6)

**Regra revogada (Fase 5):** "o cabeçalho é a primeira célula do grid".
Ela reproduzia exatamente o defeito que obrigou a reconstruir a Seleção da
Luiza: texto curto e foto alta disputando altura na mesma linha do grid
sempre volta como "desalinhado/solto", porque a célula de texto estica pra
igualar a foto. O cabeçalho agora sai da grade — a grade é só produto.

**O padrão é `components/ui/SectionHeading.tsx`** (variação "A3", escolhida
pelo dono entre alternativas): nome em maiúsculas espaçadas + **losango
dourado** + meta curto, **centralizado**. Serif preto grande está fora — o
dono rejeitou "nome enorme preto" e "marcadão em negrito" em rodadas
sucessivas; nesta identidade quem domina a tela é a FOTO da peça, não a
palavra. Toda seção importa o componente, ninguém recria a marcação.

Usado em: `/vitrine`, `/categoria/[slug]`, `/colecao/[slug]`, "Combina com"
(PDP) e "Acabou de chegar" (home). Exceção deliberada: "A seleção da Luiza"
mantém a frase em itálico da curadora — é conteúdo com voz, não um rótulo.

**Eixo central.** Com o cabeçalho centralizado, chips e ordenação também
ficam centralizados (`justify-center`, com `flex-wrap`) — controle
alinhado à direita contra título centralizado lê como desalinhamento. O
divisor é um filete dourado **simétrico** (`from-transparent via-dourado/45
to-transparent`), nunca um traço reto full-width nem duas hairlines
paralelas com um vão no meio.

## 6b. Tamanho de card — padrão de varejo real

Card de produto fica em **~280–300px de largura** no desktop (foto ~380px de
altura), o tamanho que varejo de moda real usa. Com poucas peças a grade
**encolhe e centraliza** (`max-w` + `mx-auto`) — nunca infla o card. Inflar
gerou card de ~430px com foto de ~570px, obrigando a ROLAR pra ver a peça.

Colunas: `≤2 → grid-cols-2 max-w-[600px]`; `3 → md:grid-cols-3
max-w-[920px]`; `≥4 → grid-cols-2 md:grid-cols-3 lg:grid-cols-4`.

## 6c. Card escuro sobre fundo claro

A página segue creme; a **peça** é um card escuro sólido (`bg-espresso`,
cantos 12px, texto creme, preço/CTA dourado) — prop `onDark` do
`ProductCard`. Objeto sólido apoiado num chão claro: era isso que matava a
queixa recorrente de "o nome da peça solto" (nome flutuando no creme vazio
abaixo da foto). O mesmo card é usado no catálogo E na home — uma fonte de
verdade.

**Crop da foto** (`productCardImageUrl` em `sanity/lib/image.ts`): sem
hotspot salvo no Studio, a proporção nativa das fotos é quase igual à do
card e o `fit('crop')` padrão não corta quase nada, sobrando fundo de
estúdio em volta da peça ("o vestido solto"). O helper corta 12% do topo e
10% da base via `rect`, em pixels lidos do próprio `_ref` do asset. Atenção:
o Sanity **ignora `fp-z`** (zoom por ponto focal do imgix) — confirmado
comparando bytes de resposta; corte real só via `rect`.

## 7. ProductCard — 2ª foto e selo "Novo" (Fase 5e)

Pesquisado em varejo real de escala comparável (Reformation, Ganni) antes de
aplicar — não é enfeite, é padrão comum de "dar vida" ao card sem 3D/vídeo.

- **2ª foto no hover**: se `product.image2` existir (`images[1]` no
  Sanity), crossfade puro sobre a 1ª foto no hover — sem zoom competindo (a
  1ª é a "parada", a 2ª é o "movimento"). Sem 2ª foto, comportamento
  idêntico a antes (zoom sutil na única foto).
- **Selo "Novo"**: quando `product.isNew` é `true`. Texto sobre
  `sand-50/90`, canto superior esquerdo da foto — **nunca** dourado como
  fundo (mede abaixo do AA, ver §2), nunca uma 3ª cor de função nova.
- Os dois dependem de dado que a dona cadastra no Studio (2ª foto no
  produto, marcar "Novidade") — sem esse dado, o card renderiza igual a
  antes, nunca quebra. Não confundir "sem dado ainda" com "não funciona".

## 8. Do's and Don'ts

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
