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
        {/* Breadcrumb */}
        <nav
          aria-label="Trilha de navegação"
          className="mb-8 flex items-center gap-2 font-sans text-[10px] tracking-widest uppercase text-ink-soft"
        >
          <Link href="/" className="hover:text-ink transition-colors">Início</Link>
          {product.category && (
            <>
              <span aria-hidden="true">›</span>
              <Link
                href={`/categoria/${product.category.slug}`}
                className="hover:text-ink transition-colors"
              >
                {product.category.title}
              </Link>
            </>
          )}
          <span aria-hidden="true">›</span>
          <span className="text-ink-soft">{product.title}</span>
        </nav>

        <div className="grid md:grid-cols-[58%_1fr] gap-10 lg:gap-16 items-start">
          {/* Galeria — pilha desktop / carrossel mobile */}
          <ProductGallery images={product.images ?? []} title={product.title} />

          {/* Informação */}
          <div className="flex flex-col gap-8">
            <div>
              {product.category && (
                <p className="font-sans text-[10px] tracking-widest uppercase text-ink-soft mb-2">
                  {product.category.title}
                </p>
              )}
              <h1 className="font-display text-[clamp(2rem,4vw,2.75rem)] font-[450] text-ink tracking-tight leading-tight [text-wrap:balance]">
                {product.title}
              </h1>
              {product.price ? (
                <p className="mt-4 font-sans text-xl text-ink">{formatPrice(product.price)}</p>
              ) : null}
            </div>

            <div className="h-px bg-dourado/30" />

            {product.description && product.description.length > 0 && (
              <div className="[&_p]:font-sans [&_p]:text-sm [&_p]:text-ink-soft [&_p]:leading-relaxed [&_p]:mb-3 [&_p]:max-w-[65ch] [&_blockquote]:font-sans [&_blockquote]:text-sm [&_blockquote]:text-ink-soft [&_blockquote]:leading-relaxed [&_blockquote]:mb-3 [&_strong]:font-medium [&_em]:italic">
                <PortableText value={product.description} />
              </div>
            )}

            {waHref && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-bordo text-cream-text font-sans text-[11px] tracking-widest uppercase px-8 py-4 hover:bg-bordo/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-bordo focus-visible:outline-offset-4 transition-colors self-start"
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
                className="font-sans text-[11px] tracking-wide text-esmeralda hover:text-esmeralda-light transition-colors self-start"
              >
                Não sabe se é pra você? Pergunta pra Luiza →
              </a>
            )}

            {product.category && (
              <Link
                href={`/categoria/${product.category.slug}`}
                className="font-sans text-[10px] tracking-widest uppercase text-ink-soft hover:text-ink transition-colors"
              >
                ← Ver mais em {product.category.title}
              </Link>
            )}
          </div>
        </div>

        <RelatedRail products={related} />
      </div>

      {/* CTA fixo mobile — o funil no celular; padrão aprovado, mantido */}
      {waHref ? (
        <div className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-sand-50/95 backdrop-blur-sm border-t border-dourado/30 px-5 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Quero esta peça ${product.title} (atalho fixo)`}
            className="flex w-full items-center justify-center gap-3 bg-bordo text-cream-text font-sans text-[11px] tracking-widest uppercase py-4 hover:bg-bordo/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-bordo focus-visible:outline-offset-2 transition-colors"
          >
            <WhatsAppIcon />
            Quero esta peça
          </a>
        </div>
      ) : null}
    </main>
  )
}
