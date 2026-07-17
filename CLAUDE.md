# CLAUDE.md

Contexto permanente do projeto. Leia este arquivo no início de toda sessão antes de qualquer tarefa. Se algo aqui conflitar com um pedido, pare e aponte o conflito em vez de adivinhar.

---

## 1. O que é este projeto (em uma frase)

Uma **vitrine multi-página de roupa feminina** que mostra as peças e a personal stylist, e converte a cliente para o **WhatsApp** — onde a dona fecha a venda e agenda os atendimentos de styling. Não é e-commerce transacional.

## 2. O que este projeto NÃO é (guardrails — nunca cruze sem aprovação explícita)

- **Não tem checkout, carrinho, pagamento, estoque transacional, frete nem cálculo fiscal.** A venda acontece no WhatsApp, fora do site.
- **Não tem conta de cliente, login de cliente nem área logada para quem compra.**
- **Não codamos sistema de autenticação.** O login da dona é o do CMS (Sanity Studio). Se precisar de "login", a resposta é "o Studio do Sanity", nunca "vou escrever auth".
- **Não tem bot/automação de WhatsApp.** São links `wa.me` simples com texto pré-preenchido.
- **Não invente categorias nem dados.** A taxonomia está fixada na seção 6. Se faltar uma, pergunte.

## 3. Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Estilo:** Tailwind CSS + CSS variables para os tokens de marca (seção 5)
- **CMS / login da dona:** Sanity (headless) — o Studio é a tela de admin dela
- **Imagens:** `next/image` + Sanity Image CDN (formato/resize/responsivo automáticos — obrigatório, ver seção 7)
- **Animação:** Framer Motion, com parcimônia (hero e micro-interações)
- **Hospedagem:** Vercel (deploy de preview por branch)
- Detalhes técnicos completos: `SDD.md`. Produto e escopo: `PRD.md`.

## 4. Princípio de design (decora isto)

**Marcante na pele, convencional no esqueleto.** A criatividade mora na identidade visual (cor, tipografia, movimento, fotografia, o painel-cascata). A navegação e os padrões de interação ficam onde a cliente espera. Nunca quebre convenção de navegação em nome de "ser diferente" — isso custa venda.

## 5. Tokens de marca

**A tabela completa e sempre atual vive em `DESIGN.md`** (front-matter +
"A foto é a tela") — não duplicar valores aqui, é o que causou o §5 antigo
ficar com nomes de token que não existem mais no código (`sand-200`/`300` —
removidos na Fase 5). Resumo do que importa saber sem abrir o outro arquivo:

- Base: `sand-50`/`sand-100` (areia clara) + `espresso` (único escuro de
  seção inteira, no máximo 1 seção escura por página).
- Três funções de cor fixas, nunca trocam de papel: `esmeralda` = agendamento,
  `bordo` = produto/desejo, `dourado` = linha/eyebrow (nunca texto sobre
  `bordo` — mede abaixo do mínimo AA de contraste, já medido e documentado
  em `DESIGN.md`).
- **Nunca cor chapada (painel/fundo de seção) atrás de texto corrido.** Cor
  forte só em composição com foto (bloco sangrando atrás/ao redor de uma
  imagem). Isso já foi violado uma vez (hero da Fase 4, painel bordô atrás do
  `<h1>`) e rejeitado pelo dono — não repetir.
- **Nunca degradê cruzando família de cor** (areia → espresso). Ritmo entre
  seções claras e escuras é corte limpo + entrada coreografada por scroll
  (`components/motion/`), não emenda esmaecida.

## 6. Catálogo: modelo de dados (a regra que impede duplicata)

Cada produto tem **uma categoria** (tipo de peça) e **várias tags** (cortes transversais). É isso que faz um blazer jeans ser cadastrado uma vez e achado como Casaco, como Denim e como Alfaiataria.

**Categorias (menu, mutuamente exclusivas):** Vestidos · Saias · Blusas & tops · Calças · Shorts & bermudas · Casacos & jaquetas · Tricô & suéteres · Macacões & macaquinhos · Acessórios.

**Tags / coleções (filtros, uma peça pode ter várias):** Novidades · Denim · Alfaiataria · Conjuntos · Festa · Estação (primavera-verão / outono-inverno).

