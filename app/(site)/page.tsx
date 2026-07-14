import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import CuratorialNote from '@/components/CuratorialNote'
import HeroSignature from '@/components/HeroSignature'
import PersonalStyling from '@/components/PersonalStyling'
import ProductCard, { type ProductCardData } from '@/components/ProductCard'

// ISR — produtos e settings vêm do Sanity; 60s para refletir publicações sem rebuild
export const revalidate = 60

export const metadata: Metadata = {
  title: { absolute: 'LT Studio — Moda Feminina' },
  description:
    'Moda feminina com olhar de personal stylist. Encontre a peça certa e agende seu atendimento pelo WhatsApp.',
}

// Grid UNIFORME — sem mosaico/featured (o mosaico 2x2 foi removido antes por bug de
// altura entre o card destacado e os normais, ver commit 0640831). Reintroduzido por
// decisão estrutural: a home de uma loja não pode deixar de mostrar nenhum produto.
const productsQuery = `
  *[_type == "product" && inStock == true]
  | order(_createdAt desc)
  [0...8] {
    _id, title, "slug": slug.current, price,
    "image": images[0] { asset, crop, hotspot, alt }
  }
`

const settingsQuery = `*[_type == "siteSettings"][0]{ whatsappNumber, curatorNote, curatorNoteByline }`

export default async function HomePage() {
  const [products, settings] = await Promise.all([
    client.fetch<ProductCardData[]>(productsQuery),
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
          1. HERO — momento-assinatura (Fase C): wordmark lockup, entrada
             escalonada e parallax discreto no scroll. Ver HeroSignature.tsx.
      ═══════════════════════════════════════ */}
      <HeroSignature />

      {/* ═══════════════════════════════════════
          2. NOVIDADES — grade de produtos (grid uniforme, sem mosaico).
             A home de uma loja não pode deixar de mostrar produto nenhum.
      ═══════════════════════════════════════ */}
      {products.length > 0 && (
        <section className="py-16 md:py-20 px-5 max-w-7xl mx-auto" aria-label="Novidades">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-[450] text-ink tracking-tight">
              Novidades
            </h2>
            <Link
              href="/colecao/novidades"
              className="font-sans text-[10px] tracking-widest uppercase text-ink-soft hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-bordo focus-visible:outline-offset-4"
            >
              ver todas →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
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
