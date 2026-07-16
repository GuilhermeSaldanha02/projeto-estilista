'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/components/motion/tokens'

/*
 * Fase 5 (Reconstrução, Etapa 1) — hero novo, construído do zero.
 * Tese do blueprint: "a foto É a tela". O vídeo ocupa 100% da largura; cor,
 * texto e UI são objetos pequenos apoiados sobre ele. Substitui o hero da
 * Fase 4 (vídeo 58% + painel bordô chapado + wordmark-selo translúcido),
 * rejeitado pelo dono ("agonia visual") e que violava a Regra da Cor
 * Composicional — painel de cor chapado atrás de texto.
 *
 * Legibilidade vem de um scrim de gradiente só na metade inferior
 * (tratamento de foto, não lavagem: transparente → espresso/60). O texto
 * ancora embaixo-esquerda; a presença vem do CONTRASTE entre o label de
 * 10px e a foto de 100vh — o truque real das referências de luxo — não do
 * corpo da letra (tipografia gigante já foi rejeitada: "lembrando que é
 * uma loja").
 *
 * Scroll via useScroll/useTransform do framer-motion (nunca o evento
 * 'scroll' nativo — o Lenis o quebra; nunca position:sticky — quebrou o
 * desktop na 1ª tentativa de scroll-hijack). Três camadas: vídeo escala e
 * escurece devagar, conteúdo sobe 12% mais rápido que a página.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Scale > 1 dá folga ao translate sem revelar borda (overflow-hidden na section)
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const darkenOnExit = useTransform(scrollYProgress, [0, 1], [0, 0.45])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%'])

  const videoMotionStyle = reduceMotion ? undefined : { scale: videoScale }
  const darkenStyle = reduceMotion ? { opacity: 0 } : { opacity: darkenOnExit }
  const contentMotionStyle = reduceMotion ? undefined : { y: contentY }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-espresso min-h-[calc(100svh-64px)] md:min-h-[calc(100vh-72px)] flex"
      aria-label="Hero"
    >
      {/* Poster estático — visível somente em prefers-reduced-motion: reduce */}
      <div
        className="hidden motion-reduce:block absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/hero-poster.jpg)' }}
        aria-hidden="true"
      />

      {/* Camada 1: vídeo full-bleed — a tela do hero */}
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
        className="absolute inset-0 bg-espresso motion-reduce:hidden pointer-events-none"
        style={darkenStyle}
        aria-hidden="true"
      />

      {/* Scrim: 2/3 inferiores, transparente → espresso/70. Tratamento de
          foto para legibilidade — não é fundo de cor. Calibrado pelo code
          review do PR #44: com /60 e h-1/2, a zona onde o texto de fato fica
          tinha só ~8-34% de opacidade — AA passava por sorte do vídeo atual,
          quebrava com qualquer frame claro. */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-espresso/70 via-espresso/40 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Camada 2: conteúdo embaixo-esquerda. In-flow (flex items-end na
          section), não absolute: em viewport baixo (landscape de celular) o
          hero cresce com o conteúdo em vez de cortá-lo no overflow-hidden
          (achado L3 do code review do PR #44). */}
      <motion.div
        style={contentMotionStyle}
        className="relative z-10 w-full self-end px-[6vw] pb-16 md:pb-20 pt-40"
      >
        <motion.div
          className="max-w-xl"
          variants={staggerContainer}
          initial={reduceMotion ? 'visible' : 'hidden'}
          animate="visible"
        >
          {/* cream 100%, não /75: a 10px sobre foto, o /75 derrubava o AA no
              pior caso (review PR #44) — hierarquia já vem do tamanho+tracking */}
          <motion.p
            variants={staggerItem}
            className="font-sans text-[10px] tracking-[0.4em] uppercase text-cream-text mb-5"
          >
            Consultoria de estilo · Loja
          </motion.p>

          <motion.h1
            variants={staggerItem}
            className="font-display font-[450] text-cream-text leading-[1.15] text-[clamp(2.25rem,4vw,3rem)] mb-8 max-w-[16ch] [text-wrap:balance]"
          >
            Moda feminina com olhar de personal stylist
          </motion.h1>

          <motion.div variants={staggerItem}>
            {/* CTA único (o "Agendar" vive no header sempre visível — nunca
                dois CTAs no mesmo momento de decisão). Contorno cream sobre
                foto: sólido bordô brigaria com o vídeo. */}
            <Link
              href="/vitrine"
              className="inline-flex items-center justify-center border border-cream-text text-cream-text font-sans text-[11px] tracking-widest uppercase px-8 py-4 hover:bg-cream-text hover:text-espresso focus-visible:outline focus-visible:outline-2 focus-visible:outline-cream-text focus-visible:outline-offset-4 transition-colors"
            >
              Ver vitrine
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Indicador de scroll — coreografa a descida sem hijack */}
      <div
        className="absolute bottom-16 right-[6vw] z-10 hidden md:flex flex-col items-center gap-3 motion-reduce:hidden"
        aria-hidden="true"
      >
        <div className="relative h-10 w-px bg-cream-text/25 overflow-hidden">
          <motion.div
            className="absolute inset-x-0 h-1/2 bg-cream-text/70"
            animate={reduceMotion ? undefined : { y: ['-100%', '200%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </section>
  )
}
