---
target: site inteiro (home, vitrine, categoria, produto, consultoria)
total_score: 29
p0_count: 1
p1_count: 3
timestamp: 2026-07-23T11-44-03Z
slug: inteiro-home-vitrine-categoria-produto-consultoria
---
Method: dual-agent (A: revisão de design — Opus estourou o limite semanal na primeira tentativa, refeita no modelo padrão da sessão · B: detector + evidência de navegador, isolado de A)

## Design Health Score

| # | Heurística | Score | Achado principal |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Zero `loading.tsx`/`error.tsx`/`not-found.tsx` em toda a árvore de rotas (confirmado por mim via glob) — falha de rede no Sanity cai na tela de erro genérica do Next |
| 2 | Match System / Real World | 4 | Copy fora do script de e-commerce: "Não sabe se é pra você? Pergunta pra Luiza", "Esta peça saiu de cena" |
| 3 | User Control and Freedom | 3 | Menu mobile fecha com Escape e devolve foco; falta link de volta à categoria a partir da PDP |
| 4 | Consistency and Standards | 3 | "Quero esta peça" tem dois destinos diferentes: `Link` interno no card, `<a>` de WhatsApp na PDP |
| 5 | Error Prevention | 3 | `buildWaHref` centralizado evita link de WhatsApp quebrado |
| 6 | Recognition Rather Than Recall | 3 | Categoria aparece como eyebrow na PDP mas sem link de volta |
| 7 | Flexibility and Efficiency | 3 | Filtro + ordenação + paginação incremental em `/vitrine`, poucos toques no mobile |
| 8 | Aesthetic and Minimalist Design | 3 | Bem executado por componente; home empilha muitos CTAs idênticos em sequência |
| 9 | Error Recovery | 2 | Mesmo furo do item 1 — sem plano B pra falha de infraestrutura |
| 10 | Help and Documentation | 3 | Modelo de negócio dispensa help center — o WhatsApp é a ajuda, adequado ao produto |
| **Total** | | **29/40** | **Good** |

## Anti-Patterns Verdict

**Avaliação humana (Assessment A):** Limpo no sentido clássico de AI slop — busca explícita por `bg-clip-text`/`text-transparent` (gradiente em texto) e `backdrop-blur` (glassmorphism) em todo `components/`: zero ocorrências. Sem hero de métrica gigante, sem side-stripe borders, sem `box-shadow` decorativo fora de overlays (o próprio DESIGN.md proíbe isso e o código respeita). O ponto mais próximo de "molde genérico" é o `SectionHeading` (losango dourado + label caps centralizado) reaparecendo em `/vitrine`, `/categoria/[slug]`, "Acabou de chegar" e o eyebrow dourado idêntico em `StylistHero`, `ConsultingInvite`, `EmptyState` e três das seis variantes de `Sections.tsx`.

**Scan determinístico (Assessment B):** O scan CLI estático (`detect.mjs` sobre `app`/`components`/`public`) voltou limpo (`[]`) — o scanner de arquivo não interpreta JSX renderizado. Os achados reais vieram da injeção do overlay no DOM renderizado, nas 5 páginas:
- `hero-eyebrow-chip` — home, produto, consultoria
- `all-caps-body` — todas as 5 páginas
- `overused-font` (Fraunces, 23-39% do texto) — home, vitrine, consultoria
- `skipped-heading` (H1 → H3, sem H2) — home, vitrine, categoria
- `cream-palette` — todas as 5 páginas
- `cramped-padding` — home (3x), consultoria
- `dark-glow` — home
- `clipped-overflow-container` — consultoria
- `image-hover-transform` repetido — home (~15x), vitrine (~13x)
- `ai-color-palette` ("cyan neon") — produto, no `text-esmeralda-light`

