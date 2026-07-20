import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'
import { client } from './client'

const builder = createImageUrlBuilder(client)

/**
 * Retorna o builder de URL para uma imagem do Sanity.
 * Encadeie transforms e gere a URL JÁ dimensionada, passando o resultado
 * como `src` do next/image (sem `loader` prop — ver REGRAS no PROGRESS.md):
 *   urlFor(image).width(900).height(1200).fit('crop').auto('format').url()
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

type CardImageSource = SanityImageSource & {
  asset?: { _ref?: string }
  crop?: { top: number; bottom: number; left: number; right: number } | null
}

/**
 * Sanity não suporta zoom por ponto focal (`fp-z` do imgix é ignorado pelo
 * CDN — confirmado comparando bytes de resposta, idêntico ao sem-crop).
 * O corte real precisa vir de `rect`, em pixels — e a única forma confiável
 * de saber as dimensões nativas sem uma query extra de metadata é ler do
 * próprio `_ref` do asset, que o Sanity codifica como
 * `image-<hash>-<largura>x<altura>-<formato>`.
 */
function assetDimensions(ref?: string): { w: number; h: number } | null {
  const match = ref?.match(/-(\d+)x(\d+)-/)
  if (!match) return null
  return { w: Number(match[1]), h: Number(match[2]) }
}

/**
 * Crop de card de produto: corta uma faixa do topo e da base pra "puxar" a
 * peça pra fora do fundo de estúdio. Sem isso, o fit('crop') padrão usa a
 * proporção nativa da foto (quase igual à do card) — corta quase nada,
 * sobrando fundo em volta da peça ("vestido solto", achado do dono).
 *
 * Só um `crop` EDITORIAL (recorte feito à mão no Studio) desliga o corte
 * automático — nesse caso a decisão da editora manda. `hotspot` sozinho não
 * desliga: o Studio grava um hotspot padrão (centro, imagem inteira) assim
 * que alguém encosta na ferramenta de crop, e antes isso fazia a peça voltar
 * ao enquadramento largo em UM produto no meio de uma grade de cards
 * cortados — inconsistência visual silenciosa (achado do code review).
 */
export function productCardImageUrl(source: CardImageSource, width: number, height: number) {
  const chain = builder.image(source).width(width).height(height).fit('crop').auto('format')

  // Recorte manual da editora tem prioridade — não sobrepor com rect().
  if (source?.crop) return chain.url()

  const dims = assetDimensions(source?.asset?._ref)
  if (!dims) return chain.url()

  const topCut = Math.round(dims.h * 0.12)
  const bottomCut = Math.round(dims.h * 0.1)
  return chain.rect(0, topCut, dims.w, dims.h - topCut - bottomCut).url()
}
