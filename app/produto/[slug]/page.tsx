import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

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
    firstImage?: { asset?: { _ref: string }; alt?: string }
    description?: Array<{ _type: string; children?: Array<{ text?: string }> }>
  } | null>(
    `*[_type == "product" && slug.current == $slug][0]{
      title,
      "firstImage": images[0] { asset, alt },
      description
    }`,
    { slug }
  )
  if (!product) return { title: 'Peça não encontrada' }

  const descText = product.description
    ? extractPlainText(product.description).slice(0, 160)
    : ''
  const description = descText || `${product.title} — disponível na Estilista.`

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

function formatPrice(price: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(price)
}

export default async function ProdutoPage({ params }: Props) {
  const { slug } = await params

  const [product, settings] = await Promise.all([
    client.fetch<Product | null>(productQuery, { slug }),
    client.fetch<{ whatsappNumber?: string } | null>(settingsQuery),
  ])

  if (!product) {
    return (
      <PecaNaoEncontrada />
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
    brand: { '@type': 'Brand', name: 'Estilista' },
  }

  return (
    <main className="min-h-screen py-10 px-5 max-w-6xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb */}
      <nav aria-label="Navegação" className="mb-8 flex items-center gap-2 font-sans text-[10px] tracking-widest uppercase text-ink/65">
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
            <div className="relative aspect-[3/4] overflow-hidden bg-sand-100">
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
            <div className="aspect-[3/4] bg-sand-100 flex items-center justify-center">
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
        <div className="flex flex-col gap-6">
          {/* Cabeçalho */}
          <div>
            {product.category && (
              <p className="font-sans text-[10px] tracking-widest uppercase text-ink/65 mb-2">
                {product.category.title}
              </p>
            )}
            <h1 className="font-display text-3xl md:text-4xl font-light text-ink leading-tight">
              {product.title}
            </h1>
            {product.price ? (
              <p className="mt-3 font-sans text-base text-ink/70">
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
    </main>
  )
}

function PecaNaoEncontrada() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center text-center px-5">
      <p className="font-sans text-[10px] tracking-widest uppercase text-ink/40 mb-4">
        Estilista
      </p>
      <h1 className="font-display text-3xl md:text-4xl font-light text-ink mb-3">
        Peça não encontrada
      </h1>
      <p className="font-sans text-sm text-ink/60 mb-8 max-w-xs">
        Esta peça não está mais disponível ou foi removida.
      </p>
      <Link
        href="/"
        className="font-sans text-[10px] tracking-widest uppercase text-espresso hover:text-bordo transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-bordo focus-visible:outline-offset-4"
      >
        ← Voltar ao início
      </Link>
    </main>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
