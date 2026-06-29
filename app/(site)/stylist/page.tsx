import type { Metadata } from 'next'
import Image from 'next/image'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const profile = await client.fetch<{ name?: string; tagline?: string } | null>(
    `*[_type == "stylistProfile"][0]{ name, tagline }`
  )
  return {
    title: profile?.name ?? 'Stylist',
    description:
      profile?.tagline ?? 'Conheça a personal stylist por trás da LT Studio e agende seu atendimento.',
  }
}

type SanityImg = {
  asset: { _ref: string; _type?: string }
  alt?: string
  hotspot?: { x: number; y: number }
}

type CardItem = {
  _key: string
  titulo: string
  subtitulo: string
}

type StylistSection = {
  _key: string
  eyebrow?: string
  title?: string
  body?: PortableTextBlock[]
  image?: SanityImg
  items?: CardItem[]
  layout?: 'padrao' | 'foto-esquerda' | 'foto-direita' | 'etapas' | 'destaque-escuro' | 'destaque-claro' | 'transformacao-escura' | 'cards'
}

type StylistProfile = {
  name?: string
  tagline?: string
  photo?: SanityImg
  sections?: StylistSection[]
}

const profileQuery = `*[_type == "stylistProfile"][0]{
  name,
  tagline,
  photo { asset, alt },
  sections[] {
    _key,
    eyebrow,
    title,
    body,
    image { asset, alt },
    items[] { _key, titulo, subtitulo },
    layout
  }
}`

const settingsQuery = `*[_type == "siteSettings"][0]{ whatsappNumber }`

export default async function StylistPage() {
  const [profile, settings] = await Promise.all([
    client.fetch<StylistProfile | null>(profileQuery),
    client.fetch<{ whatsappNumber?: string } | null>(settingsQuery),
  ])

  const whatsappNumber = settings?.whatsappNumber
  const waMessage = 'Oi! Gostaria de agendar um horário de personal styling.'
  const waHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`
    : null

  return (
    <main>

      {/* ═══ HERO — nome, tagline e foto principal ═══ */}
      <section className="bg-sand-100 py-16 px-5" aria-label="Apresentação">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">

          {/* Foto principal */}
          <div className="w-full max-w-xs md:w-72 md:max-w-none shrink-0">
            {profile?.photo?.asset ? (
              <Image
                src={urlFor(profile.photo).width(576).height(768).fit('crop').auto('format').url()}
                alt={profile.photo.alt ?? profile.name ?? 'Foto da stylist'}
                width={576}
                height={768}
                className="w-full object-cover"
                priority
              />
            ) : (
              <div className="w-full aspect-[3/4] bg-ink/10 flex items-center justify-center">
                <span className="font-sans text-[10px] tracking-widest uppercase text-ink/40 text-center px-4">
                  Foto em breve
                </span>
              </div>
            )}
          </div>

          {/* Texto do hero */}
          <div className="flex-1 text-center md:text-left">
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-esmeralda mb-4">
              Personal Stylist
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-ink tracking-wide mb-4">
              {profile?.name ?? 'Em breve'}
            </h1>
            {profile?.tagline && (
              <p className="font-display text-xl md:text-2xl font-light italic text-ink/70 leading-snug mb-8">
                {profile.tagline}
              </p>
            )}
            <div className="w-10 h-px bg-dourado mx-auto md:mx-0 mb-8" />
            <WaButton waHref={waHref} />
          </div>
        </div>
      </section>

      {/* ═══ SEÇÕES DINÂMICAS ═══ */}
      {profile?.sections?.map((section) => {
        switch (section.layout) {
          case 'foto-esquerda':
            return <FotoLadoSection key={section._key} section={section} reverse={false} />
          case 'foto-direita':
            return <FotoLadoSection key={section._key} section={section} reverse={true} />
          case 'etapas':
            return <EtapasSection key={section._key} section={section} />
          case 'transformacao-escura':
            return <TransformacaoEscuraSection key={section._key} section={section} />
          case 'destaque-claro':
          case 'destaque-escuro': // alias de compatibilidade — docs Sanity antigos
            return <DestaqueClaroSection key={section._key} section={section} waHref={waHref} />
          case 'cards':
            return <CardsSection key={section._key} section={section} />
          default:
            return <PadraoSection key={section._key} section={section} />
        }
      })}

    </main>
  )
}

/* ── Botão WhatsApp reutilizável ── */
function WaButton({ waHref, large = false }: { waHref: string | null; large?: boolean }) {
  if (!waHref) return null
  return (
    <a
      href={waHref}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-3 bg-esmeralda text-cream-text font-sans text-[11px] tracking-widest uppercase hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-esmeralda focus-visible:outline-offset-4 transition-opacity ${large ? 'px-12 py-4' : 'px-10 py-4'}`}
    >
      {large && <WhatsAppIcon />}
      Agendar horário
    </a>
  )
}

