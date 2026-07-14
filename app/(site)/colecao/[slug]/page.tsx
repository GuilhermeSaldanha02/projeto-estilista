import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import EmptyState from '@/components/EmptyState'
import ProductCatalog, { type FilterableProduct } from '@/components/catalog/ProductCatalog'

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
// categorySlug/categoryTitle: só para os chips de filtro do ProductCatalog
// (uma coleção pode misturar várias categorias — filtro só faz sentido aqui,
// não em /categoria/[slug], que já chega de uma categoria só).
const productsQuery = `
  *[_type == "product" && $slug in tags[]->slug.current && inStock == true]
  | order(_createdAt desc) {
    _id, title, "slug": slug.current, price,
    "image": images[0] { asset, crop, hotspot, alt },
    "categorySlug": category->slug.current,
    "categoryTitle": category->title
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
    client.fetch<FilterableProduct[]>(productsQuery, { slug }),
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
      {/* key={slug}: força remount ao navegar entre coleções diferentes,
          mesmo motivo do categoria/[slug]. */}
      <ProductCatalog key={slug} title={collection.title} products={products} />
    </main>
  )
}
