import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { PhotoReveal } from '@/components/motion/PhotoReveal'

/*
 * Fase 5 — galeria da página de produto.
 * Desktop: pilha vertical editorial — rolar a página é folhear a peça
 * (padrão das referências de luxo), sem thumbnails, sem carrossel, sem
 * sticky. Mobile: carrossel horizontal com scroll-snap.
 * CSS puro — componente servidor, zero JS de galeria.
 */
export type GalleryImage = {
  asset: { _ref: string; _type: string }
  crop?: { top: number; bottom: number; left: number; right: number } | null
  hotspot?: { x: number; y: number; width: number; height: number } | null
  alt?: string
}

export default function ProductGallery({
  images,
  title,
}: {
  images: GalleryImage[]
  title: string
}) {
  const valid = images.filter(img => img?.asset)

  if (valid.length === 0) {
    return (
      <div className="aspect-[4/5] bg-sand-100 flex items-center justify-center">
        <span className="font-sans text-[10px] tracking-widest uppercase text-ink-soft">
          Foto em breve
        </span>
      </div>
    )
  }

  return (
    <>
      {/* Desktop: pilha vertical */}
      <div className="hidden md:flex flex-col gap-3">
        {valid.map((img, i) => (
          <PhotoReveal key={i} className="relative aspect-[4/5] overflow-hidden bg-sand-100">
            <Image
              src={urlFor(img).width(1100).height(1375).fit('crop').auto('format').url()}
              alt={img.alt ?? `${title} — foto ${i + 1}`}
              fill
              priority={i === 0}
              sizes="(max-width: 768px) 100vw, 58vw"
              className="object-cover"
            />
          </PhotoReveal>
        ))}
      </div>

      {/* Mobile: carrossel snap */}
      <div
        className="md:hidden flex gap-2 overflow-x-auto snap-x snap-mandatory [-webkit-overflow-scrolling:touch] [scrollbar-width:none] -mx-5 px-5"
        role="list"
        aria-label={`Fotos de ${title}`}
      >
        {valid.map((img, i) => (
          <div
            key={i}
            role="listitem"
            className="relative snap-center shrink-0 w-[88vw] aspect-[4/5] overflow-hidden bg-sand-100"
          >
            <Image
              src={urlFor(img).width(800).height(1000).fit('crop').auto('format').url()}
              alt={img.alt ?? `${title} — foto ${i + 1}`}
              fill
              priority={i === 0}
              sizes="88vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </>
  )
}
