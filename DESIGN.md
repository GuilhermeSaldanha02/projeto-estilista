---
name: LT Studio
description: Vitrine editorial de moda feminina com olhar de personal stylist
colors:
  esmeralda: "#0B5D46"
  esmeralda-light: "#1D9A72"
  bordo: "#7B1E3A"
  dourado: "#C2A14D"
  espresso: "#241C17"
  ink: "#1A1A1A"
  sand-200: "#E7DBC8"
  sand-100: "#EDE3D2"
  sand-50: "#F4EFE6"
typography:
  display:
    fontFamily: "var(--font-display), Georgia, 'Times New Roman', serif"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "0.2em"
  headline:
    fontFamily: "var(--font-display), Georgia, 'Times New Roman', serif"
    fontWeight: 300
    fontSize: "clamp(1.875rem, 4vw, 2.25rem)"
    lineHeight: 1.2
    letterSpacing: "0.05em"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontWeight: 400
    fontSize: "0.625rem"
    lineHeight: 1
    letterSpacing: "0.4em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontWeight: 400
    fontSize: "0.875rem"
    lineHeight: 1.6
    letterSpacing: "0.05em"
rounded:
  none: "0px"
spacing:
  xs: "4px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.bordo}"
    textColor: "{colors.sand-50}"
    rounded: "{rounded.none}"
    padding: "16px 32px"
  button-primary-hover:
    backgroundColor: "{colors.bordo}"
    textColor: "{colors.sand-50}"
  button-cta-green:
    backgroundColor: "{colors.esmeralda}"
    textColor: "{colors.sand-50}"
    rounded: "{rounded.none}"
    padding: "16px 40px"
  button-cta-green-hover:
    backgroundColor: "{colors.esmeralda}"
    textColor: "{colors.sand-50}"
  product-card:
    backgroundColor: "{colors.sand-50}"
    rounded: "{rounded.none}"
---

# Design System: LT Studio

## 1. Overview

**Creative North Star: "O Olhar da Stylist"**

O site da LT Studio não é uma vitrine neutra. É tudo visto através do olhar de uma especialista — cada peça aparece porque foi escolhida, cada seção existe porque tem algo a dizer. O design tem ponto de vista. Não cataloga: cuida.

Visualmente, o sistema vive numa tensão deliberada: a severidade do espresso e o calor da areia. Cantos retos sem rádio, flat sem sombras decorativas, tipografia serif leve com tracking generoso. Não há ornamento gratuito. A foto é o argumento; o texto é a confirmação. O espaço em branco é parte do design, não ausência dele.

O ritmo da página alterna entre faixas espresso (escuras, confiantes) e areia (quentes, acolhedoras), criando cadência editorial sem depender de gradientes ou elementos decorativos. A stylist está presente — na curadoria, no CTA que diz exatamente o que acontece depois, na voz que soa como uma amiga com gosto apurado.

**Key Characteristics:**
- Cantos retos sem rádio — alfaiataria visual, sem suavização
- Elevação flat via tonal layering (sem box-shadow decorativo)
- Tipografia display serif leve com tracking muito amplo
- Dois tons dominantes: espresso + família areia
- Três funções de cor distintas: esmeralda (confiança/agendamento), bordô (ação/peça), dourado (detalhe/linha)
- Mobile-first: a experiência de tocar e scrollar é tão considerada quanto o layout desktop

## 2. Colors: A Paleta do Atelier

**Reduzida no redesign de 2026-07-13** (decisão de 3 agentes em loop + o dono — ver
`docs/PROGRESS.md`, "Direção final do redesign visual"). Tese: quase-monocromático
quente + 2 acentos funcionais (não 1) — a "Regra das Três Funções" sobrevive por
decisão explícita do dono, mas `verde-profundo` foi cortado por completo (era a
mesma rampa tonal da esmeralda — "verde sobre verde" sem separação real) e o
dourado passou de "regra ignorada" para disciplina ativa (o sistema chegou a violar
o próprio teto de 3 pontos por tela, medido em 5).

