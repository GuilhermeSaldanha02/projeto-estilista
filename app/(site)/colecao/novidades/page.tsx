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
    <main className="min-h-screen">
      <div className="relative bg-gradient-to-b from-sand-100 to-sand-200 py-16 md:py-20 px-5">
        <div className="relative z-10 max-w-7xl mx-auto">
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-ink-soft mb-4">
            {products.length} {products.length === 1 ? 'peça' : 'peças'}
          </p>
          <div className="w-10 h-px bg-dourado/40 mb-5" />
          <h1 className="font-display text-5xl md:text-6xl font-medium text-ink tracking-tight">
            Novidades
          </h1>
        </div>
      </div>

      <div className="py-10 px-5 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </main>
  )
}
