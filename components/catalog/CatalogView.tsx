'use client'

import { useMemo, useState } from 'react'
import ProductCard, { type ProductCardData } from '@/components/ui/ProductCard'

/*
 * Fase 5 (Reconstrução) — template único de catálogo para /vitrine,
 * /categoria/[slug] e /colecao/[slug].
 *
 * A rejeição "banner gigante + grade solta" morre com uma decisão
 * estrutural: O CABEÇALHO É A PRIMEIRA CÉLULA DA GRADE, não uma faixa acima
 * dela. Título e produto dividem a mesma linha — impossível ler como "dois
 * blocos com vão". Acima da grade, só uma régua fina (h-12, hairlines) com
 * chips + ordenação — nunca um banner py-16.
 *
 * Grade em 3 colunas no desktop (não 4): cards maiores = fotografia com
 * escala. Com 1-3 peças, as células vazias ganham uma legenda de "edição
 * enxuta" — vazio com intenção declarada ≠ vazio quebrado.
 */
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

const PAGE_SIZE = 18

export default function CatalogView({
  title,
  products,
  showChips = false,
  paginated = false,
}: {
  title: string
  products: FilterableProduct[]
  /** true em /vitrine e /colecao (misturam categorias); false em /categoria */
  showChips?: boolean
  /** true só em /vitrine (catálogo inteiro) */
  paginated?: boolean
}) {
  const [sortBy, setSortBy] = useState<SortKey>('recent')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [limit, setLimit] = useState(PAGE_SIZE)

  const categoryChips = useMemo(() => {
    if (!showChips) return []
    const seen = new Map<string, string>()
    for (const p of products) {
      if (p.categorySlug && p.categoryTitle && !seen.has(p.categorySlug)) {
        seen.set(p.categorySlug, p.categoryTitle)
      }
    }
    return [...seen.entries()]
  }, [products, showChips])

  const filtered = useMemo(() => {
    const base = activeCategory
      ? products.filter(p => p.categorySlug === activeCategory)
      : products
    if (sortBy === 'recent') return base
    const sorted = [...base]
    if (sortBy === 'price-asc') sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity))
    if (sortBy === 'price-desc') sorted.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity))
    return sorted
  }, [products, sortBy, activeCategory])

  const visible = paginated ? filtered.slice(0, limit) : filtered
  const isSmallEdition = filtered.length > 0 && filtered.length <= 3
  // Só desenha a célula de "edição enxuta" quando de fato sobra vaga na
  // última linha do grid desktop (md:grid-cols-3, cabeçalho + produtos).
  // Achado do code review do PR #44: com N=2, cabeçalho+2 produtos já
  // fecham a linha (3 células) — desenhar a legenda sem vaga real criava
  // uma segunda linha inteira quase vazia. emptyCells vira 1 ou 2 (nunca 0
  // quando isSmallEdition é true e há vaga) e vira o span da própria célula.
  const totalCells = 1 + visible.length
  const emptyCells = isSmallEdition ? (3 - (totalCells % 3)) % 3 : 0

  const chipClass = (active: boolean) =>
    `font-sans text-[10px] tracking-widest uppercase px-4 py-2 border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-bordo focus-visible:outline-offset-2 whitespace-nowrap ${
      active
        ? 'bg-espresso text-cream-text border-espresso'
        : 'text-ink-soft border-sand-200 hover:border-ink-soft'
    }`

  return (
    <section aria-label={title} className="px-[6vw] pt-10 md:pt-14 pb-24 md:pb-32">
      <div className="max-w-[1440px] mx-auto">
        {/* Régua de controles: fina, com hairlines — não é banner */}
        <div className="flex items-center justify-between gap-4 border-y border-ink/10 min-h-12 py-2 mb-10 md:mb-14">
          {categoryChips.length > 1 ? (
            <div
              className="flex gap-2 overflow-x-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:none]"
              role="group"
              aria-label="Filtrar por categoria"
            >
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                aria-pressed={activeCategory === null}
                className={chipClass(activeCategory === null)}
              >
                Todas
              </button>
              {categoryChips.map(([slug, catTitle]) => (
                <button
                  type="button"
                  key={slug}
                  onClick={() => setActiveCategory(slug)}
                  aria-pressed={activeCategory === slug}
                  className={chipClass(activeCategory === slug)}
                >
                  {catTitle}
                </button>
              ))}
            </div>
          ) : (
            <div />
          )}

          <label className="flex items-center gap-2 font-sans text-[10px] tracking-widest uppercase text-ink-soft shrink-0">
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

        {filtered.length === 0 ? (
          <div>
            <CatalogHeaderCell title={title} count={0} />
            <p className="font-sans text-sm text-ink-soft py-16">
              Nenhuma peça encontrada com esse filtro.
            </p>
          </div>
        ) : (
          <>
            <div
              className={`grid grid-cols-2 md:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-12 md:gap-y-16 ${
                isSmallEdition ? 'max-w-5xl' : ''
              }`}
            >
              {/* Célula 1 da grade: o cabeçalho. Divide a linha de base com
                  os primeiros produtos — um bloco só, sem vão. */}
              <CatalogHeaderCell title={title} count={filtered.length} />

              {visible.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}

              {/* Edição pequena: só desenha quando sobra vaga real na linha */}
              {emptyCells > 0 && (
                <div
                  className={`hidden md:flex items-end pb-8 ${emptyCells === 2 ? 'md:col-span-2' : ''}`}
                  aria-hidden="true"
                >
                  <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-ink-soft [writing-mode:vertical-rl]">
                    Edição enxuta — curadoria da semana
                  </span>
                </div>
              )}
            </div>

            {paginated && filtered.length > limit && (
              <div className="flex justify-center mt-16">
                <button
                  type="button"
                  onClick={() => setLimit(l => l + PAGE_SIZE)}
                  className="border border-ink/20 text-ink font-sans text-[11px] tracking-widest uppercase px-10 py-4 hover:border-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-bordo focus-visible:outline-offset-2"
                >
                  Carregar mais ({filtered.length - limit})
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

function CatalogHeaderCell({ title, count }: { title: string; count: number }) {
  return (
    <header className="flex flex-col justify-end pb-2 col-span-2 md:col-span-1">
      <h1 className="font-display text-[clamp(2rem,4vw,2.75rem)] font-[450] text-ink tracking-tight [text-wrap:balance] mb-4">
        {title}
      </h1>
      <div className="w-8 h-px bg-dourado/40 mb-3" />
      <p aria-live="polite" className="font-sans text-[10px] tracking-[0.4em] uppercase text-ink-soft">
        {count} {count === 1 ? 'peça' : 'peças'}
      </p>
    </header>
  )
}