### Primary
- **Verde Atelier** (`#0B5D46`): Esmeralda. Acento de **agendamento/relacionamento**
  (o funil principal do negócio). Carrega o peso da confiança. Usado com espaço —
  nunca como fundo de seção inteira.
- **Verde Atelier Claro** (`#1D9A72`): Esmeralda-light. Apenas hover sobre elementos
  esmeralda. Nunca em repouso.

### Secondary
- **Borgonha** (`#7B1E3A`): Bordô. Acento de **produto/desejo** — "Quero esta peça".
  Mantido (não cortado) para preservar a Regra das Três Funções. **Nunca aparece com
  o mesmo peso visual que a esmeralda no mesmo componente** — ver o "Don't" novo
  abaixo; é o erro que já aconteceu uma vez no hero.

### Tertiary
- **Fio de Ouro** (`#C2A14D`): Dourado. Exclusivo para linhas divisórias, ícones e
  eyebrows. Nunca como fundo ou texto corrido. **Disciplina ativa, não sugestão:**
  se aparecer em mais de 3 pontos na mesma tela, é bug a corrigir, não estilo.

### Neutral
- **Espresso** (`#241C17`): o único escuro de seção inteira do sistema (header,
  footer, e no máximo 1 seção de conteúdo por página). Textura quente de café
  torrado, não o frio de um preto puro.
- **Tinta** (`#1A1A1A`): texto primário sobre fundo claro.
- **Tinta Suave** (`#6B6152`, token `ink-soft`): texto secundário/legendas sobre
  fundo claro — **substitui os modificadores `text-ink/65`, `/70`, `/75`** que
  ficavam abaixo de AA em alguns pontos. AA verificado: 5.45:1 sobre `--sand-50`.
  Nunca usar opacidade solta em `ink` de novo — é este token ou nada.
- **Paper** (`#F5F1EA`, token `sand-50`): fundo dominante do corpo. Papel quente,
  quieto — não branco de tela nem beige de template.
- **Paper Deep** (`#EBE4D6`, tokens `sand-100`/`sand-200`/`sand-300` — todos o
  mesmo valor agora): único segundo tom de papel, para alternância sutil de seção
  clara. (Antes eram 3 tons quase indistinguíveis; colapsados de propósito.)
- **Creme** (`#F4EFE6`, token `cream-text`): texto sobre espresso.

### ~~Verde-Profundo~~ — CORTADO (2026-07-13)

Existiu como `#083D2C`, tom mais escuro da rampa tonal da própria esmeralda.
Causava "verde sobre verde" sem separação real (o CTA esmeralda dentro de um fundo
verde-profundo quase não se distinguia) e competia com o espresso como um segundo
"escuro de seção inteira" sem necessidade. **Removido do sistema — não redefinido.**
A "Regra Espresso × Verde-Profundo" (2026-07-12) está revogada; não recriar essa cor
sem decisão nova e explícita do dono.

### Named Rules

**A Regra das Três Funções.** Esmeralda é confiança e agendamento. Borgonha é desejo
e produto. Dourado é detalhe e linha. Os três nunca trocam de função — um botão
borgonha nunca agenda, um botão esmeralda nunca leva ao produto. **Correção nova
(2026-07-13):** quando bordô e esmeralda aparecem na MESMA tela (ex. os dois CTAs do
hero), eles NUNCA têm o mesmo peso visual/tamanho — um é primário (sólido,
dominante), o outro é secundário (contorno/menor). Nunca dois botões cheios do
mesmo tamanho lado a lado — isso é "cores brigando", não hierarquia.

**A Regra do Dourado Escasso.** O dourado (`#C2A14D`) só vive em linhas (`h-px`),
ícones e eyebrow text. Nunca como fundo, nunca como texto de parágrafo, nunca em
botão. **Se ele aparece em mais de três pontos na mesma tela, há um a mais** — isto
já foi violado uma vez (5 pontos numa tela só); tratar como bug, não estética.

