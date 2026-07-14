import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import EmptyState from '@/components/EmptyState'
import ProductCatalog, { type FilterableProduct } from '@/components/catalog/ProductCatalog'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Novidades',
  description: 'As peças mais recentes da LT Studio, de todas as categorias.',
}

// categorySlug/categoryTitle: página cruza todas as categorias por definição,
// então os chips de filtro do ProductCatalog quase sempre aparecem aqui.
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
      <ProductCatalog key="novidades" title="Novidades" products={products} />
    </main>
  )
}
