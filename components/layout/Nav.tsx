'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { NavCategory } from './Header'

interface NavProps {
  categories: NavCategory[]
  whatsappNumber: string
}

export default function Nav({ categories, whatsappNumber }: NavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const waHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : null

  function openMega() {
    clearTimeout(timerRef.current)
    setMegaOpen(true)
  }

  function closeMega() {
    timerRef.current = setTimeout(() => setMegaOpen(false), 150)
  }

  function handleBlur(e: React.FocusEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget)) closeMega()
  }

  return (
    /*
     * Mobile:  grid-cols-[1fr_auto_1fr] → hamburger | logo (centro) | WA
     * Desktop: grid-cols-[auto_1fr_auto] → logo (esq) | links (centro) | WA
     */
    <div className="h-full grid grid-cols-[1fr_auto_1fr] md:grid-cols-[auto_1fr_auto] items-center px-5 md:px-10 gap-x-6">

      {/* ── COL 1: mobile=hamburger, desktop=logo ── */}
      <div className="flex items-center">

        {/* Mobile: hambúrguer */}
        <button
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
            priority
          />
        </Link>

        {/* Desktop: Stylist + Categorias */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/stylist"
            className="text-cream-text opacity-85 hover:opacity-100 font-sans text-[10px] tracking-widest uppercase transition-opacity py-2"
            onClick={() => setMegaOpen(false)}
          >
            Stylist
          </Link>

          {categories.length > 0 && (
            <div
              className="relative"
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
              onBlur={handleBlur}
            >
              <button
                aria-haspopup="true"
                aria-expanded={megaOpen}
                onFocus={openMega}
                className="text-cream-text opacity-85 hover:opacity-100 font-sans text-[10px] tracking-widest uppercase transition-opacity py-2"
              >
                Categorias
              </button>

              {/* Mega-menu: colunas distribuídas sem vão */}
              {megaOpen && (
                <div
                  role="navigation"
                  aria-label="Categorias"
                  className="fixed inset-x-0 top-[72px] z-40 flex bg-espresso border-t border-dourado/25 shadow-2xl"
                  onMouseEnter={openMega}
                  onMouseLeave={closeMega}
                >
                  {/* Categorias: flex-1 preenche todo espaço disponível, grid 3 colunas */}
                  <div className="flex-1 px-10 py-8 grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                    {categories.map(cat => (
                      <Link
                        key={cat._id}
                        href={`/categoria/${cat.slug}`}
                        className="text-cream-text opacity-90 hover:opacity-100 focus:opacity-100 font-sans text-sm tracking-wide uppercase transition-opacity outline-none focus-visible:underline"
                        onClick={() => setMegaOpen(false)}
                      >
                        {cat.title}
                      </Link>
                    ))}
                  </div>

                  {/* Bloco destaque */}
                  <div className="w-56 shrink-0 bg-ink flex flex-col items-center justify-center gap-4 py-12 px-6">
                    <span className="font-sans text-[9px] text-dourado tracking-[0.3em] uppercase">
                      Em destaque
                    </span>
                    <div className="w-6 h-px bg-dourado/40" />
                    <Link
                      href="/colecao/novidades"
                      className="font-display text-[1.4rem] font-light italic text-cream-text hover:text-dourado focus:text-dourado transition-colors text-center outline-none focus-visible:underline"
                      onClick={() => setMegaOpen(false)}
                    >
                      Novidades
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── COL 3: WhatsApp ── */}
      <div className="flex items-center justify-end">
        {waHref && (
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar pelo WhatsApp"
            className="flex items-center gap-2 text-cream-text/65 hover:text-cream-text transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-dourado focus-visible:outline-offset-2"
          >
            <WhatsAppIcon />
            <span className="hidden md:inline font-sans text-[10px] tracking-widest uppercase">
              WhatsApp
            </span>
          </a>
        )}
      </div>

      {/* ── Mobile menu: lista vertical ── */}
      {mobileOpen && (
        <nav
          role="navigation"
          aria-label="Menu principal"
          className="md:hidden absolute inset-x-0 top-16 z-40 bg-espresso border-t border-dourado/25 shadow-2xl max-h-[calc(100dvh-64px)] overflow-y-auto"
        >
          {categories.length === 0 ? (
            <p className="px-6 py-5 font-sans text-cream-text/35 text-sm">
              Nenhuma categoria disponível.
            </p>
          ) : (
            <ul>
              {categories.map((cat, i) => (
                <li key={cat._id} className={i > 0 ? 'border-t border-white/5' : ''}>
                  <Link
                    href={`/categoria/${cat.slug}`}
                    className="flex items-center justify-between px-6 py-[1.1rem] text-cream-text/75 hover:text-cream-text hover:bg-white/5 font-sans text-sm tracking-wide uppercase transition-colors focus-visible:bg-white/5 outline-none"
                    onClick={() => setMobileOpen(false)}
                  >
                    {cat.title}
                    <span className="text-cream-text/25 text-xs" aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
              <li className="border-t border-dourado/20">
                <Link
                  href="/colecao/novidades"
                  className="flex items-center justify-between px-6 py-[1.1rem] text-dourado hover:text-cream-text font-sans text-sm tracking-wide uppercase transition-colors focus-visible:bg-white/5 outline-none"
                  onClick={() => setMobileOpen(false)}
                >
                  Novidades
                  <span className="text-dourado/45 text-xs" aria-hidden="true">→</span>
                </Link>
              </li>
              <li className="border-t border-white/5">
                <Link
                  href="/stylist"
                  className="flex items-center justify-between px-6 py-[1.1rem] text-cream-text/75 hover:text-cream-text hover:bg-white/5 font-sans text-sm tracking-wide uppercase transition-colors focus-visible:bg-white/5 outline-none"
                  onClick={() => setMobileOpen(false)}
                >
                  Stylist
                  <span className="text-cream-text/25 text-xs" aria-hidden="true">→</span>
                </Link>
              </li>
            </ul>
          )}
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

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
