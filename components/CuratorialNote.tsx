'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

interface Props {
  note: string
  byline?: string | null
}

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const clause = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
}

/**
 * Fase D do redesign — "sala clara": pull-quote assimétrico flush-left, revelado
 * por cláusula ao entrar em viewport (não no load, ver useInView). Fundo sand-50
 * sólido (achatado — coerente com o corte-limpo da Fase F, sem degradê). Verde-
 * profundo NÃO entra aqui de propósito: é reservado para a Fase E (ver DESIGN.md).
 */
export default function CuratorialNote({ note, byline }: Props) {
  const ref = useRef<HTMLQuoteElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduceMotion = useReducedMotion()

  // Divide em cláusulas (frase real tem 3, separadas por ponto/travessão);
  // sem pontuação reconhecida, degrada para uma revelação única.
  const clauses = note.split(/(?<=[.—])\s+/).filter(Boolean)

  return (
    <section
      className="relative bg-sand-50 py-32 md:py-48 px-6"
      aria-label="Nota da Stylist"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-12">
        <div className="col-span-12 md:col-span-8">
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-dourado-ink mb-5">
            Nota da Stylist
          </p>
          <div className="w-12 h-px bg-dourado/40 mb-10" />

          <motion.blockquote
            ref={ref}
            className="font-display italic font-light text-ink text-[clamp(2.75rem,5.5vw,5rem)] leading-[1.05] tracking-tight text-left [text-wrap:pretty] mb-8"
            variants={container}
            initial={reduceMotion ? 'visible' : 'hidden'}
            animate={reduceMotion || inView ? 'visible' : 'hidden'}
          >
            {clauses.map((text, i) => (
              <motion.span key={i} variants={clause} className="curatorial-note-clause block">
                {text}
                {i < clauses.length - 1 ? ' ' : ''}
              </motion.span>
            ))}
          </motion.blockquote>

          {byline && (
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-ink-soft">
              {byline}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
