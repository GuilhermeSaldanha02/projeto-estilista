import { client } from '@/sanity/lib/client'
import { settingsQuery } from '@/sanity/lib/queries'
import Nav from './Nav'

export default async function Header() {
  const settings = await client.fetch<{ whatsappNumber?: string } | null>(settingsQuery)

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-espresso h-16 md:h-[72px]">
      <Nav whatsappNumber={settings?.whatsappNumber ?? ''} />
    </header>
  )
}
