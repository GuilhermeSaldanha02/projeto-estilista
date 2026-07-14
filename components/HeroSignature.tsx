'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

// out-expo — entrada com peso, sem quicar (padrão de motion da direção "essência elite")
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT_EXPO } },
}

/*
 * Fase 4 — "Vitrine em Movimento" (remodelação após o dono pedir refação total de
 * interface/cores/nav, ver docs/PROGRESS.md). O wordmark "LT STUDIO" — antes o
 * único momento "Assinatura" do site, texto gigante e legível — vira um selo de
 * fundo translúcido (opacity ~0.14): a ousadia agora vem de escala/movimento/
 * composição, não de mais um bloco de texto competindo pela leitura (achado ao
 * comparar com Balenciaga/Gucci/LV: eles usam preto/branco quase puros como tela
 * e gastam a cor na composição da foto, não na UI). A tagline editorial existente
 * ("Moda feminina...") é promovida a headline real (agora o <h1> da página).
 * Validado no protótipo isolado "Vitrine em Movimento" antes de virar código —
 * decisão do dono, não escolha unilateral do agente.
 *
 * Três camadas de profundidade no scroll, todas via useScroll do framer-motion
 * (já comprovado neste arquivo antes da Fase 4 — não é o evento nativo 'scroll',
 * que o Lenis quebra; ver PhotoParallax.tsx para o achado original): vídeo (lento,
 * scale+y), selo de fundo (leve), texto+CTA (mais rápido, sobe na saída).
 */
export default function HeroSignature() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Scale > 1 dá folga para o translate sem revelar borda (overflow-hidden na section)
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '-6%'])
  const darkenOnExit = useTransform(scrollYProgress, [0, 1], [0, 0.5])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-14%'])
  const sealY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%'])

  const videoMotionStyle = reduceMotion ? undefined : { scale: videoScale, y: videoY }
  const darkenStyle = reduceMotion ? { opacity: 0 } : { opacity: darkenOnExit }
  const contentMotionStyle = reduceMotion ? undefined : { y: contentY }
  const sealMotionStyle = reduceMotion ? undefined : { y: sealY }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-espresso min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-72px)] grid md:grid-cols-[58%_42%]"
      aria-label="Hero"
    >
      {/* Camada 1: vídeo — protagonista, DESIGN.md §1 */}
      <div className="relative overflow-hidden min-h-[58vh] md:min-h-full">
        {/* Poster estático — visível somente em prefers-reduced-motion: reduce */}
        <div
          className="hidden motion-reduce:block absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/hero-poster.jpg)' }}
          aria-hidden="true"
        />

        <motion.video
          className="absolute inset-0 w-full h-full object-cover motion-reduce:hidden"
          src="/hero.mp4"
          poster="/hero-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          preload="none"
          style={videoMotionStyle}
        />

        {/* Escurecimento na saída (parallax) — some sob reduced-motion */}
        <motion.div
          className="absolute inset-0 bg-espresso motion-reduce:hidden"
          style={darkenStyle}
          aria-hidden="true"
        />
      </div>

      {/* Camada 2+3: painel bordô — selo de fundo + texto/CTA legível */}
      <div className="relative overflow-hidden bg-gradient-to-br from-bordo to-[#4A1123] flex items-end px-8 md:px-12 pb-16 md:pb-20 pt-10">
        {/* Selo de fundo: decorativo, nunca lido — aria-hidden, não é heading */}
        <motion.span
          style={sealMotionStyle}
          aria-hidden="true"
          className="pointer-events-none select-none absolute -top-8 left-6 md:top-[9%] md:left-[-28%] font-display font-normal text-cream-text/[0.14] tracking-[-0.01em] uppercase leading-[0.9] text-[clamp(2.4rem,9vw,5.5rem)]"
        >
          <span className="block md:inline">LT</span>{' '}
          <span className="block md:inline">Studio</span>
        </motion.span>

        <motion.div
          style={contentMotionStyle}
          className="relative z-10 max-w-md md:ml-auto md:text-right"
          variants={container}
          initial={reduceMotion ? 'visible' : 'hidden'}
          animate="visible"
        >
          <motion.p
            variants={item}
            className="font-sans text-[10px] tracking-[0.4em] uppercase text-dourado mb-5 opacity-90"
          >
            Consultoria de Estilo
          </motion.p>

          {/* Headline real da página (h1) — antes era o wordmark gigante; agora é
              a tagline editorial, promovida. Nível H1 — Página (DESIGN.md). */}
          <motion.h1
            variants={item}
            className="font-display font-[450] text-cream-text leading-[1.25] text-[clamp(1.75rem,3.4vw,2.5rem)] mb-8"
          >
            Moda feminina com olhar de personal stylist
          </motion.h1>

          <motion.div variants={item}>
            {/* CTA único do hero (2026-07-14, mantido na Fase 4): "Agendar horário"
                já vive na nav sempre visível — não duplicar aqui. Variante nova:
                fundo do painel já é bordô, então o CTA vira contorno cream sobre
                bordô (não sólido bordô-sobre-bordô, que desapareceria). */}
            <Link
              href="/colecao/novidades"
              className="inline-flex items-center justify-center border border-cream-text text-cream-text font-sans text-[11px] tracking-widest uppercase px-8 py-4 hover:bg-cream-text hover:text-bordo focus-visible:outline focus-visible:outline-2 focus-visible:outline-cream-text focus-visible:outline-offset-4 transition-colors"
            >
              Ver coleção
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
