import { FadeInSection } from '@/components/FadeInSection'

interface Props {
  note: string
  byline?: string | null
}

export default function CuratorialNote({ note, byline }: Props) {
  return (
    <section className="bg-sand-100 py-28 md:py-40 px-5" aria-label="Nota da Stylist">
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-dourado-ink mb-5">
          Nota da Stylist
        </p>
        <div className="w-8 h-px bg-dourado/40 mx-auto mb-10" />
        <FadeInSection>
          <blockquote className="font-display text-4xl md:text-5xl font-light italic text-ink leading-snug tracking-tight mb-8 [text-wrap:balance]">
            {note}
          </blockquote>
        </FadeInSection>
        {byline && (
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-ink/70">
            {byline}
          </p>
        )}
      </div>
    </section>
  )
}
