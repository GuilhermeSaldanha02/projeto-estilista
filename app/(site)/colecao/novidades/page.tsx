import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import EmptyState from '@/components/EmptyState'
import SortableProductGrid, { type FilterableProduct } from '@/components/catalog/SortableProductGrid'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Novidades',
  description: 'As peças mais recentes da LT Studio, de todas as categorias.',
}

// categorySlug/categoryTitle: página cruza todas as categorias por definição,
// então os chips de filtro do SortableProductGrid quase sempre aparecem aqui.
const novidsQuery = `
  *[_type == "product" && inStock == true]
  | order(_createdAt desc)
  [0...12] {
    _id, title, "slug": slug.current, price,
    "image": images[0] { asset, crop, hotspot, alt },
    "categorySlug": category->slug.current,
    "categoryTitle": category->title
  }
`

export default async function NovidadesPage() {
  const products = await client.fetch<FilterableProduct[]>(novidsQuery)

  if (products.length === 0) {
    return (
      <EmptyState
        headline="Novas peças em breve."
        body="A stylist está preparando uma nova seleção. Volte logo — ou agende um atendimento personalizado."
        primaryHref="/stylist"
        primaryLabel="Conheça a stylist"
        secondaryHref="/"
        secondaryLabel="← Início"
      />
    )
  }

  return (
    <main className="min-h-screen">
      <div className="relative bg-gradient-to-b from-sand-100 to-sand-200 py-16 md:py-20 px-5">
        <div className="relative z-10 max-w-7xl mx-auto">
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-ink-soft mb-4">
            {products.length} {products.length === 1 ? 'peça' : 'peças'}
          </p>
          <div className="w-10 h-px bg-dourado/40 mb-5" />
          <h1 className="font-display text-[clamp(2rem,4vw,2.75rem)] font-[450] text-ink tracking-tight">
            Novidades
          </h1>
        </div>
      </div>

      <div className="py-10 px-5 max-w-7xl mx-auto">
        <SortableProductGrid products={products} />
      </div>
    </main>
  )
}
