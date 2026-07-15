import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import CuratorialNote from '@/components/CuratorialNote'
import Hero from '@/components/home/Hero'
import PersonalStyling from '@/components/PersonalStyling'
import ProductCatalog, { type FilterableProduct } from '@/components/catalog/ProductCatalog'

// ISR — produtos e settings vêm do Sanity; 60s para refletir publicações sem rebuild
export const revalidate = 60

export const metadata: Metadata = {
  title: { absolute: 'LT Studio — Moda Feminina' },
  description:
    'Moda feminina com olhar de personal stylist. Encontre a peça certa e agende seu atendimento pelo WhatsApp.',
}

// Fase 4d: a home usava uma grade simples (8 peças, sem filtro) enquanto
// /colecao/novidades tinha a versão completa (12 peças, filtro por categoria
// + ordenação) — o dono viu as duas ao vivo e achou a inconsistência estranha
// ("um tem filtro e outro não"), pediu pra trazer a versão completa pra home.
// Mesma query/limite de /colecao/novidades (12, categorySlug/categoryTitle
// para os chips) -- ProductCatalog é o mesmo componente das duas.
const productsQuery = `
  *[_type == "product" && inStock == true]
  | order(_createdAt desc)
  [0...12] {
    _id, title, "slug": slug.current, price,
    "image": images[0] { asset, crop, hotspot, alt },
    "categorySlug": category->slug.current,
    "categoryTitle": category->title
  }
`

const settingsQuery = `*[_type == "siteSettings"][0]{ whatsappNumber, curatorNote, curatorNoteByline }`

export default async function HomePage() {
  const [products, settings] = await Promise.all([
    client.fetch<FilterableProduct[]>(productsQuery),
    client.fetch<{ whatsappNumber?: string; curatorNote?: string; curatorNoteByline?: string } | null>(settingsQuery),
  ])

  const whatsappNumber = settings?.whatsappNumber
  const waScheduleMessage = 'Oi! Gostaria de agendar um horário de personal styling.'
  const waScheduleHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waScheduleMessage)}`
    : null

  return (
    <main>

      {/* ═══════════════════════════════════════
          1. HERO — Fase 5/Etapa 1 (reconstrução): vídeo full-bleed, "a foto
             é a tela". Ver components/home/Hero.tsx. As demais seções abaixo
             são as antigas — serão reconstruídas na Etapa 2 depois que o
             dono aprovar este hero (portão definido no blueprint).
      ═══════════════════════════════════════ */}
      <Hero />

      {/* ═══════════════════════════════════════
          2. NOVIDADES — mesmo ProductCatalog de /colecao/novidades (filtro +
             ordenação inclusos). headingLevel="h2": o h1 da página já é o do
             hero -- nunca dois h1 na mesma página.
             A home de uma loja não pode deixar de mostrar produto nenhum.
      ═══════════════════════════════════════ */}
      {products.length > 0 && (
        <ProductCatalog title="Novidades" products={products} headingLevel="h2" />
      )}

      {/* ═══════════════════════════════════════
          3. NOTA DA STYLIST — nota curatorial (exibida quando preenchida no CMS)
      ═══════════════════════════════════════ */}
      {settings?.curatorNote && (
        <CuratorialNote
          note={settings.curatorNote}
          byline={settings.curatorNoteByline}
        />
      )}

      {/* ═══════════════════════════════════════
          4. PERSONAL STYLING — Fase E (quebra o monólito). Ver PersonalStyling.tsx.
      ═══════════════════════════════════════ */}
      <PersonalStyling waScheduleHref={waScheduleHref} />

    </main>
  )
}
