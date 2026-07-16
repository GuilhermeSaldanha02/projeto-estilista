import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { allProductsQuery } from '@/sanity/lib/queries'
import CatalogView, { type FilterableProduct } from '@/components/catalog/CatalogView'
import EmptyState from '@/components/ui/EmptyState'

// ISR — catálogo reflete o que a dona publica sem rebuild manual
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Vitrine',
  description: 'Todas as peças da LT Studio — moda feminina com olhar de personal stylist.',
}

/*
 * Fase 5 (Reconstrução) — /vitrine é o catálogo completo e o ÚNICO lugar
 * com filtros. Substitui /colecao/novidades (redirect 301 no next.config):
 * "novidades" deixou de ser página e virou o estado default daqui
 * (ordenação "mais recentes").
 */
export default async function VitrinePage() {
  const products = await client.fetch<FilterableProduct[]>(allProductsQuery)

  if (products.length === 0) {
    return (
      <EmptyState
        headline="Novas peças em breve."
        body="A stylist está preparando uma nova seleção. Volte logo — ou agende um atendimento personalizado."
        primaryHref="/consultoria"
        primaryLabel="Conheça a consultoria"
        secondaryHref="/"
        secondaryLabel="← Início"
      />
    )
  }

  return (
    <main className="min-h-screen">
      <CatalogView title="Vitrine" products={products} showChips paginated />
    </main>
  )
}
