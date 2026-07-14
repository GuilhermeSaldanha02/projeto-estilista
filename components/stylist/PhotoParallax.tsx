'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

/*
 * Fase 3.1 do redesign (14/07) — "A História" ganha movimento real de scroll,
 * sem position:sticky (achado do Crítico: overflow:hidden no ancestral matava
 * o sticky por completo, achado do Explorador: nenhuma referência de varejo
 * usa scroll-hijack). A foto é 122% da altura da moldura e percorre ~20% da
 * própria altura (top: -11% -> 9%) ao longo da passagem da seção pela
 * viewport -- contido localmente por overflow:hidden NA MOLDURA, não na
 * seção. `frameRef` mede o progresso (elemento estável); `imgWrapRef` recebe
 * o `top` calculado (elemento que se move).
 *
 * Não usa o evento nativo 'scroll' do window: o Lenis (scroll suave, ver
 * SmoothScroll.tsx) intercepta o scroll e não dispara esse evento de forma
 * confiável (confirmado: scrollY muda, o evento não dispara nenhuma vez).
 * Em vez disso, faz polling via rAF, ligado/desligado por IntersectionObserver
 * para só rodar enquanto a seção está perto da viewport.
 */
export function PhotoParallax({ src, alt }: { src: string; alt: string }) {
  const frameRef = useRef<HTMLDivElement>(null)
  const imgWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const frame = frameRef.current
    const imgWrap = imgWrapRef.current
    if (reduceMotion || !frame || !imgWrap) return

    const travel = 20 // % da altura da imagem percorrida ao longo da seção
    let rafId = 0

    function update() {
      if (!frame || !imgWrap) return
      const rect = frame.getBoundingClientRect()
      const total = rect.height + window.innerHeight
      const progress = Math.min(Math.max((window.innerHeight - rect.top) / total, 0), 1)
      imgWrap.style.top = `${-11 + progress * travel}%`
      rafId = requestAnimationFrame(update)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          rafId = requestAnimationFrame(update)
        } else {
          cancelAnimationFrame(rafId)
        }
      },
      { rootMargin: '50% 0px' }
    )
    io.observe(frame)

    return () => {
      io.disconnect()
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={frameRef}
      className="relative w-full aspect-[3/4] overflow-hidden shadow-[0_30px_60px_-15px_rgba(44,8,19,0.45)]"
    >
      <div ref={imgWrapRef} className="absolute inset-x-0" style={{ top: '-11%', height: '122%' }}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          style={{ filter: 'sepia(0.16) saturate(1.12) contrast(1.04) brightness(0.99)' }}
        />
      </div>
      {/* grade de cor quente e sutil -- NÃO duotone duro (achado do Crítico: duotone
          pesado num rosto lê como "projeto de agência") */}
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-multiply pointer-events-none"
        style={{ background: 'linear-gradient(150deg, rgba(123,30,58,0.16), rgba(36,28,23,0.08) 65%)' }}
      />
    </div>
  )
}
