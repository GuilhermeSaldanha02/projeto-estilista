import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { formatPrice } from '@/lib/format'
import type { FilterableProduct } from '@/components/catalog/CatalogView'
import { PhotoReveal } from '@/components/motion/PhotoReveal'
import { Reveal } from '@/components/motion/Reveal'

/*
 * Home S2 — Seleção da Luiza (Fase 5, blueprint).
 * A curadoria é o que faz isto ser loja COM ponto de vista: a nota da
 * stylist (siteSettings.curatorNote) deixa de ser seção isolada e vira
 * LEGENDA da seleção — texto e produto conversando no mesmo bloco.
 * Composição assimétrica desenhada para 2-4 peças (nunca grid esticado):
 * peça A grande à direita, B e C abaixo em escada com offset vertical.
 */
export default function CuratedSelection({
  products,
  note,
  byline,
}: {
  products: FilterableProduct[]
  note?: string | null
  byline?: string | null
}) {
  if (products.length === 0) return null
  const [a, b, c] = products

  return (
    <section aria-label="Seleção da Luiza" className="bg-sand-50 py-24 md:py-32 px-[6vw]">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-12">
        {/* Cabeçalho/legenda — col 1-4, gruda no topo da composição */}
        <Reveal className="md:col-span-4 md:pr-8">
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-ink-soft mb-5">
            Seleção da Luiza
          </p>
          <div className="w-8 h-px bg-dourado/40 mb-6" />
          {note && (
            <p className="font-display text-xl md:text-2xl font-light italic text-ink leading-snug mb-4 max-w-[24ch]">
              {note}
            </p>
          )}
          {byline && (
            <p className="font-sans text-[10px] tracking-widest uppercase text-ink-soft">
              {byline}
            </p>
          )}
        </Reveal>

        {/* Peça A — dominante, col 5-12 */}
        {a && (
          <div className="md:col-span-8">
            <CuratedPiece product={a} sizes="(max-width: 768px) 100vw, 60vw" ratio="aspect-[4/5]" />
          </div>
        )}

        {/* B e C — escada com offset (ritmo, não grade) */}
        {b && (
          <div className="md:col-span-4 md:col-start-5">
            <CuratedPiece product={b} sizes="(max-width: 768px) 100vw, 30vw" ratio="aspect-[3/4]" delay={0.12} />
          </div>
        )}
        {c && (
          <div className="md:col-span-4 md:mt-16">
            <CuratedPiece product={c} sizes="(max-width: 768px) 100vw, 30vw" ratio="aspect-[3/4]" delay={0.24} />
          </div>
        )}
      </div>
    </section>
  )
}

function CuratedPiece({
  product,
  sizes,
  ratio,
  delay = 0,
}: {
  product: FilterableProduct
  sizes: string
  ratio: string
  delay?: number
}) {
  return (
    <Link href={`/produto/${product.slug}`} className="group block">
      <PhotoReveal className={`relative ${ratio} overflow-hidden bg-sand-100`} delay={delay}>
        {product.image?.asset ? (
          <Image
            src={urlFor(product.image).width(1000).height(1250).fit('crop').auto('format').url()}
            alt={product.image.alt ?? product.title}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-sans text-[10px] tracking-widest uppercase text-ink-soft">
              Foto em breve
            </span>
          </div>
        )}
      </PhotoReveal>
      <div className="flex items-baseline justify-between pt-4">
        <h3 className="font-display text-lg font-light text-ink leading-tight">{product.title}</h3>
        {product.price ? (
          <p className="font-sans text-xs text-ink-soft shrink-0 pl-4">{formatPrice(product.price)}</p>
        ) : null}
      </div>
    </Link>
  )
}
