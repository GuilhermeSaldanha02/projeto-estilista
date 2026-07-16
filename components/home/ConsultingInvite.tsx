import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { WhatsAppIcon } from '@/components/ui/icons'
import { PhotoParallax } from '@/components/motion/PhotoParallax'
import { Reveal } from '@/components/motion/Reveal'

/*
 * Home S5 — Convite à consultoria (Fase 5, blueprint).
 * O único momento escuro da home (Regra de Uma Seção Escura por Página).
 * Foto da Luiza com bloco esmeralda-composicional sangrando atrás (cor via
 * composição com foto — nunca painel atrás de texto), texto + 3 passos com
 * numerais PEQUENOS (nunca 96px) + CTA esmeralda único.
 */
export type StylistCard = {
  name?: string | null
  tagline?: string | null
  photo?: {
    asset?: { _ref: string; _type?: string }
    alt?: string
  } | null
}

const STEPS = [
  {
    n: '01',
    title: 'É simples',
    body: 'Você toca o botão e o WhatsApp abre com a mensagem já escrita. Sem formulário, sem cadastro.',
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
]

export default function ConsultingInvite({
  stylist,
  waScheduleHref,
}: {
  stylist: StylistCard | null
  waScheduleHref: string | null
}) {
  const hasPhoto = !!stylist?.photo?.asset

  return (
    <section aria-label="Consultoria de estilo" className="bg-espresso py-24 md:py-32 px-[6vw] overflow-hidden">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-14 items-center">
        {/* Foto — primeiro no mobile (DOM depois no desktop via order) */}
        {hasPhoto && (
          <div className="md:col-span-5 md:col-start-8 md:order-2 relative">
            {/* Bloco esmeralda composicional: sangra atrás da foto para a
                borda direita — cor com foto, não cor com texto */}
            <div
              aria-hidden
              className="absolute -top-6 -right-[8vw] bottom-[-1.5rem] left-[18%] bg-esmeralda/25"
            />
            <div className="relative">
              <PhotoParallax
                src={urlFor(stylist!.photo!).width(900).height(1200).fit('crop').auto('format').url()}
                alt={stylist?.photo?.alt ?? stylist?.name ?? 'Personal stylist'}
              />
            </div>
          </div>
        )}

        {/* Texto — col 1-6 */}
        <Reveal className={hasPhoto ? 'md:col-span-6 md:order-1' : 'md:col-span-8 md:col-start-3'}>
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-dourado mb-5">
            Consultoria de estilo
          </p>
          <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-[450] text-cream-text tracking-tight mb-5 [text-wrap:balance]">
            Um olhar profissional para o seu estilo
          </h2>
          <p className="font-sans text-sm text-cream-text/75 leading-relaxed max-w-[52ch] mb-10">
            Do consultório de moda ao look do dia a dia: encontramos juntas as peças
            certas para a sua vida, seu corpo e o que você quer comunicar com a roupa.
          </p>

          <ol className="space-y-6 mb-10">
            {STEPS.map(step => (
              <li key={step.n} className="flex gap-5">
                <span
                  aria-hidden
                  className="font-sans text-sm tracking-[0.2em] text-cream-text/50 pt-0.5 shrink-0"
                >
                  {step.n}
                </span>
                <div>
                  <h3 className="font-display text-base font-[450] text-cream-text mb-1">
                    {step.title}
                  </h3>
                  <p className="font-sans text-sm text-cream-text/70 leading-relaxed max-w-[48ch]">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {waScheduleHref && (
            <a
              href={waScheduleHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-esmeralda text-cream-text font-sans text-[11px] tracking-widest uppercase px-10 py-4 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cream-text focus-visible:outline-offset-4 transition-opacity"
            >
              <WhatsAppIcon />
              Agendar horário
            </a>
          )}
        </Reveal>
      </div>
    </section>
  )
}
