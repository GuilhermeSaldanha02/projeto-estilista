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
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Fase 10 — página reescrita do zero, sem herdar nenhuma das direções
          anteriores (pedido do dono depois de várias rodadas em círculo).

          TELA DIVIDIDA EM DUAS METADES DE ALTURA TOTAL. A peça ocupa a
          metade esquerda inteira sobre o espresso; a informação fica
          centralizada na metade direita, no creme. Nada contém a foto: sem
          moldura, sem card, sem painel — o próprio escuro emoldura.

          Isso resolve de uma vez três coisas que voltavam a cada rodada:
           - descompasso de altura entre foto e texto (as duas metades têm
             exatamente a mesma altura, por construção);
           - "tem que caber na tela" (a página é UMA tela, nada abaixo da
             dobra — e o "Combina com" já saiu);
           - espaço morto sobrando de um lado (não existe mais coluna que
             estica).

          A altura desconta o cabeçalho fixo (h-16 no mobile, 72px no
          desktop, definido em Header.tsx). */}
      <div className="md:grid md:grid-cols-2 md:h-[calc(100vh-72px)]">
        {/* Metade da peça */}
        <div className="bg-espresso aspect-[4/5] md:aspect-auto md:h-full">
          <ProductGallery images={product.images ?? []} title={product.title} />
        </div>

        {/* Metade da informação — centralizada na vertical, alinhada à
            esquerda (as três referências medidas — Toteme, Shoulder, Amaro —
            alinham à esquerda; nenhuma centraliza o texto). */}
        <div className="flex flex-col justify-center px-[8vw] md:px-12 lg:px-20 py-14 md:py-0 pb-28 md:pb-0">
          <div className="flex flex-col gap-2.5 max-w-[42ch]">
            {product.category && (
              <span className="font-sans text-[9px] tracking-[0.22em] uppercase text-ink-soft">
                {product.category.title}
              </span>
            )}

            {/* Escala medida em loja real, não arbitrada: Toteme 16px,
                Shoulder 18px, Amaro 27px. */}
            <h1 className="font-display text-[1.375rem] font-normal text-espresso tracking-tight leading-snug [text-wrap:balance]">
              {product.title}
            </h1>

            {product.price ? (
              <p className="font-sans text-[0.9375rem] text-espresso">
                {formatPrice(product.price)}
              </p>
            ) : null}

            <div aria-hidden="true" className="h-px bg-dourado/50 my-2" />

            {product.description && product.description.length > 0 && (
              <div className="[&_p]:font-sans [&_p]:text-[13px] [&_p]:text-ink-soft [&_p]:leading-relaxed [&_p]:mb-2 [&_blockquote]:font-sans [&_blockquote]:text-[13px] [&_blockquote]:text-ink-soft [&_blockquote]:leading-relaxed [&_blockquote]:mb-2 [&_strong]:font-medium [&_strong]:text-espresso [&_em]:italic">
                <PortableText value={product.description} />
              </div>
            )}

            {/* CTA espresso com letra dourada — o mesmo par da metade da
                esquerda, costurando os dois lados. Exceção deliberada ao
                "bordô = botão de produto" do DESIGN.md §2: o par
                dourado/espresso mede 6,78:1 (AA exige 4,5:1). */}
            {waHref && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-3 bg-espresso text-dourado font-sans text-[10px] tracking-[0.14em] uppercase px-8 py-4 hover:bg-espresso/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-espresso focus-visible:outline-offset-4 transition-colors self-start"
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
                className="mt-2 font-sans text-[11px] tracking-wide text-esmeralda hover:text-espresso transition-colors self-start"
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
