# PROGRESS.md — Estado do projeto

_Atualizado a cada sessão. É a memória do agente entre conversas._
_Última atualização: 2026-07-20 (Fase 6 — reconstrução da página de peças + padrão de cabeçalho do site)_

---

## Fase 6 — Página de peças reconstruída + `SectionHeading` como padrão (2026-07-20)

**Pedido do dono (repetido 3x, cada vez mais enfático):** *"mudar o design
dessa pagina, não quero ajusto"*, *"mudar a pagina por completo e não
ajuste"*, *"fazer uma nova sessão, mais bonita e adequada"*. Não era pedido
de patch — era reconstrução, igual ao "MATAR A SEÇÃO" da Seleção da Luiza.

### O que eu errei antes de acertar (registrar pra não repetir)

1. **Escopo errado:** interpretei "página de peças" como a PDP
   (`/produto/[slug]`) e mexi lá. O dono queria a LISTAGEM (`/categoria`).
2. **Eixo errado, 3 vezes:** propus A/B/C mudando layout de PÁGINA (posição
   do título, grade vs. spreads). Todas rejeitadas — porque nenhuma mexia
   nas DUAS coisas que ele nomeou: "o VESTIDO solto" (a peça boiando no
   fundo de estúdio dentro da foto) e "o nome da peça solto". A lição:
   quando ele nomeia dois elementos específicos, o redesenho tem que
   atacar esses dois, não a moldura em volta deles.
3. **Não olhei a referência que ele mandou.** Ele teve que repetir *"qual a
   dificuldade de entrar no link de referencias"*. Só depois de abrir o
   link (SPA — `WebFetch` só trouxe o `<title>`, precisou de navegador) é
   que a direção destravou.

### Direção que funcionou

Da referência (galeria escura com cards sólidos): **o card é um objeto
sólido apoiado num chão** — o nome vive numa superfície, não flutua. Foi
isso que matou o "solto". Testamos fundo escuro na seção inteira; o dono
pediu de volta o creme mas **mantendo as peças escuras** — card escuro
sobre chão claro é a composição final.

### Entregue (tudo medido ao vivo, não só code review)

- **`ProductCard` com prop `onDark`** — card escuro sólido (espresso, 12px,
  texto creme, dourado no preço/CTA). Card único do site: catálogo E home
  (a home tinha marcação própria em `CuratedSelection`, removida).
- **`productCardImageUrl`** (`sanity/lib/image.ts`) — crop real via `rect`
  (12% topo / 10% base), tirando o fundo de estúdio. **Achado técnico:** o
  Sanity IGNORA `fp-z` do imgix — minha 1ª implementação por ponto focal
  não cortava nada; confirmado comparando bytes da resposta do CDN
  (439.955 B com e sem `fp-z`, idênticos). Dimensões nativas lidas do
  `_ref` do asset (`image-<hash>-<w>x<h>-<fmt>`).
- **`components/ui/SectionHeading.tsx`** — padrão A3 (nome maiúsculas +
  losango dourado + meta, centralizado), escolhido pelo dono entre 3
  alternativas depois de rejeitar serif preto grande. Aplicado em catálogo,
  "Combina com" e "Acabou de chegar" (este perdeu o campo dourado da Fase
  5i por decisão explícita dele). "A seleção da Luiza" ficou de fora — tem
  a frase em itálico da curadora, é voz, não rótulo.
