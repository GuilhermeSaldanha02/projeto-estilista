import { client } from '@/sanity/lib/client'
import Nav from './Nav'

export type NavCategory = { _id: string; title: string; slug: string }

// Só categorias com ao menos um produto em estoque — regra de negócio, sem fallback
const categoriesQuery = `
  *[_type == "category"
    && count(*[_type == "product" && references(^._id) && inStock == true]) > 0
  ] | order(order asc) {
    _id,
    title,
    "slug": slug.current
  }
`

const settingsQuery = `*[_type == "siteSettings"][0]{ whatsappNumber }`

export default async function Header() {
  const [categories, settings] = await Promise.all([
    client.fetch<NavCategory[]>(categoriesQuery),
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
