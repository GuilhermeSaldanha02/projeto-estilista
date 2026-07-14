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

Base areia clara, drama concentrado em poucos pontos.

| Token | Hex | Uso |
|---|---|---|
| `--sand-50` | `#F4EFE6` | superfície de card de produto (quase branco quente) |
| `--sand-100` | `#EDE3D2` | fundo de seção claro |
| `--sand-200` | `#E7DBC8` | base areia (área dominante) |
| `--sand-300` | `#DCCBB0` | ponta escura do degradê de areia |
| `--espresso` | `#241C17` | faixas escuras: header, footer, destaque, painel-cascata |
| `--esmeralda` | `#0B5D46` | cor dominante de marca |
| `--esmeralda-light` | `#1D9A72` | hovers e detalhes |
| `--bordo` | `#7B1E3A` | só acento e CTA |
| `--dourado` | `#C2A14D` | linhas e ícones |
| `--ink` | `#1A1A1A` | texto sobre claro |
| `--cream-text` | `#F4EFE6` | texto sobre espresso |

**Regra do degradê (importante):** degradê dentro da família areia (ex.: `--sand-100` → `--sand-200`) é o padrão para textura de fundo dentro de uma seção — sutil, restrito a hero e faixas. Nunca degradê atrás de foto de produto (suja a leitura da roupa). Gradiente forte e genérico é sinal de "cara de IA" — evite.

**Exceção revogada (2026-07-12):** a "costura" cruzando família de cor (areia → espresso) foi removida de toda a vitrine e do `/stylist` — virava sempre uma faixa taupe barrenta (marrom quase sem croma esmaecido sobre claro é matematicamente sujo, não é ajuste de valor). Regra restaurada sem nuance: **nunca degradê cruzando família de cor.** Ritmo entre seções claras e escuras se faz por corte limpo + entrada coreografada por scroll (Framer/`FadeInSection`), não por emenda esmaecida. Lenis (scroll suave) foi cortado do sistema na Fase 3 do redesign de 2026-07-13 — scroll nativo do navegador.

## 6. Catálogo: modelo de dados (a regra que impede duplicata)

Cada produto tem **uma categoria** (tipo de peça) e **várias tags** (cortes transversais). É isso que faz um blazer jeans ser cadastrado uma vez e achado como Casaco, como Denim e como Alfaiataria.

**Categorias (menu, mutuamente exclusivas):** Vestidos · Saias · Blusas & tops · Calças · Shorts & bermudas · Casacos & jaquetas · Tricô & suéteres · Macacões & macaquinhos · Acessórios.

**Tags / coleções (filtros, uma peça pode ter várias):** Novidades · Denim · Alfaiataria · Conjuntos · Festa · Estação (primavera-verão / outono-inverno).

**Regra de categoria vazia:** categoria sem nenhum produto em estoque **não aparece no menu** (some quando zera, volta quando estoca). Vale especialmente para Shorts (verão) e Tricô (inverno), que são sazonais opostos.

## 7. Regras técnicas inegociáveis

- **Mobile-first.** A maioria das clientes está no celular. Hover não existe lá — o menu-cascata vira acordeão de tocar. Desenhe o mobile primeiro, o desktop é o aprimoramento.
- **Toda imagem passa por otimização** (`next/image` + Sanity CDN). Nunca renderize `<img>` cru com arquivo pesado. Vitrine lenta = cliente perdida na primeira tela.
- **WhatsApp com texto pré-preenchido e diferente por contexto** (ver SDD): o botão de peça leva o nome do produto; o de agendamento leva a intenção de styling. Nunca dois links em branco iguais.
- **Acessibilidade:** alt em imagem, contraste adequado (cuidado com texto sobre areia e sobre espresso), foco visível, navegável por teclado.
- **SEO:** páginas estáticas (SSG/ISR), metadados por página, sitemap. A loja precisa ser achada.

## 8. Protocolo de trabalho (siga em TODA tarefa)

Você (agente) sempre fecha uma unidade de trabalho com estes três passos, nesta ordem:

1. **Atualize o estado.** Edite `docs/PROGRESS.md`: o que ficou pronto, o que está pendente, qual o próximo passo. É a sua memória entre sessões — nunca se perca por não ter lido/escrito aqui.
2. **Valide por comportamento observável.** O dono valida pela tela, não lendo código. Entregue uma checklist do que ele deve conseguir VER ou FAZER para confirmar que funcionou (ex.: "abra `/categoria/vestidos` no celular: o menu vira acordeão; as fotos carregam em < 2s; o botão WhatsApp abre conversa com o nome da peça"). Liste qualquer ponto de incerteza honestamente — se há risco de lógica, diga, não esconda.
3. **Entregue o próximo prompt.** Termine sempre com o prompt exato que o dono deve colar para iniciar o próximo passo. Curto, acionável, um passo de cada vez.

## 9. Git (mudança bem definida por commit)

- **Conventional Commits:** `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `style:`, `test:`.
- **Branch por feature:** `feat/<slug-curto>`, `fix/<slug-curto>`. Saia de `main`, abra PR, faça merge, apague a branch.
- **Uma mudança lógica por commit.** Commits pequenos e legíveis. PRs pequenos.
- Branch curta — não acumule semanas de trabalho numa só. Merge cedo, merge frequente.
- O processo serve o projeto, não o contrário. Não transforme git em cerimônia.

## 10. Definição de "pronto" (por tarefa)

Uma tarefa só está pronta quando: funciona no mobile, as imagens estão otimizadas, o estado em `PROGRESS.md` foi atualizado, a checklist de validação foi entregue, e o próximo prompt foi passado ao dono.
