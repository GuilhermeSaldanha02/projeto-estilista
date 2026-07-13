import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import CuratorialNote from '@/components/CuratorialNote'
import HeroSignature from '@/components/HeroSignature'
import ProductCard, { type ProductCardData } from '@/components/ProductCard'
import { WhatsAppIcon } from '@/components/icons'
import { FadeInSection } from '@/components/FadeInSection'

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
      <HeroSignature waScheduleHref={waScheduleHref} />

      {/* ═══════════════════════════════════════
          2. NOVIDADES — grade de produtos (grid uniforme, sem mosaico).
             A home de uma loja não pode deixar de mostrar produto nenhum.
      ═══════════════════════════════════════ */}
      {products.length > 0 && (
        <section className="py-16 md:py-20 px-5 max-w-7xl mx-auto" aria-label="Novidades">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-display text-5xl md:text-6xl font-medium text-ink tracking-tight">
              Novidades
            </h2>
            <Link
              href="/colecao/novidades"
              className="font-sans text-[10px] tracking-widest uppercase text-ink/70 hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-bordo focus-visible:outline-offset-4"
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
          4. PERSONAL STYLING — apresentação + CTA agendamento
      ═══════════════════════════════════════ */}
      <section className="relative bg-espresso py-24 md:py-36 px-5" aria-label="Consultoria de Estilo">
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <FadeInSection>
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-dourado mb-5">
              Consultoria de Estilo
            </p>
            <div className="w-6 h-px bg-dourado/40 mx-auto mb-6" />
            <h2 className="font-display text-5xl md:text-6xl font-medium text-cream-text tracking-tight mb-6 [text-wrap:balance]">
              Um olhar profissional para o seu estilo
            </h2>
          </FadeInSection>
          <p className="font-sans text-sm text-cream-text/75 leading-relaxed mb-14 max-w-prose mx-auto">
            Do consultório de moda ao look do dia a dia: encontramos juntas as peças certas
            para a sua vida, seu corpo e o que você quer comunicar com a roupa.
          </p>

          {/* Como funciona — 3 passos sobre o contato, não o atendimento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-x-8 md:gap-y-0 mb-14 text-left">
            {[
              {
                n: '01',
                title: 'É simples',
                body: 'Você toca o botão e o WhatsApp abre com a mensagem já escrita. É só enviar — sem formulário, sem cadastro.',
              },
              {
                n: '02',
                title: 'A gente conversa',
                body: 'A Luiza entende o que você precisa e marca o atendimento, no seu tempo.',
              },
              {
                n: '03',
                title: 'Você descobre seu estilo',
                body: 'No atendimento, ela alinha suas roupas aos seus objetivos.',
              },
            ].map(step => (
              <div key={step.n} className="border-t border-cream-text/10 pt-6">
                <p aria-hidden className="font-display text-6xl md:text-7xl font-light text-dourado/50 leading-none mb-4 select-none">
                  {step.n}
                </p>
                <h3 className="font-display text-xl font-light text-cream-text tracking-wide mb-3 [text-wrap:balance]">
                  {step.title}
                </h3>
                <p className="font-sans text-sm text-cream-text/75 leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          {waScheduleHref ? (
            <a
              href={waScheduleHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-esmeralda text-cream-text font-sans text-[11px] tracking-widest uppercase px-10 py-4 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cream-text focus-visible:outline-offset-4 transition-opacity"
            >
              <WhatsAppIcon />
              Agendar horário
            </a>
          ) : null}
        </div>
      </section>

    </main>
  )
}