/* ── Seção padrão: texto, fundo claro ── */
function PadraoSection({ section }: { section: StylistSection }) {
  return (
    <section className="py-16 px-5" aria-label={section.eyebrow ?? section.title}>
      <div className="max-w-2xl mx-auto">
        {section.eyebrow && (
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-dourado mb-4">
            {section.eyebrow}
          </p>
        )}
        {section.title && (
          <h2 className="font-display text-3xl md:text-4xl font-light text-ink tracking-wide mb-8">
            {section.title}
          </h2>
        )}
        <div className="w-8 h-px bg-dourado/40 mb-8" />
        {section.body && (
          <div className="[&_p]:font-sans [&_p]:text-sm [&_p]:text-ink/75 [&_p]:tracking-wide [&_p]:leading-relaxed [&_p]:mb-4 [&_blockquote]:font-display [&_blockquote]:text-xl md:[&_blockquote]:text-2xl [&_blockquote]:font-light [&_blockquote]:italic [&_blockquote]:text-ink/60 [&_blockquote]:leading-relaxed [&_blockquote]:border-l-2 [&_blockquote]:border-dourado [&_blockquote]:pl-6 [&_blockquote]:my-6">
            <PortableText value={section.body} />
          </div>
        )}
      </div>
    </section>
  )
}

