import type { Metadata } from 'next'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import {
  productQuery,
  allProductSlugsQuery,
  settingsQuery,
} from '@/sanity/lib/queries'
import { buildWaHref, WA_MESSAGES } from '@/lib/wa'
import { formatPrice } from '@/lib/format'
import { WhatsAppIcon } from '@/components/ui/icons'
import EmptyState from '@/components/ui/EmptyState'
import ProductGallery, { type GalleryImage } from '@/components/product/ProductGallery'

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
      {/* Fase 11 — O MESMO CARD DA VITRINE, DEITADO (exemplo 2, escolhido pelo
          dono depois de analisarmos o padrão que o site já tinha).

          Nada de elemento novo: é o ProductCard — bg-espresso, rounded-xl,
          o mesmo fio `ring-cream-text/10` — só que horizontal. A foto
          preenche a metade esquerda de ponta a ponta (como preenche o topo
          no card da grade) e o texto ocupa a direita. Quem clica numa peça
          na vitrine encontra o mesmo objeto, deitado e maior.

          Tipografia herdada do card, não inventada aqui: nome em serif clara
          sobre o escuro, preço dourado, micro-rótulo dourado maiúsculo.

          max-w-[840px]: com o card em duas metades iguais e a foto em 3/4,
          a altura do card é (largura/2)*4/3. Em 840 isso dá 560px de altura,
          que cabe nos ~584px livres de uma tela de 720 (viewport - header 72
          - padding 40 - respiro). Passar disso obrigaria a rolar. */}
      <div className="max-w-[840px] mx-auto">
        <div className="bg-espresso rounded-xl ring-1 ring-cream-text/10 overflow-hidden grid md:grid-cols-2">
          {/* Metade da foto — encosta nas bordas do card */}
          <div className="aspect-[3/4]">
            <ProductGallery images={product.images ?? []} title={product.title} />
          </div>

          {/* Metade da informação */}
          <div className="flex flex-col justify-center gap-3 p-7 md:p-8">
            {product.category && (
              <span className="font-sans text-[9px] tracking-[0.22em] uppercase text-dourado">
                {product.category.title}
              </span>
            )}

            <h1 className="font-display text-[1.25rem] font-light text-cream-text tracking-tight leading-snug [text-wrap:balance]">
              {product.title}
            </h1>

            {product.price ? (
              <p className="font-sans text-sm text-dourado">{formatPrice(product.price)}</p>
            ) : null}

            <div aria-hidden="true" className="h-px bg-cream-text/15 my-0.5" />

            {product.description && product.description.length > 0 && (
              <div className="[&_p]:font-sans [&_p]:text-[13px] [&_p]:text-cream-text/60 [&_p]:leading-relaxed [&_p]:mb-2 [&_blockquote]:font-sans [&_blockquote]:text-[13px] [&_blockquote]:text-cream-text/60 [&_blockquote]:leading-relaxed [&_blockquote]:mb-2 [&_strong]:font-medium [&_strong]:text-cream-text [&_em]:italic">
                <PortableText value={product.description} />
              </div>
            )}

            {/* CTA dourado sólido. Exceção deliberada ao "bordô = botão de
                produto" do DESIGN.md §2: sobre espresso, bordô (#7B1E3A) fica
                escuro-sobre-escuro e o botão some. O par dourado/espresso
                mede 6,78:1 (AA exige 4,5:1) — é acessibilidade, não gosto. */}
            {waHref && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-3 bg-dourado text-espresso font-sans text-[10px] tracking-[0.18em] uppercase px-6 py-3.5 hover:bg-dourado/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-dourado focus-visible:outline-offset-4 transition-colors"
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
          </div>
        </div>
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
