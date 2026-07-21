/*
 * Fase 5 (Reconstrução) — todos os GROQ do site, centralizados e nomeados.
 * Uma query, um nome, um lugar. Páginas importam daqui; nenhuma rota define
 * GROQ inline a partir da reconstrução.
 */

// ── Fragmentos ──────────────────────────────────────────────────────────

// Campos de card de produto — o contrato do ProductCard/grades.
// image2 + isNew (Fase 5e): 2ª foto no hover e selo "Novo" -- padrão comum
// em varejo de moda real (Reformation, Ganni), pesquisado antes de aplicar.
const CARD_FIELDS = `
  _id, title, "slug": slug.current, price, isNew,
  "image": images[0] { asset, crop, hotspot, alt },
  "image2": images[1] { asset, crop, hotspot, alt },
  "categorySlug": category->slug.current,
  "categoryTitle": category->title
`

// ── Settings / chrome ───────────────────────────────────────────────────

export const settingsQuery = `*[_type == "siteSettings"][0]{
  whatsappNumber, curatorNote, curatorNoteByline
}`

// ── Home ────────────────────────────────────────────────────────────────

// Seleção da Luiza (S2): destaques marcados no Studio; a página cai para as
// mais recentes se ninguém estiver marcado (a home nunca fica vazia).
export const featuredProductsQuery = `
  *[_type == "product" && inStock == true && featured == true]
  | order(_createdAt desc) [0...4] { ${CARD_FIELDS} }
`

export const recentProductsQuery = `
  *[_type == "product" && inStock == true]
  | order(_createdAt desc) [0...4] { ${CARD_FIELDS} }
`

// Acabou de chegar (S4): novidades marcadas primeiro, completa com recentes.
export const newArrivalsQuery = `
  *[_type == "product" && inStock == true]
  | order(isNew desc, _createdAt desc) [0...8] { ${CARD_FIELDS} }
`

// Portais de categoria (S3): imagem própria da categoria, com fallback para
// a foto do produto mais recente dela.
export const categoryPortalsQuery = `
  *[_type == "category"
    && count(*[_type == "product" && references(^._id) && inStock == true]) > 0
  ] | order(order asc) [0...4] {
    _id, title, "slug": slug.current,
    "image": coalesce(
      image { asset, crop, hotspot, alt },
      *[_type == "product" && references(^._id) && inStock == true]
        | order(_createdAt desc) [0].images[0] { asset, crop, hotspot, alt }
    )
  }
`

// Convite à consultoria (S5): foto e nome da stylist.
export const stylistCardQuery = `
  *[_type == "stylistProfile"][0] {
    name, tagline,
    "photo": photo { asset, crop, hotspot, alt }
  }
`

// ── Catálogo ────────────────────────────────────────────────────────────

export const allProductsQuery = `
  *[_type == "product" && inStock == true]
  | order(_createdAt desc) { ${CARD_FIELDS} }
`

export const categoryQuery = `
  *[_type == "category" && slug.current == $slug][0] {
    _id, title, "slug": slug.current
  }
`

export const categoryProductsQuery = `
  *[_type == "product" && category->slug.current == $slug && inStock == true]
  | order(_createdAt desc) { ${CARD_FIELDS} }
`

export const allCategorySlugsQuery = `
  *[_type == "category"
    && count(*[_type == "product" && references(^._id) && inStock == true]) > 0
  ] { "slug": slug.current }
`

export const collectionQuery = `
  *[_type == "collection" && slug.current == $slug][0] {
    _id, title, "slug": slug.current
  }
`

export const collectionProductsQuery = `
  *[_type == "product" && $slug in tags[]->slug.current && inStock == true]
  | order(_createdAt desc) { ${CARD_FIELDS} }
`

export const allCollectionSlugsQuery = `
  *[_type == "collection"
    && count(*[_type == "product" && references(^._id) && inStock == true]) > 0
  ] { "slug": slug.current }
`

// ── Produto ─────────────────────────────────────────────────────────────

export const productQuery = `
  *[_type == "product" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, price, description, inStock,
    "images": images[] { asset, crop, hotspot, alt },
    "category": category->{ title, "slug": slug.current }
  }
`

export const allProductSlugsQuery = `
  *[_type == "product" && inStock == true] { "slug": slug.current }
`
