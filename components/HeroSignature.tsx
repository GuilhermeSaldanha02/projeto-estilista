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

/**
 * Momento-assinatura do hero (Fase C — direção "essência elite, esqueleto rápido").
 * Duas camadas de movimento, ambas desligadas sob prefers-reduced-motion:
 *  1) Entrada escalonada no load (eyebrow → wordmark → tagline → CTAs).
 *  2) Parallax discreto no scroll (vídeo desloca/escala devagar, escurece na saída).
 * O vídeo continua sendo o protagonista — o texto confirma (DESIGN.md §1).
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

  const videoMotionStyle = reduceMotion ? undefined : { scale: videoScale, y: videoY }
  const darkenStyle = reduceMotion ? { opacity: 0 } : { opacity: darkenOnExit }
  const contentMotionStyle = reduceMotion ? undefined : { y: contentY }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-espresso min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-72px)]"
      aria-label="Hero"
    >
      {/* Poster estático — visível somente em prefers-reduced-motion: reduce */}
      <div
        className="hidden motion-reduce:block absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/hero-poster.jpg)' }}
        aria-hidden="true"
      />

      {/* Vídeo de fundo — oculto em prefers-reduced-motion: reduce */}
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

      {/* Escurecimento na saída (parallax) — uniforme, some sob reduced-motion */}
      <motion.div
        className="absolute inset-0 bg-espresso motion-reduce:hidden"
        style={darkenStyle}
        aria-hidden="true"
      />

      {/* Gradiente lateral — garante legibilidade sobre qualquer frame do vídeo */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-espresso/80 via-espresso/40 to-transparent"
        aria-hidden="true"
      />

      {/* Conteúdo — alinhado à esquerda, deslocado para deixar respiro negativo à direita */}
      <motion.div
        style={contentMotionStyle}
        className="relative z-10 h-full min-h-[inherit] flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16"
      >
        <motion.div
          className="max-w-md"
          variants={container}
          initial={reduceMotion ? 'visible' : 'hidden'}
          animate="visible"
        >
          <motion.p
            variants={item}
            className="font-sans text-[10px] tracking-[0.4em] uppercase text-cream-text mb-5 opacity-75"
          >
            Consultoria de Estilo
          </motion.p>

          {/* Wordmark: lockup intencional em 2 linhas no mobile ("LT" / "STUDIO"),
              linha única no desktop. Nível "Assinatura" (Fase 2 do redesign
              2026-07-13, único lugar do site que usa esse tier): peso 450 e
              tracking negativo — não font-semibold/600 (Fase 3 de 07-10, revertida:
              o tamanho já carrega a presença; peso mais alto lia como "estourado"
              somado ao resto do sistema, achado do Crítico). */}
          <motion.h1
            variants={item}
            className="font-display font-[450] text-cream-text tracking-[-0.02em] uppercase leading-[0.85] md:leading-none text-[clamp(4rem,15vw,8.5rem)] mb-6"
          >
            <span className="block md:inline">LT</span>{' '}
            <span className="block md:inline">Studio</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="font-display text-xl md:text-2xl font-light italic text-cream-text leading-snug mb-8 max-w-xs md:max-w-sm opacity-90"
          >
            Moda feminina com olhar de personal stylist
          </motion.p>

          <motion.div variants={item}>
            {/* CTA único do hero (2026-07-14): o "Agendar horário" verde foi removido
                daqui — nav e footer já mostram o CTA de agendamento sempre visível,
                e ter os dois juntos na primeira tela lia como duplicado (feedback do
                dono ao ver o site em desktop). "Ver coleção" (não "Ver novidades":
                a home já tem uma seção "Novidades" logo abaixo do hero, repetir a
                palavra lia como redundante) vira sólido agora que é o único CTA —
                não precisa mais ceder hierarquia a um botão vizinho. Bordô sólido é
                a cor de função "produto/desejo" (Regra das Três Funções, DESIGN.md);
                cream-text sobre bordô sólido dá ~8,8:1 de contraste, bem acima de AA. */}
            <Link
              href="/colecao/novidades"
              className="inline-flex items-center justify-center bg-bordo text-cream-text font-sans text-[11px] tracking-widest uppercase px-8 py-4 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cream-text focus-visible:outline-offset-4 transition-opacity"
            >
              Ver coleção
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
