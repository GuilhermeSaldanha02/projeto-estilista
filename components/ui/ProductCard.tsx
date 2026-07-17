import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { formatPrice } from '@/lib/format'

export type ProductCardData = {
  _id: string
  title: string
  slug: string
  price?: number | null
  image?: {
    asset: { _ref: string; _type: string }
    crop?: { top: number; bottom: number; left: number; right: number } | null
    hotspot?: { x: number; y: number; width: number; height: number } | null
    alt?: string
  } | null
}

export default function ProductCard({
  product,
  featured = false,
}: {
  product: ProductCardData
  featured?: boolean
}) {
  return (
    <Link href={`/produto/${product.slug}`} className="group block h-full">
      <article className="bg-sand-50 flex flex-col h-full">
        {/* Imagem 3:4 */}
        <div className="relative aspect-[3/4] overflow-hidden bg-sand-100">
          {product.image?.asset ? (
            <Image
              src={urlFor(product.image).width(600).height(800).fit('crop').auto('format').url()}
              alt={product.image.alt ?? product.title}
              fill
              sizes={
                featured
                  ? '(max-width: 1024px) 50vw, 50vw'
                  : '(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
              }
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
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
