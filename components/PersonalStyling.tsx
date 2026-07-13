'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { WhatsAppIcon } from '@/components/icons'

interface Props {
  waScheduleHref: string | null
}

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
}

const STEPS = [
  {
    n: '01',
    title: 'É simples',
    body: 'Você toca o botão e o WhatsApp abre com a mensagem já escrita. É só enviar — sem formulário, sem cadastro.',
  },
  {
    n: '02',
    title: 'A gente conversa',
    body: 'A Luiza entende o que você precisa e marca o atendimento, no seu tempo.',
  },
  {
    n: '03',
    title: 'Você descobre seu estilo',
    body: 'No atendimento, ela alinha suas roupas aos seus objetivos.',
  },
]

/**
 * Fase E do redesign — quebra o monólito do bloco de consultoria. Fundo
 * espresso: `verde-profundo` foi cortado do sistema no redesign de 2026-07-13
 * (era a mesma rampa tonal da esmeralda — "verde sobre verde" no CTA, sem
 * separação real). Esta seção volta a ser o único momento escuro da home.
 * Layout assimétrico flush-left (header/intro/CTA em col-span-7 de 12; o
 * vazio à direita é o respiro); "Como funciona" ocupa a largura toda com
 * ritmo em escada entre os 3 passos. Entrada em 4 beats ao rolar até aqui
 * (useInView, não no load), mesmo vocabulário de motion da Fase D.
 */
export default function PersonalStyling({ waScheduleHref }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduceMotion = useReducedMotion()

  return (
    <section
      className="relative bg-espresso py-24 md:py-36 px-5"
      aria-label="Consultoria de Estilo"
    >
      <motion.div
        ref={ref}
        className="max-w-6xl mx-auto grid grid-cols-12"
        variants={container}
        initial={reduceMotion ? 'visible' : 'hidden'}
        animate={reduceMotion || inView ? 'visible' : 'hidden'}
      >
        {/* Beat 1 — eyebrow + linha + headline */}
        <motion.div variants={item} className="styling-reveal-item col-span-12 md:col-span-7">
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-dourado mb-5">
            Consultoria de Estilo
          </p>
          <div className="w-12 h-px bg-dourado/40 mb-6" />
          <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-[450] text-cream-text tracking-tight mb-6 [text-wrap:pretty]">
            Um olhar profissional para o seu estilo
          </h2>
        </motion.div>

        {/* Beat 2 — parágrafo de apresentação */}
        <motion.p
          variants={item}
          className="styling-reveal-item col-span-12 md:col-span-7 font-sans text-sm text-cream-text/75 leading-relaxed max-w-prose mb-16 md:mb-20"
        >
          Do consultório de moda ao look do dia a dia: encontramos juntas as peças certas
          para a sua vida, seu corpo e o que você quer comunicar com a roupa.
        </motion.p>

        {/* Beat 3 — Como funciona, os 3 passos como um grupo único, em escada no desktop */}
        <motion.div variants={item} className="styling-reveal-item col-span-12">
          <div className="grid md:grid-cols-3 gap-y-12 md:gap-x-8 md:gap-y-0 mb-16 md:mb-20 text-left">
            {STEPS.map((step, i) => (
              <div
                key={step.n}
                className={`border-t border-cream-text/10 pt-6 ${
                  i === 1 ? 'md:mt-12' : i === 2 ? 'md:mt-24' : ''
                }`}
              >
                <p
                  aria-hidden
                  className="font-sans text-sm tracking-[0.2em] text-cream-text/50 mb-4 select-none"
                >
                  {step.n}
                </p>
                <h3 className="font-display text-xl font-light text-cream-text tracking-wide mb-3 [text-wrap:pretty]">
                  {step.title}
                </h3>
                <p className="font-sans text-sm text-cream-text/75 leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Beat 4 — CTA */}
        {waScheduleHref && (
          <motion.div variants={item} className="styling-reveal-item col-span-12 md:col-span-7">
            <a
              href={waScheduleHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-esmeralda text-cream-text font-sans text-[11px] tracking-widest uppercase px-10 py-4 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cream-text focus-visible:outline-offset-4 transition-opacity"
            >
              <WhatsAppIcon />
              Agendar horário
            </a>
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
