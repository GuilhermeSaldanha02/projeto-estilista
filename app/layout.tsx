import type { Metadata } from 'next'
import { Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
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
    <html lang="pt-BR" className={cormorant.variable}>
      <body className="flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  )
}
