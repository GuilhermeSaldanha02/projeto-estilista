import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

/*
 * Fase 10 — galeria da página de produto, reescrita do zero.
 *
 * O componente NÃO define mais tamanho próprio: ele preenche o container que
 * o chamador dá (h-full/w-full). Quem manda na altura é a página — no
 * desktop, metade da tela inteira; no mobile, uma proporção 4/5. Todas as
 * versões anteriores travavam largura/altura aqui dentro (480x600, 420x525,
 * clamp de viewport), e era isso que fazia o tamanho brigar com o layout a
 * cada mudança de direção.
 *
 * object-contain, não object-cover: num painel de meia tela (≈640x648 num
 * monitor de 1280x720) uma foto 4/5 seria cortada no topo e na base pelo
 * cover -- em loja de roupa isso corta a peça, que é justamente o que a
 * cliente veio ver. Com contain a peça aparece inteira SEMPRE, e o espresso
 * em volta vira a moldura naturalmente, sem precisar desenhar borda.
 *
 * Várias fotos: rolagem vertical com snap DENTRO do painel — a primeira
 * continua ocupando a tela inteira, as outras ficam a um scroll de
 * distância. Hoje toda peça tem 1 foto só.
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
      <div className="h-full w-full flex items-center justify-center">
        <span className="font-sans text-[10px] tracking-widest uppercase text-cream-text/40">
          Foto em breve
        </span>
      </div>
    )
  }

  return (
    <div
      className="h-full w-full overflow-y-auto snap-y snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      role={valid.length > 1 ? 'list' : undefined}
      aria-label={valid.length > 1 ? `Fotos de ${title}` : undefined}
    >
      {valid.map((img, i) => (
        <div
          key={i}
          role={valid.length > 1 ? 'listitem' : undefined}
          className="relative h-full w-full snap-start p-6 md:p-10"
        >
          <Image
            src={urlFor(img).width(1000).height(1250).fit('crop').auto('format').url()}
            alt={img.alt ?? `${title} — foto ${i + 1}`}
            fill
            priority={i === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
          />
        </div>
      ))}
    </div>
  )
}
