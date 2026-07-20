'use client'

import { useMemo, useState } from 'react'
import ProductCard, { type ProductCardData } from '@/components/ui/ProductCard'
import SectionHeading from '@/components/ui/SectionHeading'

/*
 * Fase 6 (Reconstrução da página de categoria) — template único de catálogo
 * para /vitrine, /categoria/[slug] e /colecao/[slug].
 *
 * A versão anterior (Fase 5) tratava o título como a primeira célula da
 * grade — a mesma decisão estrutural que tinha sido rejeitada e reconstruída
 * na Seleção da Luiza (home): texto e foto disputando altura na mesma linha
 * sempre volta como "solto"/desalinhado quando a foto é mais alta que o
 * texto. Aqui o cabeçalho sai da grade de vez e vira abertura de página —
 * título, régua, contagem — a grade abaixo é só produto.
 *
 * O achado do dono ("o vestido solto", "o nome da peça solto") não era sobre
 * onde o título fica na página — é sobre a foto do PRODUTO sobrando fundo de
 * estúdio em volta da peça, e o nome flutuando sem nada que o prenda à foto.
 * Corrigido no ProductCard (crop com zoom de ponto focal + nome/preço
 * colados na base da foto por uma régua), não aqui — mas a grade agora dá
 * espaço pra isso aparecer: com poucas peças (edição enxuta), os cards ficam
 * maiores (2 colunas, não 3) em vez de espremidos numa grade pensada pra
 * catálogo grande.
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

  // Tamanho de card alinhado com varejo de moda real (~280-300px de largura
  // no desktop, 4 colunas), não o card gigante que o dono viu: com 2 peças
  // em 2 colunas largas o card ficava ~430px e a foto ~570px de altura --
  // precisava ROLAR pra ver a peça inteira. Com poucas peças, em vez de
  // esticar o card, a grade é limitada e CENTRALIZADA: mesmo tamanho de
  // sempre, composição equilibrada.
  const count = filtered.length
  const gridClass =
    count <= 2
      ? 'grid-cols-2 max-w-[600px] mx-auto'
      : count === 3
        ? 'grid-cols-2 md:grid-cols-3 max-w-[920px] mx-auto'
        : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

  const chipClass = (active: boolean) =>
    `font-sans text-[10px] tracking-widest uppercase px-4 py-2 border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-bordo focus-visible:outline-offset-2 whitespace-nowrap ${
      active
        ? 'bg-espresso text-cream-text border-espresso'
        : 'text-ink-soft border-sand-200 hover:border-ink-soft'
    }`

  return (
    <section aria-label={title} className="px-[6vw] pt-10 md:pt-14 pb-24 md:pb-32">
      <div className="max-w-[1440px] mx-auto">
        {/* Padrão de cabeçalho do site (SectionHeading, variação A3): nome +
            losango dourado + contagem, centralizado e leve. Substitui o
            serif preto grande (o dono: "nome enorme preto não ficou bom").
            A foto da peça é que domina a tela. */}
        <SectionHeading
          as="h1"
          title={title}
          meta={`${String(filtered.length).padStart(2, '0')} ${filtered.length === 1 ? 'peça' : 'peças'}`}
          className="mb-8 md:mb-10"
        />

        {/* Controles: no lugar do traço reto full-width (que lia como linha
            solta), a régua vira um filete dourado que desvanece pra direita
            — mesmo motivo do campo dourado da home. Sem chips (categoria
            única), o lado esquerdo ganha um rótulo discreto pra o "Ordenar"
            não ficar órfão. */}
        {/* Tudo no eixo central pra casar com o cabeçalho centralizado (o
            "Ordenar" sozinho na direita brigava com o título no centro — o
            dono: "filtro desalinhado"). Chips e ordenação ficam centralizados;
            sem chips (categoria única), só a ordenação, também no centro. */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 min-h-11 mb-6 md:mb-7">
          {categoryChips.length > 1 && (
            <div
              className="flex gap-2 overflow-x-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
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

        {/* Filete simétrico (desvanece do centro pros lados) — casa com o
            eixo central; substitui o traço reto e o antigo fade lateral. */}
        <div className="h-px bg-gradient-to-r from-transparent via-dourado/45 to-transparent mb-10 md:mb-14" />

        {filtered.length === 0 ? (
          <p className="font-sans text-sm text-ink-soft py-16">
            Nenhuma peça encontrada com esse filtro.
          </p>
        ) : (
          <>
            {/* Card no tamanho de varejo real (~280-300px); com poucas peças
                a grade encolhe e centraliza em vez de inflar o card. */}
            <div className={`grid gap-5 md:gap-7 ${gridClass}`}>
              {visible.map(product => (
                <ProductCard key={product._id} product={product} onDark />
              ))}
            </div>

            {paginated && filtered.length > limit && (
              <div className="flex justify-center mt-16">
                <button
                  type="button"
                  onClick={() => setLimit(l => l + PAGE_SIZE)}
                  className="border border-dourado/40 text-dourado font-sans text-[11px] tracking-widest uppercase px-10 py-4 hover:bg-dourado hover:text-espresso transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-dourado focus-visible:outline-offset-2"
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
