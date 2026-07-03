# .impeccable.md — Contexto de marca para polish da LT Studio

Arquivo de contexto para a skill Impeccable. Define a identidade da marca, a
paleta, o mandato deste polish, e — crucial — o que pode ser ousado e o que NÃO
pode ser tocado. Leia inteiro antes de agir.

---

## 1. O que é o site

LT Studio — site de uma **personal stylist** (Luiza Thomaz) que vende roupa
feminina e atende clientes de styling. O diferencial do negócio é a **pessoa**,
não a loja. A loja existe para alimentar o contato com ela.

Duas conversões, ambas via WhatsApp (não há checkout):
1. Cliente vê uma peça → "Quero esta peça" → WhatsApp com o nome do produto.
2. Cliente conhece a stylist → "Agendar horário" → WhatsApp.

Público: mulheres, navegando majoritariamente no **celular**. O site precisa
carregar rápido no 4G e ler como **moda premium / editorial**, não como template.

---

## 2. O MANDATO DESTE POLISH (leia com atenção)

A dona considera o site atual **"básico, sem graça, batido"**. Esse é o problema
a resolver, e ele NÃO é só acabamento — é **estrutura e ousadia visual**.

Diagnóstico do que está sem graça hoje:
- **Estrutura monótona:** as seções (especialmente em /stylist) são uma pilha
  vertical de blocos parecidos, muito texto centralizado, pouca variação de
  ritmo. Falta assimetria, sobreposição, escala dramática, momentos de respiro
  e de tensão. É previsível.
- **Cor sem ousadia:** a paleta é bonita mas está sendo usada de forma tímida —
  muito areia uniforme, os acentos de joia (esmeralda, bordô, dourado) quase não
  aparecem. A marca tem cores ricas e as está desperdiçando.
- **Tipografia sem hierarquia forte:** falta contraste de escala e peso entre
  display e corpo; as fontes não criam drama nem guiam o olho.

**Você tem LIBERDADE ESTÉTICA AMPLA para resolver isso** — repensar layout de
seções, introduzir assimetria, variar escala e ritmo, usar a cor com mais
coragem, criar hierarquia tipográfica forte, adicionar momentos editoriais
(imagem grande, texto sobreposto, quebras de grid). Ouse. O objetivo é que o
site pareça feito por um diretor de arte de moda, não gerado por template.

**Mas essa liberdade é ESTÉTICA, não ESTRUTURAL-TÉCNICA.** Veja a seção 5
(guarda-corpos) — há um motor por baixo que não pode quebrar.

---

## 3. Paleta (tokens reais — use exatamente estes)

Família areia (bases e fundos claros):
- `--sand-50`  #F4EFE6
- `--sand-100` #EDE3D2
- `--sand-200` #E7DBC8  (fundo padrão do body)
- `--sand-300` #DCCBB0

Cores de marca:
- `--espresso`        #241C17  (faixas escuras: header, footer, seções de destaque)
- `--esmeralda`       #0B5D46  (acento joia DOMINANTE; é a cor do CTA principal)
- `--esmeralda-light` #1D9A72
- `--bordo`           #7B1E3A  (acento joia; só em CTA secundário "Quero esta peça")
- `--dourado`         #C2A14D  (linhas, ícones, números, detalhes finos)

Texto:
- `--ink`        #1A1A1A  (texto sobre fundo claro)
- `--cream-text` #F4EFE6  (texto sobre fundo escuro/espresso)

Existem variantes `-rgb` de cada token (para usar com rgb()/rgba() e o
modificador de opacidade /N do Tailwind — isto JÁ FUNCIONA, foi corrigido).

### A regra do degradê (do SDD §8 — RESPEITAR)
- Degradê SOMENTE dentro da família areia, sutil, em hero/faixas.
- NUNCA degradê atrás de produto. NUNCA cruzando famílias de cor.
- Base areia dominante; cards de produto sobre `--sand-50` para a roupa ler fiel.
- Acentos de joia em DOSE PEQUENA mas PRESENTE: esmeralda dominante entre eles,
  bordô só em CTA, dourado em linhas/ícones. (Hoje estão tímidos demais — pode
  aumentar a presença, respeitando as funções de cada um.)

---

## 4. Tipografia e tom

- Display: serifada com caráter (estilo Fraunces/Cormorant — editorial, feminina).
- Corpo/UI: sans limpa.
- Tom da marca: sofisticado, editorial, feminino, confiante. Não fofo, não
  corporativo, não minimalista-frio. Pense em revista de moda, não em e-commerce.
- Pode (e deve) criar contraste de escala forte entre display e corpo.

---

## 5. GUARDA-CORPOS — o que NÃO pode quebrar (nível B)

