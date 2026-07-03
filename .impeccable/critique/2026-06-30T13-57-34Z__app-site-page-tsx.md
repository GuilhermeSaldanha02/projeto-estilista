---
target: app/(site)/page.tsx
total_score: 22
p0_count: 1
p1_count: 2
timestamp: 2026-06-30T13-57-34Z
slug: app-site-page-tsx
---
## Design Health Score

| # | Heurística | Score | Achado principal |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Sem loading states na grade; vídeo hero com preload=none sem feedback |
| 2 | Match System / Real World | 3 | Vocabulário de moda correto; "Em destaque" no mega-menu é ambíguo |
| 3 | User Control and Freedom | 2 | Sem breadcrumb na categoria; mobile menu sem fechar ao tocar fora |
| 4 | Consistency and Standards | 2 | h2 em ProductCard incorreto; ícone WhatsApp inconsistente no WaButton |
| 5 | Error Prevention | 3 | WhatsApp degrada graciosamente; empty states tratados |
| 6 | Recognition Rather Than Recall | 3 | Navegação clara; página Stylist sem âncoras de progresso |
| 7 | Flexibility and Efficiency | 1 | Sem filtros na categoria; sem busca; Novidades enterrado no mega-menu |
| 8 | Aesthetic and Minimalist Design | 3 | Sistema visual controlado; dual CTAs de peso igual no hero |
| 9 | Error Recovery | 2 | Página "Peça não encontrada" existe mas não sugere alternativas |
| 10 | Help and Documentation | 1 | Nenhuma explicação do processo pós-WhatsApp no ponto de conversão |
| **Total** | | **22/40** | **Acceptable** |

## Anti-Patterns Verdict

App Next.js passa detector com zero findings. HTML protótipos (não commitados) têm 82 findings incluindo Cormorant Garamond (reflex-reject) e cores fora da paleta.

AI grammar acumulada: eyebrow + divisória dourada em 9+ seções; dual CTA de peso igual no hero; subheadline descritiva não aspiracional.

## Priority Issues

P0: Hero com dois CTAs de peso igual — paralisia de decisão
P1: Sem voz editorial entre hero e grade de produtos
P1: Sem reassurance no ponto de conversão WhatsApp
P2: Categoria é dump de produtos sem filtro/voz/curadoria
P3: Eyebrow + divisória dourada saturados em toda seção

## Persona Red Flags

Jordan: sem hierarquia no hero, sem scaffolding pré-WhatsApp, bounce provável
Casey: sem sticky CTA no produto; thumbnails inativas no mobile; Novidades no final do menu mobile
Isabela: sem rota /colecao/denim; sem indicador de data/novidade nos produtos

## Minor Observations

h2 em ProductCard semanticamente errado; WaButton inconsistente com ícone; border-t-2 no footer; bg-ink vs bg-espresso no mega-menu; thumbnails sem lightbox; hero subheadline max-w-xs desperdiça o espaço do hero em telas grandes
