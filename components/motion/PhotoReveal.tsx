'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { EASE_OUT_EXPO } from './tokens'

/*
 * Gesto 2 do vocabulário de motion (Fase 5): reveal de cortina em foto.
 * A imagem entra com clip-path subindo + scale assentando — o "cortinado"
 * das referências de varejo de luxo. Envolver o container da foto (que já
 * deve ter position/aspect definidos pelo chamador).
 */
export function PhotoReveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ clipPath: 'inset(100% 0 0 0)', scale: 1.06 }}
      animate={inView ? { clipPath: 'inset(0% 0 0 0)', scale: 1 } : undefined}
      transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay }}
    >
      {children}
    </motion.div>
  )
}
