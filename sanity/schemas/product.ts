import { defineField, defineType } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Produto',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nome da peça',
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
      name: 'category',
      title: 'Categoria',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (rule) => rule.required(),
      description: 'Uma única categoria (tipo de peça).',
    }),
    defineField({
      name: 'tags',
      title: 'Coleções / Tags',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'collection' }] }],
      description: 'Filtros transversais: Novidades, Denim, Alfaiataria, etc. Pode ter várias.',
    }),
    defineField({
      name: 'images',
      title: 'Fotos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Texto alternativo (acessibilidade)',
              type: 'string',
            }),
          ],
        },
      ],
      validation: (rule) => rule.min(1).error('Adicione ao menos uma foto.'),
    }),
    defineField({
      name: 'price',
      title: 'Preço (R$)',
      type: 'number',
      description: 'Opcional — só exibição. A venda fecha no WhatsApp.',
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'inStock',
      title: 'Em estoque',
      type: 'boolean',
      initialValue: true,
      description: 'Fora de estoque: a peça some da vitrine e pode sumir do menu.',
    }),
    defineField({
      name: 'isNew',
      title: 'Novidade',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'featured',
      title: 'Destaque na home',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'images.0',
      category: 'category.title',
      inStock: 'inStock',
    },
    prepare({ title, media, category, inStock }) {
      return {
        title: title ?? 'Produto sem nome',
        subtitle: `${category ?? '—'}${inStock ? '' : ' · Fora de estoque'}`,
        media,
      }
    },
  },
})
