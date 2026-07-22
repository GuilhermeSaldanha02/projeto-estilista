import Link from 'next/link'
import Image from 'next/image'
import { productCardImageUrl } from '@/sanity/lib/image'
import { formatPrice } from '@/lib/format'

type ProductImage = {
  asset: { _ref: string; _type: string }
  crop?: { top: number; bottom: number; left: number; right: number } | null
  hotspot?: { x: number; y: number; width: number; height: number } | null
  alt?: string
} | null

export type ProductCardData = {
  _id: string
  title: string
  slug: string
  price?: number | null
  isNew?: boolean | null
  image?: ProductImage
  /** 2ª foto (Fase 5e) — crossfade no hover, se existir. Pesquisado em
   *  varejo real (Reformation, Ganni): dá sensação de "vivo" sem 3D/vídeo. */
  image2?: ProductImage
}

export default function ProductCard({
  product,
  featured = false,
  priority = false,
  onDark = false,
  sizes,
}: {
  product: ProductCardData
  featured?: boolean
  /** Fase 5d: itens visíveis já no load (ex.: 1os da fila "Acabou de chegar")
   *  precisam disso -- sem `priority`, next/image carrega em lazy e, com o
   *  fundo do placeholder quase idêntico ao da seção (sand-100 sobre
   *  sand-50), o card aparece como "legenda sem foto" até a imagem chegar. */
  priority?: boolean
  /** Fase 6 (direção escura, decidida com o dono a partir da referência
   *  3dgallery): a peça vira um objeto sólido sobre o fundo creme — foto no
   *  topo, nome/preço numa base própria. Era isso que matava o "solto": o
   *  nome apoiado numa superfície, não flutuando no creme vazio. Usado no
   *  catálogo e nas duas seções da home. */
  onDark?: boolean
  /** O card vive em geometrias diferentes (grid do catálogo, grid 3-up da
   *  home, rail horizontal), então quem posiciona informa a largura real.
   *  Com um `sizes` único o navegador errava nos dois sentidos: baixava
   *  imagem grande demais no grid desktop e pequena demais no rail. */
  sizes?: string
}) {
  const resolvedSizes =
    sizes ?? (featured ? '(max-width: 1024px) 50vw, 50vw' : '(max-width: 640px) 50vw, 300px')

  return (
    <Link href={`/produto/${product.slug}`} className="group block h-full">
      <article
        className={`flex flex-col h-full overflow-hidden ${
          onDark
            ? 'bg-espresso rounded-xl ring-1 ring-cream-text/10'
            : 'bg-sand-50'
        }`}
      >
        {/* Imagem 3:4 */}
        <div
          className={`relative aspect-[3/4] overflow-hidden ${
            onDark ? 'bg-espresso' : 'bg-sand-100'
          }`}
        >
          {product.isNew && (
            <span
              className={`absolute top-3 left-3 z-10 px-2.5 py-1 font-sans text-[9px] tracking-[0.2em] uppercase ${
                onDark ? 'bg-espresso/80 text-dourado' : 'bg-sand-50/90 text-ink'
              }`}
            >
              Novo
            </span>
          )}
          {product.image?.asset ? (
            <>
              <Image
                src={productCardImageUrl(product.image, 600, 800)}
                alt={product.image.alt ?? product.title}
                fill
                priority={priority}
                sizes={resolvedSizes}
                className={`object-cover ${
                  product.image2?.asset
                    ? 'transition-opacity duration-300 group-hover:opacity-0'
                    : 'transition-transform duration-500 group-hover:scale-105'
                }`}
              />
              {/* 2ª foto: crossfade puro no hover, sem zoom -- a 1ª já é a
                  "parada", a 2ª é o "movimento" (Fase 5e). */}
              {product.image2?.asset && (
                <Image
                  src={productCardImageUrl(product.image2, 600, 800)}
                  alt={product.image2.alt ?? `${product.title} — outro ângulo`}
                  fill
                  sizes={resolvedSizes}
                  className="object-cover absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <div
              className={`absolute inset-0 flex items-center justify-center ${
                onDark ? 'bg-espresso' : 'bg-sand-200'
              }`}
            >
              <span
                className={`font-sans text-[10px] tracking-widest uppercase ${
                  onDark ? 'text-cream-text/55' : 'text-ink-soft'
                }`}
              >
                Foto em breve
              </span>
            </div>
          )}
        </div>

        {/* Info — o nome fica apoiado numa base própria do card: no escuro
            uma superfície sólida (o card é um objeto, o nome não flutua); no
            claro, a régua dourada nasce da foto. Ambos matam o "solto".
            Nome e preço EMPILHAM no mobile e só dividem a linha de base a
            partir de sm. No grid 2-up de 375px o card tem ~155px: com os
            dois na mesma linha e o preço `shrink-0`, um preço de 4 dígitos
            deixava ~51px pro nome (quebrava em 4 linhas). O padding também
            cai no mobile -- px-5 num card de 155px é 26% da largura. */}
        {onDark ? (
          <div className="flex flex-col gap-3 px-3 sm:px-5 pt-3 sm:pt-4 pb-4 sm:pb-5">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-3">
              <h3
                className={`font-display font-light text-cream-text leading-tight ${
                  featured ? 'text-2xl md:text-3xl' : 'text-base sm:text-lg md:text-xl'
                }`}
              >
                {product.title}
              </h3>
              {product.price ? (
                <p className="sm:shrink-0 font-sans text-sm text-dourado">
                  {formatPrice(product.price)}
                </p>
              ) : null}
            </div>
            <span className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.18em] uppercase text-dourado group-hover:gap-3 transition-[gap]">
              Quero esta peça <span aria-hidden="true">→</span>
            </span>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-3 border-t border-ink/10 pt-2.5">
            <h3
              className={`font-display font-light text-ink leading-tight ${
                featured ? 'text-2xl md:text-3xl' : 'text-base sm:text-lg md:text-xl'
              }`}
            >
              {product.title}
            </h3>
            {product.price ? (
              <p className="sm:shrink-0 font-sans text-sm text-ink-soft">{formatPrice(product.price)}</p>
            ) : null}
          </div>
        )}
      </article>
    </Link>
  )
}