**A Regra do Degradê Familiar.** Gradiente só dentro da família areia (sand-50 →
sand-100), sutil. Nunca cruzando família de cor. Gradiente sobre foto de produto é
proibido — suja a roupa.

## 3. Typography: Serif Leve, Sans Preciso

**Display Font:** Fraunces (`var(--font-display)`), Georgia, Times New Roman, serif
**Body/UI Font:** Schibsted Grotesk (`var(--font-sans)`), sistema como fallback

**Character:** O display carrega autoridade editorial — leve, espaçado, nunca
comprimido. O sans é o contraponto: preciso, anônimo, funcional. O contraste de
família (serif display + humanist sans) é intencional. **Guardrail (2026-07-13):
Fraunces é dona de TODO momento display/editorial; Schibsted nunca aparece maior
que corpo/label** — o modo de falha a proibir é usar os dois como display.

### Hierarquia — 5 níveis (REESCRITA 2026-07-13, ver "Regra do Peso Único" abaixo)

Escala fluida (`clamp()`), razão brutal entre o tier Assinatura e o Label — só UM
momento gigante por site, não vários headlines parecidos competindo.

- **Assinatura** (`clamp(4rem,15vw,8.5rem)`, peso **450**, tracking `-0.02em`,
  uppercase): só o wordmark "LT STUDIO" do hero da home. 1 por site.
- **Editorial** (`clamp(2.5rem,6vw,4.25rem)`, peso **400**, itálico): o pull-quote
  da Nota da Stylist (`CuratorialNote.tsx`). **Escassez por regra dura: no máximo 1
  por página, e a MAIORIA das páginas não tem nenhum.**
- **H1 — Página** (`clamp(2rem,4vw,2.75rem)`, peso **450**): título de categoria,
  coleção, produto, nome da stylist no `/stylist`. Nunca sobe além disso.
- **H2 — Seção** (`clamp(1.5rem,3vw,2rem)`, peso **450**): subseções da home e do
  `/stylist`. Visivelmente menor que H1 — hierarquia real entre níveis, não o
  mesmo tamanho universal.
- **Corpo** (400, `text-sm`/14px, line-height 1.6, máx 65ch, Schibsted).
- **Label** (400, 10–11px, tracking `0.2em`–`0.4em`, uppercase, Schibsted):
  nav, eyebrows, preços, CTAs.

**Numerais decorativos** (ex.: "01/02/03" do Personal Styling e das Etapas do
`/stylist`) NÃO são um tier de display — são label pequeno (`text-sm`, tracking
largo), na cor do tom local (`cream-text/50` sobre escuro, `ink-soft` sobre
claro — ver "Etapas" abaixo, que virou seção clara na Fase 3). Eliminados os
96px/72px anteriores (`PersonalStyling.tsx`), que eram maiores que qualquer
headline real do site — o pior ofensor medido pelo Crítico no redesign
2026-07-13.

### Named Rules

**A Regra do Peso Único — REESCRITA (redesign 2026-07-13, supera a versão de
2026-07-10).** A versão anterior subiu para `font-medium`(500)/`font-semibold`(600)
achando que 300 "sussurrava" — mas a SOMA dessas decisões com o resto do sistema
(numerais gigantes, heading idêntico repetido em 6 páginas) leu como "estourado"
para o dono. **Correção: peso 400–450 em todo display, nunca 500/600/bold — o
TAMANHO carrega a presença, não o peso.** Escassez de tamanho (só 1 Assinatura, só
1 Editorial por página, a maioria das páginas sem Editorial nenhum) é o que
resolve "estourado" de verdade, não o peso.

