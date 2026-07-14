'use client'

import { useMemo, useState } from 'react'
import ProductCard, { type ProductCardData } from '@/components/ProductCard'

// Fase 4c (Vitrine em Movimento — "as opções" do pedido de remodelação): as
// páginas de catálogo (categoria, coleção, novidades) não tinham nenhum
// controle de ordenação ou filtro. Componente client compartilhado pelas
// três: sort roda em cima da lista já buscada no servidor (sem round-trip),
// e o filtro por categoria só aparece quando a lista de fato mistura mais de
// uma categoria (coleção/novidades) — em /categoria/[slug] a lista já vem
// de uma única categoria, então os chips nunca renderizam ali.
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

export default function SortableProductGrid({ products }: { products: FilterableProduct[] }) {
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

  return (
    <div>
      {/* Contador único, calculado a partir da lista já filtrada — antes vivia
          estático no Server Component da página (banner) e ficava dessincronizado
          do grid depois de filtrar (achado do code review do PR #41). aria-live
          avisa leitor de tela quando o filtro/sort muda a contagem. */}
      <p aria-live="polite" className="font-sans text-[10px] tracking-[0.4em] uppercase text-ink-soft mb-5">
        {visible.length} {visible.length === 1 ? 'peça' : 'peças'}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
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
                  : 'text-ink-soft border-sand-200 hover:border-ink-soft'
              }`}
            >
              Todas
            </button>
            {categoryChips.map(([slug, title]) => (
              <button
                type="button"
                key={slug}
                onClick={() => setActiveCategory(slug)}
                aria-pressed={activeCategory === slug}
                className={`font-sans text-[10px] tracking-widest uppercase px-4 py-2 border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-bordo focus-visible:outline-offset-2 ${
                  activeCategory === slug
                    ? 'bg-espresso text-cream-text border-espresso'
                    : 'text-ink-soft border-sand-200 hover:border-ink-soft'
                }`}
              >
                {title}
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
            className="border border-sand-200 bg-sand-50 text-ink px-3 py-2 font-sans text-[10px] tracking-widest uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-bordo focus-visible:outline-offset-2"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="font-sans text-sm text-ink-soft py-16 text-center">
          Nenhuma peça encontrada com esse filtro.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {visible.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