**Onde as duas avaliações convergem (sinal forte, não coincidência):** o motivo eyebrow+losango dourado repetido foi flagrado tanto pela leitura subjetiva (A, como "sameness de sistema aplicado com rigor talvez rígido demais") quanto pelo scanner mecânico (B, como `hero-eyebrow-chip` em 3 de 5 páginas + `overused-font` alto). Duas fontes independentes achando o mesmo padrão é o tipo de convergência que vale investir em corrigir — está classificado abaixo como P3.

**Falsos positivos identificados:** `cream-palette`, `all-caps-body` e `overused-font` disparam em toda página porque são exatamente o sistema de design documentado no `DESIGN.md` (§2 "papel = fundo dominante", §3 "label 10px tracking uppercase", tipografia Fraunces como display oficial) — não são bugs, são a identidade declarada. `ai-color-palette` no `text-esmeralda-light` também é falso positivo: `#1D9A72` é a cor de marca "esmeralda" (função agendamento, documentada), não um acento arbitrário de IA — o detector generalista não tem como saber que é uma cor de marca fixa e intencional. O `skipped-heading`, o `cramped-padding`, o `dark-glow` e o `clipped-overflow-container` não têm essa desculpa — são achados técnicos reais a considerar.

## Overall Impression

O sistema de design é genuinamente respeitado pelo código, não só declarado em documento — isso é raro. O problema real não é "parece feito por IA"; é que a superfície mais recentemente reconstruída desta sessão (a página de produto) tem uma falha concreta e mensurável no dispositivo que a maioria das clientes usa: o botão de conversão fica cortado.

## What's Working

1. **Disciplina de cor com função fixa, verificável no código.** `bordo` só aparece em CTA de produto + a exceção documentada e justificada tecnicamente da PDP (dourado por contraste, 6,78:1 medido). `esmeralda` só em agendamento. Nenhuma cor de acento nova sem decisão.
2. **Zero card quebrado por falta de dado.** `ProductCard`, `CategoryPortals`, `ProductGallery` têm fallback explícito, com comentários no código mostrando que cada fallback nasceu de um bug real já visto e corrigido.
3. **Grade que encolhe em vez de inflar** (`CatalogView.tsx`) resolve corretamente o problema de card gigante forçando rolagem, documentado no código como já ter acontecido e sido revertido.

## Priority Issues

**[P0] CTA da PDP e o link de reasseguramento ficam cortados pela dobra no mobile**
**Por que importa:** verifiquei pessoalmente em 375×812 (viewport de referência): o botão "Quero esta peça" vai de y=777 a y=821 — **ultrapassa o viewport de 812px em 9px**, e o link "Não sabe se é pra você? Pergunta pra Luiza →" fica em y=833, inteiramente fora da tela. A maioria das clientes acessa pelo celular (PRODUCT.md), e essa é justamente a página que foi reconstruída com o objetivo explícito de "caber numa tela sem rolar" — no mobile, ela falha no próprio critério que a motivou.
**Fix:** reduzir a altura da foto no breakpoint mobile (hoje `aspect-[3/4]` full-width ocupa 57% da altura do card só de imagem) ou reordenar o conteúdo pra garantir que CTA + reasseguramento caibam nos primeiros 812px independente do tamanho da descrição.
**Suggested command:** `/impeccable adapt` (produto/[slug], mobile)

**[P1] "Quero esta peça" aponta para dois destinos diferentes conforme o componente**
**Por que importa:** no `ProductCard` (grade/vitrine/home) é um `Link` que navega para a PDP; na própria PDP é um `<a>` que abre o WhatsApp. Mesmo rótulo, ação de natureza diferente — quebra a heurística de consistência (Nielsen H4) no exato momento da decisão de compra.
**Fix:** diferenciar o rótulo do card (ex. "Ver peça") do rótulo da PDP, que pode manter "Quero esta peça" (já tem o ícone do WhatsApp ao lado, mas o texto sozinho é ambíguo).
**Suggested command:** `/impeccable clarify`

