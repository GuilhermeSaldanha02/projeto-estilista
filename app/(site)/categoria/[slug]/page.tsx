import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { type ProductCardData } from '@/components/ProductCard'
import SortableProductGrid from '@/components/catalog/SortableProductGrid'
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
    client.fetch<ProductCardData[]>(productsQuery, { slug }),
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
      {/* Sem eyebrow/linha aqui: o contador de peças virou dinâmico (calculado do
          grid já filtrado, não do total do servidor — achado do code review do
          PR #41) e mora dentro de SortableProductGrid. Título sozinho é o padrão
          certo para seção utilitária (DESIGN.md, "Regra do Andaime Único"). */}
      <div className="relative bg-gradient-to-b from-sand-100 to-sand-200 py-16 md:py-20 px-5">
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className="font-display text-[clamp(2rem,4vw,2.75rem)] font-[450] text-ink tracking-tight [text-wrap:balance]">
            {category.title}
          </h1>
        </div>
      </div>

      <div className="py-10 px-5 max-w-7xl mx-auto">
        {/* key={slug}: força remount ao navegar entre categorias diferentes
            (mesma rota [slug]) -- sem isso, o filtro de categoria ativo
            sobrevivia à troca de rota e podia deixar a próxima categoria
            parecendo vazia (achado do code review do PR #41). */}
        <SortableProductGrid key={slug} products={products} />
      </div>
    </main>
  )
}

