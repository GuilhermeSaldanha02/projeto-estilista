import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { navCategoriesQuery, settingsQuery } from '@/sanity/lib/queries'
import { buildWaHref, WA_MESSAGES } from '@/lib/wa'
import type { NavCategory } from './Header'

/*
 * Fase 5 (Reconstrução) — rodapé em 3 colunas (categorias / consultoria+
 * contato / nota curta), substituindo o footer de 1 linha genérica. Server
 * component: mesmas queries do Header, sem estado, sem JS extra.
 */
export default async function Footer() {
  const [categories, settings] = await Promise.all([
    client.fetch<NavCategory[]>(navCategoriesQuery),
    client.fetch<{ whatsappNumber?: string } | null>(settingsQuery),
  ])

  const waHref = buildWaHref(settings?.whatsappNumber)
  const waScheduleHref = buildWaHref(settings?.whatsappNumber, WA_MESSAGES.agendar)

  return (
    <footer className="bg-espresso border-t border-dourado/25">
      <div className="max-w-[1440px] mx-auto px-[6vw] py-16 md:py-20 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
        {/* Categorias */}
        <div>
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-dourado mb-5">
            Vitrine
          </p>
          <ul className="space-y-3">
            {categories.map(cat => (
              <li key={cat._id}>
                <Link
                  href={`/categoria/${cat.slug}`}
                  className="font-sans text-sm text-cream-text/75 hover:text-cream-text transition-colors"
                >
                  {cat.title}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/vitrine"
                className="font-sans text-sm text-cream-text/75 hover:text-cream-text transition-colors"
              >
                Ver tudo →
              </Link>
            </li>
          </ul>
        </div>

        {/* Consultoria + contato */}
        <div>
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-dourado mb-5">
            Consultoria
          </p>
          <ul className="space-y-3">
            <li>
              <Link
                href="/consultoria"
                className="font-sans text-sm text-cream-text/75 hover:text-cream-text transition-colors"
              >
                Conheça a stylist
              </Link>
            </li>
            {waScheduleHref && (
              <li>
                <a
                  href={waScheduleHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-esmeralda-light hover:text-cream-text transition-colors"
                >
                  Agendar horário
                </a>
              </li>
            )}
            {waHref && (
              <li>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-cream-text/75 hover:text-cream-text transition-colors"
                >
                  Falar no WhatsApp
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* Nota */}
        <div className="flex flex-col md:items-end">
          <Image
            src="/logo-lt.png"
            alt="LT Studio"
            width={80}
            height={44}
            className="opacity-80 mb-4"
          />
          <p className="font-sans text-cream-text/60 text-[10px] tracking-widest uppercase md:text-right">
            Moda Feminina · Consultoria de Estilo
          </p>
        </div>
      </div>
    </footer>
  )
}
