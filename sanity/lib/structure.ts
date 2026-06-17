import type { StructureResolver } from 'sanity/structure'

export const singletonTypes = new Set(['stylistProfile', 'siteSettings'])

export const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Conteúdo')
    .items([
      S.listItem()
        .title('Produtos')
        .schemaType('product')
        .child(S.documentTypeList('product')),
      S.listItem()
        .title('Categorias')
        .schemaType('category')
        .child(S.documentTypeList('category')),
      S.listItem()
        .title('Coleções / Tags')
        .schemaType('collection')
        .child(S.documentTypeList('collection')),
      S.divider(),
      S.listItem()
        .title('Perfil da Estilista')
        .schemaType('stylistProfile')
        .child(
          S.document()
            .schemaType('stylistProfile')
            .documentId('stylistProfile'),
        ),
      S.listItem()
        .title('Configurações do Site')
        .schemaType('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings'),
        ),
    ])
