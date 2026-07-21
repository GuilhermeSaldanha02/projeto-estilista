import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

/*
 * Fase 11 — galeria da página de produto, dentro do CARD DEITADO.
 *
 * O componente não define tamanho próprio: preenche o container que a página
 * dá (h-full/w-full). Quem manda na proporção é o card — 3/4, a mesma do
 * ProductCard da vitrine. Versões anteriores travavam largura/altura aqui
 * dentro (480x600, 420x525, clamp de viewport) e era isso que fazia o
 * tamanho brigar com o layout a cada mudança de direção.
 *
 * object-cover é seguro nesta proporção: as fotos do acervo são 4/5
 * (896x1200 = 0,747) e a caixa é 3/4 (0,75) -- o corte é de menos de 1%, a
 * peça não perde nada. Por isso NÃO se usa aqui o productCardImageUrl (o
 * corte fechado da vitrine, que puxa a peça pra fora do fundo de estúdio):
 * na página da peça a cliente quer ver o conjunto inteiro.
 *
 * Várias fotos: rolagem vertical com snap DENTRO do painel, a primeira
 * ocupando a caixa toda. Hoje toda peça tem 1 foto só.
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
      <div className="h-full w-full bg-espresso flex items-center justify-center">
        <span className="font-sans text-[10px] tracking-widest uppercase text-cream-text/55">
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
          className="relative h-full w-full snap-start"
        >
          <Image
            src={urlFor(img).width(840).height(1120).fit('crop').auto('format').url()}
            alt={img.alt ?? `${title} — foto ${i + 1}`}
            fill
            priority={i === 0}
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  )
}
