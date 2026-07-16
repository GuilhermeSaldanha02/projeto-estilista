import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { PhotoReveal } from '@/components/motion/PhotoReveal'
import { Reveal } from '@/components/motion/Reveal'
import { WhatsAppIcon } from '@/components/ui/icons'

type SanityImg = {
  asset: { _ref: string; _type?: string }
  alt?: string
  hotspot?: { x: number; y: number }
}

/*
 * Fase 5 (Reconstrução) — hero de /consultoria, na mesma linguagem do resto
 * do site novo: foto dominante (col 1-7, full-bleed de um lado), sangrando
 * na borda esquerda da tela. Texto ancorado à direita — aqui, diferente da
 * home, o CTA de agendamento JÁ entra no hero: a página inteira É o funil
 * de agendamento, não há concorrência com um CTA de produto.
 */
export default function StylistHero({
  name,
  tagline,
  photo,
  waHref,
}: {
  name?: string | null
  tagline?: string | null
  photo?: SanityImg | null
  waHref: string | null
}) {
  return (
    <section
      aria-label="Apresentação"
      className="relative bg-espresso min-h-[85vh] md:min-h-[85vh] grid md:grid-cols-12"
    >
      <div className="md:col-span-7 relative min-h-[50vh]">
        {photo?.asset ? (
          <PhotoReveal className="absolute inset-0 overflow-hidden">
            <Image
              src={urlFor(photo).width(1400).height(1750).fit('crop').auto('format').url()}
              alt={photo.alt ?? name ?? 'Foto da stylist'}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 58vw"
              className="object-cover"
              style={{ filter: 'sepia(0.14) saturate(1.1) contrast(1.03)' }}
            />
          </PhotoReveal>
        ) : (
          <div className="absolute inset-0 bg-ink/20 flex items-center justify-center">
            <span className="font-sans text-[10px] tracking-widest uppercase text-cream-text/50">
              Foto em breve
            </span>
          </div>
        )}
      </div>

      <Reveal className="md:col-span-5 flex flex-col justify-center px-[6vw] py-16 md:py-0">
        <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-dourado mb-5">
          Consultoria de estilo
        </p>
        <h1 className="font-display text-[clamp(2rem,3.4vw,2.75rem)] font-[450] text-cream-text tracking-tight mb-5 [text-wrap:balance]">
          {name ?? 'Em breve'}
        </h1>
        {tagline && (
          <p className="font-display text-xl md:text-2xl font-light italic text-cream-text/85 leading-snug mb-10 max-w-[32ch]">
            {tagline}
          </p>
        )}
        {waHref && (
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-esmeralda text-cream-text font-sans text-[11px] tracking-widest uppercase px-10 py-4 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cream-text focus-visible:outline-offset-4 transition-opacity self-start"
          >
            <WhatsAppIcon />
            Agendar horário
          </a>
        )}
      </Reveal>
    </section>
  )
}
