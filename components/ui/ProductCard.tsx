import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
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
}: {
  product: ProductCardData
  featured?: boolean
  /** Fase 5d: itens visíveis já no load (ex.: 1os da fila "Acabou de chegar")
   *  precisam disso -- sem `priority`, next/image carrega em lazy e, com o
   *  fundo do placeholder quase idêntico ao da seção (sand-100 sobre
   *  sand-50), o card aparece como "legenda sem foto" até a imagem chegar. */
  priority?: boolean
}) {
  return (
    <Link href={`/produto/${product.slug}`} className="group block h-full">
      <article className="bg-sand-50 flex flex-col h-full">
        {/* Imagem 3:4 */}
        <div className="relative aspect-[3/4] overflow-hidden bg-sand-100">
          {product.isNew && (
            <span className="absolute top-3 left-3 z-10 bg-sand-50/90 px-2.5 py-1 font-sans text-[9px] tracking-[0.2em] uppercase text-ink">
              Novo
            </span>
          )}
          {product.image?.asset ? (
            <>
              <Image
                src={urlFor(product.image).width(600).height(800).fit('crop').auto('format').url()}
                alt={product.image.alt ?? product.title}
                fill
                priority={priority}
                sizes={
                  featured
                    ? '(max-width: 1024px) 50vw, 50vw'
                    : '(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
                }
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
                  src={urlFor(product.image2).width(600).height(800).fit('crop').auto('format').url()}
                  alt={product.image2.alt ?? `${product.title} — outro ângulo`}
                  fill
                  sizes={
                    featured
                      ? '(max-width: 1024px) 50vw, 50vw'
                      : '(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
                  }
                  className="object-cover absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 bg-sand-200 flex items-center justify-center">
              <span className="font-sans text-[10px] tracking-widest uppercase text-ink-soft">
                Foto em breve
              </span>
            </div>
          )}
        </div>

        {/* Info — pt pequeno de propósito: o nome cola na foto, não flutua
            solto num "card" com respiro igual dos 4 lados (achado do dono:
            "ficou solto o nome" na fila Acabou de chegar). */}
        <div className="flex flex-col gap-1.5 pt-3 pb-1">
          <h3
            className={`font-display font-light text-ink leading-tight ${
              featured ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'
            }`}
          >
            {product.title}
          </h3>
          {product.price ? (
            <p className="font-sans text-sm text-ink-soft">{formatPrice(product.price)}</p>
          ) : null}
          {/* span, não Link/button aninhado — card inteiro já é o <Link> */}
          <span className="mt-1 inline-block font-sans text-[10px] tracking-widest uppercase text-bordo group-hover:text-espresso transition-colors">
            Quero esta peça →
          </span>
        </div>
      </article>
    </Link>
  )
}