**A Regra do Label Imutável.** Labels (`text-[10px]` ou `text-[11px]`, `tracking-widest`, `uppercase`) são a voz do sistema, não da stylist. Não misturar com prose, não aumentar a fonte "para melhorar a leitura", não remover o tracking. Se precisar de texto maior que 11px como label, é um title, não um label.

**A Regra do Andaime Único (Fase 3, 2026-07-13).** O combo "eyebrow +
linha dourada + H2" é o rótulo de abertura de uma seção — não é decoração
obrigatória. Usar nas seções que abrem um novo assunto narrativo (ex.:
`foto-esquerda`/`foto-direita` — primeira seção de conteúdo real de uma
página) ou que marcam o clímax (`transformacao-escura`). Seções utilitárias
— grade (`cards`) e lista numerada (`etapas`) — já sinalizam sua identidade
pelo próprio layout; usam só o H2, sem eyebrow nem linha. Antes da Fase 3,
o combo se repetia em 5 das 6 seções do `/stylist` numa mesma rolagem — o
"muita coisa repetida" apontado pelo dono. Ver `SectionHeading` em
`app/(site)/stylist/page.tsx` (`variant: 'full' | 'title-only'`).

**A Regra de Uma Seção Escura por Página (Fase 3, 2026-07-13).** No máximo
1 seção com fundo `espresso` por página — o momento escuro é o clímax, não
um estado que se repete. `/stylist` tinha `etapas` (fundo escuro) seguida
imediatamente por `transformacao-escura` (fundo escuro) — duas seções
escuras competindo lado a lado, achado do Crítico. `etapas` virou seção
clara (`paper`); `transformacao-escura` continua o único clímax escuro da
página, na penúltima posição antes do CTA final.

## 4. Elevation

O sistema é plano por design, não por omissão. Profundidade vem de tonal layering — alternância de superfícies (areia clara, areia base, espresso) em vez de sombras. Uma faixa espresso não levanta sobre a areia: substitui o terreno.

A exceção são os menus flutuantes (mega-menu e mobile drawer): recebem `shadow-2xl` para separação de camada, nunca para decoração. Fora de overlays, `box-shadow` é proibido.

### Named Rules

**A Regra Flat-por-Default.** Todo elemento em repouso é plano. Sombra indica overlay (menu, dialog, toast) — nunca usado para "dar profundidade" a card ou seção. Se a intenção é separação, use cor de superfície diferente.

## 5. Components

### Buttons

**Caráter:** Recortados e diretos. Alfaiataria visual — nenhum rádio, nenhuma sombra, nenhum gradiente. A estrutura é o ornamento.

- **Shape:** Sem border-radius (0px)
- **Primário borgonha** (`bg-bordo text-cream-text`, `px-8 py-4`): Ações de produto. "Quero esta peça." Uppercase 11px tracking-widest.
- **CTA esmeralda** (`bg-esmeralda text-cream-text`, `px-10 py-4`): Agendamento WhatsApp. "Agendar horário." Mesmo tipo tipográfico.
- **Hover:** `opacity-90` com `transition-opacity`. Sem mudança de cor, sem translate, sem escala.
- **Focus visible:** `outline 2px solid cream-text` (sobre escuro) ou `outline 2px solid bordo` (sobre claro), `outline-offset-4`.
- **Desabilitado:** `opacity-50 cursor-not-allowed select-none`. Sem elemento interativo por baixo.

### Cards de Produto

**Caráter:** A peça em primeiro plano, a informação em segundo. O card desaparece; a foto permanece.

- **Corner Style:** Sem border-radius
- **Background:** `sand-50` (`#F4EFE6`)
- **Shadow:** Nenhuma — flat por regra
- **Image:** `aspect-[3/4]`, `object-cover`, hover `scale-105` com `duration-500`. O hover é o único feedback de interatividade.
- **Info area:** `p-4`, flex coluna, `gap-2`
  - Título: `font-display text-lg font-light text-ink` (mantém tipografia editorial)
  - Preço: `font-sans text-xs text-ink/65`
  - CTA inline: `text-[10px] tracking-widest uppercase text-bordo`, hover `text-espresso` — não é button, é link sugestivo

