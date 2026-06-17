import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configurações do Site',
  type: 'document',
  fields: [
    defineField({
      name: 'whatsappNumber',
      title: 'Número do WhatsApp',
      type: 'string',
      description: 'Somente dígitos com DDI. Ex.: 5511999990000',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'topBarText',
      title: 'Texto da barra superior',
      type: 'string',
      description: 'Ex.: Frete grátis acima de R$ 300 | Atendimento via WhatsApp',
    }),
    defineField({
      name: 'topBarLink',
      title: 'Link da barra superior (opcional)',
      type: 'url',
    }),
    defineField({
      name: 'heroVideo',
      title: 'Vídeo do hero',
      type: 'file',
      options: { accept: 'video/mp4,video/webm' },
      description: 'Sirva webm + mp4 para máxima compatibilidade.',
    }),
    defineField({
      name: 'heroPoster',
      title: 'Poster do hero (imagem de loading)',
      type: 'image',
      options: { hotspot: true },
      description: 'Exibida enquanto o vídeo carrega — mantenha leve.',
    }),
  ],
})
