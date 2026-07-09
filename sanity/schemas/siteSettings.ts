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
    // NOTA: topBarText/topBarLink/heroVideo/heroPoster foram removidos — nenhuma
    // tela os lia (hero usa /public/hero.mp4 por regra; não há barra superior).
    // Campos sem consumidor só confundem o Studio (auditoria B1).
    defineField({
      name: 'curatorNote',
      title: 'Nota da Stylist',
      type: 'text',
      rows: 4,
      description:
        'Nota curatorial exibida na página inicial entre os produtos e a seção de agendamento. Deixe em branco para ocultar a seção.',
    }),
    defineField({
      name: 'curatorNoteByline',
      title: 'Assinatura da nota',
      type: 'string',
      description: 'Opcional. Ex.: Letícia Tadei — Julho 2025',
    }),
  ],
})
