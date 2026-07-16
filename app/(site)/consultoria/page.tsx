import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { settingsQuery } from '@/sanity/lib/queries'
import { buildWaHref, WA_MESSAGES } from '@/lib/wa'
import StylistHero from '@/components/consultoria/StylistHero'
import { StylistSectionsRenderer, type StylistSection } from '@/components/consultoria/Sections'

export const revalidate = 60

/*
 * Fase 5 (Reconstrução) — /consultoria, renomeada de /stylist (a URL dizia
 * "stylist" enquanto a nav já dizia "Consultoria" desde 10/07 — a
 * auditoria apontou a incoerência). O hero é novo (StylistHero, foto
 * dominante). As seções dinâmicas do CMS são as mesmas da Fase 3/3.1, já
 * aprovadas pelo dono — extraídas para components/consultoria/Sections.tsx.
 */
export async function generateMetadata(): Promise<Metadata> {
  const profile = await client.fetch<{ name?: string; tagline?: string } | null>(
    `*[_type == "stylistProfile"][0]{ name, tagline }`
  )
  return {
    title: profile?.name ?? 'Consultoria',
    description:
      profile?.tagline ?? 'Conheça a personal stylist por trás da LT Studio e agende seu atendimento.',
  }
}

type SanityImg = {
  asset: { _ref: string; _type?: string }
  alt?: string
  hotspot?: { x: number; y: number }
}

type StylistProfile = {
  name?: string
  tagline?: string
  photo?: SanityImg
  sections?: StylistSection[]
}

const profileQuery = `*[_type == "stylistProfile"][0]{
  name,
  tagline,
  photo { asset, alt },
  sections[] {
    _key,
    eyebrow,
    title,
    body,
    image { asset, alt },
    items[] { _key, titulo, subtitulo },
    layout
  }
}`

export default async function ConsultoriaPage() {
  const [profile, settings] = await Promise.all([
    client.fetch<StylistProfile | null>(profileQuery),
    client.fetch<{ whatsappNumber?: string } | null>(settingsQuery),
  ])

  const waHref = buildWaHref(settings?.whatsappNumber, WA_MESSAGES.agendar)

  return (
    <main>
      <StylistHero
        name={profile?.name}
        tagline={profile?.tagline}
        photo={profile?.photo}
        waHref={waHref}
      />
      <StylistSectionsRenderer sections={profile?.sections ?? []} waHref={waHref} />
    </main>
  )
}
