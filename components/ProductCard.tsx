import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

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

function formatPrice(price: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(price)
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link href={`/produto/${product.slug}`} className="group block">
      <article className="bg-sand-50 flex flex-col">
        {/* Imagem 3:4 */}
        <div className="relative aspect-[3/4] overflow-hidden bg-sand-100">
          {product.image?.asset ? (
            <Image
              src={urlFor(product.image).width(600).height(800).fit('crop').auto('format').url()}
              alt={product.image.alt ?? product.title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-sand-200 flex items-center justify-center">
              <span className="font-sans text-[10px] tracking-widest uppercase text-ink/30">
                Foto em breve
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-2">
          <h2 className="font-display text-lg md:text-xl font-light text-ink leading-tight">
            {product.title}
          </h2>
          {product.price ? (
            <p className="font-sans text-xs text-ink/60">{formatPrice(product.price)}</p>
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
