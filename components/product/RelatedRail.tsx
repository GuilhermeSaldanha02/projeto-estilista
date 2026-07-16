import ProductCard from '@/components/ui/ProductCard'
import type { FilterableProduct } from '@/components/catalog/CatalogView'
import { Reveal } from '@/components/motion/Reveal'

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
        <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-[450] text-ink tracking-tight mb-8">
          Combina com
        </h2>
      </Reveal>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  )
}
