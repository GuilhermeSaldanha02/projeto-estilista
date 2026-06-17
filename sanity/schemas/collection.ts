import { defineField, defineType } from 'sanity'

export const collection = defineType({
  name: 'collection',
  title: 'Coleção / Tag',
  type: 'document',
  description: 'Novidades, Denim, Alfaiataria, Conjuntos, Festa, Estação…',
  fields: [
    defineField({
      name: 'title',
      title: 'Nome',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
  ],
})
