import Link from 'next/link'
import ProductCard from '@/components/ui/ProductCard'
import type { FilterableProduct } from '@/components/catalog/CatalogView'
import { Reveal } from '@/components/motion/Reveal'

/*
 * Home S4 — Acabou de chegar (Fase 5, blueprint).
 * Fila horizontal com scroll-snap: novidades sem duplicar página — quem quer
 * tudo vai para /vitrine (link no cabeçalho da seção). O respiro à direita
 * mostra meio card seguinte, indicando o arrasto.
 */
export default function NewArrivalsRail({ products }: { products: FilterableProduct[] }) {
  if (products.length === 0) return null

  return (
    <section aria-label="Acabou de chegar" className="bg-sand-50 pb-24 md:pb-32">
      <Reveal className="px-[6vw]">
        <div className="max-w-[1440px] mx-auto flex items-baseline justify-between mb-8">
          <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-[450] text-ink tracking-tight">
            Acabou de chegar
          </h2>
          <Link
            href="/vitrine"
            className="font-sans text-[10px] tracking-widest uppercase text-ink-soft hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-bordo focus-visible:outline-offset-4"
          >
            Ver toda a vitrine →
          </Link>
        </div>
      </Reveal>

      {/* Fila: padding esquerdo alinha com o site; overflow à direita convida o arrasto.
          scroll-padding-inline igual ao padding visual (achado do dono, captura de
          tela): sem isso, scroll-snap "corrige" a posição inicial pra bater com o
          snap-point e a fila abre pré-deslocada (~78px), sem nenhum toque do
          usuário -- media exatamente o valor do padding-left computado. */}
      <div
        className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pl-[6vw] pr-[6vw] pb-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:thin] [scroll-padding-inline:6vw]"
        role="list"
        aria-label="Peças recém-chegadas"
      >
        {products.map((product, i) => (
          <div
            key={product._id}
            role="listitem"
            className="snap-start shrink-0 w-[72vw] sm:w-[44vw] md:w-[30vw] lg:w-[24vw] md:min-w-[300px]"
          >
            {/* priority nos 3 primeiros: já visíveis no load, sem precisar
                rolar -- sem isso, next/image lazy-carrega e o card aparece
                sem foto por um instante (achado do dono, captura de tela). */}
            <ProductCard product={product} priority={i < 3} />
          </div>
        ))}
      </div>
    </section>
  )
}
