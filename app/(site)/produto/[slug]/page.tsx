import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import EmptyState from '@/components/EmptyState'
import { formatPrice } from '@/lib/format'
import { WhatsAppIcon } from '@/components/icons'

// ISR — SDD §1: produto reflete o que a dona publica sem rebuild manual
export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

type SanityImage = {
  asset: { _ref: string; _type: string }
  crop?: { top: number; bottom: number; left: number; right: number } | null
  hotspot?: { x: number; y: number; width: number; height: number } | null
  alt?: string
}

type Product = {
  _id: string
  title: string
  slug: string
  price?: number | null
  description?: PortableTextBlock[] | null
  inStock: boolean
  images: SanityImage[]
  category?: { title: string; slug: string } | null
}

const productQuery = `
  *[_type == "product" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, price, description, inStock,
    "images": images[] { asset, crop, hotspot, alt },
    "category": category->{ title, "slug": slug.current }
  }
`

const settingsQuery = `*[_type == "siteSettings"][0]{ whatsappNumber }`

const allProductSlugsQuery = `
  *[_type == "product" && inStock == true] { "slug": slug.current }
`

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

export default async function ProdutoPage({ params }: Props) {
  const { slug } = await params

  const [product, settings] = await Promise.all([
    client.fetch<Product | null>(productQuery, { slug }),
    client.fetch<{ whatsappNumber?: string } | null>(settingsQuery),
  ])

  if (!product || !product.inStock) {
    const waScheduleHref = settings?.whatsappNumber
      ? `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Oi! Gostaria de agendar um horário de personal styling.')}`
      : undefined
    return (
      <EmptyState
        headline="Esta peça saiu de cena."
        body="Não está mais disponível — mas a stylist pode te ajudar a encontrar algo especial."
        primaryHref="/colecao/novidades"
        primaryLabel="Ver novidades"
        secondaryHref={waScheduleHref}
        secondaryLabel={waScheduleHref ? 'Falar com a stylist' : undefined}
        secondaryExternal={!!waScheduleHref}
      />
    )
  }

  const whatsappNumber = settings?.whatsappNumber
  const waMessage = `Oi! Tenho interesse na peça ${product.title}.`
  const waHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`
    : null

  const [mainImage, ...extraImages] = product.images ?? []

  const descPlain = product.description
    ? extractPlainText(
        product.description as Array<{ _type: string; children?: Array<{ text?: string }> }>
      ).slice(0, 300)
    : undefined

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
    <main className="min-h-screen pt-10 pb-28 md:pb-10 px-5 max-w-6xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb */}
      <nav aria-label="Trilha de navegação" className="mb-8 flex items-center gap-2 font-sans text-[10px] tracking-widest uppercase text-ink/65">
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
        <span className="text-ink/70">{product.title}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* ── COLUNA DE IMAGENS ── */}
        <div className="flex flex-col gap-4">
          {/* Imagem principal */}
          {mainImage?.asset ? (
            <div className="relative aspect-[3/4] lg:aspect-[4/5] overflow-hidden bg-sand-100">
              <Image
                src={urlFor(mainImage).width(900).height(1200).fit('crop').auto('format').url()}
                alt={mainImage.alt ?? product.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="aspect-[3/4] lg:aspect-[4/5] bg-sand-100 flex items-center justify-center">
              <span className="font-sans text-[10px] tracking-widest uppercase text-ink/65">
                Foto em breve
              </span>
            </div>
          )}

          {/* Imagens extras */}
          {extraImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {extraImages.map((img, i) =>
                img?.asset ? (
                  <div key={i} className="relative aspect-[3/4] overflow-hidden bg-sand-100">
                    <Image
                      src={urlFor(img).width(300).height(400).fit('crop').auto('format').url()}
                      alt={img.alt ?? `${product.title} — foto ${i + 2}`}
                      fill
                      sizes="(max-width: 768px) 33vw, 17vw"
                      className="object-cover"
                    />
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>

        {/* ── COLUNA DE DETALHES ── */}
        <div className="flex flex-col gap-8 md:gap-10">
          {/* Cabeçalho */}
          <div>
            {product.category && (
              <p className="font-sans text-[10px] tracking-widest uppercase text-ink/65 mb-2">
                {product.category.title}
              </p>
            )}
            <h1 className="font-display text-5xl md:text-6xl font-light text-ink tracking-tight leading-tight [text-wrap:balance]">
              {product.title}
            </h1>
            {product.price ? (
              <p className="mt-4 font-sans text-xl md:text-2xl text-ink">
                {formatPrice(product.price)}
              </p>
            ) : null}
          </div>

          {/* Linha divisória */}
          <div className="h-px bg-dourado/30" />

          {/* Descrição */}
          {product.description && product.description.length > 0 && (
            <div className="[&_p]:font-sans [&_p]:text-sm [&_p]:text-ink/75 [&_p]:leading-relaxed [&_p]:mb-3 [&_strong]:font-medium [&_em]:italic">
              <PortableText value={product.description} />
            </div>
          )}

          {/* CTA WhatsApp */}
          {waHref ? (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-bordo text-cream-text font-sans text-[11px] tracking-widest uppercase px-8 py-4 hover:bg-bordo/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-bordo focus-visible:outline-offset-4 transition-colors"
            >
              <WhatsAppIcon />
              Quero esta peça
            </a>
          ) : null}

          {/* Link voltar */}
          {product.category && (
            <Link
              href={`/categoria/${product.category.slug}`}
              className="font-sans text-[10px] tracking-widest uppercase text-ink/65 hover:text-ink transition-colors mt-2"
            >
              ← Ver mais em {product.category.title}
            </Link>
          )}
        </div>
      </div>

      {/* CTA sticky mobile: garante o WhatsApp acima da dobra em telas pequenas
          (o botão inline acima permanece para quem rola até o fim) */}
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
