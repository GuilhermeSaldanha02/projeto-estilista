import Image from 'next/image'
import { client } from '@/sanity/lib/client'
import { urlFor, sanityLoader } from '@/sanity/lib/image'

// Busca o primeiro produto que tenha ao menos uma foto
const query = `*[_type == "product" && defined(images[0])][0] {
  title,
  "image": images[0] {
    asset,
    crop,
    hotspot,
    alt
  }
}`

type ProductImage = {
  asset: { _ref: string; _type: string }
  crop?: object
  hotspot?: object
  alt?: string
}

type ProductData = {
  title: string
  image: ProductImage
}

export default async function TesteImgPage() {
  const product = await client.fetch<ProductData | null>(query)

  if (!product) {
    return (
      <main className="min-h-screen bg-sand-200 flex items-center justify-center p-8">
        <p className="font-sans text-ink text-center">
          Nenhum produto com foto encontrado.
          <br />
          Cadastre um produto com imagem no Studio e recarregue.
        </p>
      </main>
    )
  }

  // URL base sem transforms — o sanityLoader injeta ?w= ?auto= ?q= em cada breakpoint
  const baseUrl = urlFor(product.image).url()

  return (
    <main className="min-h-screen bg-sand-200 flex flex-col items-center justify-center gap-8 p-8">

      <h1 className="font-display text-3xl text-ink text-center">
        {product.title}
      </h1>

      {/* Retrato 3:4 — next/image fill + sanityLoader serve o tamanho certo direto do CDN */}
      <div
        className="relative w-72 sm:w-80 overflow-hidden"
        style={{ aspectRatio: '3 / 4' }}
      >
        <Image
          src={baseUrl}
          loader={sanityLoader}
          alt={product.image.alt ?? product.title}
          fill
          sizes="(max-width: 640px) 288px, 320px"
          className="object-cover"
          priority
        />
      </div>

      {/* Prova técnica: URL gerada com transforms aplicados */}
      <details className="w-full max-w-lg">
        <summary className="font-sans text-xs text-ink/50 cursor-pointer">
          URL base do CDN (expandir)
        </summary>
        <p className="font-sans text-xs text-ink/40 break-all mt-2">{baseUrl}</p>
      </details>

    </main>
  )
}