A liberdade da seção 2 é estética. Estas coisas são técnicas/funcionais e
custaram semanas para acertar. NÃO as quebre em nome do visual:

### 5a. Arquitetura de conteúdo (CMS-driven) — INTOCÁVEL
- O site é dirigido pelo Sanity. A página /stylist usa um campo `sections[]` com
  layouts nomeados: `padrao`, `foto-esquerda`, `foto-direita`, `etapas`,
  `destaque-claro`, `transformacao-escura`, `cards`. A dona edita tudo no Studio.
- Você pode redesenhar a APARÊNCIA de cada layout. NÃO pode remover layouts,
  renomeá-los, nem mudar como o conteúdo é lido do Sanity — senão o cadastro da
  dona quebra. Se um layout vira outra coisa visualmente, ele ainda precisa
  consumir os mesmos campos (eyebrow, title, body, image, items[], layout).
- Imagens vêm do Sanity via `urlFor(img).width(W).height(H).fit('crop').auto('format').url()`
  + remotePatterns. NÃO usar loaderFile nem loader como prop (quebra RSC em runtime).

### 5b. Acessibilidade e contraste — INTOCÁVEL
- Todo texto WCAG AA (4,5:1 texto pequeno). Já foi corrigido um bug sério de
  contraste; não reintroduza texto claro-sobre-claro ou escuro-sobre-escuro.
- Sobre espresso, texto em cream. Sobre areia, texto em ink. Foco visível,
  navegação por teclado, menu mobile acessível (cascata, não hover-only).

### 5c. Funcionalidade — INTOCÁVEL
- Botões WhatsApp: número vem de `siteSettings.whatsappNumber`; mensagem de
  produto inclui o nome da peça; mensagem de agendamento é fixa. NÃO alterar a
  lógica nem os textos das mensagens.
- Regra do catálogo: categoria sem produto inStock some do menu. Sem fallback.
- Hero da home é VÍDEO local (`/hero.mp4` + poster), com `muted loop autoPlay
  playsInline` e `prefers-reduced-motion`. Pode redesenhar o redor; NÃO remover
  o vídeo nem essas props (autoplay quebra sem muted; iOS abre fullscreen sem
  playsInline).
- Performance: LCP rápido no 4G mobile. Não adicione JS pesado nem animação que
  prejudique carregamento. Framer Motion só onde agrega.
- O `/studio` é isolado (route group `app/(site)/` separa o site do Studio). NÃO
  aplicar header/footer/estilo do site dentro do /studio.

### 5d. Mobile — VALIDADO, cuidado
- A navegação mobile (hambúrguer → cascata vertical) está validada e aprovada.
  Pode refinar estética, mas NÃO quebrar o comportamento nem a legibilidade.
- Tudo precisa funcionar no celular primeiro (público navega no mobile).

---

## 6. PROVISÓRIO — não otimizar em torno disto

Estas coisas estão no site mas são temporárias. NÃO as trate como definitivas
nem ajuste o layout especificamente para elas:

- **Logo do header/footer:** o arquivo `public/logo-lt.png` é uma logo de TESTE
  (PNG, possivelmente com textura/halo). A definitiva (SVG, champagne, da
  designer) virá depois, NO MESMO arquivo. Projete o espaço da logo de forma
  robusta a uma troca de arquivo — NÃO otimize medidas pixel-perfect para o PNG
  de teste, pois a proporção final pode mudar.
- **Fotos da Luiza na /stylist:** algumas aparecem como "Foto em breve"
  (placeholder). Isso é conteúdo pendente, NÃO bug. Projete os blocos de foto
  para ficarem bons COM imagem real; o placeholder é transitório.
- **Subtítulos dos cards "Pra quem é":** texto rascunho, pendente de revisão da
  Luiza. Não os trate como copy final; não construa layout que dependa do
  tamanho exato deles.

---

## 7. Prioridades deste polish (em ordem)

1. **Quebrar a monotonia estrutural** — especialmente /stylist e o ritmo entre
   seções da home. Assimetria, escala, sobreposição editorial, respiro.
2. **Usar a cor com coragem** — tirar o site do "tudo areia". Acentos de joia
   presentes (esmeralda dominante, bordô em CTA, dourado em detalhe), dentro das
   regras de função e do degradê.
3. **Hierarquia tipográfica forte** — contraste de escala display/corpo, guiar
   o olho, dar drama editorial.
4. **Coerência** — espaçamento consistente, alinhamentos, remover a "cara de IA"
   (espaçamentos genéricos, centralização default, falta de intenção).

Resultado esperado: alguém abre o site e pensa "isto foi desenhado por alguém com
olho de moda", não "isto é um template bonitinho". Ousado, mas funcional. O motor
da seção 5 continua girando intacto; a carroceria fica de outro nível.
