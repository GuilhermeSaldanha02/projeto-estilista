import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import ProductCard, { type ProductCardData } from '@/components/ProductCard'

// ISR — SDD §1: catálogo reflete o que a dona publica sem rebuild manual
export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

type Category = { _id: string; title: string; slug: string }

const categoryQuery = `
  *[_type == "category" && slug.current == $slug][0] {
    _id, title, "slug": slug.current
  }
`

const productsQuery = `
  *[_type == "product" && category->slug.current == $slug && inStock == true]
  | order(_createdAt desc) {
    _id, title, "slug": slug.current, price,
    "image": images[0] { asset, crop, hotspot, alt }
  }
`

const allCategorySlugsQuery = `
  *[_type == "category"
    && count(*[_type == "product" && references(^._id) && inStock == true]) > 0
  ] { "slug": slug.current }
`

export async function generateStaticParams() {
  const cats = await client.fetch<{ slug: string }[]>(allCategorySlugsQuery)
  return cats.map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await client.fetch<Category | null>(categoryQuery, { slug })
  return {
    title: category?.title ?? 'Categoria',
    description: category
      ? `Veja todas as peças de ${category.title} da LT Studio.`
      : undefined,
  }
}

export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params

  const [category, products] = await Promise.all([
    client.fetch<Category | null>(categoryQuery, { slug }),
    client.fetch<ProductCardData[]>(productsQuery, { slug }),
  ])

  if (!category) {
    return (
      <EmBreve
        title="Categoria não encontrada"
        subtitle="Esta categoria não existe ou foi removida."
      />
    )
  }

  if (products.length === 0) {
    return (
      <EmBreve
        title={category.title}
        subtitle="Esta categoria estará disponível em breve. Volte logo!"
      />
    )
  }

  return (
    <main className="min-h-screen py-10 px-5 max-w-7xl mx-auto">
      <h1 className="font-display text-3xl md:text-4xl font-light text-ink tracking-wide mb-8">
        {category.title}
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </main>
  )
}

function EmBreve({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center text-center px-5">
      <p className="font-sans text-[10px] tracking-widest uppercase text-ink/65 mb-4">
        LT Studio
      </p>
      <h1 className="font-display text-3xl md:text-4xl font-light text-ink mb-3">{title}</h1>
      <p className="font-sans text-sm text-ink/60 mb-8 max-w-xs">{subtitle}</p>
      <Link
        href="/"
        className="font-sans text-[10px] tracking-widest uppercase text-espresso hover:text-bordo transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-bordo focus-visible:outline-offset-4"
      >
        ← Voltar ao início
      </Link>
    </main>
  )
}
