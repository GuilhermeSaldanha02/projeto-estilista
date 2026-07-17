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
 *
 * Fase 5b (feedback do dono ao ver ao vivo): a peça A estava grande demais
 * (col-span-8, 66% da largura) e a peça C não tinha `col-start` explícito —
 * o grid auto-posicionava ela na MESMA linha de B (só afastada por
 * margin-top), o que lia como "desalinhado", não como ritmo intencional.
 * Corrigido: todas as 3 peças têm posição de coluna explícita, A reduzida
 * a col-span-6 (50%), B e C lado a lado embaixo dela, sem hack de margem.
 *
 * Fase 5f (feedback do dono, medido ao vivo em 1440px): `align-items: stretch`
 * (padrão do CSS Grid) esticava a coluna da legenda para bater com a altura
 * da peça A (806px), com o conteúdo real (selo + nota + assinatura) ocupando
 * só ~220px -- 27% da altura da linha, medido: ~40% de vazio acima do bloco
 * de texto e ~33% abaixo dele. Um primeiro fix (`self-center`) tirou o
 * esticamento mas só recentralizou o mesmo bloco pequeno num campo vazio,
 * sem resolver a sensação de "flutuando sozinho ao lado de uma foto
 * imponente" -- daí o relato persistir ("no mobile fica ok, no desktop
 * não": no mobile é coluna única, sem vizinho pra criar esse vazio).
 *
 * Fase 5g: a legenda usa a altura inteira da linha COM intenção, em vez de
 * evitá-la -- `flex flex-col justify-between` distribui o bloco selo+nota
 * no topo e a assinatura ancorada no rodapé da coluna, ritmo de "abertura e
 * assinatura" (agrupamento apertado em cada ponta, separação generosa no
 * meio) em vez de um bloco isolado boiando no centro.
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
    <section aria-label="Seleção da Luiza" className="bg-sand-50 py-20 md:py-28 px-[6vw]">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-8">
        {/* Cabeçalho/legenda — col 1-4. Volta a ocupar a altura inteira da
            linha (stretch padrão do grid), mas com intenção: flex-col
            justify-between separa abertura (selo+nota) de assinatura,
            ancorando cada uma numa ponta da coluna (Fase 5g). */}
        <Reveal className="md:col-span-4 md:pr-8 md:flex md:flex-col md:justify-between">
          <div>
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-ink-soft mb-5">
              Seleção da Luiza
            </p>
            <div className="w-8 h-px bg-dourado/40 mb-6" />
            {note && (
              <p className="font-display text-xl md:text-2xl font-light italic text-ink leading-snug max-w-[24ch]">
                {note}
              </p>
            )}
          </div>
          {byline && (
            <p className="font-sans text-[10px] tracking-widest uppercase text-ink-soft mt-8 md:mt-0">
              {byline}
            </p>
          )}
        </Reveal>

        {/* Peça A — col 5-10 (50%, não mais 66%). priority: é a S2, logo após
            o hero, quase sempre acima da dobra -- mesmo achado do code
            review do PR #46 (card sem priority = lazy = "sem foto" por um
            instante), aplicado aqui como parte de terminar a home inteira. */}
        {a && (
          <div className="md:col-start-5 md:col-span-6">
            <CuratedPiece product={a} sizes="(max-width: 768px) 100vw, 50vw" ratio="aspect-[4/5]" priority />
          </div>
        )}

        {/* B e C — lado a lado, mesma linha, mesma largura de A somada.
            Posição explícita nas duas: nada de auto-placement adivinhando. */}
        {b && (
          <div className="md:col-start-5 md:col-span-3">
            <CuratedPiece product={b} sizes="(max-width: 768px) 100vw, 25vw" ratio="aspect-[3/4]" delay={0.12} />
          </div>
        )}
        {c && (
          <div className="md:col-start-8 md:col-span-3">
            <CuratedPiece product={c} sizes="(max-width: 768px) 100vw, 25vw" ratio="aspect-[3/4]" delay={0.24} />
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
  priority = false,
}: {
  product: FilterableProduct
  sizes: string
  ratio: string
  delay?: number
  priority?: boolean
}) {
  return (
    <Link href={`/produto/${product.slug}`} className="group block">
      <PhotoReveal className={`relative ${ratio} overflow-hidden bg-sand-100`} delay={delay}>
        {product.image?.asset ? (
          <Image
            src={urlFor(product.image).width(1000).height(1250).fit('crop').auto('format').url()}
            alt={product.image.alt ?? product.title}
            fill
            priority={priority}
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
