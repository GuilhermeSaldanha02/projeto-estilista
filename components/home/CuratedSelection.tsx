import type { FilterableProduct } from '@/components/catalog/CatalogView'
import ProductCard from '@/components/ui/ProductCard'
import { Reveal } from '@/components/motion/Reveal'

/*
 * Home S2 — Seleção da Luiza (Fase 5h — reconstrução da seção).
 *
 * As Fases 5b/5c/5f tentaram consertar a MESMA estrutura: uma coluna de texto
 * estreita ao lado de uma foto dominante (legenda lateral). Essa estrutura
 * gerou o mesmo tipo de reclamação em rodada após rodada — desalinhamento,
 * "muito grande", vazio no desktop — porque a coluna de texto e a foto nunca
 * têm a mesma altura, e todo conserto só movia o vazio de lugar. O dono
 * mandou explicitamente MATAR a seção e refazer.
 *
 * Estrutura nova, sem a dependência de altura lado-a-lado que causava tudo
 * isso: a nota da stylist vira uma ABERTURA editorial centralizada (a
 * curadora apresentando a seleção — coerente com "a foto é a tela": o texto
 * é pequeno e preciso, não um painel), e as peças ficam numa linha de 3
 * IGUAIS abaixo. Centralizado + grid uniforme = impossível desalinhar, e
 * lê igual no mobile (empilha) e no desktop (3 colunas).
 */
export default function CuratedSelection({
  products,
  note,
  byline,
}: {
  products: FilterableProduct[]
  note?: string | null
  byline?: string | null
}) {
  if (products.length === 0) return null
  const pieces = products.slice(0, 3)

  return (
    <section aria-label="Seleção da Luiza" className="bg-sand-50 py-20 md:py-28 px-[6vw]">
      <div className="max-w-[1440px] mx-auto">
        {/* Abertura editorial — a curadora apresenta a seleção. Centralizada,
            largura contida (não estica no desktop), respiro generoso abaixo. */}
        <Reveal className="max-w-[46ch] mx-auto text-center mb-14 md:mb-20">
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-ink-soft mb-6">
            A seleção da Luiza
          </p>
          {note && (
            <p className="font-display text-2xl md:text-[1.75rem] font-light italic text-ink leading-snug text-balance">
              {note}
            </p>
          )}
          <div className="w-8 h-px bg-dourado/40 mx-auto mt-8 mb-5" />
          {byline && (
            <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-ink-soft">
              {byline}
            </p>
          )}
        </Reveal>

        {/* Peças — 3 iguais. Mesmo aspecto, mesma largura: uma grade uniforme
            não tem como desalinhar. Empilha no mobile.
            priority nas 3: são só 3 imagens e ficam logo abaixo do hero, quase
            sempre alcançadas num scroll curto. Carregá-las eager (em vez de
            lazy) evita o padrão recorrente deste projeto de "card sem foto"
            -- o placeholder (sand-100) é quase igual ao fundo da seção, então
            uma foto que demora a chegar lê como "não apareceu". Com 3 imagens
            pequenas (600px) o custo de carregar todas de imediato é baixo. */}
        {/* Cards padronizados com a vitrine (decisão do dono): o mesmo
            ProductCard escuro, não uma marcação própria — peça escura sólida
            sobre o creme, crop fechado (ponto focal), nome/preço ancorados.
            Uma fonte de verdade pro card em todo o site. */}
        {/* max-w + centralizado: com 3 colunas em 1440px o card passava de
            400px de largura (foto de ~540px de altura) -- fora do tamanho de
            varejo real. Limitado, o card fica em ~280-300px como nos sites. */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-7 max-w-[920px] mx-auto">
          {pieces.map(product => (
            <ProductCard key={product._id} product={product} priority onDark />
          ))}
        </div>
      </div>
    </section>
  )
}
