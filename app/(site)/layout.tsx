import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {/* div, não main — as páginas filhas já declaram seu próprio <main> */}
      <div className="flex-1 pt-16 md:pt-[72px]">
        {children}
      </div>
      <Footer />
    </>
  )
}
