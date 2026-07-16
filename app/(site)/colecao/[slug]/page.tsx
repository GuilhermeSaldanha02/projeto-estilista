import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import {
  collectionQuery,
  collectionProductsQuery,
  allCollectionSlugsQuery,
} from '@/sanity/lib/queries'
import CatalogView, { type FilterableProduct } from '@/components/catalog/CatalogView'
import EmptyState from '@/components/ui/EmptyState'

// ISR — mesmo padrão de categoria/[slug]
export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

type CollectionDoc = { _id: string; title: string; slug: string }

/*
 * Fase 5: a rota estática /colecao/novidades foi REMOVIDA (redirect 301 →
 * /vitrine no next.config). Com ela morreu o guard "slug.current !=
 * 'novidades'" que protegia contra sombreamento silencioso — uma coleção
 * chamada "Novidades" no Studio agora é só uma coleção normal, sem página
 * pra derrubar.
 */
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
    client.fetch<FilterableProduct[]>(collectionProductsQuery, { slug }),
  ])

  if (!collection) {
    return (
      <EmptyState
        headline="Coleção não encontrada."
        body="O link pode ter mudado. Explore nossas peças pelo menu acima."
        primaryHref="/vitrine"
        primaryLabel="Ver a vitrine"
        secondaryHref="/consultoria"
        secondaryLabel="Conheça a consultoria"
      />
    )
  }

  if (products.length === 0) {
    return (
      <EmptyState
        headline="Em cuidadosa seleção."
        body={`Novas peças de ${collection.title} chegam em breve. Confira o que acabou de chegar.`}
        primaryHref="/vitrine"
        primaryLabel="Ver a vitrine"
        secondaryHref="/consultoria"
        secondaryLabel="Conheça a consultoria"
      />
    )
  }

  return (
    <main className="min-h-screen">
      {/* Chips ligados: coleção mistura categorias. key={slug} remonta ao
          trocar de coleção. */}
      <CatalogView key={slug} title={collection.title} products={products} showChips />
    </main>
  )
}
