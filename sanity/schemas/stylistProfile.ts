import { defineField, defineType } from 'sanity'

export const stylistProfile = defineType({
  name: 'stylistProfile',
  title: 'Perfil da Estilista',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Foto',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'bio',
      title: 'Biografia',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'Número do WhatsApp',
      type: 'string',
      description: 'Somente dígitos com DDI. Ex.: 5511999990000',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bookingMessage',
      title: 'Mensagem de agendamento',
      type: 'string',
      description: 'Texto pré-preenchido no WhatsApp ao clicar em "Agendar horário".',
      initialValue: 'Oi! Quero agendar um horário de personal styling.',
      validation: (rule) => rule.required(),
    }),
  ],
})
