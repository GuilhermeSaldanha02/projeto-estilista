interface Props {
  note: string
  byline?: string | null
}

export default function CuratorialNote({ note, byline }: Props) {
  return (
    <section className="bg-sand-100 py-20 md:py-28 px-5" aria-label="Nota da Stylist">
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-dourado mb-5">
          Nota da Stylist
        </p>
        <div className="w-8 h-px bg-dourado/40 mx-auto mb-10" />
        <blockquote className="font-display text-2xl md:text-[1.75rem] font-light text-ink leading-relaxed tracking-wide mb-8 [text-wrap:balance]">
          {note}
        </blockquote>
        {byline && (
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-ink/70">
            {byline}
          </p>
        )}
      </div>
    </section>
  )
}