- **Cabeçalho SAIU da grade** — revoga a regra da Fase 5 ("cabeçalho é a
  1ª célula do grid"), que era o mesmo defeito da Seleção da Luiza.
- **Tamanho de card corrigido:** ~430px de largura / foto de ~570px →
  **286px / 381px**. O dono: *"pra ver a imagem precisa rolar"*. Com poucas
  peças a grade encolhe e centraliza em vez de inflar o card.
- **Filtro no eixo central** + filete dourado simétrico (o "Ordenar" à
  direita contra título centralizado lia como desalinhado).

### Pendência aberta

`stash@{0}` — ajuste de espaçamento na PDP, feito durante o erro de escopo
(item 1). Não foi pedido e a direção mudou desde então; decidir com o dono
se descarta ou reaproveita.

---

## Fase 5i — Cabeçalho de "Acabou de chegar": 2 tentativas até acertar (2026-07-17)

**Tentativa 1 (rejeitada):** depois do dono apontar que o título "Acabou de
chegar" era só um "negrito forte" solto, dei a ele o mesmo vocabulário da
Seleção da Luiza (etiqueta "Novidades" + fio dourado fino). O dono rejeitou:
*"permaneço sem achar que ficou bom... da maneira assim marcadão em negrito
não ficou legal"*. Certo em rejeitar — etiqueta pequena com tracking largo
acima de todo título de seção é exatamente o padrão que a skill de design
(Impeccable) marca como "AI scaffolding" quando repetido (era a 2ª seção da
página com esse mesmo recurso).

**Correção de processo:** em vez de tentar mais um ajuste isolado (4ª rodada
no mesmo título), parei e mostrei 3 direções REALMENTE diferentes num mockup
visual antes de tocar em código: (A) campo de dourado atrás do título, (B)
faixa fina de foto com véu escuro atrás (a tese "a foto é a tela" aplicada
ao cabeçalho), (C) fio dourado atravessando a seção. O dono pediu
recomendação; descartei B (banda escura de foto logo acima de uma fila que
já é toda fotos, e o site só permite pouca área escura por página) e
recomendei A, que ele já preferia mas tinha receio de repetir a "agonia
visual" do hero.

**Tentativa 2 (aprovada, com um bug pego a tempo):** implementado o campo
dourado como degradê TRANSLÚCIDO (`from-dourado/25 via-dourado/10
to-transparent`), nunca cor sólida — é isso que evita o "painel chapado"
que deu agonia no hero (aquele era cor sólida + letra gigante). Primeira
versão sangrava a banda até a borda da viewport (`bg-gradient` no `<section>`
inteiro); medido em 1920px: o dourado forte caía na margem vazia à esquerda,
longe do título, porque o conteúdo é centralizado numa coluna de 1440px mas
o gradiente não era. Corrigido: a banda fica contida na própria coluna
`max-w-1440` — o dourado forte agora sempre atrás do título, testado em
1920/1440/390px. Documentado como padrão novo no `DESIGN.md` §2 (dourado
também pode ser campo de fundo em degradê, nunca sólido, contido na coluna).

Screenshot real do dono (localhost:3000) confirma o resultado ao vivo.

---

## Fase 5h — Seleção da Luiza reconstruída do zero + fix de imagens (2026-07-17)

O dono aprovou a fila "Acabou de chegar" ("começando a ficar bom") mas
reprovou de vez a Seleção da Luiza: *"MATAR A SEÇÃO E CRIAR ALGO NOVO POIS
NÃO ESTÁ FUNCIONANDO DE MANEIRA NENHUMA"*. As Fases 5b/5c/5f/5g tentaram
consertar a MESMA estrutura (coluna de texto ao lado de foto dominante) e a
mesma reclamação voltava — porque texto e foto nunca têm a mesma altura e
todo conserto só movia o vazio de lugar.

**Estrutura nova (`CuratedSelection.tsx` reescrito):** a nota da stylist
vira uma abertura editorial CENTRALIZADA (largura contida, não estica), e as
peças ficam numa linha de 3 IGUAIS abaixo — mesma foto, mesma largura, mesma
altura. Grade uniforme = impossível desalinhar. Verificado ao vivo (1440 e
390px): 3 peças com altura idêntica (567px) na mesma linha no desktop,
empilham no mobile. Direção decidida com a skill Impeccable (`/impeccable
layout`, register brand) depois de 3 direções candidatas.

**Fix de imagens (dono: "só não apareceu as imagem"):** investigado ao vivo.
As URLs eram válidas (otimizador 200 + bytes), mas em dev as fotos
`loading=lazy` intermitentemente não decodificavam — o otimizador do
next/image engasga com os PNGs originais grandes do Sanity (1792×2400), e o
placeholder (sand-100) quase igual ao fundo faz uma foto atrasada ler como
"não apareceu". Ajustes: tamanho pedido 800→600px (mesmo da fila, que já era
confiável) e as 3 imagens em `priority` (eager) em vez de lazy — são só 3,
logo abaixo do hero. Verificado 3/3 carregando em 3 reloads no servidor
isolado E as 3 retornando 200 pelo otimizador do próprio servidor do dono
(porta 3000).

Nota sobre a limitação do ambiente de teste desta sessão: a aba do Browser
pane roda com `document.hidden=true`, o que faz o Chromium estrangular
carregamento lazy e rAF — por isso imagens eager e medição DOM são
confiáveis aqui, mas suavidade de animação e lazy-load precisam de
confirmação num navegador real do dono.

**Estado: aguardando o dono confirmar visualmente (Ctrl+Shift+R na home).**

---

## Fase 5g — Seleção da Luiza (composição) + setas de navegação na fila (2026-07-17)

Depois do PR #48 (Fase 5f) resolver o bug técnico de stretch, o dono olhou de
novo e insistiu: *"não esta sendo arrumado oque eu to lhe pedindo... pegar
referencias e mudar"* — pedindo reconstrução da composição, não só patch de
bug, para as duas seções (Seleção da Luiza + Acabou de chegar).

**Seleção da Luiza — o `self-center` da Fase 5f não era suficiente.** Medido:
mesmo sem esticar, a legenda centralizada sobra ~40% de vazio acima do texto
e ~33% abaixo — um bloco pequeno flutuando isolado ao lado de uma foto
imponente, não uma composição intencional. Preparadas 3 direções candidatas
(ancorar no topo / reduzir a foto / tirar a legenda da lateral) e a decisão
delegada à skill de design (Impeccable, `/impeccable layout`), que confirmou
o diagnóstico (não é decoração que falta, é relação de vazio) e escolheu
ancoragem no topo: `flex flex-col justify-between` distribui abertura
(selo+nota) no topo e assinatura no rodapé da coluna — usa os 806px de altura
com o ritmo "agrupamento apertado + separação generosa" (registrado em
`reference/layout.md` da skill), em vez de evitar o espaço. Medido depois:
assinatura ancorada exatamente no rodapé da coluna (791–806px), batendo com
a base da foto ao lado. Mobile não muda (`md:` prefix).

**Acabou de chegar — setas de navegação.** Pesquisa em Ganni.com confirmou:
filas reais de novidades no varejo de moda usam botões explícitos de
anterior/próximo, não só arrasto — ao esconder a barra nativa (Fase 5f),
tiramos o único indício de navegação para mouse comum sem shift+wheel. Novo
componente `components/ui/HorizontalRail.tsx`: wrapper client mínimo (só
ref+observer+botões viram JS no cliente; `ProductCard`s continuam vindo do
server component pai como children). Estado de disabled via
`IntersectionObserver` em sentinelas no início/fim da fila, não listener de
`scroll` nativo (Lenis quebra esse evento silenciosamente, DESIGN.md §4).
`aria-disabled`, nunca `disabled` — `disabled` tira o foco do botão para
`<body>`, quebrando navegação por teclado no próprio componente adicionado
por acessibilidade. Botões só em `md+` com `pointer:fine`.

Animação do clique via rAF com easing próprio, não `scrollBy({behavior:
'smooth'})`: em teste isolado nesta sessão o scroll suave nativo não
avançou. Causa raiz real (confirmada nesta continuação): a aba de teste do
Browser pane roda com `document.hidden = true` — o próprio Chromium pausa
`requestAnimationFrame` (e possivelmente throttles outras APIs) numa página
que ele considera oculta, independente do código. rAF+easing próprio é o
mesmo padrão já usado no projeto para motion que convive com o Lenis
(`PhotoParallax.tsx`), escolha segura de qualquer forma. **Verificado nesta
sessão:** clique calcula o alvo de scroll corretamente (testado forçando o
fallback `prefers-reduced-motion`, que usa atribuição direta sem depender de
rAF — `scrollLeft` pulou do valor esperado ao alvo certo). **Não verificado
ao vivo:** a suavidade real da animação rAF e a atualização dinâmica do
`aria-disabled` durante o scroll, porque `document.hidden=true` nesta aba
pausa isso independente do código estar certo. Precisa de confirmação num
navegador real (o dono, ao testar, é quem vai ver se a animação anima).

**Estado: aguardando confirmação visual do dono em navegador real — as duas
seções mudaram de composição, não só de bug.**

---

## Fase 5f — Legenda esticada no desktop + barra nativa da fila (2026-07-17)

Depois da Fase 5e ("home finalizada do lado do código"), o dono mandou duas
capturas novas e disse: *"não esta sendo arrumado oque eu to lhe pedindo...
na versão mobile fica ok, mas na de computador não"* (Seleção da Luiza) e
*"na parte acabou de chegar ta com uma barra está tambem errado e solto"*
(Acabou de chegar). Desta vez a investigação foi feita **ao vivo, com
medição DOM real** (`getBoundingClientRect`/`getComputedStyle` num servidor
isolado, porta 3130) antes de qualquer alteração de código — a ferramenta de
screenshot travava nesta sessão (timeout repetido em duas páginas
diferentes), então a verificação visual foi substituída por medição
numérica precisa, não pulada.

**Achado 1 — `CuratedSelection.tsx` (Seleção da Luiza).** `align-items:
stretch` (padrão do CSS Grid) esticava a coluna da legenda (selo + nota +
assinatura) para bater com a altura da peça A ao lado — medido: coluna com
806px de altura, mas o conteúdo real ocupa só 219px, sobrando ~587px vazios
embaixo do texto. Só existe no desktop (grid de 12 colunas); no mobile é
grid de coluna única, sem vizinho para "esticar até bater". Bate exatamente
com o relato "mobile ok, desktop não". **Diferente** do achado da Fase 5b
(auto-placement da peça C) — aquele continua correto, este é um bug novo,
não pego antes porque a verificação anterior media posição/alinhamento de
coluna, não altura de conteúdo vs. altura esticada do grid.
Corrigido: `md:self-center` na legenda — não estica mais, centraliza ao
lado da foto. Medido depois: coluna caiu para 219px (bate com o conteúdo).

**Achado 2 — `NewArrivalsRail.tsx` (Acabou de chegar).** `[scrollbar-width:
thin]` é propriedade CSS **exclusiva do Firefox** — em Chrome/Edge
(Chromium, o navegador do dono) é ignorada e o navegador desenha a barra de
rolagem nativa padrão (cinza, ~10px) por baixo da fila. Medido: 10px de
espaço reservado para a barra antes da correção. Corrigido escondendo a
barra nos três motores (`scrollbar-width:none` + `-ms-overflow-style:none`
+ `[&::-webkit-scrollbar]:hidden`) — o arrasto continua sinalizado pelo
meio-card visível na borda direita, sem depender de UI nativa do navegador.
Medido depois: 0px reservados; `scrollWidth` da fila preservado em mobile
(rolagem continua funcional).

**Lição de processo, registrada por já ter se repetido:** o dono apontou
duas vezes seguidas (após PR #45 e após PR #47) que a correção não batia
com o que ele via. A causa, nas duas vezes, não era falta de esforço — era
verificação incompleta (medir alinhamento de posição, não altura
efetiva/CSS específico de motor de navegador). A partir desta fase, toda
alegação de "corrigido" nesta seção da home foi confirmada por medição
numérica antes/depois, não só por releitura do código.

PR #48, aberto a partir de `main` (que estava sincronizado com
`origin/main` — sem incidente de commit direto desta vez). Code review em
PT-BR disparado em background antes do merge, mesmo processo já usado
desde a Fase 5.

**Estado: aguardando code review + confirmação visual do dono. Continua
valendo o checkpoint por página — nenhuma outra página deve começar antes
dele confirmar a home.**

---

## Fase 5e — Home finalizada de ponta a ponta (2026-07-17)

O dono mudou a forma do checkpoint: em vez de gate por correção pontual
("Fase A confirma, depois Fase B"), pediu pra eu **terminar a home inteira**
antes de qualquer nova rodada de confirmação, e só então passar pra outra
página. Isso absorveu a Fase B que estava reservada (ver Fase 5d) + uma
auditoria própria do resto da home.

**Fase B aplicada** (`sanity/lib/queries.ts`, `components/ui/ProductCard.tsx`):
`CARD_FIELDS` ganhou `image2` (`images[1]`) e `isNew`. `ProductCard` mostra a
2ª foto em crossfade no hover quando existe (sem zoom competindo — a 1ª foto
é "parada", a 2ª é o "movimento"), e um selo "Novo" (texto sobre fundo
`sand-50/90`, sem cor de função nova) quando `isNew` é `true`. Aplica em
todo lugar que usa `ProductCard` (vitrine, categoria, coleção, rail,
relacionados), não só na home.

**Achado da própria auditoria (antes de declarar a home pronta):** conferi
diretamente na API do Sanity (`*[_type=="product"]{title,isNew,"imgCount":
count(images)}`) — **todos os 16 produtos têm exatamente 1 foto e
`isNew: false`.** O código da Fase B está correto e não quebra nada (cards
renderizam normalmente com 1 foto, sem selo, como antes), mas **não tem
dado nenhum pra mostrar o efeito ainda** — isso é tarefa da dona no Sanity
Studio (subir uma 2ª foto por produto, marcar `isNew` em peças novas), não
um bug de código. Registrado aqui pra não ser confundido com "não
funcionou" quando o dono for conferir.

**Achado da auditoria, corrigido:** `CuratedSelection.tsx` (Seleção da
Luiza, S2 — logo após o hero) tinha a mesma lacuna que o code review do
PR #46 achou no rail: a peça dominante (A) não tinha `priority` na
`&lt;Image&gt;`, então carregava em lazy mesmo estando acima da dobra na
maioria das telas. Adicionada prop `priority` em `CuratedPiece`, usada só
em A (a maior, mais visível sem rolar — B e C continuam lazy, corretamente).

**Seções revisadas e sem pendência nova:** `Hero.tsx` (vídeo full-bleed, já
corrigido nas Fases 4/5), `CategoryPortals.tsx` (fallback tipográfico
funcionando; grid de fotos pronto pra quando a dona subir fotos de
categoria — hoje nenhuma categoria tem, roda 100% no fallback, por design),
`ConsultingInvite.tsx` (sem pendência reportada, revisado, estrutura ok),
`Footer.tsx` (3 colunas, Fase 5).

Verificado (porta isolada, `.next` limpo): build limpo; home com 1 `h1`, 2
`h2` (Acabou de chegar + Consultoria), sem erro de console; peça A da
Seleção da Luiza carrega `complete: true` sem `loading` (eager); sem
overflow horizontal em mobile.

**Estado: home finalizada do lado do código — inclusive os itens que
dependem de dado que a dona ainda não cadastrou (2ª foto, isNew), já
preparados e seguros para quando ela cadastrar. Aguardando o dono conferir
a home inteira ao vivo antes de qualquer trabalho em outra página —
checkpoint por página, pedido explícito dele.**

---

## Fase 5d — Bug real da fila "Acabou de chegar" + plano formal (2026-07-17)

Nova captura de tela do dono mostrando "Acabou de chegar" com o primeiro
produto sem foto e um vão vazio grande, com a frase *"nada que eu pedi da
home page foi feito"*. Junto, três pedidos de processo, explícitos:
1. não fazer tudo de uma vez, trabalhar em fases com checkpoint;
2. olhar referências de sites reais para a vitrine;
3. atualizar `PRD.md`/`CLAUDE.md`/`docs/PROGRESS.md`.

Segui os três. Entrei em modo de planejamento formal (`EnterPlanMode`) antes
de tocar em qualquer código — plano salvo e aprovado pelo dono antes da
implementação.

**Investigação (antes de qualquer correção):** reproduzi a captura em
ambiente isolado (viewport 1307×628, o tamanho exato da imagem) e achei
**dois bugs reais e distintos**, não um problema de design:
1. A fila (`components/home/NewArrivalsRail.tsx`) media `scrollLeft: 78`
   **sem nenhuma interação do usuário** — comportamento conhecido de
   `scroll-snap` quando o padding do container não é declarado também como
   `scroll-padding`: o navegador corrige a posição inicial pra bater com o
   snap-point, deslocando a fila sozinha no load.
2. `ProductCard.tsx` não tinha como marcar uma imagem como prioritária —
   os primeiros itens da fila (já visíveis no load, sem rolar) carregavam em
   lazy, e o placeholder (`bg-sand-100`) é quase idêntico ao fundo da seção
   (`bg-sand-50`): enquanto a foto não chega, o card mostra só a legenda,
   lendo como "sem foto".

As 4 correções da Fase 5c (Seleção da Luiza, bloco de categorias, padding do
`ProductCard`, CTA da consultoria) foram reconfirmadas como corretas nesta
investigação — não precisaram ser refeitas.

**Correção (Fase A do plano):**
- `NewArrivalsRail.tsx`: `[scroll-padding-inline:6vw]` no container da fila
  (mesmo valor do padding visual) + `priority` nos 3 primeiros `ProductCard`.
- `ProductCard.tsx`: nova prop `priority?: boolean`, repassada ao
  `next/image` interno (não existia antes — é a causa de não dar pra marcar
  itens específicos como eager sem essa mudança).
- Verificado no viewport exato da captura (1307×628) e em mobile: `scrollLeft`
  volta a `0` no load; os 3 primeiros `img` carregam sem atributo `loading`
  (eager) e chegam com `complete: true`; o 4º continua `loading="lazy"`,
  como esperado. Sem overflow horizontal em nenhum dos dois viewports.

**Pesquisa de referências (pedido explícito do dono, feita antes do plano):**
fui em dois sites reais de moda de escala comparável ao projeto —
Reformation (`thereformation.com/dresses`) e Ganni (`ganni.com/clothing`) —
em vez da lista genérica de 179 links 3D já descartada. Confirmado: a
estrutura do `CatalogView` (cabeçalho como célula da grade, régua de
filtro/ordenação) já bate com o que o varejo de verdade faz — não precisa
mudar. Duas melhorias concretas ficaram registradas para a **Fase B** (só
depois do dono confirmar a Fase A ao vivo, por pedido dele): 2ª foto no
hover do card (o schema já tem `images[]`, só não é usado no card) e selo
"Novo" quando `isNew` (o dado já existe, só não é mostrado).

**Documentos atualizados nesta fase** (pedido explícito do dono):
- `CLAUDE.md`: removida a contradição real que existia desde antes da
  reconstrução — §7 ainda dizia *"desenhe o mobile primeiro"*, o oposto da
  decisão já tomada na Fase 4 ("desktop lidera, mobile é derivado"). Tokens
  desatualizados (`sand-200`/`300`, que não existem mais) trocados por
  referência direta ao `DESIGN.md`. Protocolo de trabalho (§8) ganhou a
  lição desta fase: medir DOM não substitui olhar; fases pequenas com
  checkpoint, não tudo de uma vez.
- `SDD.md`: tabela de rotas (`/vitrine`, `/consultoria`, sem `/stylist` nem
  `/colecao/novidades`), schema (`category.image`), especificação de
  WhatsApp (`lib/wa.ts` como fonte única desde a Fase 5).
- `PRD.md`: seção 7 (features do v1) com os nomes de rota atuais e a
  composição real da home em 5 seções — sem mudar escopo de produto.

**Code review do PR #46, corrigido:** `i<3` deixava o 4º card do rail
majoritariamente visível (64%) no viewport exato da captura do dono e ainda
`loading="lazy"` — mesma causa-raiz, card quase visível em vez de fora da
tela. Virou `i<4` (cobre a faixa real de ~4,1 cards visíveis em
`lg:w-[24vw]`). Também corrigido: `SDD.md` dizia "redirect 301", o código
usa `permanent: true` que o Next.js serve como 308; e adicionado comentário
em `ProductGallery.tsx` explicando por que o carrossel mobile de produto
(mesma receita `overflow-x-auto`+`snap`+padding) não precisa do mesmo
`scroll-padding-inline` — testado ao vivo, não reproduz o bug (usa margem
negativa, não padding direto).

**Follow-up não corrigido nesta fase (fora de escopo, registrado para
depois):** `ProductCard` em `components/catalog/CatalogView.tsx` (grade de
`/vitrine`, categoria, coleção) e a `Image` interna de `CuratedPiece` em
`components/home/CuratedSelection.tsx` (Seleção da Luiza, S2 da home) nunca
recebem `priority` — mesma classe de sintoma poderia aparecer nessas telas.
Não corrigido agora por decisão de escopo (o pedido era só a fila "Acabou de
chegar"); se o dono notar o mesmo problema em `/vitrine` ou na home, é o
próximo passo óbvio.

**Estado: Fase A entregue, verificada, e com o code review aplicado. Fase B
(2ª foto + selo "Novo") só começa depois do dono confirmar esta correção ao
vivo — checkpoint pedido por ele, respeitado.**

---

## Fase 5c — Retoques após o dono ver a reconstrução ao vivo (2026-07-16)

Primeira vez que o dono viu qualquer coisa da Fase 5 rodando de verdade (no
`npm run dev` dele). Feedback misto: *"gostei do fato de eu scroll a página
e acompanhar"* (parallax do hero aprovado), mas *"senti a página um pouco
pesada"* com 4 pontos concretos + consultoria + vitrine.

1. **"Seleção da Luiza tá muito grande, poderia deixar mais na esquerda e
   menor"** + **"logo abaixo está desalinhado"**: achei um bug real por trás
   do "desalinhado" — a peça C (`CuratedSelection.tsx`) não tinha
   `col-start` explícito, então o grid auto-posicionava ela na MESMA linha
   de B, só empurrada por `margin-top` — um hack quebrado, não ritmo
   intencional. Corrigido: as 3 peças têm posição de coluna explícita
   (A: col-span-6, 50% — era col-span-8, 66%; B e C lado a lado, mesma
   linha, sem hack de margem).

2. **"As opções vestidos/saias/blusas/calças poderiam alinhar num único
   bloco"**: o fallback tipográfico de `CategoryPortals.tsx` (quando
   nenhuma categoria resolve foto) era uma lista vertical dividida, alta e
   solta. Virou um bloco único: grid com borda externa e divisores
   internos, as 4 categorias lado a lado (2x2 no mobile), altura modesta.

3. **"Acabou de chegar, ficou solto o nome"**: `ProductCard.tsx` tinha
   `p-5 md:p-6` (respiro igual nos 4 lados, como um card com margem
   própria) — reduzido para `pt-3 pb-1`, o nome agora cola na foto.
   Afeta todo uso de `ProductCard` (vitrine, categoria, rail, relacionados)
   por design — é a mesma lógica em todo lugar.

4. **Consultoria "repetitivo, Agendar horário uns 4x"**: removido o
   `WaButton` de dentro de `FotoLadoSection` (repetia a cada seção
   foto+texto do CMS). Ficam só 2 no CONTEÚDO da página: hero
   (`StylistHero`) e a seção de fechamento (`DestaqueClaroSection`,
   "Vamos começar?"). As outras ocorrências que apareciam ao contar
   `document.querySelectorAll('a')` sem escopo eram nav + footer (chrome
   global, em toda página do site por design — não é repetição de página).

5. **"Vitrine: as peças também não está legal"**: achei a causa em
   `/categoria/saias` (2 peças) — `CatalogHeaderCell` esticava pra ocupar
   uma coluna inteira de 1/3 do grid (~325px) só pra um título curto
   ("Saias"), sobrando um vão vazio grande do lado. Corrigido com um
   grid-template diferente para N≤2 (`md:grid-cols-[auto_1fr_1fr]` — a
   coluna do cabeçalho vira largura do próprio texto, não 1/3 fixo) +
   `justify-start` no header (antes `justify-end` ancorava o texto embaixo
   de uma célula esticada, deixando um vão vazio em cima). N=3 continua no
   grid uniforme de 3 colunas (o auto-header bagunçaria a largura da coluna
   1 na 2ª linha, com 2 linhas envolvidas).

**Nota sobre o ambiente de verificação nesta sessão:** o servidor de
verificação isolado (portas 3070-3090) apresentou instabilidade real —
"Jest worker encountered 2 child process exceptions" e
"Cannot find module for page" — rastreados a cache `.next` compartilhado
entre `next build` (produção) e `next dev` rodando em sequência rápida na
mesma pasta. `rm -rf .next` antes de cada novo `next dev` resolveu
consistentemente. Isso não afetou o código entregue (build de produção
sempre limpo), só atrasou a verificação visual própria.

Verificado (porta isolada, após `rm -rf .next` limpo): B/C da Seleção da
Luiza agora com o mesmo `top`/`bottom` (alinhados de verdade); bloco de
categorias com as 4 lado a lado; consultoria com 2 CTAs no conteúdo (hero +
fechamento); `/categoria/saias` com header auto-dimensionado e gap de 24px
(o gap do grid, não um vazio) até o primeiro produto. Build limpo.

---

## Fase 5 (continuação) — Reconstrução completa, todas as páginas de uma vez (2026-07-16)

Depois de Etapas 0-1 (fundações + hero), o dono cortou o portão etapa-por-
etapa: *"novamente só ta alterando pedaços, quero que mude tudo, seja um
novo site totalmente diferente do que já foi."* Execução direta do blueprint
inteiro numa sessão, sem gate intermediário — o gate agora é o site completo.

**Mapa de rotas mudou:**
- `/vitrine` (nova): catálogo completo, único lugar com filtro/ordenação.
- `/colecao/novidades` → **removida**, redirect 301 → `/vitrine`
  (`next.config.ts`). Eliminava a duplicação exata home/página que o dono
  já tinha apontado.
- `/stylist` → **removida**, redirect 301 → `/consultoria` (a nav já dizia
  "Consultoria" desde 10/07; a URL nunca tinha acompanhado).
- `/categoria/[slug]`, `/colecao/[slug]`, `/produto/[slug]`: reescritas,
  mesmo padrão de rota, template/queries novos.

**Home reconstruída em 5 seções novas** (`components/home/`): Hero (vídeo
full-bleed, sem painel de cor — ver Etapa 1), `CuratedSelection` (nota da
stylist virou legenda da curadoria, composição assimétrica 1 peça grande +
2 em escada — nunca grid esticado), `CategoryPortals` (fotos de categoria
como botão, com fallback tipográfico quando a categoria não tem foto — hoje
nenhuma tem, o fallback é o que roda em produção), `NewArrivalsRail` (fila
com scroll-snap), `ConsultingInvite` (única seção escura, foto+bloco
esmeralda composicional+CTA). `CuratorialNote.tsx` e `PersonalStyling.tsx`
deletados — conteúdo migrou.

**Catálogo unificado** (`components/catalog/CatalogView.tsx`, substitui
`ProductCatalog.tsx`): título+contador+filtro **são a primeira célula da
grade**, não um banner separado — a causa raiz do "solto, não harmônico"
que sobreviveu às Fases 4c/4d. Home usa o mesmo componente na seção
Novidades (Etapa 2 do blueprint) com a mesma query de `/vitrine`.

**Produto reconstruído**: galeria em pilha vertical no desktop (rolar =
folhear a peça, zero carrossel/sticky), carrossel snap no mobile
(`ProductGallery.tsx`), seção "Combina com" nova (`RelatedRail.tsx` — a
página era beco sem saída, agora sempre oferece 4 peças da mesma categoria).
CTA de consultoria virou link de texto, nunca segundo botão.

**Consultoria renomeada e recomposta**: hero novo foto-dominante
(`StylistHero.tsx`); as 7 seções dinâmicas do CMS (já aprovadas nas Fases
3/3.1 — cor composicional, `PhotoParallax`, andaime único) foram extraídas
de dentro de `app/(site)/stylist/page.tsx` (446 linhas numa rota) para
`components/consultoria/Sections.tsx` — recomposição de arquivo, não
redesenho: o que já funcionava só mudou de endereço.

**Reorganização de pastas** (pedido explícito do dono, achado da auditoria):
zero componente solto na raiz de `components/` — tudo em `layout/`,
`motion/`, `home/`, `catalog/`, `product/`, `consultoria/`, `ui/`. Todo GROQ
centralizado e nomeado em `sanity/lib/queries.ts` — nenhuma página mais
escreve query inline. `lib/wa.ts` é a fonte única de links de WhatsApp
(sanitiza o número, `\D` fora — achado do code review do PR #44, antes cada
página montava a string à mão). Footer expandido de 1 linha genérica para
3 colunas (categorias / consultoria+contato / nota).

**Schema Sanity**: campo `image` opcional em `category` (portais da home);
fallback automático para a foto do produto mais recente já implementado na
query (`categoryPortalsQuery`), então a home não quebra enquanto a Luiza não
cadastra fotos de categoria — hoje roda 100% no fallback tipográfico.

**Achado real corrigido durante a verificação (não pelo code review, por
mim mesmo revisando):** o CTA do hero ("Ver vitrine") ainda apontava para
`/colecao/novidades` (rota antiga) em vez de `/vitrine` direto — funcionava
só porque o redirect 301 cobria, mas era um link morto de verdade,
corrigido antes do commit.

Verificado (porta isolada, nunca a 3000 do dono): home com as 5 seções e
exatamente 1 `h1`; `/vitrine` com cabeçalho na mesma linha dos primeiros
produtos (`top` idêntico, medido); `/categoria/saias` (2 peças) com grid
capado em `max-w-5xl` e legenda "edição enxuta"; `/produto/[slug]` com 1
CTA sólido + 1 link de texto + seção "Combina com"; `/consultoria` com as 6
seções; drawer mobile sem overflow horizontal e sem link morto para
Novidades; mega-menu funcionando via hover real (não só leitura de DOM);
redirects `/stylist` e `/colecao/novidades` confirmados. Build limpo.

**Nota honesta sobre o processo:** este ciclo NÃO teve o portão de aprovação
visual por etapa que a Fase 5 original (Etapas 0-1) tinha estabelecido como
regra — o dono pediu explicitamente para não gatear por pedaço. Isso
significa que, diferente do hero isolado da Etapa 1, o dono ainda não viu
NADA disto ao vivo. O risco que a auditoria descreveu (construir sem
verificação visual real) está mitigado pelas checagens de DOM/geometria
acima, mas essas não substituem o olho — a mesma ressalva de sempre.

---

## Fase 5 — Reconstrução do zero (2026-07-14, em andamento)

O dono rejeitou o hero da Fase 4 ("esse vídeo com esse vermelho e esse LT
STUDIO assim tá me dando agonia visual") e as páginas de peças ("permanece
do mesmo jeito"), e deu a ordem definitiva: *"acione um time de agente, faça
o review de tudo que já solicitamos... você permanece algo só remodelando,
não uma estrutura nova, organizar as pastas do projeto... sem ser só
alteração e sim construir do zero."*

**Time de 2 agentes acionado (pedido explícito do dono), ambos em PT-BR:**

1. **AUDITORIA** (relatório completo entregue ao dono): de ~17 pedidos, só 4
   atendidos de verdade. Três pedidos de "redesign total" (08/07, 09/07,
   14/07) — nenhum produziu site estruturalmente diferente. Padrões de falha
   confirmados: (a) pedido global fatiado em "fases seguras" que somam
   retoques, nunca estrutura — "rigor micro, covardia macro"; (b) DESIGN.md
   violado pela implementação seguinte (painel bordô chapado do hero Fase 4
   viola a Regra da Cor Composicional escrita 1 dia antes) e autocontraditório
   (front-matter vs corpo; §6 diz peso 300, §3 diz 400-450); (c) validação
   por DOM substituindo olho — o dono era o único QA visual; (d) interpretação
   sistematicamente restritiva dos pedidos (o dono precisa pedir 2-3x).
   Condições inegociáveis da reconstrução: desenhar a composição inteira
   antes de fatiar; nada pronto sem verificação visual real; catálogo+produto
   no design desde o dia 1.

2. **BLUEPRINT** (arquiteto — documento completo no histórico da sessão de
   14/07): tese "a foto É a tela" — fotografia full-bleed é o terreno; cor,
   texto e UI são objetos pequenos sobre ela. Resolve as rejeições 1, 2, 4 e
   5 de uma vez. Mapa novo: home editorial (hero full-bleed → seleção da
   Luiza → portais de categoria → fila "acabou de chegar" → consultoria
   escura) / NOVA /vitrine (catálogo completo, único lugar com filtros —
   /colecao/novidades morre com redirect) / catálogo com cabeçalho COMO
   célula da grade (não banner) / produto com galeria em pilha + "Combina
   com" / /consultoria renomeada de /stylist. Componentes reorganizados por
   domínio: ui/, layout/, motion/ (4 gestos), home/, catalog/, product/,
   consultoria/. 6 etapas: 0-fundações → 1-hero (PORTÃO: dono aprova antes
   de seguir) → 2-home → 3-catálogo → 4-produto → 5-consultoria → 6-passe
   de coreografia. Cada etapa com gate de verificação visual dupla
   (desktop 1440 + mobile 390).

### Etapa 0 — Fundações (este commit)

- `lib/wa.ts`: fonte única de href de WhatsApp (antes montado à mão em 6
  arquivos). Call sites migram conforme cada página é reconstruída.
- `components/motion/tokens.ts`: EASE_OUT_EXPO + variants de stagger — o
  vocabulário único de motion. Nav.tsx já importa daqui.
- `PhotoParallax` movido de `components/stylist/` para `components/motion/`
  (é genérico); `SmoothScroll` movido da raiz para `components/motion/`.
- Campo `image` opcional adicionado a `sanity/schemas/category.ts` (para os
  portais de categoria da home, Etapa 2; fallback = foto do produto mais
  recente).
- **Desvios conscientes do blueprint:** redirects (/stylist→/consultoria,
  /colecao/novidades→/vitrine) NÃO entraram na Etapa 0 — apontariam para
  rotas que ainda não existem; entram nas Etapas 3 e 5 junto com as rotas.
  `queries.ts` centralizado nasce com as queries novas nas etapas seguintes;
  mover as existentes agora seria churn em páginas que serão reescritas.

### Etapa 1 — Hero novo (este commit) — AGUARDANDO PORTÃO DO DONO

`components/home/Hero.tsx`, do zero: vídeo full-bleed 100% da largura ×
(100vh − header). SEM painel de cor, SEM wordmark-selo (as duas metades da
rejeição de hoje). Legibilidade via scrim de gradiente só na metade inferior
(transparente → espresso/60 — tratamento de foto, não lavagem). Conteúdo
embaixo-esquerda: eyebrow 10px + h1 no tier H1-Página (48px @1440 — presença
vem da foto de 828px de altura atrás, não do corpo da letra) + CTA único
"Ver vitrine" contorno cream (href temporário /colecao/novidades até a
Etapa 3). Indicador de scroll animado no canto direito. 3 camadas de
parallax via useScroll (vídeo escala 1→1.12 + escurece, conteúdo sobe 12%
mais rápido). `HeroSignature.tsx` (o hero rejeitado) DELETADO.

Verificado em 1440x900 e 375x812: zero painéis bordô no hero (busca
programática por qualquer bg com as cores 123,30,58/74,17,35 → 0
resultados), zero selo, 1 h1 na página, CTA na dobra nos dois viewports,
sem overflow horizontal. **A ferramenta de screenshot falhou de novo nesta
sessão (timeout, artefato conhecido de tab em segundo plano) — o gate
visual REAL desta etapa é o olho do dono, que é exatamente o desenho do
portão: Etapa 2 não começa sem o dono aprovar este hero ao vivo.**

**Estado: Etapas 0-1 entregues. Próximo: dono olha o hero → aprovando,
Etapa 2 (home completa); reprovando, itera aqui.**

---

## Fase 4e — Dois retoques após o dono ver a Fase 4d ao vivo (2026-07-14)

Duas capturas de tela reais (`/vestidos` e o mega-menu aberto) trouxeram
feedback direto:

1. **"Esse Novidades permaneceu no side bar, sendo que não foi o que
   falei, mandei retirar."** Na Fase 4d eu li "trazer a versão completa pra
   home, eliminando a outra" como só "acabar com a inconsistência" — mas o
   dono queria também que a nav parasse de apontar pra lá, já que agora
   Novidades vive de verdade na home. Removido o "bloco destaque" do
   mega-menu (`components/layout/Nav.tsx`) por completo — o mega-menu agora
   é só a grade de categorias. **Não removida** a rota `/colecao/novidades`
   nem o link do drawer mobile: `EmptyState` usa aquela rota como destino de
   fallback em várias telas, e o dono não pediu pra tirar do mobile
   especificamente (só citou o "side bar", a captura era do mega-menu
   desktop).

2. **"Sobre a vitrine-peças, permaneceu cru."** Mesmo com o cabeçalho
   harmonizado (Fase 4d), a grade de produtos com poucas peças (ex.: 2
   vestidos) esticava em `grid-cols-4` e deixava um vazio enorme à direita —
   lia como "grid quebrado com produtos faltando", não como "seleção
   pequena por design". Corrigido em `ProductCatalog.tsx`: para 1-3 peças
   visíveis, o container do grid ganha um `max-w` proporcional ao número de
   colunas (`max-w-[300px]`/`max-w-2xl`/`max-w-4xl`) — os cards mantêm o
   tamanho normal, e o "vazio" que sobra é só margem de página, não células
   de grid órfãs. A partir de 4 peças, comportamento idêntico a antes.

Verificado: mega-menu sem "Novidades" (confirmado via hover real, não só
DOM — `document.hasFocus()`/eventos sintéticos falharam nesta sessão, mesmo
artefato de tab em segundo plano já documentado; `computer{hover}` real
funcionou). Grade de 2 peças em `/categoria/vestidos`: container caiu de
~1240px para ~672px (`max-w-2xl`), cards mantiveram ~324px cada, sem vazio
à direita dentro do grid. Mobile (375px) inalterado. Build limpo. Verificação
rodou em porta separada (3060), não na 3000 do dono.

---

## Fase 4d — Cabeçalho coeso + Novidades consolidado (2026-07-14)

O dono mandou print real da página `/categoria/saias` rodando no `npm run dev`
dele (não um mockup) e apontou dois problemas concretos:

1. **"Na home tem Novidades e na nav também tem Novidades, só que um tem
   filtro e outro não."** A home mostrava uma prévia simples (8 peças, sem
   filtro); `/colecao/novidades` tinha a versão completa (12 peças, filtro +
   ordenação da Fase 4c). Perguntei se deveria unificar ou manter diferentes;
   o dono confirmou: **trazer a versão completa (com filtros) para a home,
   eliminando a versão simples.**

2. **"Tem o nome da peça solto, a quantidade de peças solta, o filtro
   solto — não tá harmônico."** Causa raiz: título (`h1`, dentro do banner
   sand-gradient) e contador+filtro+sort (dentro de `SortableProductGrid`,
   `py-10` abaixo) viviam em **duas seções de página inteira separadas por um
   vão grande**, sem nenhum elemento visual ligando as duas — exatamente o
   que a Fase 4c introduziu ao mover o contador para dentro do componente sem
   reconsiderar o layout ao redor.

