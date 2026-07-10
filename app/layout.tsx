import type { Metadata } from 'next'
import { Fraunces, Schibsted_Grotesk } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

// Fonte de corpo escolhida na Fase 1 do redesign (comparação em /dev-fontes, agora
// removida): Schibsted Grotesk — espinha editorial, pareia com a Fraunces, legível
// no corpo sobre claro e escuro. Alimenta --font-sans via globals.css.
const schibsted = Schibsted_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
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
      className={`${fraunces.variable} ${schibsted.variable}`}
    >
      <body className="flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  )
}