**Regra de categoria vazia:** categoria sem nenhum produto em estoque **não aparece no menu** (some quando zera, volta quando estoca). Vale especialmente para Shorts (verão) e Tricô (inverno), que são sazonais opostos.

## 7. Regras técnicas inegociáveis

- **Desktop lidera o desenho; mobile é derivado por responsividade** (decisão
  explícita do dono, Fase 4 — ver `docs/PROGRESS.md`). Isto **substitui** a
  regra antiga "desenhe o mobile primeiro": construir mobile-first e adaptar
  pro desktop depois foi a causa raiz de "fica de um jeito no computador e de
  outro no celular" ao longo de várias rodadas — a causa real não era a ordem
  de escrita do CSS, era falta de verificação visual do desktop. **A maioria
  das clientes ainda está no celular** (isso não mudou — hover não existe lá,
  o menu vira acordeão de tocar), então mobile continua tão verificado quanto
  desktop; só a ordem de composição virou desktop → mobile, não o inverso.
- **Toda imagem passa por otimização** (`next/image` + Sanity CDN). Nunca renderize `<img>` cru com arquivo pesado. Vitrine lenta = cliente perdida na primeira tela.
- **WhatsApp com texto pré-preenchido e diferente por contexto** (ver SDD): o botão de peça leva o nome do produto; o de agendamento leva a intenção de styling. Nunca dois links em branco iguais.
- **Acessibilidade:** alt em imagem, contraste adequado (cuidado com texto sobre areia e sobre espresso), foco visível, navegável por teclado.
- **SEO:** páginas estáticas (SSG/ISR), metadados por página, sitemap. A loja precisa ser achada.

## 8. Protocolo de trabalho (siga em TODA tarefa)

Você (agente) sempre fecha uma unidade de trabalho com estes passos, nesta ordem:

1. **Verifique de verdade antes de dizer que terminou.** Medir DOM
   (`getBoundingClientRect`/`getComputedStyle`) prova estrutura, não prova
   composição visual — várias rodadas deste projeto declararam "verificado"
   uma coisa que, ao olho, estava quebrada (ex.: o bug de `font-[450]`
   renderizando como 500 que o `getComputedStyle` não detectava; o
   auto-scroll do scroll-snap que só apareceu numa captura de tela real).
   Rodar em dois viewports isolados (desktop largo + mobile) é o mínimo;
   **o dono no navegador real dele é o gate final, não substituível por
   medição.**
2. **Não fature tudo de uma vez.** Fases pequenas com checkpoint do dono
   entre elas — ele já pediu isso explicitamente mais de uma vez. Se o
   pedido for grande, proponha as fases antes de implementar.
3. **Atualize o estado.** Edite `docs/PROGRESS.md`: o que ficou pronto, o que está pendente, qual o próximo passo. É a sua memória entre sessões — nunca se perca por não ter lido/escrito aqui.
4. **Valide por comportamento observável.** O dono valida pela tela, não lendo código. Entregue uma checklist do que ele deve conseguir VER ou FAZER para confirmar que funcionou. Liste qualquer ponto de incerteza honestamente — se há risco de lógica, diga, não esconda.
5. **Entregue o próximo prompt.** Termine sempre com o prompt exato que o dono deve colar para iniciar o próximo passo. Curto, acionável, um passo de cada vez.

## 9. Git (mudança bem definida por commit)

- **Conventional Commits:** `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `style:`, `test:`.
- **Branch por feature:** `feat/<slug-curto>`, `fix/<slug-curto>`. Saia de `main`, abra PR, faça merge, apague a branch.
- **Uma mudança lógica por commit.** Commits pequenos e legíveis. PRs pequenos.
- Branch curta — não acumule semanas de trabalho numa só. Merge cedo, merge frequente.
- O processo serve o projeto, não o contrário. Não transforme git em cerimônia.

## 10. Definição de "pronto" (por tarefa)

Uma tarefa só está pronta quando: funciona no mobile, as imagens estão otimizadas, o estado em `PROGRESS.md` foi atualizado, a checklist de validação foi entregue, e o próximo prompt foi passado ao dono.
