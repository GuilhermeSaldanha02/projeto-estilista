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

Paleta de contraste dramático: a família areia domina as superfícies, o espresso ancora os extremos, e três acentos exercem funções precisas e distintas.

### Primary
- **Verde Atelier** (`#0B5D46`): Esmeralda. A cor dominante da marca. Reservada para CTAs de agendamento/WhatsApp e detalhes de presença da stylist. Carrega o peso da confiança e da relação pessoal. Usado com espaço — nunca como fundo de seção inteira.
- **Verde Atelier Claro** (`#1D9A72`): Esmeralda-light. Apenas para estados de hover sobre elementos esmeralda. Nunca em repouso.

### Secondary
- **Borgonha** (`#7B1E3A`): Bordô. O CTA de produto — "Quero esta peça". Alto contraste sobre areia. Aparece no hero e nos cards de produto. Ousadia e desejo concentrados.

### Tertiary
- **Fio de Ouro** (`#C2A14D`): Dourado. Exclusivo para linhas divisórias, ícones e eyebrows. Nunca como fundo ou texto corrido. A sua escassez é o que o torna precioso.

### Neutral
- **Espresso** (`#241C17`): O escuro. Header, footer, faixas de seção dramáticas. Textura quente de café torrado, não o frio de um preto puro.
- **Tinta** (`#1A1A1A`): Texto sobre fundo claro. Ligeiramente mais suave que o espresso; evita dureza de preto puro sobre areia.
- **Areia Base** (`#E7DBC8`): O fundo dominante do corpo. Quente, receptivo, nunca beige genérico — a escolha da stylist, não do template.
- **Areia Clara** (`#EDE3D2`): Fundo de seções alternadas claras, hero da página stylist.
- **Areia Superfície / Creme** (`#F4EFE6`): Fundo de cards de produto e texto sobre espresso. O mesmo hex (`--sand-50` = `--cream-text`) — a areia mais clara como creme para texto em fundo escuro.

### Named Rules

**A Regra das Três Funções.** Esmeralda é confiança e agendamento. Borgonha é desejo e produto. Dourado é detalhe e linha. Os três nunca aparecem juntos no mesmo elemento e nunca trocam de função. Um botão borgonha nunca agenda; um botão esmeralda nunca leva ao produto.

**A Regra do Dourado Escasso.** O dourado (`#C2A14D`) só vive em linhas (`h-px`), ícones e eyebrow text. Nunca como fundo, nunca como texto de parágrafo, nunca em botão. Se ele aparece em mais de três pontos na mesma tela, há um a mais.

**A Regra do Degradê Familiar.** Gradiente só dentro da família areia (sand-50 → sand-200), sutil. Nunca areia → esmeralda, areia → espresso, ou qualquer cruzamento de família. Gradiente sobre foto de produto é proibido — suja a roupa.

## 3. Typography: Serif Leve, Sans Preciso

**Display Font:** `var(--font-display)`, Georgia, Times New Roman, serif
**Body/UI Font:** System stack — `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, sans-serif

**Character:** O display carrega autoridade editorial — luz, espaçado, nunca comprimido. O sans é o contraponto: preciso, anônimo, funcional. O contraste de família (serif display + humanist sans) é intencional e não deve ser substituído por dois sans-serifs similares.

### Hierarchy

- **Display — Hero** (300, 5xl–7xl / 48–72px, clamp, line-height 1.0, tracking 0.2em, uppercase): Só no hero H1. A LT Studio como declaração, não como título.
- **Headline — Seções** (300, 3xl–4xl / 30–36px, line-height 1.2, tracking-wide ~0.05em): H2 de seções de conteúdo. Serif leve, nunca bold.
- **Title — Produto / Stylist** (300, lg–xl / 18–20px, line-height 1.3): Nomes de produto nos cards, nome da stylist no hero. Mantém o peso leve.
- **Body** (400, sm / 14px, line-height 1.6, tracking-wide ~0.05em, máx 65ch): Texto de parágrafo em seções da stylist e descrições. Legibilidade sobre elegância quando em conflito.
- **Label** (400, 10–11px, tracking-widest ~0.4em ou tracking-[0.4em], uppercase, sem-serif): O alfabeto do sistema de navegação e eyebrows. Categorizações, botões, links de ação, preços. Disciplina visível.

### Named Rules

**A Regra do Peso Único.** Display e headline são sempre `font-light` (300). Nunca bold ou semibold em display serif — o peso contradiz o ponto de vista da stylist. Ênfase em display vem do tamanho e do espaçamento, não do peso.

**A Regra do Label Imutável.** Labels (`text-[10px]` ou `text-[11px]`, `tracking-widest`, `uppercase`) são a voz do sistema, não da stylist. Não misturar com prose, não aumentar a fonte "para melhorar a leitura", não remover o tracking. Se precisar de texto maior que 11px como label, é um title, não um label.

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
