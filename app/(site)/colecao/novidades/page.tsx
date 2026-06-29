import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import ProductCard, { type ProductCardData } from '@/components/ProductCard'

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
      <main className="min-h-[60vh] flex flex-col items-center justify-center text-center px-5">
        <p className="font-sans text-[10px] tracking-widest uppercase text-ink/40 mb-4">
          LT Studio
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-light text-ink mb-3">Novidades</h1>
        <p className="font-sans text-sm text-ink/60 mb-8 max-w-xs">
          Em breve novidades chegando. Volte logo!
        </p>
        <Link
          href="/"
          className="font-sans text-[10px] tracking-widest uppercase text-espresso hover:text-bordo transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-bordo focus-visible:outline-offset-4"
        >
          ← Voltar ao início
        </Link>
      </main>
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
