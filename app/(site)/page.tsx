import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import ProductCard, { type ProductCardData } from '@/components/ProductCard'

// ISR — produtos e settings vêm do Sanity; 60s para refletir publicações sem rebuild
export const revalidate = 60

export const metadata: Metadata = {
  title: { absolute: 'LT Studio — Moda Feminina' },
  description:
    'Moda feminina com olhar de personal stylist. Encontre a peça certa e agende seu atendimento pelo WhatsApp.',
}

const productsQuery = `
  *[_type == "product" && inStock == true]
  | order(_createdAt desc)
  [0...8] {
    _id, title, "slug": slug.current, price,
    "image": images[0] { asset, crop, hotspot, alt }
  }
`
const settingsQuery = `*[_type == "siteSettings"][0]{ whatsappNumber }`

export default async function HomePage() {
  const [products, settings] = await Promise.all([
    client.fetch<ProductCardData[]>(productsQuery),
    client.fetch<{ whatsappNumber?: string } | null>(settingsQuery),
  ])

  const whatsappNumber = settings?.whatsappNumber
  const waScheduleMessage = 'Oi! Gostaria de agendar um horário de personal styling.'
  const waScheduleHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waScheduleMessage)}`
    : null

  return (
    <main>

      {/* ═══════════════════════════════════════
          1. HERO — vídeo de fundo, texto à esquerda
      ═══════════════════════════════════════ */}
      <section
        className="relative overflow-hidden min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-72px)]"
        aria-label="Hero"
      >
        {/* Poster estático — visível somente em prefers-reduced-motion: reduce */}
        <div
          className="hidden motion-reduce:block absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/hero-poster.jpg)' }}
          aria-hidden="true"
        />

        {/* Vídeo de fundo — oculto em prefers-reduced-motion: reduce */}
        <video
          className="absolute inset-0 w-full h-full object-cover motion-reduce:hidden"
          src="/hero.mp4"
          poster="/hero-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          preload="none"
        />

        {/* Gradiente lateral — garante legibilidade sobre qualquer frame do vídeo */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"
          aria-hidden="true"
        />

        {/* Conteúdo — alinhado à esquerda onde há espaço negativo no vídeo */}
        <div className="relative z-10 h-full min-h-[inherit] flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16">
          <div className="max-w-lg">
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-cream-text mb-5 opacity-70">
              Personal Stylist
            </p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-light text-cream-text tracking-[0.2em] uppercase leading-none mb-5">
              LT Studio
            </h1>
            <p className="font-sans text-sm md:text-base text-cream-text tracking-wide leading-relaxed mb-8 max-w-xs opacity-90">
              Moda feminina com olhar de personal stylist
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* CTA bordô — leva para novidades */}
              <Link
                href="/colecao/novidades"
                className="inline-flex items-center justify-center bg-bordo text-cream-text font-sans text-[11px] tracking-widest uppercase px-8 py-4 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cream-text focus-visible:outline-offset-4 transition-opacity"
              >
                Quero esta peça
              </Link>

              {/* CTA esmeralda — agendamento WhatsApp */}
              {waScheduleHref ? (
                <a
                  href={waScheduleHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-esmeralda text-cream-text font-sans text-[11px] tracking-widest uppercase px-8 py-4 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cream-text focus-visible:outline-offset-4 transition-opacity"
                >
                  Agendar horário
                </a>
              ) : (
                <span className="inline-flex items-center justify-center bg-esmeralda text-cream-text font-sans text-[11px] tracking-widest uppercase px-8 py-4 opacity-50 cursor-not-allowed select-none">
                  Agendar horário
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          2. NOVIDADES — grade de produtos recentes
      ═══════════════════════════════════════ */}
      {products.length > 0 && (
        <section className="py-14 px-5 max-w-7xl mx-auto" aria-label="Novidades">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-display text-3xl md:text-4xl font-light text-ink tracking-wide">
              Novidades
            </h2>
            <Link
              href="/colecao/novidades"
              className="font-sans text-[10px] tracking-widest uppercase text-ink/60 hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-bordo focus-visible:outline-offset-4"
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
          3. PERSONAL STYLIST — apresentação + CTA agendamento
      ═══════════════════════════════════════ */}
      <section className="bg-espresso py-16 px-5" aria-label="Personal Styling">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-dourado mb-5">
            Personal Styling
          </p>
          <div className="w-6 h-px bg-dourado/40 mx-auto mb-6" />
          <h2 className="font-display text-3xl md:text-4xl font-light text-cream-text tracking-wide mb-6">
            Um olhar profissional para o seu estilo
          </h2>
          {/* Texto provisório — substitua pelo conteúdo da stylist no Sanity Studio */}
          <p className="font-sans text-sm text-cream-text leading-relaxed mb-10 max-w-prose mx-auto opacity-75">
            Do consultório de moda ao look do dia a dia: encontramos juntas as peças certas
            para a sua vida, seu corpo e o que você quer comunicar com a roupa.
          </p>

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

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
