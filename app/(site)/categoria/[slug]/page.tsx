import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import ProductCatalog, { type FilterableProduct } from '@/components/catalog/ProductCatalog'
import EmptyState from '@/components/EmptyState'

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
    client.fetch<FilterableProduct[]>(productsQuery, { slug }),
  ])

  if (!category) {
    return (
      <EmptyState
        headline="Categoria não encontrada."
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
        body={`Novas peças de ${category.title} chegam em breve. Confira o que acabou de chegar.`}
        primaryHref="/colecao/novidades"
        primaryLabel="Ver novidades"
        secondaryHref="/stylist"
        secondaryLabel="Conheça a stylist"
      />
    )
  }

  return (
    <main className="min-h-screen">
      {/* key={slug}: força remount ao navegar entre categorias diferentes
          (mesma rota [slug]) -- sem isso, o filtro de categoria ativo
          sobrevivia à troca de rota e podia deixar a próxima categoria
          parecendo vazia (achado do code review do PR #41). Título+contador+
          filtro/sort agora moram juntos em ProductCatalog, no mesmo bloco —
          antes eram 2 seções separadas por um vão grande, achado do dono
          ("solto, não harmônico") ao ver a página Saias ao vivo. */}
      <ProductCatalog key={slug} title={category.title} products={products} />
    </main>
  )
}

