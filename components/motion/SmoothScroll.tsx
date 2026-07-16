'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Scroll suave global (Lenis). Fundação de movimento da direção "essência elite".
 * Regra do sistema: respeita `prefers-reduced-motion` — se o usuário pediu menos
 * movimento, o Lenis NÃO inicia e o scroll nativo do navegador é preservado.
 * Não renderiza nada; só liga o loop de rAF enquanto montado.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduceMotion.matches) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    let rafId = 0
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return null
}
