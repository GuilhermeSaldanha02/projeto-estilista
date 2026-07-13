import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import ProductCard, { type ProductCardData } from '@/components/ProductCard'
import EmptyState from '@/components/EmptyState'

// ISR — mesmo padrão de categoria/[slug]
export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

type CollectionDoc = { _id: string; title: string; slug: string }

const collectionQuery = `
  *[_type == "collection" && slug.current == $slug][0] {
    _id, title, "slug": slug.current
  }
`

// Tag é array de referência (product.tags[]->collection) — "$slug in tags[]->slug.current"
// filtra produtos que têm essa coleção entre as suas, sem exigir categoria única.
const productsQuery = `
  *[_type == "product" && $slug in tags[]->slug.current && inStock == true]
  | order(_createdAt desc) {
    _id, title, "slug": slug.current, price,
    "image": images[0] { asset, crop, hotspot, alt }
  }
`

// ⚠️ NÃO REMOVER "slug.current != 'novidades'": testado empiricamente que, se este
// slug entrar em generateStaticParams, a rota dinâmica SOBRESCREVE SILENCIOSAMENTE
// a página estática de app/colecao/novidades/page.tsx (build passa sem erro/warning;
// só falha em runtime, servindo "Coleção não encontrada." no lugar da home de
// novidades). Sem essa exclusão, cadastrar uma Coleção chamada "Novidades" no Studio
// (nome plausível — é um dos exemplos do próprio schema collection.ts) derruba a
// página em produção sem nenhum sinal de erro.
const allCollectionSlugsQuery = `
  *[_type == "collection" && slug.current != "novidades"
    && count(*[_type == "product" && references(^._id) && inStock == true]) > 0
  ] { "slug": slug.current }
`

export async function generateStaticParams() {
  const collections = await client.fetch<{ slug: string }[]>(allCollectionSlugsQuery)
  return collections.map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const collection = await client.fetch<CollectionDoc | null>(collectionQuery, { slug })
  return {
    title: collection?.title ?? 'Coleção',
    description: collection
      ? `Veja as peças da coleção ${collection.title} da LT Studio.`
      : undefined,
  }
}

export default async function ColecaoPage({ params }: Props) {
  const { slug } = await params

  const [collection, products] = await Promise.all([
    client.fetch<CollectionDoc | null>(collectionQuery, { slug }),
    client.fetch<ProductCardData[]>(productsQuery, { slug }),
  ])

  if (!collection) {
    return (
      <EmptyState
        headline="Coleção não encontrada."
        body="O link pode ter mudado. Explore nossas peças pelo menu acima."
        primaryHref="/colecao/novidades"
        primaryLabel="Ver novidades"
        secondaryHref="/stylist"
        secondaryLabel="Conheça a stylist"
      />
    )
  }

  if (products.length === 0) {
    return (
      <EmptyState
        headline="Em cuidadosa seleção."
        body={`Novas peças de ${collection.title} chegam em breve. Confira o que acabou de chegar.`}
        primaryHref="/colecao/novidades"
        primaryLabel="Ver novidades"
        secondaryHref="/stylist"
        secondaryLabel="Conheça a stylist"
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
          <h1 className="font-display text-[clamp(2rem,4vw,2.75rem)] font-[450] text-ink tracking-tight [text-wrap:balance]">
            {collection.title}
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
