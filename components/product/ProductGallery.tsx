import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { PhotoReveal } from '@/components/motion/PhotoReveal'

/*
 * Fase 8 — galeria da página de produto, dentro do card escuro (direção N1).
 *
 * Tamanho FIXO, não fluido (pedido explícito do dono: "cuidado com o tamanho
 * das imagens, elas estão como adaptativas e não é isso que quero"). Antes a
 * coluna era `minmax(0,520px)` e a foto crescia/encolhia com a viewport.
 * Agora a foto tem 480x600 fixos no desktop -- dentro da faixa medida ao vivo
 * em loja real (Toteme 494px, Amaro 543px, Shoulder 633px de largura).
 * Só encolhe abaixo de 520px de tela, onde não caberia de outro jeito.
 *
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
      <div className="w-full sm:w-[480px] aspect-[4/5] bg-espresso/50 flex items-center justify-center">
        <span className="font-sans text-[10px] tracking-widest uppercase text-cream-text/40">
          Foto em breve
        </span>
      </div>
    )
  }

  return (
    <>
      {/* Desktop: pilha vertical, largura FIXA (não cresce com a viewport) */}
      <div className="hidden sm:flex flex-col gap-3">
        {valid.map((img, i) => (
          <PhotoReveal
            key={i}
            className="relative w-[480px] h-[600px] overflow-hidden bg-espresso/50"
          >
            <Image
              src={urlFor(img).width(960).height(1200).fit('crop').auto('format').url()}
              alt={img.alt ?? `${title} — foto ${i + 1}`}
              fill
              priority={i === 0}
              sizes="480px"
              className="object-cover"
            />
          </PhotoReveal>
        ))}
      </div>

      {/* Mobile (<640px): carrossel snap. Aqui a largura acompanha a tela por
          necessidade -- 480px fixos não caberiam num aparelho de 375px. */}
      <div
        className="sm:hidden flex gap-2 overflow-x-auto snap-x snap-mandatory [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label={`Fotos de ${title}`}
      >
        {valid.map((img, i) => (
          <div
            key={i}
            role="listitem"
            className="relative snap-center shrink-0 w-full aspect-[4/5] overflow-hidden bg-espresso/50"
          >
            <Image
              src={urlFor(img).width(800).height(1000).fit('crop').auto('format').url()}
              alt={img.alt ?? `${title} — foto ${i + 1}`}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </>
  )
}
