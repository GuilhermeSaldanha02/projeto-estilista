import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { PhotoReveal } from '@/components/motion/PhotoReveal'

/*
 * Home S3 — Portais de categoria (Fase 5, blueprint).
 * A foto é o botão: faixas fotográficas assimétricas (7/5 colunas, linha
 * seguinte inverte), label da categoria embaixo-esquerda. Sem card, sem
 * borda. Imagem = category.image do Studio, com fallback (na query) para a
 * foto do produto mais recente da categoria. Sem nenhuma imagem, degrada
 * para lista tipográfica — nunca quebra.
 */
export type CategoryPortal = {
  _id: string
  title: string
  slug: string
  image?: {
    asset?: { _ref: string; _type?: string }
    alt?: string
  } | null
}

export default function CategoryPortals({ categories }: { categories: CategoryPortal[] }) {
  if (categories.length === 0) return null

  const shown = categories.slice(0, 4)
  const noneHaveImage = shown.every(c => !c.image?.asset)

  // Fallback raro: nenhuma categoria (própria ou via produto mais recente,
  // já resolvido em categoryPortalsQuery) tem foto. Fase 5b (feedback do
  // dono): a lista vertical dividida antes ficava "solta" — 4 links soltos
  // ocupando uma faixa alta da página. Agora é UM bloco só: grid com borda
  // e divisores internos, as 4 categorias lado a lado (2x2 no mobile),
  // altura modesta — nada de caixas vazias de 70vh sem foto nenhuma dentro.
  if (noneHaveImage) {
    return (
      <section aria-label="Categorias" className="pb-20 md:pb-28 px-[6vw] bg-sand-50">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 border border-ink/10 divide-x divide-y md:divide-y-0 divide-ink/10">
          {shown.map(cat => (
            <Link
              key={cat._id}
              href={`/categoria/${cat.slug}`}
              className="group flex items-center justify-center gap-2 py-9 px-4 text-center"
            >
              <span className="font-display text-lg md:text-xl font-[450] text-ink group-hover:text-bordo transition-colors">
                {cat.title}
              </span>
              <span
                aria-hidden
                className="font-sans text-ink-soft text-sm transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section aria-label="Categorias" className="bg-sand-50 pb-24 md:pb-32 px-[6vw]">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        {shown.map((cat, i) => {
          // Assimetria 7/5 alternada por linha: 7-5 / 5-7
          const span = i % 4 === 0 || i % 4 === 3 ? 'md:col-span-7' : 'md:col-span-5'
          // Categoria sem foto (própria nem via fallback de produto): tile
          // tipográfico no lugar da foto — nunca some do portal (achado do
          // code review do PR #44: filtrar por withImage fazia a categoria
          // desaparecer de vez quando misturada com outras que tinham foto).
          if (!cat.image?.asset) {
            return (
              <Link
                key={cat._id}
                href={`/categoria/${cat.slug}`}
                className={`group relative flex items-end h-[52vh] md:h-[70vh] bg-sand-100 border border-ink/10 px-6 pb-6 ${span}`}
              >
                <span className="flex items-baseline gap-3">
                  <span className="font-display text-[clamp(1.5rem,2.6vw,2rem)] font-[450] text-ink group-hover:text-bordo transition-colors">
                    {cat.title}
                  </span>
                  <span
                    aria-hidden
                    className="font-sans text-ink-soft text-sm transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
            )
          }
          return (
            <Link
              key={cat._id}
              href={`/categoria/${cat.slug}`}
              className={`group relative block h-[52vh] md:h-[70vh] ${span}`}
            >
              <PhotoReveal className="absolute inset-0 overflow-hidden bg-sand-100" delay={(i % 2) * 0.12}>
                <Image
                  src={urlFor(cat.image).width(1400).height(1200).fit('crop').auto('format').url()}
                  alt={cat.image.alt ?? cat.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 55vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                {/* Scrim de canto para o label — tratamento de foto */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-espresso/60 to-transparent"
                />
              </PhotoReveal>
              <span className="absolute bottom-6 left-6 z-10 flex items-baseline gap-3">
                <span className="font-display text-[clamp(1.5rem,2.6vw,2rem)] font-[450] text-cream-text">
                  {cat.title}
                </span>
                <span
                  aria-hidden
                  className="font-sans text-cream-text/70 text-sm transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
