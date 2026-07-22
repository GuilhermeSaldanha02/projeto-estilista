import Link from 'next/link'

interface Props {
  headline: string
  body: string
  primaryHref: string
  primaryLabel: string
  secondaryHref?: string
  secondaryLabel?: string
  secondaryExternal?: boolean
}

export default function EmptyState({
  headline,
  body,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  secondaryExternal = false,
}: Props) {
  return (
    <main className="bg-espresso min-h-[80vh] flex flex-col items-center justify-center text-center px-6 py-20">
      <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-dourado mb-8">
        LT Studio
      </p>

      <h1 className="font-display text-3xl md:text-4xl font-light text-cream-text tracking-wide [text-wrap:balance] mb-5">
        {headline}
      </h1>
      <p className="font-sans text-sm text-cream-text/75 leading-relaxed max-w-xs mb-10">
        {body}
      </p>

      <div className="flex flex-col items-center gap-4">
        <Link
          href={primaryHref}
          className="inline-flex items-center justify-center bg-bordo text-cream-text font-sans text-[11px] tracking-widest uppercase px-8 py-4 hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-cream-text focus-visible:outline-offset-4"
        >
          {primaryLabel}
        </Link>

        {secondaryHref && secondaryLabel && (
          secondaryExternal ? (
            <a
              href={secondaryHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[11px] tracking-widest uppercase text-cream-text/60 hover:text-cream-text transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cream-text focus-visible:outline-offset-4"
            >
              {secondaryLabel} →
            </a>
          ) : (
            <Link
              href={secondaryHref}
              className="font-sans text-[11px] tracking-widest uppercase text-cream-text/60 hover:text-cream-text transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cream-text focus-visible:outline-offset-4"
            >
              {secondaryLabel} →
            </Link>
          )
        )}
      </div>
    </main>
  )
}
