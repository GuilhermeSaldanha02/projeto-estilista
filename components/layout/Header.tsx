import { client } from '@/sanity/lib/client'
import { navCategoriesQuery, settingsQuery } from '@/sanity/lib/queries'
import Nav from './Nav'

export type NavCategory = { _id: string; title: string; slug: string }

export default async function Header() {
  const [categories, settings] = await Promise.all([
    client.fetch<NavCategory[]>(navCategoriesQuery),
    client.fetch<{ whatsappNumber?: string } | null>(settingsQuery),
  ])

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-espresso h-16 md:h-[72px]">
      <Nav
        categories={categories ?? []}
        whatsappNumber={settings?.whatsappNumber ?? ''}
      />
    </header>
  )
}
