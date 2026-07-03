import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import ProductCard, { type ProductCardData } from '@/components/ProductCard'
import EmptyState from '@/components/EmptyState'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Novidades',
  description: 'As peças mais recentes da LT Studio, de todas as categorias.',
}

const novidsQuery = `
  *[_type == "product" && inStock == true]
  | order(_createdAt desc)
  [0...12] {
    _id, title, "slug": slug.current, price,
    "image": images[0] { asset, crop, hotspot, alt }
  }
`

export default async function NovidadesPage() {
  const products = await client.fetch<ProductCardData[]>(novidsQuery)

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
    <main className="min-h-screen py-10 px-5 max-w-7xl mx-auto">
      <h1 className="font-display text-3xl md:text-4xl font-light text-ink tracking-wide mb-8">
        Novidades
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </main>
  )
}
