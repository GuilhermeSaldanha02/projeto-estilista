import ProductCard from '@/components/ui/ProductCard'
import type { FilterableProduct } from '@/components/catalog/CatalogView'
import { Reveal } from '@/components/motion/Reveal'
import SectionHeading from '@/components/ui/SectionHeading'

/*
 * Fase 5 — "Combina com": peças da mesma categoria ao fim da página de
 * produto. Antes, a página era um beco sem saída — a cliente via 1 peça e
 * não tinha para onde ir além do voltar.
 */
export default function RelatedRail({ products }: { products: FilterableProduct[] }) {
  if (products.length === 0) return null

  return (
    <section aria-label="Combina com" className="mt-24 md:mt-32">
      <Reveal>
        <SectionHeading title="Combina com" className="mb-10 md:mb-12" />
      </Reveal>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map(product => (
          <ProductCard
            key={product._id}
            product={product}
            onDark
            sizes="(max-width: 640px) 50vw, 300px"
          />
        ))}
      </div>
    </section>
  )
}
