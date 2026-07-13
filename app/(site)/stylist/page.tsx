import type { Metadata } from 'next'
import Image from 'next/image'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { WhatsAppIcon } from '@/components/icons'
import { FadeInSection } from '@/components/FadeInSection'

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
      <section className="relative bg-gradient-to-b from-sand-50 to-sand-100 py-20 md:py-28 px-5" aria-label="Apresentação">
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">

          {/* Foto principal */}
          <div className="w-full max-w-xs md:w-[40%] md:max-w-none shrink-0">
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
                <span className="font-sans text-[10px] tracking-widest uppercase text-ink-soft text-center px-4">
                  Foto em breve
                </span>
              </div>
            )}
          </div>

          {/* Texto do hero */}
          <div className="flex-1 text-center md:text-left">
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-esmeralda mb-4">
              Consultoria de Estilo
            </p>
            <h1 className="font-display text-[clamp(2rem,4vw,2.75rem)] font-[450] text-ink tracking-tight mb-5 [text-wrap:balance]">
              {profile?.name ?? 'Em breve'}
            </h1>
            {profile?.tagline && (
              <p className="font-display text-xl md:text-2xl font-light italic text-ink-soft leading-snug mb-8">
                {profile.tagline}
              </p>
            )}
            <div className="w-10 h-px bg-dourado/40 mx-auto md:mx-0 mb-8" />
            <WaButton waHref={waHref} />
          </div>
        </div>
      </section>

      {/* ═══ SEÇÕES DINÂMICAS ═══ */}
      {profile?.sections?.map((section) => {
        const layout = section.layout ?? 'padrao'
        switch (layout) {
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
      className={`inline-flex items-center justify-center gap-3 bg-esmeralda text-cream-text font-sans text-[11px] tracking-widest uppercase hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cream-text focus-visible:outline-offset-4 transition-opacity ${large ? 'px-12 py-4' : 'px-10 py-4'}`}
    >
      {large && <WhatsAppIcon />}
      Agendar horário
    </a>
  )
}

/* ── Seção padrão: texto, fundo claro ── */
function PadraoSection({ section }: { section: StylistSection }) {
  return (
    <section className="relative bg-gradient-to-b from-sand-50 to-sand-100 py-24 md:py-32 px-5" aria-label={section.eyebrow ?? section.title}>
      <div className="relative z-10 max-w-2xl mx-auto">
        <FadeInSection>
          {section.eyebrow && (
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-dourado-ink mb-4">
              {section.eyebrow}
            </p>
          )}
          {section.title && (
            <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-[450] text-ink tracking-tight mb-8 [text-wrap:balance]">
              {section.title}
            </h2>
          )}
        </FadeInSection>
        <div className="w-8 h-px bg-dourado/40 mb-8" />
        {section.body && (
          <div className="[&_p]:font-sans [&_p]:text-sm [&_p]:text-ink-soft [&_p]:tracking-wide [&_p]:leading-relaxed [&_p]:mb-4 [&_blockquote]:font-display [&_blockquote]:text-xl md:[&_blockquote]:text-2xl [&_blockquote]:font-light [&_blockquote]:italic [&_blockquote]:text-ink-soft [&_blockquote]:leading-relaxed [&_blockquote]:my-6">
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
    <section className="relative bg-gradient-to-b from-sand-50 to-sand-100 py-24 md:py-32 px-5" aria-label={section.eyebrow ?? section.title}>
      <div
        className={`relative z-10 max-w-5xl mx-auto flex flex-col ${
          reverse ? 'md:flex-row-reverse' : 'md:flex-row'
        } items-start gap-10 md:gap-16`}
      >
        {/* Imagem */}
        <div className="w-full max-w-xs md:w-2/5 md:max-w-none shrink-0 self-center">
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
              <span className="font-sans text-[10px] tracking-widest uppercase text-ink-soft text-center px-4">
                Foto em breve
              </span>
            </div>
          )}
        </div>

        {/* Texto */}
        <div className="flex-1">
          <FadeInSection>
            {section.eyebrow && (
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-dourado-ink mb-4">
                {section.eyebrow}
              </p>
            )}
            {section.title && (
              <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-[450] text-ink tracking-tight mb-8 [text-wrap:balance]">
                {section.title}
              </h2>
            )}
          </FadeInSection>
          <div className="w-8 h-px bg-dourado/40 mb-8" />
          {section.body && (
            <div className="[&_p]:font-sans [&_p]:text-sm [&_p]:text-ink-soft [&_p]:tracking-wide [&_p]:leading-relaxed [&_p]:mb-4">
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
            className="font-sans text-sm tracking-[0.2em] text-cream-text/50 w-8 shrink-0 pt-2 select-none"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="font-sans text-sm text-cream-text/75 tracking-wide leading-relaxed flex-1 pt-2">
            {children}
          </div>
        </li>
      ),
    },
  }

  return (
    <section className="relative bg-espresso py-24 md:py-32 px-5" aria-label={section.eyebrow ?? section.title}>
      <div className="relative z-10 max-w-3xl mx-auto">
        <FadeInSection>
          {section.eyebrow && (
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-dourado mb-4">
              {section.eyebrow}
            </p>
          )}
          {section.title && (
            <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-[450] text-cream-text tracking-tight mb-4 [text-wrap:balance]">
              {section.title}
            </h2>
          )}
        </FadeInSection>
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
    <section className="relative bg-gradient-to-b from-sand-100 to-sand-200 py-24 md:py-36 px-5" aria-label={section.eyebrow ?? section.title}>
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <div className="w-6 h-px bg-dourado/40 mx-auto mb-8" />
        {section.body && (
          <FadeInSection>
            <div className="[&_p]:font-display [&_p]:text-3xl md:[&_p]:text-4xl [&_p]:font-light [&_p]:italic [&_p]:text-ink-soft [&_p]:leading-snug [&_p]:mb-6 mb-10">
              <PortableText value={section.body} />
            </div>
          </FadeInSection>
        )}
        <WaButton waHref={waHref} large />
      </div>
    </section>
  )
}

/* ── Destaque escuro — clímax da página, fundo espresso, todo texto em creme (ex. "O que muda") ── */
function TransformacaoEscuraSection({ section }: { section: StylistSection }) {
  return (
    <section className="relative bg-espresso py-28 md:py-40 px-5" aria-label={section.eyebrow ?? section.title}>
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <FadeInSection>
          {section.eyebrow && (
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-dourado mb-4">
              {section.eyebrow}
            </p>
          )}
          {section.title && (
            <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-[450] text-cream-text tracking-tight mb-6 [text-wrap:balance]">
              {section.title}
            </h2>
          )}
        </FadeInSection>
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
    <section className="relative bg-gradient-to-b from-sand-50 to-sand-100 py-24 md:py-32 px-5" aria-label={section.eyebrow ?? section.title}>
      <div className="relative z-10 max-w-4xl mx-auto">
        <FadeInSection>
          {section.eyebrow && (
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-dourado-ink mb-4">
              {section.eyebrow}
            </p>
          )}
          {section.title && (
            <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-[450] text-ink tracking-tight mb-4 [text-wrap:balance]">
              {section.title}
            </h2>
          )}
        </FadeInSection>
        <div className="w-8 h-px bg-dourado/40 mb-10" />
        {section.items && section.items.length > 0 && (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 list-none p-0 m-0">
            {section.items.map((item) => (
              <li key={item._key} className="bg-sand-50 px-7 py-6">
                <h3 className="font-display text-lg font-light text-ink tracking-wide mb-2">
                  {item.titulo}
                </h3>
                <p className="font-sans text-sm text-ink-soft tracking-wide leading-relaxed">
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
