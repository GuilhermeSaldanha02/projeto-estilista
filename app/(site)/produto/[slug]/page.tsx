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
        {/* Fase 7 (direção B1+B3, escolhida pelo dono): o painel de informação
            vira um BLOCO ESCURO único, contínuo com o "Combina com" logo
            abaixo — antes a área principal era clara e só o rail era escuro,
            duas linguagens na mesma página. A trilha de navegação entra
            DENTRO do painel (B1): nada claro "vazando" por cima da coluna.
            gap-0 no desktop: o painel encosta na galeria, um objeto sólido
            ao lado da foto, não um texto solto. */}
        <div className="grid md:grid-cols-[58%_1fr] gap-6 md:gap-0 items-start md:items-stretch">
          {/* Galeria — pilha desktop / carrossel mobile.
              A foto NÃO leva o corte fechado do card de grade: aqui a cliente
              quer ver a peça inteira, em detalhe. O crop apertado
              (productCardImageUrl) é só pra vitrine. */}
          <ProductGallery images={product.images ?? []} title={product.title} />

          {/* Painel escuro de informação */}
          <div className="bg-espresso text-cream-text flex flex-col gap-5 p-7 md:p-8">
            <nav
              aria-label="Trilha de navegação"
              className="flex flex-wrap items-center gap-2 font-sans text-[9px] tracking-widest uppercase text-cream-text/40"
            >
              <Link href="/" className="hover:text-cream-text transition-colors">Início</Link>
              {product.category && (
                <>
                  <span aria-hidden="true">›</span>
                  <Link
                    href={`/categoria/${product.category.slug}`}
                    className="hover:text-cream-text transition-colors"
                  >
                    {product.category.title}
                  </Link>
                </>
              )}
            </nav>

            {/* Categoria + losango dourado + status (B3) — o mesmo motivo do
                SectionHeading, costurando esta página ao resto do site. */}
            <div className="flex items-center gap-2.5 pt-1">
              {product.category && (
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-dourado">
                  {product.category.title}
                </span>
              )}
              <span aria-hidden="true" className="w-1 h-1 bg-dourado rotate-45 shrink-0" />
              <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-cream-text/40">
                Disponível
              </span>
            </div>

            <h1 className="font-display text-[clamp(1.75rem,3.2vw,2.5rem)] font-[450] text-cream-text tracking-tight leading-tight [text-wrap:balance]">
              {product.title}
            </h1>

            {product.price ? (
              <p className="font-sans text-xl text-dourado">{formatPrice(product.price)}</p>
            ) : null}

            {product.description && product.description.length > 0 && (
              <div className="[&_p]:font-sans [&_p]:text-sm [&_p]:text-cream-text/65 [&_p]:leading-relaxed [&_p]:mb-3 [&_p]:max-w-[60ch] [&_blockquote]:font-sans [&_blockquote]:text-sm [&_blockquote]:text-cream-text/65 [&_blockquote]:leading-relaxed [&_blockquote]:mb-3 [&_strong]:font-medium [&_strong]:text-cream-text [&_em]:italic">
                <PortableText value={product.description} />
              </div>
            )}

            {/* Decisão ancorada na BASE do painel (lógica da variação B2):
                o painel estica pra acompanhar a altura da foto, e sem isso a
                informação se aglomerava no topo deixando um vazio escuro
                embaixo. Hoje toda peça tem 1 foto e as alturas batem; se a
                Luiza cadastrar 2-3 fotos por peça, a galeria empilha e este
                painel fica bem mais alto — revisar aqui quando isso
                acontecer. */}
            <div className="mt-auto pt-6 flex flex-col gap-4">
              {/* CTA dourado sólido (B1). Exceção deliberada ao "bordô = botão
                  de produto" do DESIGN.md §2: sobre o painel espresso, bordô
                  (#7B1E3A) fica escuro-sobre-escuro e o botão some. O dourado
                  com texto espresso é o único que mantém o CTA legível aqui —
                  é acessibilidade, não preferência. */}
              {waHref && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-dourado text-espresso font-sans text-[11px] tracking-widest uppercase px-8 py-4 hover:bg-dourado/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-dourado focus-visible:outline-offset-4 transition-colors"
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
                  className="font-sans text-[11px] tracking-wide text-esmeralda-light hover:text-cream-text transition-colors self-start"
                >
                  Não sabe se é pra você? Pergunta pra Luiza →
                </a>
              )}

              {product.category && (
                <Link
                  href={`/categoria/${product.category.slug}`}
                  className="font-sans text-[10px] tracking-widest uppercase text-cream-text/40 hover:text-cream-text transition-colors self-start"
                >
                  ← Ver mais em {product.category.title}
                </Link>
              )}
            </div>
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
