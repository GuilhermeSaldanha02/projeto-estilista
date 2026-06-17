import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'
import type { ImageLoader } from 'next/image'
import { client } from './client'

const builder = createImageUrlBuilder(client)

/**
 * Retorna o builder de URL para uma imagem do Sanity.
 * Encadeie transforms antes de chamar .url():
 *   urlFor(image).width(800).auto('format').quality(80).url()
 *
 * Para uso com next/image use junto com sanityLoader como loader prop,
 * passando apenas a URL base (sem .width()) como src.
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/**
 * Loader para next/image que delega transforms de largura, qualidade e
 * formato diretamente ao Sanity Image CDN — sem passar por /_next/image.
 *
 * Uso:
 *   <Image src={urlFor(img).url()} loader={sanityLoader} ... />
 *
 * O src deve ser a URL base do Sanity (sem ?w= nem ?auto=), produzida por
 * urlFor(source).url(). O loader injeta w, auto=format e q automaticamente.
 */
export const sanityLoader: ImageLoader = ({ src, width, quality }) => {
  const url = new URL(src)
  url.searchParams.set('w', String(width))
  url.searchParams.set('auto', 'format')
  url.searchParams.set('q', String(quality ?? 80))
  return url.toString()
}
