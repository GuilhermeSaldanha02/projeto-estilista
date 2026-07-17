import Link from 'next/link'
import ProductCard from '@/components/ui/ProductCard'
import { HorizontalRail } from '@/components/ui/HorizontalRail'
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
      {/* Cabeçalho editorial — mesmo vocabulário da Seleção da Luiza (etiqueta
          + fio dourado) para as seções pertencerem à mesma página. Antes o
          título ficava solto, um "negrito forte" sem enquadramento (feedback
          do dono). Agora tem contexto (etiqueta "Novidades") e a linha dourada
          que é o motivo recorrente do site, com o link de "ver tudo" no fim
          da mesma régua do título. */}
      <Reveal className="px-[6vw]">
        <div className="max-w-[1440px] mx-auto mb-10 md:mb-12">
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-ink-soft mb-3">
            Novidades
          </p>
          <div className="w-8 h-px bg-dourado/40 mb-5" />
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-[450] text-ink tracking-tight">
              Acabou de chegar
            </h2>
            <Link
              href="/vitrine"
              className="shrink-0 font-sans text-[10px] tracking-widest uppercase text-ink-soft hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-bordo focus-visible:outline-offset-4"
            >
              Ver toda a vitrine →
            </Link>
          </div>
        </div>
      </Reveal>

      {/* Fila: padding esquerdo alinha com o site; overflow à direita convida o arrasto.
          scroll-padding-inline igual ao padding visual (achado do dono, captura de
          tela): sem isso, scroll-snap "corrige" a posição inicial pra bater com o
          snap-point e a fila abre pré-deslocada (~78px), sem nenhum toque do
          usuário -- media exatamente o valor do padding-left computado.

          Fase 5f (feedback do dono, medido ao vivo): `scrollbar-width: thin`
          não tinha efeito no Chrome/Edge do dono (suporte a essa propriedade
          no Chromium é recente e ainda inconsistente entre versões) -- o
          navegador caía na barra nativa padrão (~10px, cinza, sem nenhum
          estilo do site) por baixo da fila, lendo como "barra solta".
          Corrigido: barra escondida nos três seletores (Firefox, IE/Edge
          legado, Chromium/Safari via pseudo-elemento).

          Fase 5g: esconder a barra tirou o único indício de navegação para
          mouse comum -- pesquisado em Ganni.com, filas reais de novidades
          usam setas explícitas de anterior/próximo. `HorizontalRail` devolve
          esse mecanismo sem UI nativa (ver componente para detalhes de
          acessibilidade: aria-disabled, IntersectionObserver, teclado). */}
      <HorizontalRail
        ariaLabel="Peças recém-chegadas"
        className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pl-[6vw] pr-[6vw] pb-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [scroll-padding-inline:6vw]"
      >
        {products.map((product, i) => (
          <div
            key={product._id}
            role="listitem"
            className="snap-start shrink-0 w-[72vw] sm:w-[44vw] md:w-[30vw] lg:w-[24vw] md:min-w-[300px]"
          >
            {/* priority nos 4 primeiros: em lg:w-[24vw] cabem ~4,1 cards no
                viewport sem rolar -- com i<3, o code review do PR #46 mediu
                o 4º card 64% visível no viewport exato da captura do dono e
                ainda `loading="lazy"` (mesma causa-raiz, card quase visível
                em vez de fora da tela). i<4 cobre a faixa de largura real. */}
            <ProductCard product={product} priority={i < 4} />
          </div>
        ))}
      </HorizontalRail>
    </section>
  )
}
