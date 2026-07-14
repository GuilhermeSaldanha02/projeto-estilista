'use client'

import { useMemo, useState } from 'react'
import ProductCard, { type ProductCardData } from '@/components/ProductCard'

// Fase 4c/4d (Vitrine em Movimento). Era SortableProductGrid: título, contador
// e filtro/sort viviam em componentes/blocos separados (H1 no Server Component
// da página, o resto aqui) — o dono viu ao vivo e achou "solto, não harmônico"
// (screenshot da página Saias). Motivo raiz: título e controles ficavam em
// duas seções com padding de página inteira entre eles, sem nenhum elemento
// visual ligando os dois. Agora tudo mora no MESMO bloco (banner sand), só o
// grid de produtos abre uma seção nova abaixo — um único cabeçalho coeso,
// depois o conteúdo.
export type FilterableProduct = ProductCardData & {
  categorySlug?: string
  categoryTitle?: string
}

type SortKey = 'recent' | 'price-asc' | 'price-desc'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'recent', label: 'Mais recentes' },
  { value: 'price-asc', label: 'Menor preço' },
  { value: 'price-desc', label: 'Maior preço' },
]

export default function ProductCatalog({
  title,
  products,
  headingLevel = 'h1',
}: {
  title: string
  products: FilterableProduct[]
  /** 'h2' quando o catálogo é embutido numa página que já tem seu próprio h1
   *  (ex.: a seção Novidades da home, dentro do h1 do hero) — nunca duplicar h1. */
  headingLevel?: 'h1' | 'h2'
}) {
  const [sortBy, setSortBy] = useState<SortKey>('recent')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Categorias distintas presentes na lista, na ordem de primeira aparição —
  // como products chega ordenado por _createdAt desc do servidor, isso vira
  // "categoria com a peça mais recente aparece primeiro no filtro" de graça.
  const categoryChips = useMemo(() => {
    const seen = new Map<string, string>()
    for (const p of products) {
      if (p.categorySlug && p.categoryTitle && !seen.has(p.categorySlug)) {
        seen.set(p.categorySlug, p.categoryTitle)
      }
    }
    return [...seen.entries()]
  }, [products])

  const visible = useMemo(() => {
    const filtered = activeCategory
      ? products.filter(p => p.categorySlug === activeCategory)
      : products

    if (sortBy === 'recent') return filtered

    // Sort estável (Array.prototype.sort em engines modernas) preserva o
    // desempate por _createdAt quando o preço é igual.
    const sorted = [...filtered]
    if (sortBy === 'price-asc') sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity))
    if (sortBy === 'price-desc') sorted.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity))
    return sorted
  }, [products, sortBy, activeCategory])

  const Heading = headingLevel

  // Grade com poucas peças (ex.: categoria com só 2 produtos) esticada em
  // grid-cols-4 deixava um vazio enorme à direita — lia como "cru"/quebrado,
  // não como "seleção pequena por design" (achado do dono, screenshot de
  // /categoria/vestidos). Capar colunas E largura máxima pelo nº de peças
  // visíveis evita tanto o vazio quanto cards gigantes esticados por um
  // grid-cols-2 sozinho numa tela larga.
  const GRID_LAYOUT: Record<number, { cols: string; maxW: string }> = {
    1: { cols: 'grid-cols-1', maxW: 'max-w-[300px]' },
    2: { cols: 'grid-cols-2', maxW: 'max-w-2xl' },
    3: { cols: 'grid-cols-2 md:grid-cols-3', maxW: 'max-w-4xl' },
  }
  const layout = GRID_LAYOUT[visible.length] ?? {
    cols: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    maxW: '',
  }

  return (
    <section aria-label={title}>
      {/* Cabeçalho único: título + contador + filtro/sort no mesmo bloco —
          antes eram 2 blocos de página inteira separados (achado do dono).
          <section aria-label> aqui (não na <div> de antes): achado do code
          review do PR #42 -- a home usava <section aria-label="Novidades">
          antes desta refatoração, perdido na troca para ProductCatalog. */}
      <div className="relative bg-gradient-to-b from-sand-100 to-sand-200 py-16 md:py-20 px-5">
        <div className="relative z-10 max-w-7xl mx-auto">
          <Heading className="font-display text-[clamp(2rem,4vw,2.75rem)] font-[450] text-ink tracking-tight [text-wrap:balance]">
            {title}
          </Heading>

          <p aria-live="polite" className="font-sans text-[10px] tracking-[0.4em] uppercase text-ink-soft mt-4 mb-6">
            {visible.length} {visible.length === 1 ? 'peça' : 'peças'}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Chips só aparecem quando a lista mistura 2+ categorias */}
            {categoryChips.length > 1 ? (
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
                <button
                  type="button"
                  onClick={() => setActiveCategory(null)}
                  aria-pressed={activeCategory === null}
                  className={`font-sans text-[10px] tracking-widest uppercase px-4 py-2 border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-bordo focus-visible:outline-offset-2 ${
                    activeCategory === null
                      ? 'bg-espresso text-cream-text border-espresso'
                      : 'text-ink-soft border-sand-300 hover:border-ink-soft'
                  }`}
                >
                  Todas
                </button>
                {categoryChips.map(([slug, catTitle]) => (
                  <button
                    type="button"
                    key={slug}
                    onClick={() => setActiveCategory(slug)}
                    aria-pressed={activeCategory === slug}
                    className={`font-sans text-[10px] tracking-widest uppercase px-4 py-2 border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-bordo focus-visible:outline-offset-2 ${
                      activeCategory === slug
                        ? 'bg-espresso text-cream-text border-espresso'
                        : 'text-ink-soft border-sand-300 hover:border-ink-soft'
                    }`}
                  >
                    {catTitle}
                  </button>
                ))}
              </div>
            ) : (
              <div />
            )}

            <label className="flex items-center gap-2 font-sans text-[10px] tracking-widest uppercase text-ink-soft">
              Ordenar
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortKey)}
                className="border border-sand-300 bg-sand-50 text-ink px-3 py-2 font-sans text-[10px] tracking-widest uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-bordo focus-visible:outline-offset-2"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* Conteúdo: seção nova, com seu próprio respiro — nunca cola no cabeçalho */}
      <div className="py-10 px-5 max-w-7xl mx-auto">
        {visible.length === 0 ? (
          <p className="font-sans text-sm text-ink-soft py-16 text-center">
            Nenhuma peça encontrada com esse filtro.
          </p>
        ) : (
          <div className={`grid gap-4 md:gap-6 ${layout.cols} ${layout.maxW}`}>
            {visible.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
