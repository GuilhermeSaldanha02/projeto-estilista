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
      {/* Sem eyebrow/linha aqui: contador de peças agora é dinâmico e mora
          dentro de SortableProductGrid (achado do code review do PR #41). */}
      <div className="relative bg-gradient-to-b from-sand-100 to-sand-200 py-16 md:py-20 px-5">
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className="font-display text-[clamp(2rem,4vw,2.75rem)] font-[450] text-ink tracking-tight">
            Novidades
          </h1>
        </div>
      </div>

      <div className="py-10 px-5 max-w-7xl mx-auto">
        <SortableProductGrid key="novidades" products={products} />
      </div>
    </main>
  )
}
