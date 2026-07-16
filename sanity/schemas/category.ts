import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Categoria',
  type: 'document',
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
    defineField({
      name: 'order',
      title: 'Ordem no menu',
      type: 'number',
      description: 'Número inteiro — categorias aparecem em ordem crescente.',
      validation: (rule) => rule.required().integer().positive(),
    }),
    defineField({
      name: 'image',
      title: 'Foto da categoria (opcional)',
      type: 'image',
      options: { hotspot: true },
      description:
        'Usada nos portais de categoria da home. Se vazia, a home usa a foto do produto mais recente da categoria.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo (acessibilidade)',
          type: 'string',
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Ordem no menu',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})
