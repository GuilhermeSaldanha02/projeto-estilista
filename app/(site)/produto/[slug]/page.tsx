import type { Metadata } from 'next'
import Link from 'next/link'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import {
  productQuery,
  allProductSlugsQuery,
  relatedProductsQuery,
  settingsQuery,
} from '@/sanity/lib/queries'
import { buildWaHref, WA_MESSAGES } from '@/lib/wa'
import { formatPrice } from '@/lib/format'
import { WhatsAppIcon } from '@/components/ui/icons'
import EmptyState from '@/components/ui/EmptyState'
import ProductGallery, { type GalleryImage } from '@/components/product/ProductGallery'
import RelatedRail from '@/components/product/RelatedRail'
import type { FilterableProduct } from '@/components/catalog/CatalogView'

// ISR — produto reflete o que a dona publica sem rebuild manual
export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

type Product = {
  _id: string
  title: string
  slug: string
  price?: number | null
  description?: PortableTextBlock[] | null
  inStock: boolean
  images: GalleryImage[]
  category?: { title: string; slug: string } | null
}

export async function generateStaticParams() {
  const products = await client.fetch<{ slug: string }[]>(allProductSlugsQuery)
  return products.map(p => ({ slug: p.slug }))
}

function extractPlainText(
  blocks: Array<{ _type: string; children?: Array<{ text?: string }> }>
): string {
  return blocks
    .filter(b => b._type === 'block')
    .flatMap(b => b.children ?? [])
    .map(c => c.text ?? '')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await client.fetch<{
    title: string
    inStock: boolean
    firstImage?: { asset?: { _ref: string }; alt?: string }
    description?: Array<{ _type: string; children?: Array<{ text?: string }> }>
  } | null>(
    `*[_type == "product" && slug.current == $slug][0]{
      title,
      inStock,
      "firstImage": images[0] { asset, alt },
      description
    }`,
    { slug }
  )
  if (!product || !product.inStock) return { title: 'Peça não encontrada' }

  const descText = product.description
    ? extractPlainText(product.description).slice(0, 160)
    : ''
  const description = descText || `${product.title} — disponível na LT Studio.`

  const ogImageUrl = product.firstImage?.asset
    ? urlFor(product.firstImage).width(1200).height(630).fit('crop').auto('format').url()
    : undefined

  return {
    title: product.title,
    description,
    openGraph: ogImageUrl
      ? {
          title: product.title,
          description,
          images: [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: product.firstImage?.alt ?? product.title,
            },
          ],
        }
      : undefined,
  }
}

/*
 * Fase 5 (Reconstrução) — página de produto nova: 58% galeria em pilha /
 * 42% informação (mesmo split de proporção do hero — coerência entre
 * páginas). "Quero esta peça" (bordô sólido) é o único botão; a consultoria
 * entra como link de texto — nunca segundo botão no mesmo momento de
 * decisão. "Combina com" fecha a página — sem beco sem saída.
 */
