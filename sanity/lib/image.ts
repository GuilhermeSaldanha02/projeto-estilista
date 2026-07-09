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
