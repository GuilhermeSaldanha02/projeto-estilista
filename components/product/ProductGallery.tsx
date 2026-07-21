import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { PhotoReveal } from '@/components/motion/PhotoReveal'

/*
 * Fase 9 — galeria da página de produto, montada DENTRO da moldura escura
 * (direção T, escolhida pelo dono): o bloco espresso emoldura a foto e a
 * informação fica fora dele, no claro.
 *
 * Tamanho FIXO, não fluido (pedido explícito: "elas estão como adaptativas e
 * não é isso que quero"). 420x525 no desktop, escolhido por duas restrições
 * que se cruzam:
 *  - CABER NA TELA sem rolar: em 1280x720 sobram ~584px (viewport - header 72
 *    - padding 40 - respiro). Com os 28px da moldura, 525 de foto fecha em
 *    553px de bloco.
 *  - ficar perto da faixa de loja real medida ao vivo (Toteme 494px,
 *    Amaro 543px, Shoulder 633px de largura).
 * É menor que as referências de propósito: elas não têm moldura em volta.
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
      <div className="w-full sm:w-[420px] aspect-[4/5] bg-espresso/40 flex items-center justify-center">
        <span className="font-sans text-[10px] tracking-widest uppercase text-cream-text/40">
          Foto em breve
        </span>
      </div>
    )
  }

  return (
    <>
      {/* Desktop: pilha vertical, tamanho FIXO (não cresce com a viewport) */}
      <div className="hidden sm:flex flex-col gap-3.5">
        {valid.map((img, i) => (
          <PhotoReveal
            key={i}
            className="relative w-[420px] h-[525px] overflow-hidden bg-espresso/40"
          >
            <Image
              src={urlFor(img).width(840).height(1050).fit('crop').auto('format').url()}
              alt={img.alt ?? `${title} — foto ${i + 1}`}
              fill
              priority={i === 0}
              sizes="420px"
              className="object-cover"
            />
          </PhotoReveal>
        ))}
      </div>

      {/* Mobile (<640px): carrossel snap. Aqui a largura acompanha a tela por
          necessidade -- 420px fixos não caberiam num aparelho de 375px. */}
      <div
        className="sm:hidden flex gap-2 overflow-x-auto snap-x snap-mandatory [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label={`Fotos de ${title}`}
      >
        {valid.map((img, i) => (
          <div
            key={i}
            role="listitem"
            className="relative snap-center shrink-0 w-full aspect-[4/5] overflow-hidden bg-espresso/40"
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