export default async function ProdutoPage({ params }: Props) {
  const { slug } = await params

  const [product, settings] = await Promise.all([
    client.fetch<Product | null>(productQuery, { slug }),
    client.fetch<{ whatsappNumber?: string } | null>(settingsQuery),
  ])

  if (!product || !product.inStock) {
    const waScheduleHref = buildWaHref(settings?.whatsappNumber, WA_MESSAGES.agendar)
    return (
      <EmptyState
        headline="Esta peça saiu de cena."
        body="Não está mais disponível — mas a stylist pode te ajudar a encontrar algo especial."
        primaryHref="/vitrine"
        primaryLabel="Ver a vitrine"
        secondaryHref={waScheduleHref ?? undefined}
        secondaryLabel={waScheduleHref ? 'Falar com a stylist' : undefined}
        secondaryExternal={!!waScheduleHref}
      />
    )
  }

  const related = product.category
    ? await client.fetch<FilterableProduct[]>(relatedProductsQuery, {
        categorySlug: product.category.slug,
        slug: product.slug,
      })
    : []

  const waHref = buildWaHref(settings?.whatsappNumber, WA_MESSAGES.peca(product.title))
  const waConsultHref = buildWaHref(
    settings?.whatsappNumber,
    WA_MESSAGES.consultoriaSobrePeca(product.title)
  )

  const descPlain = product.description
    ? extractPlainText(
        product.description as Array<{ _type: string; children?: Array<{ text?: string }> }>
      ).slice(0, 300)
    : undefined

  const mainImage = product.images?.[0]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    ...(mainImage?.asset && {
      image: urlFor(mainImage).width(1200).height(1600).fit('crop').auto('format').url(),
    }),
    ...(descPlain && { description: descPlain }),
    brand: { '@type': 'Brand', name: 'LT Studio' },
  }

  return (
    <main className="min-h-screen pt-10 pb-28 md:pb-24 px-[6vw]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-[1440px] mx-auto">
        {/* Fase 8 (direção N1, escolhida pelo dono): a página inteira vira UM
            CARD ESCURO centralizado -- a moldura espresso envolve a foto pelos
            quatro lados, os dados e o botão. Substitui a estrutura de duas
            colunas (foto | painel), que foi rejeitada em várias rodadas: com
            poucos dados cadastrados, uma coluna de texto ao lado de uma foto
            alta sempre deixava vazio, não importava o ajuste.
            Coluna única e estreita = não existem duas alturas pra conciliar.
            Escala tipográfica das referências medidas ao vivo (Toteme: nome
            16px, preço 14px; Shoulder: nome 18px) -- não o 32px anterior. */}
        {/* w-full no mobile / w-fit só a partir de sm: com `w-fit` puro, o
            carrossel interno (que usa w-full) não tinha largura de
            referência e colapsava -- card de 266px e foto sem renderizar
            num aparelho de 375px (medido ao vivo). */}
        <div className="mx-auto w-full max-w-[520px] sm:w-fit sm:max-w-none bg-espresso text-cream-text p-4 sm:p-5">
          {/* Galeria em tamanho FIXO (480x600), não fluida.
              A foto NÃO leva o corte fechado do card de grade: aqui a cliente
              quer ver a peça inteira, em detalhe. O crop apertado
              (productCardImageUrl) é só pra vitrine. */}
          <ProductGallery images={product.images ?? []} title={product.title} />

          <div className="w-full sm:w-[480px] pt-6 flex flex-col items-center text-center gap-2.5">
            {product.category && (
              <span className="font-sans text-[9px] tracking-[0.22em] uppercase text-dourado">
                {product.category.title}
              </span>
            )}

            <h1 className="font-display text-[1.0625rem] font-[450] text-cream-text tracking-tight leading-snug [text-wrap:balance]">
              {product.title}
            </h1>

            <div aria-hidden="true" className="w-[18px] h-px bg-dourado/70 my-1" />

            {product.price ? (
              <p className="font-sans text-[13px] text-cream-text/65">
                {formatPrice(product.price)}
              </p>
            ) : null}

            {product.description && product.description.length > 0 && (
              <div className="max-w-[46ch] [&_p]:font-sans [&_p]:text-[13px] [&_p]:text-cream-text/60 [&_p]:leading-relaxed [&_p]:mb-2 [&_blockquote]:font-sans [&_blockquote]:text-[13px] [&_blockquote]:text-cream-text/60 [&_blockquote]:leading-relaxed [&_blockquote]:mb-2 [&_strong]:font-medium [&_strong]:text-cream-text [&_em]:italic">
                <PortableText value={product.description} />
              </div>
            )}

            {/* CTA dourado sólido. Exceção deliberada ao "bordô = botão de
                produto" do DESIGN.md §2: sobre espresso, bordô (#7B1E3A) fica
                escuro-sobre-escuro e o botão some. O dourado com texto
                espresso mede 6,78:1 — é acessibilidade, não preferência. */}
            {waHref && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full inline-flex items-center justify-center gap-3 bg-dourado text-espresso font-sans text-[10px] tracking-[0.14em] uppercase px-6 py-3.5 hover:bg-dourado/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-dourado focus-visible:outline-offset-4 transition-colors"
              >
                <WhatsAppIcon />
                Quero esta peça
              </a>
            )}

            {/* Consultoria como link de texto — nunca segundo botão */}
            {waConsultHref && (
              <a
                href={waConsultHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 font-sans text-[10px] tracking-wide text-esmeralda-light hover:text-cream-text transition-colors"
              >
                Não sabe se é pra você? Pergunta pra Luiza →
              </a>
            )}
          </div>
        </div>

        <RelatedRail products={related} />
      </div>

      {/* CTA fixo mobile — o funil no celular. Dourado sobre espresso, igual
          ao CTA do painel: com o botão do painel dourado, manter este bordô
          deixaria duas cores de CTA na mesma tela. */}
      {waHref ? (
        <div className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-espresso/95 backdrop-blur-sm border-t border-dourado/30 px-5 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Quero esta peça ${product.title} (atalho fixo)`}
            className="flex w-full items-center justify-center gap-3 bg-dourado text-espresso font-sans text-[11px] tracking-widest uppercase py-4 hover:bg-dourado/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-dourado focus-visible:outline-offset-2 transition-colors"
          >
            <WhatsAppIcon />
            Quero esta peça
          </a>
        </div>
      ) : null}
    </main>
  )
}
