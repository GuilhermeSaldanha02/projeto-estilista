import type { Metadata } from 'next'
import { Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Estilista — Moda Feminina',
  description: 'Vitrine de moda feminina com personal stylist. Encontre a peça certa e agende seu atendimento pelo WhatsApp.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={cormorant.variable}>
      <body className="flex flex-col min-h-screen">
        <Header />
        {/* div, não main — as páginas filhas já declaram seu próprio <main> */}
        <div className="flex-1 pt-16 md:pt-[72px]">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
