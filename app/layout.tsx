import type { Metadata } from 'next'
import { Fraunces, Hanken_Grotesk, Schibsted_Grotesk, Familjen_Grotesk } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

// Candidatas à fonte de corpo (Fase 1 — comparação em /dev-fontes, ver PROGRESS).
// Nenhuma delas troca --font-sans ainda; ficam disponíveis só para a página de teste.
const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-hanken',
  display: 'swap',
})
const schibstedGrotesk = Schibsted_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-schibsted',
  display: 'swap',
})
const familjenGrotesk = Familjen_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-familjen',
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'LT Studio — Moda Feminina',
    template: '%s | LT Studio',
  },
  description: 'Vitrine de moda feminina com personal stylist. Encontre a peça certa e agende seu atendimento pelo WhatsApp.',
  openGraph: { siteName: 'LT Studio', locale: 'pt_BR', type: 'website' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${hankenGrotesk.variable} ${schibstedGrotesk.variable} ${familjenGrotesk.variable}`}
    >
      <body className="flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  )
}