### Navegação

**Desktop:** Grid `logo-esquerda | links-centro | WhatsApp-direita`. Header fixo `bg-espresso h-16 md:h-[72px]`.

- Links: `font-sans text-[10px] tracking-widest uppercase text-cream-text opacity-85`, hover `opacity-100`
- Logo: 66×36px desktop, 55×30px mobile, `hover:opacity-75`
- WhatsApp: ícone + texto "WhatsApp" apenas desktop, `cream-text/65` → `cream-text`

**Mega-menu:** `fixed inset-x-0`, `bg-espresso`, `border-t border-dourado/25`, grid 2-3 colunas + bloco destaque `bg-ink`. Bloco destaque usa `font-display italic` para o link "Novidades".

**Mobile:** Overlay absoluto `top-16`, `bg-espresso`, lista com separadores `border-t border-white/5`. Links uppercase text-sm com seta `→` direita. "Novidades" em `text-dourado` (exceção intencional de cor no mobile menu).

### Mega-menu — Bloco Destaque

Componente único do sistema: o quadrado escuro à direita do mega-menu. `bg-ink` (mais escuro que espresso), eyebrow dourado, font-display itálico. Representa a curadoria da stylist dentro da navegação — não é só um link, é um ponto de vista.

## 6. Do's and Don'ts

### Do:
- **Do** usar `font-light` (300) em toda tipografia display e headline — o peso leve é o ponto de vista, não uma omissão.
- **Do** alternar seções entre espresso e família areia para criar ritmo sem gradiente — sand-100, sand-200, e espresso são os três níveis de profundidade.
- **Do** reservar bordô para CTAs de produto e esmeralda para CTAs de agendamento — as funções são fixas.
- **Do** manter labels em `text-[10px]`/`text-[11px]` uppercase tracking-widest — são a voz do sistema, não decoração.
- **Do** testar contraste de `text-ink/65` e `text-cream-text/75` sobre seus respectivos fundos — as variações com opacidade são onde o AA falha primeiro.
- **Do** usar `next/image` + Sanity CDN para toda imagem de produto — vitrine lenta é cliente perdida.
- **Do** manter o dourado escasso: linhas `h-px`, ícones e eyebrows. Três pontos na mesma tela é o máximo.

### Don't:
- **Don't** adicionar border-radius a nenhum elemento interativo — cantos retos são a identidade, não um padrão a "modernizar".
- **Don't** usar gradiente sobre foto de produto, nem cruzar famílias de cor em gradiente (areia → esmeralda, espresso → areia).
- **Don't** fazer o site parecer fast fashion genérico (Shein, Renner): nenhuma grade lotada, nenhum preço em destaque na hero, nenhuma promoção "X% OFF" como elemento visual.
- **Don't** fazer o site parecer loja de departamento (C&A, Riachuelo): sem identidade de template, sem curadoria perdida em volume de produtos, sem prioridade à função sobre ao ponto de vista.
- **Don't** usar `box-shadow` fora de overlays (mega-menu, mobile drawer) — sombra indica flutuação; elementos em repouso não flutuam.
- **Don't** colocar dois CTAs diferentes no mesmo momento de decisão — nunca bordô e esmeralda lado a lado em contexto ambíguo. Quando estão juntos (hero), a hierarquia é clara: bordô principal, esmeralda secundário.
- **Don't** usar `font-bold` ou `font-semibold` em display serif — ênfase vem de escala e tracking, não de peso.
- **Don't** criar uma nova cor de acento sem aprovação — o sistema tem três funções (esmeralda, bordô, dourado) e não precisa de uma quarta.
- **Don't** usar eyebrow em toda seção por reflexo — o tracking-[0.4em] uppercase é o padrão atual, mas só justificado quando há um rótulo de categoria real. Não é scaffolding de layout.