**[P1] Nenhuma rota tem `loading.tsx`/`error.tsx`/`not-found.tsx`**
**Por que importa:** confirmei via busca no projeto — zero arquivos desse tipo em toda `app/`. Com fetch direto ao Sanity a cada página (ISR de 60s), qualquer instabilidade de rede ou do CMS cai na tela de erro genérica do Next, quebrando o tom editorial no pior momento.
**Fix:** criar `error.tsx` reaproveitando o tom do `EmptyState` já existente, ao menos em `produto/[slug]`, `categoria/[slug]` e na raiz de `(site)`; um `loading.tsx` simples evita tela em branco em conexão móvel ruim.
**Suggested command:** `/impeccable harden`

**[P1] H1 pulando direto pra H3 (sem H2) em home, vitrine e categoria**
**Por que importa:** achado do detector, não da leitura subjetiva — quebra estrutura semântica de heading, afeta navegação por leitor de tela (Nielsen H3/acessibilidade).
**Fix:** revisar a hierarquia de heading nessas três páginas.
**Suggested command:** `/impeccable audit`

**[P3] Motivo eyebrow+losango dourado repetido em quase toda seção do site**
**Por que importa:** achado cruzado (LLM + detector, independentemente). Cada uso isolado respeita o limite de "3 pontos de dourado por tela" do DESIGN.md, mas a repetição do mesmo motivo em praticamente toda seção — incluindo estados de erro — corre o risco de ler como "molde reaplicado" em vez de "sistema com identidade".
**Fix:** variar o tratamento de cabeçalho de seção em pelo menos 1-2 lugares (ex. consultoria, que já é mais editorial).
**Suggested command:** `/impeccable layout`

## Persona Red Flags

**Jordan (primeira vez, mobile, veio do Instagram):** abre um link direto de produto compartilhado → cai exatamente na PDP mais problemática do site. O botão de contato está cortado na base da tela; o reasseguramento que resolveria sua hesitação está fora da vista. Precisa rolar pra agir — risco real de sair sem perceber que há mais conteúdo abaixo.

**Casey (mobile, distraída, pouco tempo):** rola a home rápido e encontra "Quero esta peça" repetido quase uma dezena de vezes (3 na curadoria + até 8 na fila de novidades) antes de chegar à seção da consultoria — não é parede de opções clássica, mas é repetição do mesmo microtexto que pode dessensibilizar o CTA.

**Riley (stress tester):** categoria com 2 produtos renderiza corretamente, encolhida e centralizada — passa. Mas uma simulação de Sanity fora do ar cai direto na tela de erro genérica do Next, sem plano B em lugar nenhum.

## Minor Observations

- Nome/preço do card empilham no mobile e só dividem linha a partir de `sm:` — decisão correta e documentada (evita quebra de preço de 4 dígitos).
- `NewArrivalsRail` esconde scrollbar nativa e compensa com setas via `HorizontalRail` — solução cuidadosa para affordance real.
- PDP tem `jsonLd` (schema.org Product) + Open Graph com imagem — bom pro canal de entrada principal (redes sociais).
- `EmptyState` usa `bg-espresso` full screen — única surface fora do padrão "página clara" antes de qualquer interação; funciona porque é rara e intencional, mas vale confirmar que é decisão consciente, não hoje sem verificação.
- 12 das 14 peças da vitrine ainda não têm preço cadastrado — item já identificado e comunicado ao dono anteriormente nesta mesma sessão (trabalho pendente da Luiza no Studio, não é bug de código).

## Questions to Consider

1. A ausência de preço em 12 das 14 peças é decisão de negócio (empurrar pro WhatsApp) ou dado ainda não cadastrado? O site trata as duas situações da mesma forma hoje.
2. Se "a mulher primeiro, a peça depois" é a tese, por que a home só chega à stylist como pessoa depois de três seções inteiras de produto?
3. O critério "cabe na tela sem rolar" da PDP foi testado num viewport mobile real (375×812), ou só no desktop — onde o layout de duas colunas de fato cabe?
4. Vale aceitar o risco de uma tela de erro genérica em produção, dado que o site inteiro depende de fetch ao vivo no Sanity a cada request?
