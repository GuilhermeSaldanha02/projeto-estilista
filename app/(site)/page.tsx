import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import ProductCard, { type ProductCardData } from '@/components/ProductCard'
import CuratorialNote from '@/components/CuratorialNote'
import { WhatsAppIcon } from '@/components/icons'

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

            <div className="flex flex-col items-start gap-3">
              {/* CTA primário — borgonha, leva para novidades */}
              <Link
                href="/colecao/novidades"
                className="inline-flex items-center justify-center bg-bordo text-cream-text font-sans text-[11px] tracking-widest uppercase px-8 py-4 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cream-text focus-visible:outline-offset-4 transition-opacity"
              >
                Quero esta peça
              </Link>

              {/* CTA secundário — link de texto, agendamento WhatsApp */}
              {waScheduleHref && (
                <a
                  href={waScheduleHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[11px] tracking-widest uppercase text-cream-text/60 hover:text-cream-text transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cream-text focus-visible:outline-offset-4"
                >
                  Agendar horário →
                </a>
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
          3. NOTA DA STYLIST — nota curatorial (exibida quando preenchida no CMS)
      ═══════════════════════════════════════ */}
      {settings?.curatorNote && (
        <CuratorialNote
          note={settings.curatorNote}
          byline={settings.curatorNoteByline}
        />
      )}

      {/* ═══════════════════════════════════════
          4. PERSONAL STYLIST — apresentação + CTA agendamento
      ═══════════════════════════════════════ */}
      <section className="bg-espresso py-20 md:py-28 px-5" aria-label="Personal Styling">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-dourado mb-5">
            Personal Styling
          </p>
          <div className="w-6 h-px bg-dourado/40 mx-auto mb-6" />
          <h2 className="font-display text-3xl md:text-4xl font-light text-cream-text tracking-wide mb-6">
            Um olhar profissional para o seu estilo
          </h2>
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
                <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-cream-text/60 mb-4">
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
