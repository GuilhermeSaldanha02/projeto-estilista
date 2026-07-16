import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import {
  settingsQuery,
  featuredProductsQuery,
  recentProductsQuery,
  newArrivalsQuery,
  categoryPortalsQuery,
  stylistCardQuery,
} from '@/sanity/lib/queries'
import { buildWaHref, WA_MESSAGES } from '@/lib/wa'
import Hero from '@/components/home/Hero'
import CuratedSelection from '@/components/home/CuratedSelection'
import CategoryPortals, { type CategoryPortal } from '@/components/home/CategoryPortals'
import NewArrivalsRail from '@/components/home/NewArrivalsRail'
import ConsultingInvite, { type StylistCard } from '@/components/home/ConsultingInvite'
import type { FilterableProduct } from '@/components/catalog/CatalogView'

// ISR — produtos e settings vêm do Sanity; 60s para refletir publicações sem rebuild
export const revalidate = 60

export const metadata: Metadata = {
  title: { absolute: 'LT Studio — Moda Feminina' },
  description:
    'Moda feminina com olhar de personal stylist. Encontre a peça certa e agende seu atendimento pelo WhatsApp.',
}

type Settings = {
  whatsappNumber?: string
  curatorNote?: string
  curatorNoteByline?: string
}

/*
 * Fase 5 (Reconstrução) — home nova, do zero, conforme blueprint:
 * S1 Hero full-bleed → S2 Seleção da Luiza (curadoria + nota como legenda)
 * → S3 Portais de categoria → S4 Acabou de chegar (fila snap) → S5 Convite
 * à consultoria (única seção escura). A home é VITRINE EDITORIAL — quem
 * quer o catálogo com filtros vai para /vitrine. As seções antigas
 * (ProductCatalog embutido, CuratorialNote, PersonalStyling) morreram;
 * o conteúdo delas migrou para S2 e S5.
 */
export default async function HomePage() {
  const [settings, featured, newArrivals, portals, stylist] = await Promise.all([
    client.fetch<Settings | null>(settingsQuery),
    client.fetch<FilterableProduct[]>(featuredProductsQuery),
    client.fetch<FilterableProduct[]>(newArrivalsQuery),
    client.fetch<CategoryPortal[]>(categoryPortalsQuery),
    client.fetch<StylistCard | null>(stylistCardQuery),
  ])

  // Seleção: destaques marcados no Studio; sem nenhum marcado, cai para as
  // mais recentes — a home nunca fica sem a seção de curadoria.
  const curated =
    featured.length > 0
      ? featured
      : await client.fetch<FilterableProduct[]>(recentProductsQuery)

  const waScheduleHref = buildWaHref(settings?.whatsappNumber, WA_MESSAGES.agendar)

  return (
    <main>
      <Hero />

      <CuratedSelection
        products={curated.slice(0, 3)}
        note={settings?.curatorNote}
        byline={settings?.curatorNoteByline}
      />

      <CategoryPortals categories={portals} />

      <NewArrivalsRail products={newArrivals} />

      <ConsultingInvite stylist={stylist} waScheduleHref={waScheduleHref} />
    </main>
  )
}
