import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { formatPrice } from '@/lib/format'
import type { FilterableProduct } from '@/components/catalog/CatalogView'
import { PhotoReveal } from '@/components/motion/PhotoReveal'
import { Reveal } from '@/components/motion/Reveal'

/*
 * Home S2 — Seleção da Luiza (Fase 5h — reconstrução da seção).
 *
 * As Fases 5b/5c/5f tentaram consertar a MESMA estrutura: uma coluna de texto
 * estreita ao lado de uma foto dominante (legenda lateral). Essa estrutura
 * gerou o mesmo tipo de reclamação em rodada após rodada — desalinhamento,
 * "muito grande", vazio no desktop — porque a coluna de texto e a foto nunca
 * têm a mesma altura, e todo conserto só movia o vazio de lugar. O dono
 * mandou explicitamente MATAR a seção e refazer.
 *
 * Estrutura nova, sem a dependência de altura lado-a-lado que causava tudo
 * isso: a nota da stylist vira uma ABERTURA editorial centralizada (a
 * curadora apresentando a seleção — coerente com "a foto é a tela": o texto
 * é pequeno e preciso, não um painel), e as peças ficam numa linha de 3
 * IGUAIS abaixo. Centralizado + grid uniforme = impossível desalinhar, e
 * lê igual no mobile (empilha) e no desktop (3 colunas).
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
  const pieces = products.slice(0, 3)

  return (
    <section aria-label="Seleção da Luiza" className="bg-sand-50 py-20 md:py-28 px-[6vw]">
      <div className="max-w-[1440px] mx-auto">
        {/* Abertura editorial — a curadora apresenta a seleção. Centralizada,
            largura contida (não estica no desktop), respiro generoso abaixo. */}
        <Reveal className="max-w-[46ch] mx-auto text-center mb-14 md:mb-20">
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-ink-soft mb-6">
            A seleção da Luiza
          </p>
          {note && (
            <p className="font-display text-2xl md:text-[1.75rem] font-light italic text-ink leading-snug text-balance">
              {note}
            </p>
          )}
          <div className="w-8 h-px bg-dourado/40 mx-auto mt-8 mb-5" />
          {byline && (
            <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-ink-soft">
              {byline}
            </p>
          )}
        </Reveal>

        {/* Peças — 3 iguais. Mesmo aspecto, mesma largura: uma grade uniforme
            não tem como desalinhar. Empilha no mobile. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {pieces.map((product, i) => (
            <CuratedPiece
              key={product._id}
              product={product}
              delay={i * 0.1}
              priority={i < 3}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function CuratedPiece({
  product,
  delay = 0,
  priority = false,
}: {
  product: FilterableProduct
  delay?: number
  priority?: boolean
}) {
  return (
    <Link href={`/produto/${product.slug}`} className="group block">
      <PhotoReveal className="relative aspect-[3/4] overflow-hidden bg-sand-100" delay={delay}>
        {product.image?.asset ? (
          <Image
            src={urlFor(product.image).width(800).height(1067).fit('crop').auto('format').url()}
            alt={product.image.alt ?? product.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
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
