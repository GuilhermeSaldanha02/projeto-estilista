'use client'

import { useEffect, useRef, useState } from 'react'

/*
 * Fila horizontal com setas de navegação (Fase 5g). Pesquisado em Ganni.com:
 * filas reais de "novidades" no varejo de moda usam botões explícitos de
 * "anterior/próximo", não só arrasto -- ao esconder a barra de rolagem nativa
 * (Fase 5f), tiramos o único indício de navegação para quem usa mouse comum
 * sem shift+wheel. As setas devolvem esse mecanismo sem reintroduzir UI nativa.
 *
 * Client wrapper mínimo: só o scroll/observer/botões viram JS no cliente. Os
 * itens (ProductCard) continuam vindo do Server Component pai como children.
 */
export function HorizontalRail({
  children,
  ariaLabel,
  className = '',
}: {
  children: React.ReactNode
  ariaLabel: string
  className?: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const startRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  useEffect(() => {
    const root = scrollRef.current
    const start = startRef.current
    const end = endRef.current
    if (!root || !start || !end) return

    // Sentinelas + IntersectionObserver, não listener de `scroll`: o Lenis
    // (smooth scroll global) quebra o evento `scroll` nativo silenciosamente
    // (regra do DESIGN.md §4) -- observer é seguro mesmo com Lenis ativo.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === start) setAtStart(entry.isIntersecting)
          if (entry.target === end) setAtEnd(entry.isIntersecting)
        }
      },
      { root, threshold: 0.95 }
    )
    observer.observe(start)
    observer.observe(end)
    return () => observer.disconnect()
  }, [])

  // Animação manual via rAF, não `scrollBy({behavior:'smooth'})`: em teste
  // isolado, o scroll nativo suave não avançou nesta sessão com o Lenis
  // ligado (mesma classe de quebra silenciosa que o DESIGN.md §4 já
  // documenta para o evento `scroll` nativo) -- `behavior:'auto'`
  // (instantâneo) funciona, mas perde a suavidade. rAF com easing próprio é
  // também o padrão já usado no projeto para motion que convive com o Lenis
  // (ver `PhotoParallax.tsx`), então é a escolha mais segura aqui de
  // qualquer forma, independente da causa exata do travamento.
  function scrollByPage(direction: 1 | -1) {
    const root = scrollRef.current
    if (!root) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const from = root.scrollLeft
    const distance = direction * root.clientWidth * 0.9
    const max = root.scrollWidth - root.clientWidth
    const to = Math.max(0, Math.min(max, from + distance))

    if (reduceMotion) {
      root.scrollLeft = to
      return
    }

    const duration = 450
    const start = performance.now()
    const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))

    function step(now: number) {
      if (!root) return
      const t = Math.min(1, (now - start) / duration)
      root.scrollLeft = from + (to - from) * easeOutExpo(t)
      if (t < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  return (
    <div className="relative">
      <div ref={scrollRef} role="list" aria-label={ariaLabel} className={className}>
        <div ref={startRef} aria-hidden className="w-px shrink-0 self-stretch" />
        {children}
        <div ref={endRef} aria-hidden className="w-px shrink-0 self-stretch" />
      </div>

      {/* Setas: só desktop com mouse (md+ e pointer:fine) -- em touch o
          arrasto já é natural, e o teclado já rola a fila via foco nos
          Links dos cards. aria-disabled, nunca `disabled`: um botão
          focado que vira disabled perde o foco (cai para <body>). */}
      <button
        type="button"
        aria-label="Ver peças anteriores"
        aria-disabled={atStart}
        onClick={() => !atStart && scrollByPage(-1)}
        className="hidden md:[@media(pointer:fine)]:flex absolute left-[1vw] top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center bg-sand-50/90 text-ink hover:bg-sand-50 transition-colors aria-disabled:opacity-30 aria-disabled:pointer-events-none"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Ver próximas peças"
        aria-disabled={atEnd}
        onClick={() => !atEnd && scrollByPage(1)}
        className="hidden md:[@media(pointer:fine)]:flex absolute right-[1vw] top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center bg-sand-50/90 text-ink hover:bg-sand-50 transition-colors aria-disabled:opacity-30 aria-disabled:pointer-events-none"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      </button>
    </div>
  )
}
