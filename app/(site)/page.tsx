import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import CuratorialNote from '@/components/CuratorialNote'
import HeroSignature from '@/components/HeroSignature'
import { WhatsAppIcon } from '@/components/icons'
import { FadeInSection } from '@/components/FadeInSection'
import { SeamTransition } from '@/components/SeamTransition'
import { EDGE } from '@/lib/colors'

// ISR — produtos e settings vêm do Sanity; 60s para refletir publicações sem rebuild
export const revalidate = 60

export const metadata: Metadata = {
  title: { absolute: 'LT Studio — Moda Feminina' },
  description:
    'Moda feminina com olhar de personal stylist. Encontre a peça certa e agende seu atendimento pelo WhatsApp.',
}

const settingsQuery = `*[_type == "siteSettings"][0]{ whatsappNumber, curatorNote, curatorNoteByline }`

export default async function HomePage() {
  const settings = await client.fetch<{ whatsappNumber?: string; curatorNote?: string; curatorNoteByline?: string } | null>(settingsQuery)

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
          2. NOTA DA STYLIST — nota curatorial (exibida quando preenchida no CMS)
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
      <section className="relative bg-espresso py-24 md:py-36 px-5" aria-label="Personal Styling">
        {settings?.curatorNote && <SeamTransition from={EDGE.sand100} />}
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <FadeInSection>
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-dourado mb-5">
              Personal Styling
            </p>
            <div className="w-6 h-px bg-dourado/40 mx-auto mb-6" />
            <h2 className="font-display text-5xl md:text-6xl font-light text-cream-text tracking-tight mb-6 [text-wrap:balance]">
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