**Correção:** `SortableProductGrid` virou `components/catalog/ProductCatalog.tsx`
— agora o componente recebe `title` e renderiza título + contador + filtro/sort
**no mesmo bloco** (mesmo banner sand-gradient, gaps de 16-24px entre os
elementos, não gaps de seção inteira). O grid de produtos abre uma seção nova
abaixo, com seu próprio respiro. `headingLevel` (`'h1' | 'h2'`, default `'h1'`)
permite embutir o componente numa página que já tem seu próprio `h1` — a home
usa `headingLevel="h2"` porque o `h1` real da página é o do hero
(`HeroSignature`); nunca dois `h1` na mesma página.

A home (`app/(site)/page.tsx`) trocou sua grade simples de 8 peças por
`&lt;ProductCatalog title="Novidades" products={products} headingLevel="h2" /&gt;`
com a mesma query de 12 peças + `categorySlug`/`categoryTitle` de
`/colecao/novidades` — agora as duas telas mostram exatamente a mesma coisa,
filtro incluso. O link "ver todas →" foi removido da home (não fazia mais
sentido — já mostra tudo); a rota `/colecao/novidades` continua existindo
(link direto do mega-menu da nav, `docs/PROGRESS.md`/Fase 4b) e agora tem
conteúdo idêntico ao da home por construção (mesmo componente, mesma query).

Verificado: exatamente 1 `h1` na home (`document.querySelectorAll('h1')`
→ 1, o do hero), `h2` "Novidades" com os 7 chips de categoria funcionando,
gaps do cabeçalho (título→contador 16px, contador→filtro 24px) em vez dos
`py-16`/`py-10` de seção inteira de antes, testado em 375px e no viewport
padrão. Build limpo. **Servidor de verificação rodou numa porta separada
(3050), não na 3000 — essa já estava em uso pelo `npm run dev` do próprio
dono (a mesma sessão do print que ele mandou), e eu não devo derrubar a
sessão dele pra rodar minhas checagens.**

---

## Fase 4c — "As opções": filtro por categoria + ordenação no catálogo (2026-07-14)

Depois de hero (#39) e nav (#40), perguntei diretamente o que "as opções" do
pedido original de remodelação significava (em vez de chutar) — o dono
confirmou: filtros/ordenação no catálogo, que hoje não existe nenhum.
Também confirmei que a verificação é só via `npm run dev` local — não há
deploy publicado (sem `vercel.json`/`netlify.toml`, sem homepage no repo do
GitHub).

Antes disso, avaliei e decidi **não** aplicar o painel bordô do hero/nav em
categoria e produto: repetiria o bloco de cor em toda página de listagem
(o oposto de "cor escassa"), e na página de produto competiria com a própria
foto da peça — o `DESIGN.md` já proíbe "gradiente sobre foto de produto"
("suja a roupa"). As duas páginas continuam corretamente quietas.

**Implementado:** `components/catalog/SortableProductGrid.tsx` (client,
compartilhado por `/categoria/[slug]`, `/colecao/[slug]` e
`/colecao/novidades`). Ordenação (mais recentes / menor preço / maior preço)
roda sobre a lista já buscada no servidor, sem round-trip. Chips de filtro
por categoria só aparecem quando a lista de fato mistura 2+ categorias —
em `/categoria/[slug]` (já vem de uma categoria só) eles nunca renderizam;
em `/colecao/[slug]` e `/colecao/novidades` (cruzam categorias) aparecem.
Isso exigiu adicionar `categorySlug`/`categoryTitle` às queries GROQ dessas
duas rotas (categoria/[slug] não precisou).

Verificado: filtro por categoria funciona (testado clicando "Calças" em
`/colecao/novidades`, reduz de 12 para 2 peças corretamente), sort não
quebra com preços ausentes (dado de seed atual não tem `price` em nenhum
produto — o sort degrada bem, sem NaN nem crash, mantém ordem original).
Build limpo, sem erros de console.

---

## Fase 4b — Nav ganha a mesma linguagem de cor + movimento (2026-07-14)

Depois do hero (PR #39, verificado pelo dono direto na API do GitHub — não só
no disco local), segui para nav/menus, também pedidos explicitamente no
pivô de remodelação total. Achado importante antes de mexer: o header é uma
barra fixa e sólida que **nunca sobrepõe o vídeo do hero** (`layout.tsx`
reserva `pt-16`/`pt-[72px]` de espaço acima do conteúdo) — então o risco de
legibilidade que me fez descartar "nav transparente sobre o hero" não existe
aqui. Duas mudanças, ambas em `components/layout/Nav.tsx`:

1. **Bloco destaque do mega-menu**: de `bg-ink` para o mesmo gradiente bordô
   do painel do hero — estende a cor composicional para a nav.
2. **Drawer mobile**: entrada escalonada nos links (`framer-motion`,
   `useReducedMotion`), mesmo padrão do hero.

**Achado de contraste que virou regra nova (ver DESIGN.md):** calculei WCAG
de verdade (não estimativa) — dourado sobre bordô é 4,07:1, abaixo do mínimo
AA de 4,5:1, mesmo a 100% de opacidade. Isso já tinha derrubado o eyebrow do
hero no code review do PR #39; aqui trocou o texto do bloco destaque (antes
`text-dourado`) para `cream-text`. Regra geral registrada: **dourado nunca
como texto sobre bordô** — só sobre espresso/ink, ou como linha/ícone
decorativo.

Verificado: mega-menu abre com o gradiente correto, drawer mobile abre com
todos os 10 itens e a animação assenta (`opacity:1, transform:none`), Escape
fecha o drawer e devolve foco ao botão hambúrguer (comportamento de
acessibilidade pré-existente, intacto). Build limpo.

---

## Fase 4 — "Vitrine em Movimento": remodelação após pedido de refação total (2026-07-14)

Depois da Fase 3.1, o dono voltou com a mensagem mais dura da sessão: *"acho
que ta tendo alguma falta de comunicação... tudo que estão fazer e so
adaptações no que ja existe e toda hora da erro, pois fica de uma maneira no
computador e outra no mobile... eu quero pegar o conceito e a ideia ainda do
cliente, e quero remodelar tudo, interface, cores, a nav bar, os menus, as
opções."* Não era mais "ajusta esta seção" — era "a abordagem incremental não
está funcionando, comece de novo pelo visual inteiro, mantendo o conceito do
negócio."

**Não rodei uma 3ª rodada de agentes.** O dono disse explicitamente que a
mensagem estava se perdendo *através* dos agentes — repetir o padrão "spawn 3
agentes" seria reproduzir o problema que ele estava nomeando. Investiguei
direto, como thread principal.

**Fui na lista de referências de verdade.** Não é um site — é um diretório
(`3dgallery-eqrvxb8t.manus.space`) com 179 links curados, incluindo uma seção
Moda & Luxo (Balenciaga, Gucci, Louis Vuitton — com Unreal Engine 5, Prada,
Cartier, Rolex). **Achado central:** essas referências usam 3D/WebGL pesado e
câmera cinematográfica — direto em conflito com a regra do próprio projeto
(sem 3D, mobile-first, rápido). Isso explica o padrão de rodadas anteriores
lendo como "tímido": os agentes vinham tentando honrar as duas coisas ao
mesmo tempo e recuando para o seguro. Perguntei ao dono como resolver essa
tensão; escolheu "motion mais pesado, aceitando algum custo de performance" —
sem 3D de verdade, mas mais movimento e camadas do que o site tem hoje.

**Protótipo antes de código.** Montei "Vitrine em Movimento"
(`remodel-vitrine-movimento.html`, publicado como Artifact) mostrando nav,
hero e uma seção de produtos com **desktop e mobile lado a lado, de
propósito** — cada um como composição própria, não a mesma tela reflowada.
Achei e corrigi um bug real antes de mostrar ao dono: o wordmark "LT STUDIO"
colidia por cima do texto/CTA do hero no desktop (medido via
`getBoundingClientRect`, não visualmente — a ferramenta de screenshot seguiu
instável nesta sessão). Isso confirmou a causa real de "fica diferente no
computador": o desktop nunca estava sendo verificado de verdade, só o mobile.

**Decisão do dono, explícita:** desktop passa a liderar o desenho a partir de
agora; mobile é derivado por responsividade (mas continua sendo verificado —
é o canal que mais importa pro funil de WhatsApp, não foi desprezado).

**Implementação real (este commit): só o hero da home.** `HeroSignature.tsx`
reescrito — o wordmark gigante (antes tier "Assinatura", ver DESIGN.md) vira
selo de fundo translúcido (`opacity 0.14`, `aria-hidden`), e a tagline
editorial existente é promovida a `<h1>` real. Painel bordô à direita
(desktop) / abaixo (mobile) com CTA em contorno cream. Vídeo do hero
permanece — ele já era o protagonista, não havia motivo pra trocar por foto
estática. Três camadas de scroll reaproveitam o `useScroll` do framer-motion
já validado neste arquivo (não o evento `'scroll'` nativo, que o Lenis
quebra — achado da Fase 3.1, `PhotoParallax.tsx`).

**Fora de escopo desta fase, por decisão consciente:** nav/mega-menu (já
sólida, acessível, sem bug reportado — mexer sem ganho real é risco à toa) e
`ProductCard.tsx`/grade de produtos (bloco de cor atrás de cada card numa
grade de 8+ produtos leria como lavagem repetida — o oposto do "cor escassa"
que fez a Fase 3.1 funcionar). Ver "A Regra do Selo de Fundo" em DESIGN.md.

---

## Fase 3.1 — "A História" repensada: cor composicional + movimento real (2026-07-14)

Depois das correções de desktop (seção abaixo), o dono olhou de novo e viu a
mesma composição de sempre: *"não está com nenhum efeito das referências que
mandei... parece que tá se perdendo em loop."* Pediu explicitamente uma 2ª
rodada de agentes, "em loop", com poder de pensamento mais forte.

**2ª rodada de 3 agentes (modelo Opus):**
1. **Explorador de Referências** — desta vez foi atrás de **lojas de moda
   reais** (Ganni, Jacquemus, Reformation, Farm Rio, Toteme, Nanushka, The
   Attico), não portfólios de agência (erro da 1ª rodada de 13/07). Achados
   confirmados navegando de verdade, lendo o DOM via JS: nenhuma delas usa
   scroll-hijack (GSAP/Lenis/Locomotive/AOS testados via JS, todos `false`)
   — o movimento real vem de vídeo de produto e carrossel; cor forte vem da
   fotografia/produto, nunca de bloco CSS chapado; impacto tipográfico vem
   de sans bold caixa-alta ou serif pequeno-com-voz, nunca itálico
   monumental; o padrão "sobre a marca" mais transferível é o da
   Reformation — foto+bio ousados mas com CTA de volta à conversão.
2. **Crítico** — auditou meu protótipo v1 (fundo bordô full-screen +
   `position:sticky`) e achou o bug real: `overflow:hidden` no
   container mata o `sticky` por completo (regra do CSS: sticky pina
   relativo ao ancestral com scroll mais próximo). Resultado: **zero
   pinagem**, ~750px de bordô vazio rolável sem nada acontecer —
   reproduzindo exatamente o "loop" que o dono reclamou. Também confirmou
   que 144px (o título do protótipo v1) é maior que o maior tier
   tipográfico do site inteiro (Assinatura, teto 136px).
3. **Diretor** — sintetizou os dois relatórios numa especificação concreta:
   cor como bloco atrás da foto (não lavagem atrás do texto), parallax
   contínuo sem sticky (~18-22% de amplitude), tipografia no tier H1/H2 já
   estabelecido, CTA de agendamento fechando a seção como âncora comercial.

**Protótipo v2** (artifact isolado, validado antes de tocar no código):
implementei a especificação, corrigi 2 bugs próprios no processo (transform
redundante conflitando com a animação de `top`; amplitude de scroll
insuficiente por falta de espaço de rolagem no harness de teste), confirmei
via medição real de scroll (~17,5% de amplitude, dentro da faixa), sem
overflow em mobile/desktop, orçamento de dourado em 2/3 pontos.

**Implementação real** (`app/(site)/stylist/page.tsx`, `FotoLadoSection` +
novo `components/stylist/PhotoParallax.tsx`):
- Bloco `bordo` (gradiente para `#4A1123`) sangrando por uma borda, atrás da
  foto — nunca lavagem full-screen atrás do texto.
- `PhotoParallax`: foto 122% da altura da moldura, `top` animado de -11% a
  9% conforme a seção passa pela viewport. Contenção via `overflow:hidden`
  **na moldura da foto**, não na seção (diferente do bug do protótipo v1).
