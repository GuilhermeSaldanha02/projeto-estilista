import { defineField, defineType, defineArrayMember } from 'sanity'

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
      name: 'tagline',
      title: 'Frase de definição',
      description: 'Exibida abaixo do nome no hero da página (resposta à Q1).',
      type: 'string',
    }),
    defineField({
      name: 'photo',
      title: 'Foto principal',
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
      name: 'sections',
      title: 'Seções de conteúdo',
      description: 'Cada item vira uma seção na página. Ordene livremente arrastando.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'section',
          title: 'Seção',
          preview: {
            select: { title: 'title', eyebrow: 'eyebrow', layout: 'layout' },
            prepare({ title, eyebrow, layout }: { title?: string; eyebrow?: string; layout?: string }) {
              return {
                title: title ?? eyebrow ?? '(sem título)',
                subtitle: layout ?? 'padrao',
              }
            },
          },
          fields: [
            defineField({
              name: 'eyebrow',
              title: 'Rótulo (eyebrow)',
              description: 'Texto pequeno em caixa alta acima do título. Ex.: "Pra quem é"',
              type: 'string',
            }),
            defineField({
              name: 'title',
              title: 'Título da seção',
              type: 'string',
            }),
            defineField({
              name: 'body',
              title: 'Conteúdo',
              description: 'Para o layout "Etapas", escreva uma lista ordenada (1. 2. 3…)',
              type: 'array',
              of: [{ type: 'block' }],
            }),
            defineField({
              name: 'image',
              title: 'Imagem (opcional)',
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
              name: 'layout',
              title: 'Layout visual',
              type: 'string',
              initialValue: 'padrao',
              options: {
                list: [
                  { title: 'Padrão (só texto, fundo claro)', value: 'padrao' },
                  { title: 'Foto à esquerda + texto à direita', value: 'foto-esquerda' },
                  { title: 'Texto à esquerda + foto à direita', value: 'foto-direita' },
                  { title: 'Etapas numeradas (fundo escuro)', value: 'etapas' },
                  { title: 'Destaque final com botão WhatsApp', value: 'destaque-escuro' },
                ],
                layout: 'radio',
              },
            }),
          ],
        }),
      ],
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
