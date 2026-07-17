# PRD — Vitrine de roupa feminina + personal stylist

> **Nome real em produção: "LT Studio"** (rebrand aplicado em `feat/rebrand-lt-studio`,
> ver `docs/PROGRESS.md`). Este documento é agnóstico de marca de propósito — os
> conceitos abaixo valem independente do nome — mas toda referência a "a loja"/"o
> site" no dia a dia deve usar "LT Studio". _(Reconciliado em 2026-07-10 — item 6 do
> plano de retomada.)_

## 1. Problema

Uma personal stylist quer (a) mostrar as roupas que vende e (b) converter visitantes em duas ações: comprar uma peça e agendar um atendimento de styling. Hoje isso depende de Instagram e mensagens soltas, sem um lugar próprio que organize o catálogo e direcione o contato. O diferencial do negócio é a **pessoa** — a stylist —, não a loja em si. A loja existe para alimentar o contato com ela.

## 2. Usuários

- **A dona (personal stylist):** publica produtos, fotos e novidades sozinha, sem depender de desenvolvedor, e recebe os contatos pelo WhatsApp. Acessa pelo Studio do Sanity (o login dela).
- **A cliente (compradora):** navega pelo celular, procura uma peça ou se interessa pelo serviço de styling, e fecha pelo WhatsApp. Não cria conta, não tem carrinho.

## 3. Objetivos

- Apresentar o catálogo feminino de forma rápida, escaneável e marcante.
- Dar destaque à personal stylist logo após o hero, com uma via clara de agendamento.
- Converter para o WhatsApp com contexto (a dona sabe se o contato é sobre peça ou sobre styling).
- Permitir que a dona atualize tudo sozinha.

## 4. Não-objetivos (escopo cortado, de propósito)

Estas coisas estavam na ideia original e foram removidas por boa razão. Não voltam no v1.

- E-commerce transacional: checkout, carrinho, pagamento, estoque, frete, fiscal. → A venda fecha no WhatsApp.
- Automação/bot de agendamento via WhatsApp API. → É um link `wa.me` manual.
- Painel administrativo e autenticação próprios. → É o Studio do Sanity.
- Conta de cliente, login de comprador, lista de desejos com conta.
- Calçados (a loja é só roupa).

## 5. As duas jornadas (o coração do produto)

1. **Peça → WhatsApp:** cliente navega → vê uma peça → clica "Quero esta peça" → abre o WhatsApp já com o nome do produto na mensagem.
2. **Stylist → WhatsApp:** cliente conhece a stylist → clica "Agendar horário" → abre o WhatsApp já com a intenção de styling na mensagem.

## 6. Taxonomia do catálogo

**Categorias (tipo de peça — menu):** Vestidos · Saias · Blusas & tops · Calças · Shorts & bermudas · Casacos & jaquetas · Tricô & suéteres · Macacões & macaquinhos · Acessórios.

**Coleções/tags (cortes transversais — filtros):** Novidades · Denim · Alfaiataria · Conjuntos · Festa · Estação.

Produto = 1 categoria + N tags. Categoria sem estoque some do menu (regra sazonal).

## 7. Features do v1 (MVP — o mínimo para lançar e começar a converter)

_Atualizado na Fase 5 (reconstrução completa) — nomes de rota e composição da
home mudaram; o escopo de produto abaixo continua o mesmo._

- **Home:** hero com vídeo em loop mudo de fundo (S1) → seleção curada da
  dona com nota da stylist (S2) → portais de categoria (S3) → fila de
  novidades (S4) → convite à consultoria com a stylist em destaque, botão
  "Agendar horário" (S5, última seção — não mais "segunda dobra": a curadoria
  de produto vem antes, a stylist fecha a página). _(A "faixa fixa no topo"
  desta lista original nunca foi construída — decisão já registrada, não
  recuperar sem pedido novo.)_
- **`/consultoria`** (era `/stylist`): sobre a personal stylist + botão
  "Agendar horário" (→ WhatsApp).
- **Navegação:** "Vitrine" (link + mega-menu de categorias no hover) e
  "Consultoria" no header; sem bloco de destaque de novidades no menu — a
  seção de novidades já vive com destaque na home e em `/vitrine`.
- **Página de categoria** (1 template, serve todas as categorias): grade de
  produtos, escaneável.
- **Página de produto** (1 template, serve todas as peças): fotos, descrição,
  botão "Quero esta peça" (→ WhatsApp com o nome), seção "Combina com" (4
  peças da mesma categoria).
- **`/vitrine`** (era "página de coleção/novidades"): catálogo completo,
  único lugar com filtro por categoria + ordenação.
- **CMS configurado:** a dona cadastra produto (1 categoria + tags), sobe fotos, marca novidade — tudo otimizado.

## 8. Depois (só quando o v1 provar que vale)

Subcategorias (vestido curto/midi/longo/festa); filtros de coleção mais ricos; contagem regressiva de promoção real; página "sobre a loja"/contato dedicada; e — só se a demanda de agendamento sufocar a dona — automação de WhatsApp. Nada disso entra agora.

## 9. MVP Gate

Antes de adicionar qualquer item da seção 8, o v1 precisa estar no ar e a dona precisa estar recebendo e respondendo contatos pelo WhatsApp. Funcionalidade nova só entra contra demanda real observada, não contra hipótese.

## 10. Sinais de sucesso

- A dona publica uma peça nova sozinha, sem ajuda.
- Uma cliente chega ao WhatsApp já com o contexto certo (peça ou styling).
- A vitrine carrega rápido no celular (fotos em poucos segundos).
- A stylist aparece com destaque, não enterrada.