- **Achado real durante a implementação**: o parallax não se movia com o
  scroll nativo (`window.addEventListener('scroll', ...)`) porque o **Lenis**
  (scroll suave, restaurado no PR #37) intercepta o scroll e **não dispara o
  evento nativo `'scroll'`** de forma confiável — confirmado instrumentando
  um contador (`scrollY` mudava, o evento nunca disparava). Corrigido
  trocando para polling via `requestAnimationFrame`, ligado/desligado por
  `IntersectionObserver` (só roda enquanto a seção está perto da viewport).
  **Isto é uma lição geral do projeto**: qualquer efeito futuro
  scroll-dependente precisa considerar o Lenis e preferir rAF/polling a
  ouvir o evento `'scroll'` diretamente.
- Título/H2 no tier já estabelecido (32px, `SectionHeading` existente) —
  sem pull-quote itálico: o Diretor previu esse momento como "voz da
  stylist", mas não existe campo de citação no schema do Sanity hoje;
  fabricar uma frase seria conteúdo inventado. Registrado como possível
  próximo passo se/quando a Luiza fornecer uma frase real.
- CTA "Agendar horário" (`WaButton` já existente) fechando a seção.
- Hairline dourada no topo da seção (via novo prop `topHairline` do
  `SectionShell`) + eyebrow = 2 pontos do orçamento de dourado (máx. 3).

**Verificação:** `tsc --noEmit` (erro pré-existente de sempre, não
relacionado); `npm run build` limpo; navegador em mobile (375px, sem
overflow) e desktop (1440px, sem overflow, título 32px, CTA presente).
**Limitação registrada:** a aba de automação desta sessão ficou com o
compositor suspenso (`document.visibilityState: "hidden"`,
`document.hasFocus(): false`) — o mesmo artefato já documentado na Fase E
(12/07). Isso impede `requestAnimationFrame`/`IntersectionObserver` de
disparar automaticamente NESSA aba especificamente, então o disparo
automático do parallax não pôde ser confirmado ao vivo nesta sessão. O que
foi confirmado, isolado dessa limitação: a escrita do DOM funciona
corretamente (`imgWrap.style.top` movendo de -52,97px a +43,33px = ~96px,
batendo com os ~20% de amplitude especificados), e o padrão
IntersectionObserver+rAF é uma técnica padrão e amplamente suportada — o
disparo automático deve funcionar normalmente num navegador real (sem a
suspensão de compositor). Vale confirmar visualmente assim que possível.

---

## Correções de desktop pós-Fase 3 (2026-07-14) — Fases 1-3 só tinham sido validadas mobile-first/1280px

O dono viu o site em desktop (telas maiores) e apontou 6 problemas, com prints
reais da home e do `/stylist`. Metodologia: 3 eram bugs técnicos claros (corrigidos
direto), 3 tocavam decisão de negócio/gosto (arbitrados via pergunta ao dono antes
de mexer) — mesmo padrão desta sessão de separar "bug" de "decisão do dono".

**Arbitrado pelo dono:**
1. **CTA duplicado (nav + hero)** — "Hero perde o botão verde, mantém só 'Ver
   coleção'" (opção escolhida, não a recomendada por mim). Nav vira o único
   agendamento sempre visível.
2. **Onde estava "desconfigurado"** — "os dois" (seção Consultoria de Estilo na
   home E a página `/stylist`), confirmado com prints de ambos.
3. **Scroll suave (Lenis)** — trazer de volta (escolhido, ver detalhe abaixo). O
   corte na Fase 3 foi avaliado como precipitado: era recomendação do Diretor,
   nunca confirmada pelo dono para o contexto real; e Lenis era parte real da
   sensação de "rolar e a página transicionar" que o dono via nos sites de
   referência, não peso morto.

**Bugs técnicos corrigidos direto:**

4. **`HeroSignature.tsx`** — removido o CTA "Agendar horário" (esmeralda) do
   hero da home; "Ver coleção" promovido de contorno para sólido bordô (só
   precisava ceder hierarquia enquanto coexistia com o outro botão — agora é o
   único CTA do hero, ~8,8:1 de contraste cream-text/bordô). `waScheduleHref`
   removido do componente (não usado mais); `app/(site)/page.tsx` não passa mais
   essa prop para `HeroSignature`.
5. **`PersonalStyling.tsx`** — removido o efeito "escada" dos 3 passos
   (`md:mt-12`/`md:mt-24`), pré-existente desde a Fase E (12/07), nunca notado
   porque as verificações anteriores desta sessão foram só mobile/1280px. O
   dono leu como desalinhamento quebrado, não como ritmo intencional.
6. **`CuratorialNote.tsx`** — padding `py-32 md:py-48` (192px) → `py-24 md:py-32`
   (128px). Medido: em 1920/2560px a citação (limitada por `clamp()`/max-width)
   ocupava só 45,8% da altura da seção — o resto era padding fixo, lendo como
   vão vazio enorme antes da próxima seção. Depois do fix: 68,3%, estável em
   qualquer largura ≥ ~1130px (testado 1440/1920/2560px).
7. **Bug real de conteúdo — blockquote sem estilo.** Investigando "fontes
   desconfiguradas" no `/stylist`, descobri que o corpo (`section.body`) de
   3 seções (`foto-esquerda`/"Como cheguei até aqui", `transformacao-escura`/
   "O que muda", `destaque-claro`/"Vamos começar?") serializa do Sanity como
   `<blockquote>`, não `<p>` — mas o CSS que estiliza o corpo usava só o
   seletor `[&_p]:...`, que não atinge `blockquote`. Resultado: essas 3 citações
   renderizavam SEM NENHUM estilo (sem `font-sans`/`font-display`, sem
   tamanho, sem cor, sem itálico) — herdando o que calhasse do contexto, lido
   pelo dono como "fonte desconfigurada". `PadraoSection` já cobria os dois
   seletores (por isso nunca deu problema ali); as outras 3 seções + o corpo do
   produto (`produto/[slug]/page.tsx`, sem blockquote populado ainda, mas
   igualmente frágil) ganharam `[&_blockquote]:...` espelhando o `[&_p]`.
8. **3 CTAs no `/stylist`** — Nav + botão do hero da página + CTA final de
   "Vamos começar?" apareciam juntos. Removida a linha dourada + `WaButton` do
   hero de `/stylist` (mesma lógica do item 4: nav já cobre o agendamento
   sempre visível). Ficam 2: nav + CTA final (padrão igual ao da home).
9. **Espaço sobrando em `etapas`/`cards`** — seções mais curtas (lista de 4
   itens, grade) usavam o mesmo padding das seções com prosa longa. Reduzido de
   `py-24 md:py-32` para `py-20 md:py-28` nas duas, alinhado ao papel
   "utilitário" que essas seções já tinham na Fase 3 (Regra do Andaime Único).

**Verificação:** `tsc --noEmit` (erro pré-existente de sempre, não relacionado);
`npm run build` limpo; navegador — `getComputedStyle`/`getBoundingClientRect` em
1280/1440/1920/2560px confirmando: proporção de conteúdo das seções, alinhamento
dos 3 passos, contagem e posição dos CTAs, `fontFamily`/`fontSize`/`color`
computados dos 3 blockquotes antes inertes. **Limitação registrada:** a captura
de screenshot (`computer{screenshot}`) ficou indisponível a sessão inteira desta
rodada — toda verificação visual final veio de prints reais enviados pelo dono
mais medições DOM, não de screenshot próprio.

**Lição para não repetir:** as Fases 1-3 foram verificadas majoritariamente em
375px (mobile) e 1280px (`resize_window preset:"desktop"`) — nunca em telas
reais de desktop (1440-2560px, o que o dono realmente usa). Ritmo vertical
(padding) e efeitos de layout que dependem de proporção viewport/conteúdo
(clamps atingindo o teto, colunas com max-width) só quebram visivelmente acima
de ~1280px. Verificação futura de qualquer mudança de layout/tipografia deve
incluir pelo menos um desktop real (1440 ou 1920), não só o preset.

---

## Redesign completo (2026-07-13) — dono viu o site ao vivo e não gostou

Depois de toda a fila de fases anteriores concluída, o dono navegou pelo site e
apontou, na hora: "Agendar horário" + "Agendar styling" duplicados; "Ver
novidades" logo acima de uma seção "Novidades"; **tipografia muito grande,
estourada**; **muita coisa repetida**; **muitas cores brigando**. Pediu para
"ignorar o padrão e a estrutura feita no início" e repensar — com liberdade total
sobre cor/tipografia/estrutura, mas com os fundamentos de negócio (mobile-first,
rápido, funil WhatsApp, sem 3D) **intocáveis** (confirmado por ele).

**Bugs corrigidos na hora (PR #33), sem precisar de debate:** rótulo de CTA de
agendamento unificado para "Agendar horário" nos 3 lugares (nav dizia "Agendar
styling"); CTA secundário do hero renomeado de "Ver novidades" para "Ver coleção"
(repetia a palavra do heading "Novidades" logo abaixo).

### O processo pedido pelo dono: 3 agentes, em loop, decisão final dele

1. **Explorador de Referências** — navegou de verdade a galeria de 179 sites
   (`3dgallery-eqrvxb8t.manus.space` — confirmado: é um ÍNDICE, não um design
   único) + amostra real de 6 sites (Lusion, Obys, Zajno, Utsubo, Active Theory,
   Merci-Michel). Achado central: a essência de elite é CONTENÇÃO — 1 fonte peso
   400, escala ~10:1 entre headline e label, paleta quase-monocromática (2 cores
   + no máx. 1 acento), motion via IntersectionObserver simples (não 3D).
2. **Crítico** — auditou o site atual ao vivo, quantificou os 3 achados do dono
   com arquivo:linha: numerais decorativos 96px (`PersonalStyling.tsx:99`) maiores
   que qualquer headline real; `verde-profundo` é literalmente o mesmo tom da
   esmeralda mais escuro (botão esmeralda dentro de fundo verde-profundo, quase
   sem separação); heading idêntico 60px repetido em 6 arquivos; andaime
   eyebrow+linha+heading repetido ~10×; dourado em 5 pontos numa tela que a
   própria regra do sistema limita a 3.
3. **Diretor de Design** — propôs a direção nova, ancorada nos dois relatórios.

### Loop de reação (cada agente reagiu à proposta do outro)

- Explorador: concordou com a paleta reduzida; discordou em parte da tipografia
  (2 fontes só funciona se a Schibsted for tratada com a mesma contenção medida);
  questionou se o tier H1 de ~40px dilui o efeito "só uma coisa é gigante".
- Crítico: concordou com numerais/verde-profundo/escala/1-seção-escura; **discordou
  da eliminação total de dourado e bordô** — o achado original era DOSAGEM (5
  pontos contra teto de 3), não que a cor estivesse errada; cortar bordô destrói a
  "Regra das Três Funções" (código de cor produto×agendamento) e empurra a
  diferenciação de volta pro tamanho/peso — a mesma alavanca que já estourou.

### Decisão final do dono (arbitrando a discordância)

- **Dourado: disciplinar (máx. 3/tela), não eliminar.**
- **Bordô: manter como 2ª cor funcional** (produto=bordô, agendamento=esmeralda),
  com a hierarquia corrigida (nunca mesmo peso visual lado a lado).
- Fatiamento da implementação: **cores → tipografia → estrutura**, cada fase
  validada no navegador antes da próxima.

### Fase 1 (redesign completo) — CONCLUÍDA: paleta reduzida

- **`app/globals.css`:** `sand-50` → `#F5F1EA` ("paper"); `sand-100/200/300`
  colapsados em `#EBE4D6` ("paper-deep", único). Novo token `--ink-soft: #6B6152`
  (AA 5.45:1 sobre paper). `--verde-profundo` removido por completo.
- **`tailwind.config.ts`:** aliases `porcelana`/`areia` renomeados para
  `paper`/`paper-deep` (não usados em nenhum componente, troca segura); classe
  `ink-soft` adicionada; `verde-profundo` removido.
- **Substituição global:** `text-ink/65`, `/70`, `/75` → `text-ink-soft` em 8
  arquivos (21 ocorrências — corrigido de "20" após o code review contar de novo)
  — mata os modificadores de opacidade soltos que falhavam AA em alguns pontos.
- **`components/PersonalStyling.tsx`:** `bg-verde-profundo` → `bg-espresso`
  (volta a ser o único escuro da home; a reestruturação do "Como funciona" fica
  para a Fase 3 — estrutura).
- **`components/HeroSignature.tsx`:** hierarquia bordô×esmeralda corrigida — CTA
  "Ver coleção" (bordô) vira contorno em `cream-text` (não sólido bordô: sobre o
  fundo escuro do hero, bordô como texto/borda daria ~1,5:1 de contraste, reprova
  AA — duas cores escuras próximas). "Agendar horário" (esmeralda) continua sólido,
  primário. Bordô sólido é preservado no PDP/EmptyState, onde já funciona bem
  sobre fundo claro.
- **`DESIGN.md` + `.impeccable/design.json`:** reescritos — paleta documentada
  com os hex reais (também corrige valores que já estavam desatualizados desde a
  Fase 1 original de 08/07 e nunca tinham sido sincronizados); "Regra Espresso ×
  Verde-Profundo" marcada revogada; "Regra das Três Funções" ganha a correção de
  hierarquia; "Regra do Dourado Escasso" marcada como disciplina ativa (não
  sugestão).

_Verificado:_ `tsc --noEmit` EXIT=0; build de produção limpo (30 páginas, 1 retry
por timeout de rede transitório buscando fontes do Google — não relacionado ao
código); navegador confirma `body` em `rgb(235,228,214)` (paper-deep), label de
categoria em `rgb(107,97,82)` (ink-soft), seção Personal Styling em
`rgb(36,28,23)` (espresso, não mais verde-profundo), CTA "Agendar horário" sólido
esmeralda + "Ver coleção" em contorno cream-text (não mais dois botões cheios
competindo); zero erro de console.

**Achado do code review (não-bloqueante, registrado para acompanhar):** o CTA
"Ver coleção" antes tinha `bg-bordo` opaco — contraste garantido matematicamente.
Agora, em contorno, o texto/borda `cream-text` fica direto sobre vídeo+gradiente
(sem piso opaco próprio) — o contraste real depende do frame do vídeo naquele
ponto. Isso replica o padrão já aceito no resto do hero (eyebrow/h1/tagline já
fazem a mesma coisa), não é uma categoria de risco nova — mas é uma garantia a
menos especificamente neste botão. Vale conferir visualmente em vídeo real, não
só no frame estático testado.

**Próximo:** Fase 2 (tipografia) — escala em 5 níveis, escassez do tier Editorial,
cortar os numerais 96px, revisar se a Schibsted precisa da mesma contenção que a
paleta acabou de ganhar.

---

### Fase 2 (redesign completo) — CONCLUÍDA: tipografia em 5 níveis

Implementada a escala definida pelo Diretor no debate de 13/07: **Assinatura**
(wordmark do hero) / **Editorial** (pull-quote da Nota da Stylist) / **H1**
(título de página) / **H2** (heading de seção) / **Corpo** / **Label** — cada
tier com `clamp()`, peso e tracking próprios, documentados em `DESIGN.md` §3 e
espelhados em `.impeccable/design.json` (schema `typographyMeta` expandido de 4
para 6 chaves).

**Mudanças por arquivo:**
- `HeroSignature.tsx` — wordmark: `font-semibold text-[clamp(3.5rem,15vw,9rem)]`
  → `font-[450] tracking-[-0.02em] text-[clamp(4rem,15vw,8.5rem)]` (Assinatura).
- `CuratorialNote.tsx` — pull-quote: `font-light text-[clamp(2.75rem,5.5vw,5rem)]`
  → `font-normal text-[clamp(2.5rem,6vw,4.25rem)]` (Editorial).
- `PersonalStyling.tsx` — numeral decorativo dos 3 passos: `font-display
  text-7xl md:text-8xl font-light text-dourado/50` (96px, maior que qualquer
  headline real — o achado central do Crítico) → `font-sans text-sm
  tracking-[0.2em] text-cream-text/50` (Label); heading "Um olhar profissional…"
  rebaixado de `text-5xl md:text-6xl font-medium` para tier H2.
- `stylist/page.tsx` — H1 (nome da stylist) e 5 headings de seção rebaixados
  para os tiers H1/H2; numeral do `EtapasSection` recebeu o mesmo tratamento
  visual de label pequeno do `PersonalStyling`, além de zero-padding via
  `padStart` (mudou de `{index + 1}` para `String(index + 1).padStart(2, '0')}`
  — o `PersonalStyling` já tinha os numerais zero-padded como strings estáticas
  no array `STEPS` desde antes desta fase, não usa `padStart`).
- `categoria/[slug]`, `colecao/[slug]`, `colecao/novidades`, `produto/[slug]`,
  `page.tsx` (home) — H1/H2 de página rebaixados de `text-5xl md:text-6xl
  font-medium` (60px repetido em 6 arquivos, achado do Crítico) para os tiers
  correspondentes.

**Decisão conscientemente adiada:** o Diretor sugeriu subir o corpo de texto de
14px para 15px por legibilidade; não entrou nesta fase porque toca todo
`text-sm` do site (risco de regressão de layout maior que o ganho) — fica
registrado como candidato pontual para a Fase 3 (Estrutura) ou uma sessão
dedicada, não esquecido.

**Verificação:** `tsc --noEmit` (erro pré-existente e não relacionado —
`app/layout.tsx` não resolve tipos do `globals.css`, confirmado idêntico na
`main` sem stash das mudanças desta fase); build de produção limpo
(`npm run build`, exit 0); navegador — medido via `getComputedStyle` em
desktop (1280px) e mobile (375px) para wordmark, H2 "Novidades", numeral do
`PersonalStyling`, H1 de `/categoria/vestidos` e o pull-quote da Nota da
Stylist — todos batendo com os `clamp()` especificados (em mobile, a maioria
já está no piso do clamp, como esperado).

**Achado do code review (PR #35), corrigido antes do merge:** a Fraunces
estava carregada em `app/layout.tsx` com pesos estáticos discretos
(`weight: ['300','400','500','600']`, não variável). `font-[450]` — usado no
wordmark e em todo H1/H2 — não tinha face exata nesse conjunto; o algoritmo de
casamento de peso do CSS (para alvo entre 400–500) sobe primeiro até o próximo
peso disponível, então **todo `font-[450]` renderizava de fato como peso 500**
— o peso que a própria "Regra do Peso Único" desta fase proíbe. Anulava
silenciosamente o propósito central da Fase 2, e o método de verificação
(`getComputedStyle`) não pegava isso porque reporta o valor declarado, não a
face física usada. Corrigido trocando para `weight: 'variable'`; confirmado no
CSS buildado (`@font-face` agora declara `font-weight:100 900`, um range, não
um valor único) e revalidado no navegador. O review também encontrou o Label
documentado como peso 500 em `DESIGN.md`/`design.json` sem nenhuma mudança de
código correspondente (o código nunca teve peso explícito nos labels, sempre
~400) — corrigido nos dois documentos — e uma descrição imprecisa do
zero-padding dos numerais (ver acima).

---

### Fase 3 (redesign completo) — CONCLUÍDA: estrutura do /stylist (Lenis restaurado em 2026-07-14, ver nota no item 3)

Última fase do plano de 3 (cores → tipografia → estrutura). Escopo: o andaime
eyebrow+linha+heading repetido (achado do Crítico, ~10× no site, 5× só no
scroll do `/stylist`), a colisão de duas seções escuras adjacentes, e a
decisão já tomada de cortar o Lenis.

**Achado confirmado ao vivo antes de mexer:** consultei o Sanity real
(`stylistProfile.sections`) e confirmei que `etapas` e `transformacao-escura`
estão de fato lado a lado no conteúdo publicado (posições 3 e 4 de 5) — não
era um risco teórico do componente, era um bug ativo na página no ar.

**1. Refatoração das 7 seções do `/stylist` (`app/(site)/stylist/page.tsx`).**
Extraídos `SectionShell` (wrapper `<section>`+container, tom/padding/aria-label)
e `SectionHeading` (eyebrow+linha+H2, tom-aware) — antes duplicados
byte-a-byte em `PadraoSection`, `FotoLadoSection`, `EtapasSection`,
`DestaqueClaroSection`, `TransformacaoEscuraSection` e `CardsSection`. Cada
seção agora só declara o que de fato varia (prosa, foto lateral, etapas
numeradas, cards, citação centralizada). Margens por seção passadas
explicitamente (`titleMargin`/`lineMargin`/`lineWidth`) para preservar os
valores originais onde o andaime completo foi mantido (`Padrao`/`FotoLado`:
título `mb-8`; `TransformacaoEscura`: título `mb-6`, linha `w-6` — achado do
code review, a extração tinha hardcoded a linha em `w-8` e quebrado essa
única seção centralizada que a usava). Em `Etapas`/`Cards`, que perderam a
linha (ver item 3), o título usa `mb-10` — não é o `mb-4` original do título
sozinho, é o espaço que antes pertencia à linha removida, redistribuído para
dar respiro ao corpo sem o marcador visual da linha. Espaçamento revisado,
não uma preservação 1:1.

**2. Duas mudanças de design, aplicadas sobre a base já unificada:**
- **Uma seção escura por página** (nova regra em `DESIGN.md`/`design.json`):
  `etapas` virou seção clara (`tone="paper"`, era `bg-espresso`) — numeral e
  corpo de texto trocaram `cream-text/50`/`cream-text/75` por `ink-soft`.
  `transformacao-escura` continua o único clímax escuro da página, mantendo
  sua posição (penúltima, antes do CTA final).
- **Andaime reduzido** (nova regra "Andaime Único"): `etapas` e `cards` — as
  duas seções utilitárias (lista numerada, grade) — perderam o eyebrow e a
  linha dourada, ficando só com o H2 (`variant="title-only"`). `foto-esquerda`
  (abre a narrativa) e `transformacao-escura` (clímax) mantiveram o andaime
  completo. Reduz o combo eyebrow+linha+H2 de 5 para 2 ocorrências no scroll
  da página (mais o hero, que é estruturalmente diferente — tem h1 e foto).

**3. Lenis removido — depois RESTAURADO (2026-07-14).** Removido nesta fase
(`components/SmoothScroll.tsx` deletado, uso retirado de `app/(site)/layout.tsx`,
dependência desinstalada), avaliando como peso morto frente ao fundamento
"mobile-first, rápido". **Correção no dia seguinte:** o dono revisou o site em
desktop e perguntou pela sensação de "rolar e a página transicionar" que via
nos sites de referência — o Lenis (scroll suave com easing, já guardado por
`prefers-reduced-motion`) era parte real dessa sensação, não peso morto sem
função. Restaurado por completo (arquivo, uso, CSS, dependência) via
`git checkout` do commit anterior à remoção. Lição: a recomendação do Diretor
de cortar Lenis nunca tinha sido confirmada pelo dono para o contexto real do
`/stylist`+home — era uma recomendação de agente, não decisão do dono; tratá-la
como decidida foi prematuro.

**Fora de escopo desta fase:** consolidar as 7 funções de seção num único
componente `StylistSection(tone, variant)` totalmente genérico foi avaliado e
descartado — `FotoLadoSection` (foto+texto lado a lado) e `CardsSection`
(grade) têm estruturas de corpo genuinamente diferentes o bastante para que
forçá-las num switch único geraria um componente mais difícil de ler do que
a extração feita (`SectionShell`+`SectionHeading` compartilhados, corpo
próprio por seção). A duplicação real (o andaime) foi eliminada; a
duplicação restante é estrutural, não texto repetido.

**Verificação:** `tsc --noEmit` (mesmo erro pré-existente de `globals.css`,
não relacionado); `npm run build` limpo antes e depois de cada mudança
(refatoração, tom claro do `etapas`, corte do Lenis); navegador — TODO
confirmar visualmente as 5 seções reais do `/stylist` com o conteúdo do
Sanity ao vivo, incluindo a transição `foto-esquerda`(clara) →
`etapas`(clara, era escura) → `transformacao-escura`(escura) →
`destaque-claro`(clara).

---

### Fase E — CONCLUÍDA (verificação parcial — ver nota de limitação): Personal Styling quebra o monólito

Consultado o agente de design antes de implementar (regra da casa). Decisão: sem foto
nova nesta seção (a foto que chegou foi para "Como cheguei até aqui", outra seção do
`/stylist`) — nada de slot de imagem "esperando foto".

**`components/PersonalStyling.tsx`** (novo, extraído de `page.tsx`, client component):
- **Cor:** `bg-espresso` → `bg-verde-profundo` — primeiro uso real do token reservado
  na Fase D (ver "A Regra Espresso × Verde-Profundo" no DESIGN.md). Texto `cream-text`/
  `dourado` mantidos. **Correção (code review do PR #32, recalculado via fórmula WCAG,
  não repetir a suposição de "equivalente"):** `cream-text` sobre `verde-profundo` é
  10,70:1 (era 14,63:1 sobre espresso — folgado nos dois). `dourado` sobre
  `verde-profundo` é **4,96:1** — passa AA (4,5:1) mas com margem bem mais apertada que
  os 6,78:1 do espresso (queda de ~27%). Ainda válido, não regressão que exija fix, só
  a margem de segurança encolheu — vale monitorar se o token entrar em mais contextos.
- **Layout assimétrico:** `grid-cols-12`; header/intro/CTA em `col-span-12 md:col-span-7`
  flush-left (linha dourada `w-12`, sem `mx-auto`); "Como funciona" ocupa a largura toda
  (`col-span-12`) com ritmo em escada no desktop (2º passo `md:mt-12`, 3º `md:mt-24`);
  numerais `text-6xl md:text-7xl` → `text-7xl md:text-8xl` (maiores também no mobile,
  não só desktop — são o ritmo vertical do bloco).
- **Motion:** reveal em 4 beats (header, intro, grupo dos 3 passos, CTA) via
  `useInView(once:true, margin:'-10% 0px')` + stagger 0.12 — mesmo vocabulário da
  Fase D. Guard duplo: `useReducedMotion()` (JS) + `.styling-reveal-item` no bloco
  `@media (prefers-reduced-motion: reduce)` do `globals.css` (rede de segurança CSS,
  mesmo padrão exigido pelo review do PR #30).
- **`DESIGN.md`/`design.json`:** nota de "único fade-in do site" corrigida — agora lista
  os 3 contextos de motion sancionados (hero, Nota da Stylist, Personal Styling).

**⚠️ Nota de limitação de verificação desta sessão:** o servidor `Claude_Preview`
(usado em toda verificação anterior desta sessão) desconectou no meio do trabalho.
A ferramenta alternativa (`Claude_Browser`) apresentou instabilidade real neste
ambiente — `computer{screenshot}` deu timeout repetido, e um teste direto de
`IntersectionObserver` nativo (sem Framer) não disparou nem o callback inicial em
2s, mesmo com overlap geométrico confirmado por `getBoundingClientRect`. Diagnóstico:
falha do ambiente de automação (provável falta de loop de composição/rendering),
não bug de código — o mesmo hook (`useInView`, mesmas opções) já foi validado
funcionando na Fase D com a ferramenta anterior, e o `threshold` padrão do Framer
(`amount: "some"` → 0) deveria disparar em qualquer sobreposição, confirmado lendo
o código-fonte instalado.
**O que FOI verificado nesta sessão:** `tsc --noEmit` EXIT=0; build de produção
limpo (30 páginas); cor `rgb(8,61,44)` = `#083D2C` confirmada via `getComputedStyle`;
4 elementos `.styling-reveal-item` confirmados no DOM, todos em `opacity:0` antes
de rolar (comportamento inicial correto); zero erro de console.
**O que NÃO foi possível verificar ao vivo:** a transição real 0→1 ao rolar até a
seção. Pedido explícito ao dono: conferir pessoalmente no navegador se a seção
Personal Styling aparece (não fica presa invisível) e se o reveal ocorre ao rolar.

---

### Conteúdo — CONCLUÍDO: foto real da seção "Como cheguei até aqui"

Levantamento por query direta no Sanity (não por suposição): das 5 seções do
`/stylist`, só **1** tinha campo de imagem vazio — "Como cheguei até aqui"
(layout `foto-esquerda`). As outras 4 (`cards`, `etapas`, `transformacao-escura`,
`destaque-claro`) não usam campo de imagem, nada a cadastrar ali. O hero do
`/stylist` já tinha foto real desde antes desta sessão.

O dono forneceu a foto (arquivo colado no chat → salvo em `public/` como staging
→ lido, subido como asset no Sanity via script Node temporário usando o token de
API, anexado ao campo `image` da seção via `_key`, com `alt` descritivo). Script e
o PNG de staging apagados logo depois — nunca ficaram rastreados no git (mesmo
padrão do item 1: usar `/public` só como ponte temporária de arquivo, nunca como
destino final de imagem de conteúdo, que vive no Sanity CDN).

**Achado:** só existe a versão publicada de `stylistProfile` (sem rascunho
pendente) — diferente do `siteSettings`, que tinha os dois. Script tentou
atualizar `drafts.stylistProfile` e falhou com "documento não encontrado",
esperado e inofensivo (nada a fazer ali).

_Verificado:_ navegador confirma a foto real renderizando na seção "Como cheguei
até aqui" do `/stylist` (era "Foto em breve"), zero erro de console.

**Pendência de conteúdo, não mais bloqueio técnico:** o agente agora sabe fazer
esse fluxo completo (upload + anexo via API) sempre que uma foto nova chegar —
não depende mais do login do Studio.

---

### Fase D — CONCLUÍDA: Nota da Stylist vira "sala clara"

Desbloqueada pelo item 1 (texto real da Luiza já publicado no Sanity). Antes de
implementar, achado de ponta solta: o token `--verde-profundo` (criado na Fase 1,
"pronto para Fases 3/4") **nunca foi usado em nenhum componente** — confirmado por
grep. Consultado o agente de design sobre os dois pontos (destino do token +
execução da Fase D):

- **`verde-profundo` reservado para a Fase E** (bloco Personal Styling da home), não
  aqui — ele é a ÚNICA superfície de seção inteira "tomada pelo verde" (distinto do
  espresso, que é chrome/escuro neutro). Regra nova registrada em `DESIGN.md` ("A
  Regra Espresso × Verde-Profundo") e espelhada no `.impeccable/design.json`, para um
  agente futuro não tentar "consertar" a aparente cor escura duplicada.
- **`components/CuratorialNote.tsx` reescrito:** vira client component. Layout
  `grid-cols-12`, blockquote em `col-span-8` (flush-left, assimétrico — o vazio à
  direita é o respiro). Fundo `bg-sand-50` sólido (achatado, sem degradê — coerente
  com o corte-limpo da Fase F). Tipografia `text-[clamp(2.75rem,5.5vw,5rem)]
  leading-[1.05] text-left [text-wrap:pretty]` (trocado de `[text-wrap:balance]`,
  que é para texto centralizado). Removido `<FadeInSection>` (duplicaria animação
  com o stagger novo).
- **Revelação por cláusula:** o texto é dividido em cláusulas
  (`note.split(/(?<=[.—])\s+/)`) — a frase real vira 3 — cada uma um
  `<motion.span>` dentro de um único `<blockquote>` (acessibilidade: leitor de tela
  lê a citação inteira, não fragmentos). Dispara com `useInView(once:true)`, não no
  load (diferente do hero) — stagger 120ms, ease `[0.16,1,0.3,1]`, `y:12→0`, guard
  `useReducedMotion`.

_Verificado:_ `tsc --noEmit` EXIT=0; build de produção limpo (30 páginas); navegador
confirma as 3 cláusulas em `opacity:0` fora de viewport (scrollY 0) e `opacity:1`
dentro (scrollY 2500), zero erro de console; mobile 375px com layout flush-left
legível (`sectionWidth` bate com `innerWidth`, sem overflow).

---

### Fase F — CONCLUÍDA: costura removida do site inteiro + exceção revogada

Motivada por reclamação direta do dono ("ainda existe degradê de cores do branco com
o marrom e está feio"), confirmada visualmente em `/categoria/[slug]` e `/stylist`
(a faixa suja aparecia logo abaixo do header fixo — por isso ele descreveu como
"menu"). Era a mesma costura da Fase C (hero), só que nos 11 pontos que aquela fase
não tocou. Consultado o agente de design de novo antes de executar (regra da casa):
decisão foi corte limpo puro, sem substituto — bandas de categoria/coleção não
precisam de `FadeInSection` (estão acima da dobra, já visíveis no load).

**Removido `<SeamTransition>` de 11 pontos:**
`categoria/[slug]`, `colecao/novidades`, `colecao/[slug]` (1 cada — cabeçalho), home
`page.tsx` (seção Personal Styling), e as **7** ocorrências do `/stylist` (uma por
variante de seção). No `/stylist` também removido o cálculo de `prevEdge`/`seamFrom`
(a lógica que calculava a cor de entrada de cada seção dinamicamente, já que a ordem é
definida pela dona no CMS) — as 6 funções de seção perderam a prop `seamFrom`.

**Arquivos órfãos apagados:** `components/SeamTransition.tsx` e `lib/colors.ts`
inteiros (confirmado por grep: zero consumidor restante).

**Exceção revogada:** `CLAUDE.md §5` e `.impeccable/design.json` ("A Regra do Degradê
Familiar") — a exceção de 2026-07-08 que autorizava cruzamento de família de cor como
"costura" foi formalmente revogada. Regra volta a ser: **nunca degradê cruzando
família de cor**, sem nuance. Ritmo entre seções agora é só corte limpo + entrada
coreografada por scroll (Lenis/Framer/`FadeInSection`), consistente com a tese "capítulos
dirigidos, não blocos empilhados" adotada na Fase C — agora aplicada ao site inteiro,
não só à home.

_Verificado:_ `tsc --noEmit` EXIT=0; build de produção limpo (30 páginas); navegador
confirma corte seco (sem faixa cinza) em `/categoria/vestidos` e em 3 emendas
diferentes do `/stylist` (clara→clara, clara→escura via "O Processo"), zero erro de
console.

---

### Item 1 — CONCLUÍDO: acesso ao Sanity destravado + placeholder morto

**Como foi destravado:** o dono não conseguiu logar no Studio (`/studio`, exige conta
convidada como membro do projeto — segue sem resolver), mas gerou um **token de API**
direto em sanity.io/manage (permissão Editor) e passou para o agente. Token vive em
`.env.local` como `SANITY_API_TOKEN` (sem prefixo `NEXT_PUBLIC_`, nunca exposto ao
client, arquivo fora do git — confirmado via `git check-ignore`). Isso dá ao agente
escrita programática no Sanity **sem precisar do login do Studio**.

**Achado ao investigar:** o placeholder "Nota de exemplo — a Luiza escreve aqui"
existia em DOIS documentos — o publicado (`siteSettings`, que o site lê) e um rascunho
(`drafts.siteSettings`) — ambos com o mesmo texto de teste. Corrigir só o publicado
teria deixado o rascunho pronto para "reverter" o fix se alguém o publicasse de novo
sem querer.

**Os rascunhos originais do "roteirista" (mencionados no checkpoint 09/07) se perderam**
na compactação de contexto entre sessões — nenhum arquivo os continha, só a menção de
que existiam. Precisou refazer o trabalho: um agente redator gerou 3 novas opções
[RASCUNHO] (ângulos: escutar a cliente / autenticidade / transformação), sem nenhum
fato de negócio inventado (só nome, papel e voz da Luiza, já confirmados). O dono pediu
para decidir com um agente **qual converte mais** — um segundo agente (foco em
estratégia de conversão/funil) escolheu a **Opção 1** ("Antes de escolher uma peça, eu
escuto você...") por ser a única que abre uma pergunta em vez de fechar uma frase e
faz ponte direta para o CTA de agendamento logo abaixo; ajustou "começa em" → "começa
por" (gramática).

**Escrito nos dois documentos** (`siteSettings` + `drafts.siteSettings`) via script
Node temporário (criado dentro do projeto para resolver `node_modules`, **apagado
logo depois** — nunca ficou rastreado no git). `curatorNoteByline` ("Luiza Thomaz")
mantido, já era real.

_Verificado:_ navegador confirma `blockquote` da home com o texto novo, zero
placeholder, zero erro de console.

**⚠️ Ainda é conteúdo-modelo, marcado como tal na origem** (mesma lógica autorizada
pelo dono em 09/07: "o que depende da Luiza fica para o FIM"). Quando ela tiver uma
frase própria, é só sobrescrever `curatorNote` de novo — agora o agente tem o caminho
técnico pronto (script + token) para fazer isso a qualquer momento, sem depender do
login do Studio.

**Item 1 da fila do consenso: FECHADO.** Único bloqueio que restava na lista original
está resolvido.

---

### Fase 3 — CONCLUÍDA: peso/ousadia dos headlines + item 9 (inglês → PT-BR)

Consultado o agente de design para sequenciar o que fazer com o Sanity ainda bloqueado
(regra da casa). Decisão: peso dos headlines é o maior efeito visual/estrutural por
esforço que não depende de nenhuma palavra da Luiza e fecha 100% (nada "esperando
foto") — ao contrário das Fases D/E do plano antigo, que ficam de fora por dependerem
de conteúdo real bloqueado (ver abaixo).

**`font-light` (300) → `font-medium` (500)** em headlines de página/seção: h1 de
`categoria/[slug]`, `colecao/novidades`, `colecao/[slug]`, `produto/[slug]`, nome da
stylist em `/stylist`; h2 de "Novidades" e "Um olhar profissional..." na home; 5 h2 de
seção do `/stylist` (Padrao/FotoLado/Transformacao/Etapas/Cards).

**`font-light` (300) → `font-semibold` (600)** só no wordmark "LT STUDIO" do hero da
home (`HeroSignature.tsx`) — o momento-assinatura merece a maior presença da escala.

**Deixado leve (300), de propósito** — momentos de apoio/quietude, não o headline
principal: taglines e citações em itálico, blockquotes de Portable Text, numerais
decorativos (`01`/`02`/`03`), títulos de card de produto (`ProductCard.tsx`, `text-lg`)
e o headline do `EmptyState`. Confirmado que nenhum desses foi tocado.

**Item 9 (inglês → PT-BR):** "Personal Stylist"/"Personal Styling" (eyebrow do hero,
eyebrow da seção Personal Styling na home, eyebrow do `/stylist`) → **"Consultoria de
Estilo"**, termo único e consistente nos 3 pontos de marca. `aria-label` das duas
seções também traduzido para coerência (não eram visíveis, mas mantém tudo em PT-BR).

**Docs atualizados** (senão um agente futuro reverte o peso novo achando bug):
`DESIGN.md` §3 (escala tipográfica + "Regra do Peso Único", ambas revisadas com o
porquê e o que continua leve) e `.impeccable/design.json` (`rules[]` e `dos[]`).

_Verificado:_ `tsc --noEmit` EXIT=0; build de produção limpo (30 páginas); navegador
confirma pesos computados — hero `h1: 600`, home `h2: 500` (Novidades e Personal
Styling), categoria `h1: 500`, `/stylist` `h1: 500` + 4 `h2: 500` + tagline itálica
`300` (intacta) + eyebrow "Consultoria de Estilo"; título de card de produto `300`
(intacto); zero erro de console em todas as telas testadas.

**Fica de fora desta fase (Backlog B, bloqueado por conteúdo real):**
- Fase D (Nota da Stylist "sala clara") — pull-quote sem a frase real da Luiza só
  produziria uma seção bonita ao redor de um placeholder.
- Fase E (quebrar o monólito do Personal Styling) — ritmo interno pleno depende do
  retrato real da stylist; adiantar layout sem a foto arrisca refação.
- Fase F (aposentar `SeamTransition`/`EDGE` no `/stylist` e headers de categoria/
  novidades, revogar a exceção de degradê do CLAUDE.md §5) — candidata natural a
  próxima fase: puro código, sem depender de conteúdo, mas payload visual menor.

---

### Item 6 — CONCLUÍDO: PRD/SDD reconciliados (PR #25)

Corrigido no `PRD.md`/`SDD.md`: nome real "LT Studio" (nenhum dos dois citava nome
nenhum); loader do Sanity banido ainda recomendado no SDD §2; fontes desatualizadas
(Geist/Inter → Fraunces + Schibsted Grotesk, já decididas); campos de schema removidos
ainda documentados (`stylistProfile.bio/whatsappNumber/bookingMessage`,
`siteSettings.heroVideo/heroPoster/topBarText/topBarLink`); mensagem de WhatsApp de
produto com `(url)` que o código nunca teve; feature "faixa fixa no topo" do PRD §7
que nunca foi construída. _Verificado por grep direto contra os schemas/código reais
(o code-review por agente bateu no limite de sessão no meio da checagem — completei
os 5 pontos restantes manualmente; todos bateram)._

## Fila do consenso do debate — STATUS FINAL (2026-07-10)

| # | Item | Status |
|---|---|---|
| 1 | Matar placeholder ao vivo (Nota da Stylist) | 🔴 Bloqueado — acesso ao Sanity Studio |
| 2 | IA de navegação + CTA honesto + peso Fraunces | ✅ PR #23 |
| 3 | Produto de volta na home (grid uniforme) | ✅ PR #23 |
| 4 | Descoberta de tags (`/colecao/[slug]`) | ✅ PR #24 (tela pronta; zero tags cadastradas) |
| 5 | Fase 3+ do redesign visual | Não iniciado |
| 6 | Reconciliar PRD/SDD | ✅ PR #25 |

Único item bloqueado é o 1 (dono precisa resolver acesso ao Sanity, fora do Claude
Code). Todo o resto que dependia só de código está feito. Próximo: Fase 3+ do
redesign visual, ou destravar o item 1 — decisão do dono.

---

### Item 4 — CONCLUÍDO: tela de descoberta de tags/coleções

Nova rota `app/(site)/colecao/[slug]/page.tsx`, espelhando exatamente o padrão de
`categoria/[slug]` (mesmo layout: faixa com contagem+título, grid uniforme, EmptyState
para "não encontrada"/"sem peças"). GROQ: `$slug in tags[]->slug.current` (tags é array
de referência a `collection`, diferente de `category` que é referência única). Exclui
"novidades" do `generateStaticParams` — já é rota estática própria
(`colecao/novidades/page.tsx`) com copy/query bespoke.

**⚠️ Correção (achado do code review do PR #24, testado empiricamente, não suposição):**
a frase original aqui dizia "Next.js resolve a rota estática antes da dinâmica, sem
conflito" — **isso está ERRADO e foi removido.** O revisor forçou `generateStaticParams`
a incluir `"novidades"` e rodou `next build` + `next start` reais: a rota dinâmica
**sobrescreve silenciosamente** a estática, sem warning de build, sem erro de tipo. Se
algum dia alguém cadastrar no Studio uma Coleção chamada "Novidades" (nome plausível —
é um dos exemplos do próprio schema `collection.ts`), a página de novidades do site
passa a mostrar "Coleção não encontrada." em produção, silenciosamente. A exclusão
`slug.current != "novidades"` na query (linha ~34 do arquivo) é a ÚNICA defesa —
não é redundante, é obrigatória. Ponto único de falha: se essa linha for removida num
refactor futuro (inclusive por parecer "redundante"), o bug volta sem nenhum sinal.

**Achado mais fundo que a auditoria original:** não é só "falta tela" — **não existe
nenhum documento `collection` cadastrado no Sanity** (confirmado por query direta:
`*[_type=="collection"]` retorna `[]`). O schema e a descrição ("Novidades, Denim,
Alfaiataria, Conjuntos, Festa, Estação…") existem, mas nenhuma tag foi criada, então
nenhum produto tem `tags` preenchido. **A tela agora existe e funciona** (testada com
slug inexistente → "Coleção não encontrada.", comportamento correto); falta o dado.

**Pendência (mesma raiz do item 1):** cadastrar as coleções e marcar as tags nos
produtos é ação no Sanity Studio — mesmo bloqueio de acesso do item 1 (dono não
autorizado ainda). **Escopo desta implementação foi só o template/rota — não criei
nenhum link de navegação novo apontando para `/colecao/[tag]`** (não fazia parte do
pedido do consenso, e é uma decisão de IA/design própria — onde essas tags aparecem no
menu ou nas páginas de produto — que não foi briefada; fica para quando houver tags
reais para decidir isso com conteúdo de verdade na mão).

_Verificado:_ `tsc --noEmit` EXIT=0; build de produção limpo, `/colecao/[slug]` gerada
como SSG sem sub-rotas (zero coleções), `/colecao/novidades` continua estática e
separada; navegador confirma `/colecao/denim` (slug de teste, inexistente) renderiza
"Coleção não encontrada." sem erro de console.

---

## Debate consenso (2026-07-10) — "estrutura primeiro" vs. "seguir o redesign"

O dono pediu 2 agentes especializados para debater (posições opostas, 2 rounds:
posição → réplica → consenso) em vez de responder diretamente às perguntas de
calibre. **Nota de anomalia:** a 1ª tentativa do agente "seguir o redesign" devolveu
uma resposta corrompida (falsa mensagem de sistema, zero uso de ferramenta) —
descartada, relançada do zero antes de prosseguir.

**Consenso alcançado pelos dois lados (fila única, priorizada):**
1. Matar placeholder ao vivo (Nota da Stylist) — **BLOQUEADO**, ver abaixo.
2. IA de navegação + CTA honesto + peso do Fraunces no header, um único commit.
3. Produto de volta na home, grid uniforme (sem mosaico) — junto com o item 2.
4. `/colecao/[tag]` no template de categoria existente — trilha paralela.
5. Fase 3+ do redesign visual segue normalmente.
6. PRD/SDD reconciliados no mesmo lote (não "quando sobrar tempo").

**Desacordo residual (não forçado a consenso):** adiantar peso/cor da Fase 3 em
páginas não afetadas (categoria, produto) em paralelo aos itens 1-4, ou manter
sequencial estrito. Dono não respondeu ainda — tratando como sequencial por padrão.

### Item 1 — BLOQUEADO: sem acesso de escrita ao Sanity
Não há token de escrita em `.env.local` (só `NEXT_PUBLIC_*`, chaves de leitura). O
Studio (`/studio`) exige login (Google/GitHub/e-mail) — o dono tentou logar e o
Sanity recusou ("não autoriza"), provavelmente porque a conta dele não está convidada
como membro do projeto no sanity.io (ação fora do Claude Code — dono precisa resolver
no painel do Sanity ou pedir convite a quem criou o projeto). **Enquanto isso não for
resolvido, o placeholder "Nota de exemplo — a Luiza escreve aqui" continua ao vivo.**
Ação pendente do dono: em `/studio` → "Configurações do Site" → campo "Nota da
Stylist" → apagar o texto de teste e publicar vazio (esconde a seção, comportamento
já documentado no schema) OU colar uma frase real da Luiza.

### Itens 2+3 — CONCLUÍDOS (branch `feat/ia-navegacao-funil-honesto`)

Consultado o agente de design antes de implementar (regra da casa: design → sempre
especialista) sobre a ambiguidade "peso do Fraunces no header/menu" — **decisão:
chrome de navegação continua sans** (Schibsted), nunca Fraunces; o ganho de presença
vem do CTA sólido esmeralda, não da fonte. Serifar "Consultoria"/"Vitrine" quebraria o
único tell que separa navegação de conteúdo editorial. Também corrigido: a proposta do
agente usava `rounded-full` no botão novo — **descartado**, contradiz regra dura do
DESIGN.md ("cantos retos sem rádio — não adicionar border-radius a nenhum elemento
interativo"). Botão saiu com cantos retos (`0px` confirmado no navegador).

**`components/layout/Nav.tsx`:**
- "Stylist" → **"Consultoria"** (mesmo href `/stylist`), continua primeiro na ordem.
- "Categorias" → **"Vitrine"** (label do trigger do mega-menu e `aria-label` do painel).
- COL 3 do header: link de WhatsApp genérico (só ícone) substituído por **botão sólido
  esmeralda "Agendar styling"** no desktop (mensagem de agendamento, não contato
  genérico); mobile mantém o ícone compacto (`md:hidden`) — o CTA de agendar
  proeminente mora no drawer, não espremido na coluna estreita do header mobile.
- Drawer mobile reordenado: **Agendar styling → Consultoria** no topo (antes: Stylist
  era o último item) → Vitrine (categorias) → Novidades, igual antes.

**`components/HeroSignature.tsx`:**
- CTAs invertidos: **esmeralda "Agendar horário" agora primeiro** (funil principal
  confirmado pelo dono é a consultoria, não a loja).
- CTA bordô renomeado de "Quero esta peça" (mentia — sempre levou a uma listagem) para
  **"Ver novidades"** (honesto, bate com o destino `/colecao/novidades`).

**`app/(site)/page.tsx`:**
- Grade de produtos **de volta na home**, entre o Hero e a Nota da Stylist. Grid
  **uniforme** (`grid-cols-2 md:grid-cols-3 lg:grid-cols-4`), **sem** o mosaico 2×2
  destacado que causou o bug de alinhamento original (commit `0640831`). Mesma query
  de 8 produtos (`inStock == true`, mais recentes primeiro) que alimentava a versão
  antiga; link "ver todas →" para `/colecao/novidades`.

_Verificado:_ `tsc --noEmit` EXIT=0; build de produção limpo (30 páginas); navegador
confirma nav desktop `["Consultoria","Vitrine","Agendar styling"]`, hero CTAs
`["Agendar horário","Ver novidades"]`, `href` do botão de agendar com a mensagem
correta codificada, `border-radius: 0px` no botão, drawer mobile na ordem
`Agendar styling → Consultoria → categorias → Novidades`, home com 8 cards de
produto, zero erro de console.

**Pendente (próximos passos, não feitos nesta sessão):** item 4 (`/colecao/[tag]`),
item 6 (reconciliar PRD/SDD), e destravar o item 1 (acesso Sanity).

---

## CHECKPOINT — Redesign completo decidido (2026-07-09)

Depois da Fase C, o dono revisou o site e disse "não estou gostando" — pediu para
acionar o agente de planejamento + um revisor de sistema, ler/atualizar os docs, e
reportar antes de qualquer novo código. Os dois agentes convergiram, independentemente:
**o esqueleto está certo; o problema é sequenciamento** — motion/hero foram polidos
antes de resolver estrutura e conteúdo. Nenhum dos dois recomendou refatorar tudo.

**Mesmo assim, decisão final do dono (dele, não dos agentes — registrado como tal):
refatorar o design inteiro** (páginas, menu, cor, tipografia), inspirado numa nova
referência que ele mandou (`3dgallery-eqrvxb8t.manus.space`) — **confirmado por ele
como sendo a MESMA galeria das 39 referências 3D/WebGL de antes**, não um mockup
próprio. Confirmou de novo: **"continua só a essência (sem 3D)"** — agora aplicada ao
site INTEIRO, não só ao hero.

**Achados das duas auditorias (planejamento + revisor de sistema), consolidados:**
1. Home de uma loja não mostra nenhum produto.
2. Placeholder rodando ao vivo (Nota da Stylist texto de exemplo; "FOTO EM BREVE" no `/stylist`).
3. Bloco espresso "Personal Styling" é monólito de ~1300px no mobile.
4. Costura de degradê só foi removida na emenda hero→Nota; o resto ainda vaza.
5. PDP esquelética (mas o template já suporta preço/descrição/galeria — é falta de
   conteúdo real no catálogo de teste, não falta de estrutura).
6. **Hierarquia de navegação inverte o funil confirmado pelo dono:** ele definiu
   **consultoria/personal styling como funil PRINCIPAL** (loja é vitrine de gosto que
   alimenta o contato) — mas hoje a estrutura prioriza a loja.
7. CTA do hero mente (leva a uma listagem, não a uma peça).
8. Tags/coleções (Denim, Alfaiataria, Festa...) não têm nenhuma tela de descoberta.
9. "PERSONAL STYLIST"/"Personal Styling" em inglês em duas telas de marca.
10. **Achado grave de drift:** a Fase E planejada em 08/07 era estrutural ("dupla função
    / IA de navegação"); em 09/07 foi silenciosamente redefinida para uma tarefa de
    layout ("quebrar o monólito"). Motion tomou o lugar de resolver estrutura.
11. PRD.md/SDD.md desatualizados (nome antigo "Estilista", schema removido, padrão de
    imagem banido ainda recomendado).

**Recomendação do agente de design (aceita pelo dono) — paleta evoluída:**
_"O sistema não está sem polish — está polido demais dentro da estética errada."_
Fraunces leve + areia + fio dourado + eyebrow tracked é a gramática do editorial-IA.
- **Esmeralda promovida a protagonista** (ativo mais raro/diferenciado da marca).
- **`porcelana`** (`#F5F3EE`) substitui a superfície dominante; **`areia`** única
  (`#E9E1D3`) colapsa os 3 tons quase-idênticos que nunca deixavam a costura fechar.
- **`verde-profundo`** (`#083D2C`) novo, para superfícies de marca "tomadas" pelo verde.
- **Dourado só sobre fundo escuro** (nunca mais eyebrow sobre claro — mata o tell de
  "cara de IA" E o bug de contraste histórico no mesmo movimento).
- Tipografia: **o corpo de texto nunca foi escolhido** (era a fonte padrão do sistema)
  — esse é o elo fraco de alta confiança, independente de qualquer outra decisão.
  Fraunces (display) fica, mas com mais peso/ousadia (a "Regra do Peso Único" 300 faz
  tudo sussurrar — revisar nos tamanhos de display).
- **Menu/IA:** CTA "Agendar styling" (esmeralda, botão, não ícone) no header; nav
  reordenada Consultoria → Vitrine → Novidades; "Stylist" vira "Consultoria" em PT-BR;
  drawer mobile inverte a pilha (agendar+consultoria no topo); hero com CTA honesto.

**Roteirista (rascunhos, marcados [RASCUNHO], sem fato inventado):** Nota da Stylist
(2 opções), lista "Como funciona", citação de fechamento, template de descrição de PDP,
3 opções de eyebrow PT-BR. **Achado técnico:** a Q6 ("o que a Luiza não faz") não tem
pra onde ir no schema atual — `body` fica `hidden` quando `layout === 'cards'` e a
`CardsSection` só imprime `items[]`. Schema precisa de ajuste (card #5 ou seção própria).

**Decisão de sequenciamento do dono:** o que depende da Luiza (foto real, Q&A real)
fica para o FIM; enquanto isso, usar os rascunhos do roteirista como conteúdo modelo.

**Decisões travadas nesta sessão (perguntas ao dono):**
- Paleta evoluída: **aprovada como proposta.**
- Fonte do corpo: **decidir vendo 3 opções no navegador** (Hanken Grotesk, Schibsted
  Grotesk, Familjen Grotesk) — página temporária `/dev-fontes` criada para isso.
- Fraunces (display): **mantém, com mais peso/ousadia** nos títulos.

### Fase 1 (redesign) — CONCLUÍDA nesta sessão: tokens de cor + candidatas de fonte

- **`app/globals.css`:** valores de `sand-50` → porcelana (`#F5F3EE`); `sand-100/200/300`
  colapsados no mesmo tom areia (`#E9E1D3` — `sand-300` nunca foi usado em nenhum
  componente, confirmado por grep, colapsar é seguro). Nomes de classe Tailwind
  intocados (nenhum componente precisou mudar). Novo token `verde-profundo`
  (`#083D2C`) adicionado, ainda sem uso (pronto para Fases 3/4).
- **`tailwind.config.ts`:** aliases semânticos `porcelana`/`areia`/`verde-profundo`
  adicionados (mesmas variáveis CSS — código futuro pode usar os nomes novos).
- **`app/layout.tsx` + `/dev-fontes` (página temporária):** 3 fontes de corpo candidatas
  carregadas via `next/font/google` (Hanken Grotesk, Schibsted Grotesk, Familjen
  Grotesk), nenhuma delas troca `--font-sans` ainda — só disponíveis na página de
  comparação. Página mostra as 3 sobre porcelana e espresso, com texto real do site,
  + swatches da paleta nova.
- _Verificado:_ `tsc --noEmit` EXIT=0; build limpo (31 páginas, incluindo `/dev-fontes`);
  navegador confirma as 3 `font-family` computadas distintas e os hex dos swatches
  batendo com os tokens; home renderiza sem regressão, zero erro de console.

### Fase 1 — FECHADA (2026-07-09): fonte do corpo decidida e aplicada

O dono delegou a escolha final ao agente de design ("você que é o agente designer,
decidir"). Comparando as 3 candidatas renderizadas com texto real do site (screenshot
+ inspeção): **Hanken** lia neutra demais (risco de continuar parecendo fonte-padrão,
o próprio problema que estamos corrigindo); **Familjen** era a mais quente/informal mas
com desenho menos refinado no corpo; **Schibsted Grotesk** tem espinha editorial, foi
desenhada para parear com serifadas como a Fraunces, e mantém legibilidade alta sobre
claro e escuro — decisão: **Schibsted Grotesk**.

- **`app/layout.tsx`:** removidas as 3 candidatas; só `Fraunces` (display) +
  `Schibsted_Grotesk` (`variable: '--font-body'`) permanecem.
- **`app/globals.css`:** `--font-sans` agora referencia `var(--font-body)` de verdade
  antes da pilha de sistema — **achado:** `--font-sans` nunca tinha sido ligada a
  nenhuma fonte do Google; o corpo do site inteiro rendeu em fonte de sistema
  (`-apple-system` etc.) até este commit, mesmo depois de toda a Fase C. É o "elo
  fraco de alta confiança" que o próprio checkpoint já apontava.
- **`tailwind.config.ts`:** removidas as classes `font-hanken`/`font-schibsted`/
  `font-familjen` (só existiam para a página de teste).
- **`app/dev-fontes/page.tsx`:** apagada (a própria página dizia "some do projeto assim
  que a decisão for tomada").
- _Verificado:_ `tsc --noEmit` EXIT=0 (pegou 3 erros reais — `className` do `<html>`
  ainda citava as variáveis antigas removidas — corrigido); build de produção limpo
  (30 páginas, `/dev-fontes` não aparece mais); navegador confirma
  `body → "Schibsted Grotesk", "Schibsted Grotesk Fallback", …` e `h1 → Fraunces, …`
  na home e em `/categoria/vestidos`; zero erro de console.
- **Próximo da sequência do redesign:** Fase 2 (peso/ousadia do Fraunces nos títulos).

### ⚠️ Nota de transparência — commits diretos na `main` (fora do workflow)

Os commits `ee014e9` (paleta evoluída), `a62277d` (página `/dev-fontes`), `a940a27`
(checkpoint) e `a66bac3` (noindex) foram feitos **direto na `main`, sem branch nem PR**
— quebra do próprio workflow do projeto (§9: nunca commitar na main). Aconteceu numa
parte da sessão anterior à compactação de contexto; não há memória do racional exato.
Como já estão mesclados e enviados ao remoto, não revertidos (reverter histórico
publicado é mais arriscado que o problema que resolveria). **A partir desta correção,
toda mudança volta ao fluxo correto** (branch → commit → PR → review por agente →
merge), como nesta própria Fase 1.

---

## Redesign da home — tese e fases (2026-07-09, debatido com agente especialista de design)

O dono rejeitou a solução minimalista de só remover a costura de degradê ("está feio")
e pediu um REDESIGN de verdade, à altura das 39 referências de elite entregues (barra
aspiracional), sem 3D/WebGL. Tese do especialista, adotada: **"capítulos dirigidos, não
blocos empilhados"** — em repouso cada seção continua chapada (honra o DESIGN.md: "a
faixa não levanta sobre a areia"); o que muda é que ENTRAR em cada seção vira uma
batida coreografada pelo scroll (Lenis+Framer), e as emendas ganham tipografia composta
+ respiro, não degradê. Diagnóstico da faixa cinza: `SeamTransition from={EDGE.espresso}`
esmaecia um marrom escuro quase sem croma sobre a areia clara — matematicamente vira
taupe barrento, não é ajuste de valor, é o conceito errado.

Fases (pequenas, validar no navegador entre elas):
- **Fase C — Hero (momento-assinatura):** CONCLUÍDA nesta sessão, ver abaixo.
- **Fase D — Nota da Stylist ("sala clara"):** pull-quote grande, itálico, assimétrico
  (flush-left), respiro generoso, revelação por linha. Depende de 1 frase real da Luiza
  (hoje é placeholder "Nota de exemplo").
- **Fase E — Personal Styling (quebrar o monólito):** o bloco espresso de ~1300px no
  mobile ganha ritmo/assimetria interna + entrada coreografada na emenda claro→escuro.
  Elite pleno aqui depende de retrato real da stylist (hoje não existe).
- **Fase F — passada de motion + docs:** consolidar, aposentar `SeamTransition`/`EDGE`
  também no `/stylist` e no header de categoria/novidades, só então revogar a exceção
  do CLAUDE.md §5 e do design.json (ainda NÃO revogada — usada em `page.tsx` Personal
  Styling e nas 7 seções do `/stylist`; revogar só quando não sobrar nenhum uso).

---

## Fase 0 — Reconciliação (2026-07-08, retomada sob diretrizes-em-andamento v2)

_Releitura de CLAUDE.md + PROGRESS.md, `git status`/`git log`, e checagem de
baseline (build + navegador desktop **e mobile 375px**) antes de qualquer edição._

### Divergências doc × repo encontradas (corrigidas aqui)
1. **Branch fantasma (classe E4).** O cabeçalho e a seção `redesign/fable-review`
   diziam "branch aberta, não mesclada". **Falso:** essa branch NÃO existe; todo o
   redesign editorial + costura/degradê está na **`main`** (HEAD `4c6d9cd`,
   sincronizada com `origin/main`). Corrigido o cabeçalho. Nada a mesclar.
2. **Nota da Stylist não está vazia (classe E4, conteúdo).** PROGRESS afirma que
   `curatorNote` está vazio e a seção some. **Na tela renderiza placeholder**
   "Nota de exemplo — a Luiza escreve aqui" / byline "LUIZA THOMAZ". Há texto de
   exemplo no Sanity (ou um fallback) — a seção NÃO está oculta. A verificar com a dona.
3. **Working tree sujo (classe E9).** Apenas `.claude/skills/impeccable/` (9 arquivos
   de tooling do agente) modificado + `.claude/launch.json` novo (config de preview,
   criado nesta sessão). Nenhuma mudança de código de produto pendente. Commit destes
   fica separado do código (E9), quando for o caso.

### Baseline (2026-07-08)
- **Build:** `npm run build` **limpo** — 30 páginas (7 categorias, 14 produtos), zero
  erro de tipo/lint. Obs.: rodar build com o `next dev --turbopack` no ar corrompe o
  `.next` compartilhado (ENOENT em `[turbopack]_runtime.js`) → parar o dev antes de buildar.
- **Desktop (navegador):** home, `/categoria/vestidos`, `/produto/vestido-bordo` e
  `/stylist` renderizam de verdade (não são tela de erro). Design desktop está
  **coerente e polido** — editorial, Fraunces, paleta areia/espresso/bordô/esmeralda.
- **Mobile 375px:**
  - Hero: cabe, CTAs visíveis; "LT STUDIO" quebra em 2 linhas (aceitável, um pouco tosco).
  - Menu: drawer vertical funciona (categorias + Novidades + Stylist + CTAs).
  - PDP: CTA WhatsApp a ~786px do topo → **acima da dobra em phone de 812px, mas
    ABAIXO em phone de ~667px** (iPhone SE/8). Confirma a pendência "CTA sticky mobile".
  - Seção "Personal Styling" da home = **1295px** de espresso (bloco escuro muito
    longo) — candidato à queixa de "tudo em blocos".
  - `/stylist`: faixa espresso vazia acima da foto do hero.
- **Falsos alarmes descartados (não são bugs):** "Internal Server Error" na PDP =
  concorrência build×dev (erro de processo, não de código); imagem da PDP "em branco"
  = carregamento lento do Sanity CDN, a imagem renderiza.

### Leitura estratégica
O desktop **não** está "todo errado" — está polido. Mas na retomada o dono respondeu:
- **Alvo:** "tudo — quero agentes revisando tudo, do design (se necessário um novo)
  até a parte técnica."
- **Natureza:** "Direção — não é esse estilo." (Rejeita o rumo editorial atual.)

### Mandato desta fase (definido com o dono, 2026-07-08)
Revisão ampla (design + técnico) com subagentes, possível **novo design**, servindo às
DUAS frentes: **loja** (vitrine de peças) **+ consultoria** de personal stylist.

### ⚠️ Conflito registrado — referências vs. INEGOCIÁVEL do projeto (regra E7/E8)
O dono entregou `todas_referencias_compiladas.pdf`: **39 sites 3D/WebGL de elite**
(Bruno Simon, Lusion, Active Theory, Obys, Merci Michel, Unseen, Robin Payot; curadoria
Awwwards/FWA). Stack listada: **Three.js/WebGL, React Three Fiber, GSAP/ScrollTrigger,
Lenis, shaders GLSL, modelos .glb**. Observações:
1. **Proveniência suspeita:** o PDF se intitula "Sites 3D e WebGL de Elite" e lista
   Three.js Journey/Spline/.glb — é o perfil EXATO do projeto irmão `C:\dentista-3d`
   (o de Three.js). O CLAUDE.md do Estilista nunca menciona 3D. A confirmar com o dono
   se o *calibre/energia* é o alvo ou algo literal (não assumir).
2. **Colisão com o INEGOCIÁVEL:** CLAUDE.md §4/§7 fixam mobile-first + carregamento
   rápido + funil WhatsApp como não-negociáveis ("a maioria das clientes está no
   celular"; "vitrine lenta = cliente perdida"). Bruno Simon/Lusion são *desktop
   showpieces onde o site É o produto*. Aqui o produto é roupa + serviço de styling, o
   funil é WhatsApp, a cliente está no celular, e **não existem assets 3D** (só fotos
   chapadas de IA). Adoção literal briga com o modelo de negócio que o próprio dono escreveu.
3. **Caminho recomendado (a validar):** extrair a *essência* dessas referências —
   coreografia de scroll (Lenis + reveals GSAP com parcimônia), ousadia tipográfica,
   UM momento-assinatura de "wow", direção de arte mais rica — sobre um esqueleto
   convencional e mobile-rápido. É "marcante na pele" turbinado, DENTRO da filosofia
   atual, não contra ela. Full-immersive fica como escolha do dono se ele aceitar o
   custo de perf/assets/escopo/conversão. Split inteligente: mais ambição nas
   superfícies de MARCA (hero, /stylist/consultoria); catálogo/PDP rápidos e diretos.

### Plano de revisão "tudo" — separado por dependência de direção (advisor)
- **Independe da direção (começa já):** auditoria técnica — perf, a11y, correção,
  código morto, saúde de build/config, defeitos de responsividade mobile, as
  divergências da Fase 0. Rodando em subagente nesta sessão.
- **Depende da direção (aguarda a resposta de calibre):** crítica de design das telas
  atuais e o plano de redesign. Não escrever antes da decisão — seria retrabalho.

### Direção de design DECIDIDA (dono, 2026-07-08): "Essência elite, esqueleto rápido"

Adotar a *essência* das referências de elite SEM 3D/WebGL e SEM sacrificar o
INEGOCIÁVEL (mobile-first, rápido, funil WhatsApp). Não é redesenhar contra a filosofia
atual — é turbinar "marcante na pele, convencional no esqueleto".

**Princípios:**
- **Movimento como coreografia, não enfeite:** smooth scroll (Lenis, ~poucos KB) +
  reveals de entrada sóbrios ao rolar (já há o padrão `FadeInSection`). SEMPRE
  respeitar `prefers-reduced-motion` (regra já existente).
- **Ousadia tipográfica e direção de arte:** escala, assimetria, ritmo editorial,
  numerais grandes — concentrado nas superfícies de MARCA.
- **UM momento-assinatura de "wow"** (proposta: o hero). Tratamento de vídeo com
  parallax/scroll ou revelação por máscara. **Sem WebGL/3D** (não há assets; custo mobile).
- **Split por superfície (protege o funil):**
  - *Marca/emoção* (hero da home, `/stylist`/consultoria): ambição máxima.
  - *Transação/navegação* (categoria, produto/PDP): rápido, limpo, sem fricção,
    CTA WhatsApp proeminente (corrigir o abaixo-da-dobra no mobile → CTA sticky).
- **Dupla função explícita:** o site é loja (ver peça → WhatsApp) **e** consultoria
  (apresentar o styling → agendar). Navegação tem que deixar as duas óbvias.
- **Piso de performance mensurável:** sem libs 3D pesadas; motion barato de GPU;
  imagens sempre via `next/image` + Sanity.

**Decisão técnica a confirmar:** Lenis (smooth scroll) — sim. Lib de motion: manter
Framer Motion (escolha do CLAUDE.md §3, ainda não instalada) para reveals + Lenis para
o scroll; GSAP/ScrollTrigger só se um scroll-scrub de assinatura exigir. (Recomendação.)

**Sequência em fases pequenas (§8 — validar no navegador entre cada):**
- **Fase A — técnica (rodando):** auditoria por subagente → aplicar Balde A
  (perf/a11y/bugs) + CTA sticky na PDP mobile + faixas espresso vazias/seções longas.
  Independe da direção; entra primeiro.
- **Fase B — fundação de motion:** Lenis + smooth scroll global + reduced-motion.
- **Fase C — momento-assinatura no hero:** 1 proposta, validar no navegador antes de espalhar.
- **Fase D — direção de arte nas superfícies de marca:** home + `/stylist`.
- **Fase E — dupla função / IA de navegação:** loja e consultoria óbvias; revisar nav/rotas.
- Cada fase: spec de 4 linhas (atual/alvo/invariantes/fronteira), verificação no
  navegador (mobile real), evidência aqui.

### Fase A — CONCLUÍDA (2026-07-08, validada no navegador mobile 375px)

Auditoria técnica por subagente (relatório triado A/B/C). Aplicados os itens do
Balde A que independem de decisão de negócio. Invariante respeitada: nenhuma mudança
de direção visual/marca — só a11y, código morto e ergonomia mobile.

- **A1 — contraste WCAG AA** (classe de bug recorrente do projeto): label "N peças" em
  `categoria/[slug]/page.tsx` e `colecao/novidades/page.tsx` `text-ink/50→/70`;
  `Footer.tsx` `cream-text/40→/70`; mensagem de menu vazio em `Nav.tsx` `/35→/70`.
  _Verificado:_ footer `rgba(244,239,230,0.7)`, label categoria `rgba(26,26,26,0.7)`.
- **A3 — código morto proibido:** removido `sanityLoader` + JSDoc que mandava usá-lo como
  `loader` prop (padrão já banido nas REGRAS — reintrodução do bug de runtime RSC).
  `sanity/lib/image.ts` agora só exporta `urlFor`. _Verificado:_ categoria e PDP
  renderizam com imagens do Sanity, zero erro de console.
- **A4 — alvo de toque (WCAG 2.5.8):** link WhatsApp do header ganhou `p-2 -mr-2` no
  mobile (`md:p-0`). _Verificado:_ área de toque **34×34px** (era 18×18).
- **A5 — Escape no menu mobile:** `Nav.tsx` ganhou `mobileTriggerRef` +
  `handleMobileKeyDown` — fecha com Escape e devolve foco ao hambúrguer (simetria com o
  mega-menu desktop). _Verificado:_ menu fecha e `activeElement` volta ao hambúrguer.
- **A6 — CTA sticky mobile na PDP** (era a pendência nº 1): barra `fixed bottom-0
  md:hidden` com `env(safe-area-inset-bottom)` + `pb-28` no `<main>` para não cobrir o
  conteúdo; botão inline mantido. _Verificado:_ barra fixada no rodapé da viewport,
  CTA de 49px acima da dobra sem rolar.

_Nota: a ferramenta de screenshot travou nesta sessão; verificação feita por inspeção
de DOM (getComputedStyle/getBoundingClientRect) + teste de interação, mais precisa que
captura para valores de CSS. Falta o dono confirmar a olho no celular real._

### Limpeza da auditoria (A2/B1/B3 + higiene) — CONCLUÍDA (2026-07-08, aprovado pelo dono)

- **A2/B1 — campos-fantasma do Studio removidos:** `stylistProfile` perdeu
  `whatsappNumber`/`bookingMessage` (obrigatórios que só bloqueavam publicação; o site
  usa `siteSettings.whatsappNumber` + mensagem fixa — confirmado por grep + leitura da
  query). `siteSettings` perdeu `topBarText`/`topBarLink`/`heroVideo`/`heroPoster`
  (nenhuma tela lia; hero é `/public/hero.mp4` por regra). Dados órfãos no Sanity são
  inofensivos. _Se um dia quisermos barra de aviso ou hero via CMS, recriar de propósito._
- **B3 — editor de texto travado:** `product.description` e `section.body` do
  `stylistProfile` agora só permitem estilos **Normal + Citação** (`of: [{ type:'block',
  styles:[...] }]`). Some o risco de `<h1>` solto sem estilo do design system. Listas
  (inclusive a numerada das "Etapas") e negrito/itálico seguem no padrão default.
- **Higiene (Balde C):** arquivo `nul` apagado; 5 wireframes `.html` movidos da raiz para
  `wireframes/` via `git mv` (histórico preservado).
- _Verificado:_ `npx tsc --noEmit` EXIT=0; site e schemas type-clean; páginas renderizam.

### Fase B — CONCLUÍDA (2026-07-08): fundação de movimento (scroll suave)

Primeiro passo da direção "essência elite, esqueleto rápido". Invariante: nada de layout
mudou; só o *comportamento* do scroll.

- Instalados `lenis` + `framer-motion` (Framer fica para os reveals ricos das Fases C/D;
  o projeto já tem `FadeInSection` via CSS/IntersectionObserver para reveals simples).
- **`components/SmoothScroll.tsx`** (client): inicia o Lenis com loop de rAF, montado no
  `app/(site)/layout.tsx`. **Respeita `prefers-reduced-motion`** — se o usuário pediu
  menos movimento, o Lenis NÃO inicia e o scroll nativo é preservado (regra do sistema).
- CSS recomendado do Lenis adicionado ao `globals.css` (evita conflito de
  `scroll-behavior`/overflow).
- _Verificado:_ home carrega com `<html class="… lenis">`, `lenisActive:true`, zero erro
  de console; `tsc --noEmit` EXIT=0. Falta o dono sentir o scroll no navegador/celular
  e confirmar o caminho reduced-motion (guard de código, não testável via preview aqui).

**Vulnerabilidades npm:** o `npm install` reportou 23 vulns (pré-existentes, árvore
Sanity/Next). Não rodei `audit fix` (pode quebrar; não pedido). Registrar como pendência.

_Fase B foi commitada e mesclada na `main` via PR #19 (`feat/auditoria-e-scroll-suave`,
merge `0cf92e8`). Segue sem commitar apenas o tooling do agente: `.claude/skills/impeccable/`
(E9 → commit separado) e o `.claude/launch.json` (config de preview)._

### Fase C — CONCLUÍDA (2026-07-09, mesclada na `main` via PR #20 — branch `feat/hero-momento-assinatura`, hoje remote-only): momento-assinatura do hero

Debatido com agente especialista de design (ver "Redesign da home" acima) antes de
implementar — recomendação: vídeo (não máscara tipográfica) como protagonista, por
hierarquia da marca ("a foto é o argumento; o texto é a confirmação") e por ser o único
asset real e premium do projeto.

- **`components/HeroSignature.tsx`** (novo, client): extrai o hero de `page.tsx`. Duas
  camadas de motion via Framer, ambas desligadas sob `prefers-reduced-motion`
  (`useReducedMotion`):
  1. **Entrada escalonada no load:** eyebrow → wordmark → tagline → CTAs, stagger 80ms,
     ease out-expo `[0.16,1,0.3,1]`, 900ms cada.
  2. **Parallax discreto no scroll** (`useScroll`+`useTransform` amarrado ao próprio
     `sectionRef`): vídeo `scale` 1→1.15 + `y` 0→-6% (scale dá folga pro translate sem
     revelar borda, container é `overflow-hidden`); escurecimento uniforme 0→0.5 de
     opacidade na saída (em vez de reduzir a opacidade do próprio vídeo — evita revelar
     o fundo por trás); texto sobe um pouco mais (`y` 0→-14%) para separação de planos.
- **Wordmark vira lockup intencional:** "LT" / "Studio" em `<span>`s separados,
  `block md:inline` — duas linhas deliberadas no mobile (antes quebrava por acaso no
  texto corrido), linha única no desktop. `text-[clamp(3.5rem,15vw,9rem)]`.
- **Removida a costura da emenda hero→Nota** (`CuratorialNote.tsx` perdeu
  `<SeamTransition from={EDGE.espresso}/>`): era a faixa cinza barrenta que o dono
  apontou. Corte limpo — taupe quente do vídeo encontra o sand-50 quente da Nota.
  **Escopo desta fase é só essa emenda**; a costura de `page.tsx` (Personal Styling) e
  as 7 do `/stylist` ficam para a Fase F (ver acima).
- _Verificado:_ `tsc --noEmit` EXIT=0; navegador em 1280px (wordmark linha única,
  `spans display:inline`) e 375px (lockup 2 linhas, `spans display:block`, hero
  full-width `375×748`); parallax confirmado por inspeção (`scroll 560px` →
  `video transform: matrix(1.10, …, -29.28)`, `darken opacity: 0.335`); Nota sem
  gradiente-costura (`temFaixaGradiente:false`); zero erro de console.
  **Screenshot da ferramenta de preview com artefato de escala nesta sessão**
  (mostrou canvas cortado) — validação feita por medição de DOM
  (`getBoundingClientRect`/`getComputedStyle`), que é a fonte confiável aqui.
  **Caminho `prefers-reduced-motion` não testável nesta ferramenta** (sem emulação
  disponível) — guard segue o mesmo padrão já validado do `SmoothScroll.tsx`; falta o
  dono confirmar no sistema operacional com "reduzir movimento" ativado.
- Code review por agente antes do merge do PR anterior pegou um bug real de Escape que
  eu tinha validado errado (fix já mergeado) — reforça manter o passo de review.

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

### fix/polish-balde-a — Balde A do POLISH-FIXES (Fable) *(2026-07-06, mesclado na `main` via PR #18 — merge `a3a1948`)*

Seis tarefas do POLISH-FIXES, cada uma em commit próprio, **nesta ordem**:

1. **1.1 fix — peça esgotada vendável por link direto:** `produto/[slug]/page.tsx`
   trata `!product.inStock` igual a `!product` (EmptyState "saiu de cena" +
   `generateMetadata` com title "Peça não encontrada", sem vazar OG image/preço).
2. **1.2+1.3 fix/refactor — formatPrice com centavos + desduplicação** (feitas juntas,
   por instrução): `lib/format.ts` (`formatPrice` novo: inteiro sem decimais,
   com centavos sempre 2 casas) e `components/icons.tsx` (`WhatsAppIcon`, prop
   `size` default 16, mantendo o 18 do header). Substituídas 4 cópias do SVG e 2
   cópias do formatPrice por import. `grep "M17.472 14.382"` → 1 ocorrência.
3. **2.2 fix — contrastes P1** (sem o P1-C eyebrow dourado, que fica para o Impeccable):
   números do "Como funciona" `/35→/60`; byline da CuratorialNote `/50→/70`;
   blockquote da seção padrão do /stylist perde a borda dourada lateral e sobe
   para `/70`; foco do `WaButton` passa de `outline-esmeralda` para
   `outline-cream-text` (visível sobre o próprio fundo esmeralda do botão).
4. **4.1 fix — gradiente do hero:** `from-black/70 via-black/40` → `from-espresso/80
   via-espresso/40`, mesma função de legibilidade, cor da paleta em vez de preto puro.
5. **4.3 fix — acabamento a11y/perf:** breadcrumb do produto "Navegação" →
   "Trilha de navegação"; mega-menu de Categorias fecha com Escape e devolve foco
   ao gatilho; logo mobile no Nav perde `priority` (só o desktop precisa de
   preload) e ganha `loading="eager"`.

**Fora de escopo por decisão** (não tocados): 1.4 (offers), 2.1 (eyebrow dourado),
Bloco 3 (features), Bloco 5 (tipografia) — ver Decisões.

`npm run build` limpo após cada commit. Preços no Sanity ainda são todos `null`
(catálogo de teste) — o formatPrice com centavos foi validado por execução direta
da função (189.9 → "R$ 189,90", 189 → "R$ 189"), não por produto real no browser;
quando a Luiza cadastrar preços com centavos, conferir visualmente no card e na
página de produto. Gradiente do hero (item 4) só foi validado por build limpo —
falta o dono confirmar legibilidade do texto sobre o vídeo/poster no browser.

---

### /impeccable polish — `app/(site)/page.tsx` *(2026-07-07)*

Rodada de polish planejada (ver Decisões abaixo). Ambiente sem navegador/Puppeteer
disponível nesta sessão — verificação foi por leitura de código, detector estático
(zero findings antes e depois) e inspeção do HTML compilado (dev server + build de
produção), não por captura visual real. Falta o dono confirmar no navegador.

**Achados do critique original (score 22/40) já resolvidos em rodadas anteriores:**
P0 dois CTAs de peso igual, P1 voz editorial (Nota da Stylist), P1 reassurance
(Como funciona). Restava desta rodada: heading semântico incorreto no card de
produto e contraste abaixo do limiar documentado no DESIGN.md.

**Mudanças:**
1. **`components/ProductCard.tsx`** — título do produto `h2` → `h3`. A home tem
   `h1` (hero) → `h2` ("Novidades") → título de produto; usar `h2` de novo
   quebrava a hierarquia (achado "Consistency and Standards" do critique).
   Confirmado no HTML compilado: 1 `h1`, 2 `h2`, N `h3` (8 produtos + 3 passos).
2. **Hero (`page.tsx`)** — eyebrow "Personal Stylist" `opacity-70` → `opacity-75`
   e CTA secundário "Agendar horário →" `text-cream-text/60` → `/75`. O DESIGN.md
   documenta `cream-text/75` como o limiar testado e aprovado sobre espresso; `/60`
   e `/70` ficavam abaixo dele (mesma classe de bug já corrigida em outros pontos
   no `fix/polish-balde-a`, mas esta instância do hero não estava no lote).
3. **Hero subheadline** — `max-w-xs` → `max-w-xs md:max-w-sm`. Critique original
   apontava que `max-w-xs` desperdiçava o espaço do hero em telas grandes; mobile
   mantém a largura original.
4. **H2 "Um olhar profissional para o seu estilo"** — ganhou `[text-wrap:balance]`,
   consistente com os demais headings/blockquotes do sistema que já usam a regra.

**Decidido não tocar (fora de escopo ou requer decisão do dono):**
- **Eyebrow + divisória dourada** (item 2.1 do POLISH-FIXES, apontado como P3 no
  critique): na home são só 2 ocorrências (seção Personal Styling + Nota da
  Stylist), dentro do limite de "3 por tela" que o próprio DESIGN.md define para
  esse padrão. Não é scaffolding reflexo aqui — é o sistema nomeado funcionando
  como documentado. Nada para corrigir nesta página.
- **Copy do CTA principal do hero** ("Quero esta peça" → leva para a coleção
  "Novidades", não para uma peça específica): mesmo texto que o CTA de produto
  individual usa (`ProductCard`), mas aqui aponta para uma listagem, não uma peça.
  Pode ler como promessa quebrada. Não mudei sem validar com a dona — é decisão
  de voz de marca, não bug técnico.
- **Motion de entrada no hero:** o CLAUDE.md previa Framer Motion "com parcimônia
  no hero", mas a lib não está instalada e não há nenhuma animação de entrada em
  nenhuma página do site (convenção atual é zero motion). Adicionar a dependência
  é decisão maior que um polish pontual — não fiz sem perguntar.

`npm run build` limpo (30 páginas, sem erros de tipo). Detector do Impeccable:
zero findings antes e depois das mudanças.

---

### /impeccable polish — `app/(site)/stylist/page.tsx` *(2026-07-07)*

Polish de higiene por instrução explícita do dono: coerente com a home já polida,
sem redesenhar, guarda-corpo de opacidade restrito a `/60`, `/70`, `/75` (histórico
de texto invisível com valores novos, 3 ocorrências anteriores). Mesma limitação
de ambiente da rodada anterior: sem navegador disponível, verificação por leitura
de código + detector estático (zero findings antes/depois) + `npm run build` limpo
(30 páginas). Falta o dono confirmar contraste no browser, como pedido.

**Mudanças aplicadas:**
1. **Placeholder "Foto em breve"** (hero e `FotoLadoSection`) — `text-ink/40` →
   `text-ink/75`. Mesma classe de bug já corrigida no `ProductCard.tsx` da home
   (`/30` → `/65`, 1,85:1 → 4,92:1 ✓); aqui usei `/75` (dentro do guarda-corpo
   pedido) em vez de `/65` — estritamente mais escuro/contraste maior, então
   também aprovado.
2. **Divisória do hero** — `bg-dourado` (100%, sem modificador) → `bg-dourado/40`.
   Único divisor do arquivo fora do padrão; todo o resto do site (esta página e a
   home) usa `/40` para essa linha decorativa.
3. **Hierarquia de heading em `CardsSection`** — título do item era `<p>`, virou
   `<h3>` (a seção já tem `<h2>`). Mesmo fix de "Consistency and Standards" do
   `ProductCard.tsx` na rodada anterior.
4. **`[text-wrap:balance]`** adicionado a todos os headings do arquivo (`h1` do
   hero + os 5 `h2` de seção), replicando o padrão já aplicado na home.

**Encontrado mas NÃO corrigido — decisão do dono necessária:**
- **Eyebrow dourado sobre fundo claro é ilegível.** `PadraoSection`,
  `FotoLadoSection` e `CardsSection` usam `text-dourado` (100%, sem opacidade) para
  o eyebrow em cima de `sand-100`/`sand-200`. Contraste calculado ≈ **1,87:1**
  (precisa de 4,5:1 para texto de 10px) — falha grave, provavelmente o mesmo
  "P1-C eyebrow dourado" que o critique original adiou para o Impeccable.
  **Não dá para resolver com opacidade** — dourado já é claro, reduzir opacidade
  sobre fundo claro só piora o contraste. A correção real exige trocar a COR do
  texto do eyebrow nessas 3 variações (ex.: usar `text-ink` ou `text-espresso` só
  no texto, mantendo o dourado na linha/ícone) — o que esbarra no guarda-corpo
  "não redesenhar" e na regra do DESIGN.md de que dourado é a cor exclusiva de
  eyebrow. Por isso não toquei sem validar. As mesmas seções sobre fundo
  `bg-espresso` (`EtapasSection`, `TransformacaoEscuraSection`) não têm esse
  problema — dourado sobre espresso tem ótimo contraste.

---

### redesign/fable-review — Redesign editorial completo *(2026-07-08, JÁ NA `main` — ver Fase 0; a branch homônima não existe mais)*

Revisão de design completa pedida pelo dono ("básico, sem graça, batido" → nível
editorial/premium). Diagnóstico: o sistema documentado em `.impeccable/design.json`
já era correto (flat, dourado escasso, peso único, cantos retos) — o problema era
**subaplicação por excesso de cautela** (toda seção `py-16`, todo H2 `text-3xl/4xl`,
grid sempre simétrico). O redesign manteve quase integralmente as regras de
cor/forma/peso e concentrou a mudança em escala tipográfica, ritmo vertical
variável, assimetria e uso mais ousado (não mais frequente) do dourado/itálico.
Plano completo em `C:\Users\danin\.claude\plans\voc-o-fable-optimized-karp.md`.

**Decisões validadas com o dono antes de codar:**
1. Fonte display: Cormorant Garamond → **Fraunces** (`app/layout.tsx`).
2. Fix de contraste do eyebrow dourado (bug WCAG AA conhecido desde o polish
   anterior, ver seção `/impeccable polish` acima): novo token **`dourado-ink`
   (#7A5E1A)**, mesmo stop do tonal ramp já documentado, para eyebrow/texto sobre
   fundo claro; `#C2A14D` continua padrão sobre fundo escuro/linha/ícone.
   `PadraoSection` e `CardsSection` do stylist ganharam fundo `sand-100` explícito
   (antes herdavam o `sand-200` do body) — resolve contraste e dá ritmo.
3. Motion: fade-in único (opacity+translateY 8px, 400ms) em headlines de seção ao
   entrar em viewport, incluído como **exceção documentada** à Regra Flat/Motion
   (`components/FadeInSection.tsx` + `.fade-in` em `globals.css`), sempre
   neutralizado por `prefers-reduced-motion`.
4. Mosaico de grid (peça em destaque maior): só na Home nesta fase; Categoria/
   Novidades ficam só com tipografia/espaçamento, mosaico é fase 2 experimental.

**Mudanças por arquivo:**
- `app/layout.tsx` — fonte Fraunces.
- `app/globals.css` — token `--dourado-ink`/`--dourado-ink-rgb`; classes `.fade-in`.
- `tailwind.config.ts` — cor `dourado-ink`.
- `.impeccable/design.json` — documentado o novo token, a exceção de motion, e a
  troca de fonte.
- `app/(site)/page.tsx` — hero com escala tipográfica dramática (`text-9xl` em
  desktop), tagline em itálico serif, bloco de texto mais estreito (`lg:max-w-md`);
  grid de Novidades com mosaico condicional (peça 1 em destaque 2×2 quando
  `products.length >= 4`, senão grid uniforme); Personal Styling com H2 maior e
  numerais 01/02/03 dourados grandes (`text-6xl/7xl`) substituindo o texto pequeno
  anterior.
- `app/(site)/stylist/page.tsx` — hero com foto fluida (`md:w-[40%]`) e H1 maior;
  as 7 variantes de seção (`PadraoSection`, `FotoLadoSection`, `EtapasSection`,
  `TransformacaoEscuraSection`, `DestaqueClaroSection`, `CardsSection`) com escala
  tipográfica subida um degrau, ritmo vertical variável (`py-24` a `py-40`
  conforme o peso narrativo da seção), numerais do `EtapasSection` ampliados, e
  `CardsSection` perdeu a borda (`border-sand-300/40`) em favor de tonal layering
  puro — schema/campos Sanity consumidos continuam idênticos.
- `components/CuratorialNote.tsx` — blockquote maior e itálico, ritmo mais generoso.
- `components/ProductCard.tsx` — preço `text-xs`→`text-sm`, padding maior, nova
  prop `featured` (título maior, mesmo componente/dados) para o card de destaque
  do mosaico.
- `app/(site)/categoria/[slug]/page.tsx` e `colecao/novidades/page.tsx` — H1 maior,
  contagem de peças como eyebrow textual (`products.length`, sem campo novo),
  espaçamento maior; grid permanece simétrico nesta fase.
- `app/(site)/produto/[slug]/page.tsx` — H1 e preço maiores, imagem principal
  `lg:aspect-[4/5]`, mais respiro entre blocos de detalhe. JSON-LD sem `offers`,
  `inStock`, breadcrumb: intocados.
- `components/layout/Nav.tsx` — só tipografia (tracking dos links, tamanho do
  painel "Em destaque" do mega-menu); mecânica de hover-intent/timers/Escape/aria
  confirmada intocada.
- `components/layout/Footer.tsx` — mais respiro vertical, borda `border-t-2` → `border-t`.

**Build:** `npm run build` limpo, 30 páginas geradas, zero erro de tipo/lint.

**Não implementado nesta rodada (fase 2/3 do plano, adiado deliberadamente):**
- Itálico como "assinatura" em mais pontos da página (1 frase-âncora por página).
- Mosaico de grid replicado em Categoria/Novidades — aguarda validação do padrão
  na Home com dados reais (fotos definitivas, contagens reais de estoque).
- Segunda foto no hover do ProductCard — precisa de fotos reais (atuais são
  placeholder de IA) e mudança de query (`images[1]`).

**Validação pendente (dono, no browser):** escala tipográfica em todas as
páginas; contraste do eyebrow dourado no stylist (`PadraoSection`/`FotoLadoSection`/
`CardsSection`) sobre `sand-100`; robustez do mosaico da home com 1–3 vs. 4+
produtos em estoque reais; leitura da fonte Fraunces nos tamanhos novos
(`text-8xl`/`text-9xl`); mega-menu e cascata mobile comportando-se como antes;
`prefers-reduced-motion` desativando o fade-in. Nenhum deploy foi feito.

**Correções após 1ª rodada de feedback do dono no browser** *(mesmo dia)*:
- **Mosaico de grid da home era bug, não só gosto** — o card em destaque (2×2)
  e os cards normais ao lado tinham alturas que não batiam (o CSS grid não
  garantia isso), resultando em desalinhamento visível nos prints. Em vez de
  depurar o grid, a seção Novidades **saiu da home por decisão do dono**
  (continua em `/colecao/novidades` e acessível pelo CTA primário do hero).
- **CTA de agendamento no hero** — era link de texto ("Agendar horário →"),
  virou botão sólido esmeralda do mesmo peso visual do CTA primário bordô
  (dono pediu explicitamente um botão, não só texto).
- **"Ficou sem visual/degradê"** — dono apontou que, fora o hero (vídeo), o
  resto da página ficou piso/cru: títulos grandes soltos sobre fundo liso,
  sem textura. Fix dentro da regra já documentada (degradê só na família
  areia, restrito a faixas): Categoria/Novidades ganharam faixa de cabeçalho
  com degradê `sand-100→sand-200` + linha dourada antes do H1; hero e seções
  claras do `/stylist` (`PadraoSection`, `FotoLadoSection`, `CardsSection`,
  `DestaqueClaroSection`) e a `CuratorialNote` trocaram fundo liso por
  degradê sutil dentro da mesma família. PDP ficou de fora de propósito —
  fundo liso perto de foto de produto é regra do sistema (gradiente sobre
  foto de produto é proibido), não lacuna.
- Build limpo após as correções. Ainda falta validação visual do dono.

**2ª rodada de feedback — "ainda parece tudo em blocos, sem degradê entre as
cores"**: o dono queria transição suave de cor ENTRE seções vizinhas de
famílias diferentes (ex. Nota da Stylist clara → Personal Styling escura),
o que a `CLAUDE.md §5` proibia explicitamente ("nunca areia → outra
família"). Perguntei e o dono **autorizou abrir exceção** — registrada em
`CLAUDE.md §5` e `.impeccable/design.json` ("A Regra do Degradê Familiar"):
cruzamento de família passa a ser permitido, mas só como uma "costura"
curta (~96–160px) na emenda entre duas seções, nunca como fundo de seção
inteira. Implementado em `components/SeamTransition.tsx` (overlay absoluto
que esmaece a cor da seção anterior até transparente sobre o topo da seção
atual) + `lib/colors.ts` (valores hex literais, necessários porque o
gradiente é aplicado via `style` inline, não classe Tailwind). Aplicado na
home e no `/stylist` — neste último a ordem das seções é definida
dinamicamente pela dona no CMS, então a cor de entrada de cada seção é
calculada em runtime a partir da borda inferior resolvida da seção anterior
(`STYLIST_SECTION_BOTTOM_EDGE` em `lib/colors.ts`). PDP e Categoria/Novidades
não usam costura entre blocos claro/escuro pois não têm essa alternância.
Build limpo. Ainda falta validação visual do dono.

---

## Decisões recentes (não reverter sem discutir)

- **JSON-LD do produto fica SEM `offers`.** Decisão consciente: o site não é
  e-commerce transacional, a venda fecha no WhatsApp. Não adicionar preço/oferta
  estruturada só porque "SEO recomenda" — reintroduziria a promessa de compra no site.
- **POLISH-FIXES (Fable) — só o "Balde A" foi executado** (bugs 1.1, 1.2, 1.3, 2.2,
  4.1 e 4.3 — ver `fix/polish-balde-a` acima). Ficam **FORA por decisão**, não por
  esquecimento:
  - 1.4 (offers no JSON-LD) — mesma decisão do item acima.
  - 2.1 (eyebrow dourado) — vai para o polish do Impeccable, não para o Balde A.
  - Bloco 3 (features) — fora de escopo desta rodada.
  - Bloco 5 (tipografia) — vai para o Impeccable.
- **Próximo trabalho planejado:** mesclar `fix/polish-balde-a` → depois rodar
  `/impeccable polish`. *(Feito em 2026-07-07, ver seção acima — resultado: fixes
  pequenos de hierarquia/contraste/tipografia; nada de estrutural mudou.)*

## Pendências — prioridade alta

- ~~**CTA sticky no mobile da página de produto**~~ — **resolvido na Fase 5**
  (reconstrução completa, commit `23332e8`). A página de produto atual já tem
  uma barra fixa no rodapé do mobile (`fixed inset-x-0 bottom-0`, `md:hidden`)
  com o CTA "Quero esta peça". Verificado ao vivo em 2026-07-18 no viewport
  exato citado aqui (375×667, iPhone SE) e após scroll: CTA sempre visível,
  nunca abaixo da dobra. Este item ficou órfão no documento desde antes da
  Fase 5 — mantido riscado em vez de apagado, para não perder o rastro de
  quando/por que foi resolvido.

---

## Divergências de especificação (vs. PRD/SDD — registradas aqui, PRD/SDD não editados)

- **Nome do produto:** o PRD antigo chama o projeto de "Estilista"; o nome real em
  produção é **"LT Studio"** (rebrand aplicado em `feat/rebrand-lt-studio`). Toda
  referência mental/tratativa com a dona deve usar "LT Studio".
- ~~**Fonte display:** o SDD §2 sugeria Fraunces; o projeto usa Cormorant Garamond~~ —
  **resolvido em 2026-07-08**: trocado para **Fraunces** no redesign editorial (decisão
  do dono), alinhando com o SDD original. Ver seção "redesign/fable-review" abaixo.
- ~~**Scroll suave (Lenis):** cortado na Fase 3 (2026-07-13)~~ — **restaurado em
  2026-07-14** a pedido do dono (ver "Fase 3" acima). Sem divergência: o SDD
  continua valendo como estava.

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
