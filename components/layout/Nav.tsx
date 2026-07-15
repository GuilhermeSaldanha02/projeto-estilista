'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import type { NavCategory } from './Header'
import { WhatsAppIcon } from '@/components/icons'

// Entrada escalonada do drawer mobile — ease vem do vocabulário único de
// motion (Fase 5/Etapa 0, components/motion/tokens.ts); os timings locais
// são mais curtos que os do stagger padrão porque menu abre por ação direta.
import { EASE_OUT_EXPO } from '@/components/motion/tokens'

const menuContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
}
const menuItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT_EXPO } },
}

interface NavProps {
  categories: NavCategory[]
  whatsappNumber: string
}

export default function Nav({ categories, whatsappNumber }: NavProps) {
  const reduceMotion = useReducedMotion()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const megaTriggerRef = useRef<HTMLButtonElement>(null)
  const mobileTriggerRef = useRef<HTMLButtonElement>(null)
  const waHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : null
  const waScheduleMessage = 'Oi! Gostaria de agendar um horário de personal styling.'
  const waScheduleHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waScheduleMessage)}`
    : null

  function closeMobileAndReturnFocus() {
    setMobileOpen(false)
    mobileTriggerRef.current?.focus()
  }

  // No container raiz (ancestral comum do hambúrguer e do drawer): assim o Escape
  // funciona mesmo com o foco ainda no botão, que é irmão — não ancestral — do <nav>.
  function handleMobileKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (mobileOpen && e.key === 'Escape') closeMobileAndReturnFocus()
  }

  function openMega() {
    clearTimeout(timerRef.current)
    setMegaOpen(true)
  }

  function closeMega() {
    timerRef.current = setTimeout(() => setMegaOpen(false), 150)
  }

  function closeMegaAndReturnFocus() {
    clearTimeout(timerRef.current)
    setMegaOpen(false)
    megaTriggerRef.current?.focus()
  }

  function handleBlur(e: React.FocusEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget)) closeMega()
  }

  function handleMegaKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') closeMegaAndReturnFocus()
  }

  return (
    /*
     * Mobile:  grid-cols-[1fr_auto_1fr] → hamburger | logo (centro) | WA
     * Desktop: grid-cols-[auto_1fr_auto] → logo (esq) | links (centro) | WA
     */
    <div
      onKeyDown={handleMobileKeyDown}
      className="h-full grid grid-cols-[1fr_auto_1fr] md:grid-cols-[auto_1fr_auto] items-center px-5 md:px-10 gap-x-6"
    >

      {/* ── COL 1: mobile=hamburger, desktop=logo ── */}
      <div className="flex items-center">

        {/* Mobile: hambúrguer */}
        <button
          ref={mobileTriggerRef}
          className="md:hidden text-cream-text p-1 -ml-1"
          aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(v => !v)}
        >
          {mobileOpen ? <XIcon /> : <MenuIcon />}
        </button>

        {/* Desktop: logo à esquerda */}
        <Link
          href="/"
          className="hidden md:block hover:opacity-75 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-dourado focus-visible:outline-offset-4"
          onClick={() => { setMobileOpen(false); setMegaOpen(false) }}
        >
          <Image
            src="/logo-lt.png"
            alt="LT Studio"
            width={66}
            height={36}
            priority
          />
        </Link>
      </div>

      {/* ── COL 2: mobile=logo (centralizada), desktop=links nav (centralizados) ── */}
      <div className="flex items-center justify-center">

        {/* Mobile: logo centralizada */}
        <Link
          href="/"
          className="md:hidden hover:opacity-75 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-dourado focus-visible:outline-offset-4"
          onClick={() => { setMobileOpen(false); setMegaOpen(false) }}
        >
          <Image
            src="/logo-lt.png"
            alt="LT Studio"
            width={55}
            height={30}
            loading="eager"
          />
        </Link>

        {/* Desktop: Consultoria (funil principal) + Vitrine — nessa ordem */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/stylist"
            className="text-cream-text opacity-85 hover:opacity-100 font-sans text-[11px] tracking-[0.2em] uppercase transition-opacity py-2"
            onClick={() => setMegaOpen(false)}
          >
            Consultoria
          </Link>

          {categories.length > 0 && (
            <div
              className="relative"
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
              onBlur={handleBlur}
              onKeyDown={handleMegaKeyDown}
            >
              <button
                ref={megaTriggerRef}
                aria-haspopup="true"
                aria-expanded={megaOpen}
                onFocus={openMega}
                className="text-cream-text opacity-85 hover:opacity-100 font-sans text-[11px] tracking-[0.2em] uppercase transition-opacity py-2"
              >
                Vitrine
              </button>

              {/* Mega-menu: colunas distribuídas sem vão */}
              {megaOpen && (
                <div
                  role="navigation"
                  aria-label="Vitrine"
                  className="fixed inset-x-0 top-[72px] z-50 bg-espresso border-t border-dourado/25 shadow-2xl"
                  onMouseEnter={openMega}
                  onMouseLeave={closeMega}
                >
                  {/* Sem bloco destaque "Novidades" (removido, Fase 4e): a Novidades
                      completa (com filtro) já vive na home agora — apontar pra ela
                      de novo aqui duplicava o destino sem motivo, achado do dono.
                      flex/flex-1 removidos junto (código review PR #43): só
                      existiam para dividir espaço com o bloco que não existe mais. */}
                  <div className="px-10 py-8 grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                    {categories.map(cat => (
                      <Link
                        key={cat._id}
                        href={`/categoria/${cat.slug}`}
                        className="text-cream-text opacity-90 hover:opacity-100 focus:opacity-100 font-sans text-sm tracking-[0.15em] uppercase transition-opacity outline-none focus-visible:underline"
                        onClick={() => setMegaOpen(false)}
                      >
                        {cat.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── COL 3: CTA de agendamento (desktop) / WhatsApp compacto (mobile) ──
          Cor e sólido carregam a hierarquia do CTA; a fonte permanece o sans do
          chrome (nunca Fraunces aqui — decisão do agente de design). Cantos retos:
          sem rounded, por regra do design system (DESIGN.md — "cantos retos sem
          rádio... não adicionar border-radius a nenhum elemento interativo"). */}
      <div className="flex items-center justify-end">
        {waScheduleHref && (
          <a
            href={waScheduleHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center bg-esmeralda text-cream-text font-sans text-[11px] font-medium tracking-[0.18em] uppercase px-5 py-2.5 hover:bg-esmeralda/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-dourado focus-visible:outline-offset-2"
          >
            Agendar horário
          </a>
        )}
        {waHref && (
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar pelo WhatsApp"
            className="md:hidden flex items-center gap-2 p-2 -mr-2 text-cream-text/65 hover:text-cream-text transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-dourado focus-visible:outline-offset-2"
          >
            <WhatsAppIcon size={18} />
          </a>
        )}
      </div>

      {/* ── Mobile menu: lista vertical, entrada escalonada (Fase 4) ── */}
      {mobileOpen && (
        <nav
          role="navigation"
          aria-label="Menu principal"
          data-lenis-prevent
          className="md:hidden absolute inset-x-0 top-16 z-40 bg-espresso border-t border-dourado/25 shadow-2xl max-h-[calc(100dvh-64px)] overflow-y-auto"
        >
          <motion.ul
            variants={menuContainer}
            initial={reduceMotion ? 'visible' : 'hidden'}
            animate="visible"
          >
            {/* Agendar + Consultoria no topo — funil principal do negócio primeiro
                (pilha invertida em relação à hierarquia antiga, que priorizava a loja) */}
            {waScheduleHref && (
              <motion.li variants={menuItem} className="border-b border-esmeralda/25">
                <a
                  href={waScheduleHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-6 py-[1.1rem] text-esmeralda-light hover:text-cream-text font-sans text-sm tracking-wide uppercase transition-colors focus-visible:bg-white/5 outline-none"
                  onClick={() => setMobileOpen(false)}
                >
                  Agendar horário
                  <span className="text-esmeralda-light/60 text-xs" aria-hidden="true">→</span>
                </a>
              </motion.li>
            )}
            <motion.li variants={menuItem} className="border-b border-white/5">
              <Link
                href="/stylist"
                className="flex items-center justify-between px-6 py-[1.1rem] text-cream-text/75 hover:text-cream-text hover:bg-white/5 font-sans text-sm tracking-wide uppercase transition-colors focus-visible:bg-white/5 outline-none"
                onClick={() => setMobileOpen(false)}
              >
                Consultoria
                <span className="text-cream-text/25 text-xs" aria-hidden="true">→</span>
              </Link>
            </motion.li>

            {categories.length === 0 ? (
              <motion.li variants={menuItem} className="border-t border-white/5">
                <p className="px-6 py-5 font-sans text-cream-text/70 text-sm">
                  Nenhuma categoria disponível.
                </p>
              </motion.li>
            ) : (
              categories.map(cat => (
                <motion.li key={cat._id} variants={menuItem} className="border-t border-white/5">
                  <Link
                    href={`/categoria/${cat.slug}`}
                    className="flex items-center justify-between px-6 py-[1.1rem] text-cream-text/75 hover:text-cream-text hover:bg-white/5 font-sans text-sm tracking-wide uppercase transition-colors focus-visible:bg-white/5 outline-none"
                    onClick={() => setMobileOpen(false)}
                  >
                    {cat.title}
                    <span className="text-cream-text/25 text-xs" aria-hidden="true">→</span>
                  </Link>
                </motion.li>
              ))
            )}
            <motion.li variants={menuItem} className="border-t border-dourado/20">
              <Link
                href="/colecao/novidades"
                className="flex items-center justify-between px-6 py-[1.1rem] text-dourado hover:text-cream-text font-sans text-sm tracking-wide uppercase transition-colors focus-visible:bg-white/5 outline-none"
                onClick={() => setMobileOpen(false)}
              >
                Novidades
                <span className="text-dourado/45 text-xs" aria-hidden="true">→</span>
              </Link>
            </motion.li>
          </motion.ul>
        </nav>
      )}
    </div>
  )
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M3 8h18M3 16h18" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}