/* ── Seção com foto lateral ── */
function FotoLadoSection({ section, reverse }: { section: StylistSection; reverse: boolean }) {
  return (
    <section className="bg-sand-100 py-16 px-5" aria-label={section.eyebrow ?? section.title}>
      <div
        className={`max-w-5xl mx-auto flex flex-col ${
          reverse ? 'md:flex-row-reverse' : 'md:flex-row'
        } items-start gap-10 md:gap-16`}
      >
        {/* Imagem */}
        <div className="w-full max-w-xs md:w-64 md:max-w-none shrink-0 self-center">
          {section.image?.asset ? (
            <Image
              src={urlFor(section.image).width(512).height(683).fit('crop').auto('format').url()}
              alt={section.image.alt ?? section.title ?? ''}
              width={512}
              height={683}
              className="w-full object-cover"
            />
          ) : (
            <div className="w-full aspect-[3/4] bg-ink/10 flex items-center justify-center">
              <span className="font-sans text-[10px] tracking-widest uppercase text-ink/40 text-center px-4">
                Foto em breve
              </span>
            </div>
          )}
        </div>

        {/* Texto */}
        <div className="flex-1">
          {section.eyebrow && (
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-dourado mb-4">
              {section.eyebrow}
            </p>
          )}
          {section.title && (
            <h2 className="font-display text-3xl md:text-4xl font-light text-ink tracking-wide mb-8">
              {section.title}
            </h2>
          )}
          <div className="w-8 h-px bg-dourado/40 mb-8" />
          {section.body && (
            <div className="[&_p]:font-sans [&_p]:text-sm [&_p]:text-ink/75 [&_p]:tracking-wide [&_p]:leading-relaxed [&_p]:mb-4">
              <PortableText value={section.body} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ── Seção etapas numeradas (fundo espresso) ── */
function EtapasSection({ section }: { section: StylistSection }) {
  /*
   * Números robustos para dois formatos de conteúdo Sanity:
   * - Lista numerada (listType:'number'): listItem.number usa {index+1} explícito
   * - Parágrafos normais (block.normal): CSS counter via [counter-increment:step]
   *   + before:content-[counter(step)] — evita invisibilidade se o conteúdo
   *   não for formatado como lista ordenada no Studio
   */
  const components = {
    list: {
      number: ({ children }: { children: React.ReactNode }) => (
        <ol className="space-y-8 list-none p-0 m-0">{children}</ol>
      ),
    },
    listItem: {
      number: ({ children, index }: { children: React.ReactNode; index: number }) => (
        <li className="flex gap-6 items-start text-left">
          <span
            aria-hidden
            className="font-display text-3xl font-light text-dourado/60 leading-none w-8 shrink-0 select-none"
          >
            {index + 1}
          </span>
          <div className="font-sans text-sm text-cream-text/75 tracking-wide leading-relaxed flex-1">
            {children}
          </div>
        </li>
      ),
    },
  }

  return (
    <section className="bg-espresso py-16 px-5" aria-label={section.eyebrow ?? section.title}>
      <div className="max-w-3xl mx-auto">
        {section.eyebrow && (
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-dourado mb-4">
            {section.eyebrow}
          </p>
        )}
        {section.title && (
          <h2 className="font-display text-3xl md:text-4xl font-light text-cream-text tracking-wide mb-4">
            {section.title}
          </h2>
        )}
        <div className="w-8 h-px bg-dourado/40 mb-10" />
        {section.body && (
          <div className="space-y-8">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <PortableText value={section.body} components={components as any} />
          </div>
        )}
      </div>
    </section>
  )
}

/* ── Destaque claro — citação itálica, fundo areia, botão WhatsApp (ex. "Vamos começar?") ── */
function DestaqueClaroSection({ section, waHref }: { section: StylistSection; waHref: string | null }) {
  return (
    <section className="bg-sand-200 py-16 px-5" aria-label={section.eyebrow ?? section.title}>
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-6 h-px bg-dourado/40 mx-auto mb-8" />
        {section.body && (
          <div className="[&_p]:font-display [&_p]:text-2xl md:[&_p]:text-3xl [&_p]:font-light [&_p]:italic [&_p]:text-ink/65 [&_p]:leading-snug [&_p]:mb-6 mb-10">
            <PortableText value={section.body} />
          </div>
        )}
        <WaButton waHref={waHref} large />
      </div>
    </section>
  )
}

/* ── Destaque escuro — clímax da página, fundo espresso, todo texto em creme (ex. "O que muda") ── */
function TransformacaoEscuraSection({ section }: { section: StylistSection }) {
  return (
    <section className="bg-espresso py-16 px-5" aria-label={section.eyebrow ?? section.title}>
      <div className="max-w-2xl mx-auto text-center">
        {section.eyebrow && (
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-dourado mb-4">
            {section.eyebrow}
          </p>
        )}
        {section.title && (
          <h2 className="font-display text-3xl md:text-4xl font-light text-cream-text tracking-wide mb-6">
            {section.title}
          </h2>
        )}
        <div className="w-6 h-px bg-dourado/40 mx-auto mb-8" />
        {section.body && (
          /* text-cream-text no wrapper garante que TODOS os elementos filhos herdam a cor clara,
             sem depender de seletores [&_p] que não cobrem listas nem outros tipos de bloco */
          <div className="text-cream-text [&_p]:font-display [&_p]:text-xl md:[&_p]:text-2xl [&_p]:font-light [&_p]:italic [&_p]:leading-snug [&_p]:mb-4 [&_li]:font-sans [&_li]:text-sm [&_li]:leading-relaxed [&_li]:mb-2">
            <PortableText value={section.body} />
          </div>
        )}
      </div>
    </section>
  )
}

/* ── Cards — grade de itens, fundo areia claro (ex. "Pra quem é") ── */
function CardsSection({ section }: { section: StylistSection }) {
  return (
    <section className="py-16 px-5" aria-label={section.eyebrow ?? section.title}>
      <div className="max-w-4xl mx-auto">
        {section.eyebrow && (
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-dourado mb-4">
            {section.eyebrow}
          </p>
        )}
        {section.title && (
          <h2 className="font-display text-3xl md:text-4xl font-light text-ink tracking-wide mb-4">
            {section.title}
          </h2>
        )}
        <div className="w-8 h-px bg-dourado/40 mb-10" />
        {section.items && section.items.length > 0 && (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 list-none p-0 m-0">
            {section.items.map((item) => (
              <li key={item._key} className="bg-sand-50 border border-sand-300/40 px-7 py-6">
                <p className="font-display text-lg font-light text-ink tracking-wide mb-2">
                  {item.titulo}
                </p>
                <p className="font-sans text-sm text-ink/65 tracking-wide leading-relaxed">
                  {item.subtitulo}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
