import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import {
  categoryQuery,
  categoryProductsQuery,
  allCategorySlugsQuery,
} from '@/sanity/lib/queries'
import CatalogView, { type FilterableProduct } from '@/components/catalog/CatalogView'
import EmptyState from '@/components/ui/EmptyState'

// ISR — SDD §1: catálogo reflete o que a dona publica sem rebuild manual
export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

type Category = { _id: string; title: string; slug: string }

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
    client.fetch<FilterableProduct[]>(categoryProductsQuery, { slug }),
  ])

  if (!category) {
    return (
      <EmptyState
        headline="Categoria não encontrada."
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
        body={`Novas peças de ${category.title} chegam em breve. Confira o que acabou de chegar.`}
        primaryHref="/vitrine"
        primaryLabel="Ver a vitrine"
        secondaryHref="/consultoria"
        secondaryLabel="Conheça a consultoria"
      />
    )
  }

  return (
    <main className="min-h-screen">
      {/* key={slug}: remount ao navegar entre categorias (estado de sort não
          vaza entre rotas — achado do code review do PR #41, mantido). Sem
          chips: a lista já vem de uma categoria só. */}
      <CatalogView key={slug} title={category.title} products={products} />
    </main>
  )
}
