import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { urlFor } from '@/sanity/lib/image'
import { Reveal } from '@/components/motion/Reveal'
import { PhotoParallax } from '@/components/motion/PhotoParallax'

/*
 * Fase 5 (Reconstrução) — seções dinâmicas de /consultoria, extraídas de
 * app/(site)/stylist/page.tsx (446 linhas dentro de uma rota — achado da
 * auditoria). Conteúdo e regras de composição são as da Fase 3/3.1, JÁ
 * APROVADAS pelo dono ao vivo (cor composicional, PhotoParallax, andaime
 * único) — esta etapa é recomposição de arquivo, não redesenho: só o que
 * já funcionou muda de endereço.
 */

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

export type StylistSection = {
  _key: string
  eyebrow?: string
  title?: string
  body?: PortableTextBlock[]
  image?: SanityImg
  items?: CardItem[]
  layout?:
    | 'padrao'
    | 'foto-esquerda'
    | 'foto-direita'
    | 'etapas'
    | 'destaque-escuro'
    | 'destaque-claro'
    | 'transformacao-escura'
    | 'cards'
}

export function StylistSectionsRenderer({
  sections,
  waHref,
}: {
  sections: StylistSection[]
  waHref: string | null
}) {
  return (
    <>
      {sections.map(section => {
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
    </>
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
      Agendar horário
    </a>
  )
}

type Tone = 'paper' | 'paper-deep' | 'dark'

function toneClasses(tone: Tone) {
  switch (tone) {
    case 'dark':
      return { bg: 'bg-espresso', eyebrow: 'text-dourado', title: 'text-cream-text' }
    case 'paper-deep':
      return { bg: 'bg-gradient-to-b from-sand-100 to-sand-200', eyebrow: 'text-dourado-ink', title: 'text-ink' }
    default:
      return { bg: 'bg-gradient-to-b from-sand-50 to-sand-100', eyebrow: 'text-dourado-ink', title: 'text-ink' }
  }
}

function SectionShell({
  tone,
  maxWidth = 'max-w-2xl',
  padding = 'py-24 md:py-32',
  align = 'left',
  ariaLabel,
  topHairline = false,
  children,
}: {
  tone: Tone
  maxWidth?: string
  padding?: string
  align?: 'left' | 'center'
  ariaLabel?: string
  topHairline?: boolean
  children: React.ReactNode
}) {
  return (
    <section className={`relative ${toneClasses(tone).bg} ${padding} px-5`} aria-label={ariaLabel}>
      {topHairline && <div aria-hidden className="absolute top-0 left-[6vw] right-[6vw] h-px bg-dourado/40" />}
      <div className={`relative z-10 ${maxWidth} mx-auto ${align === 'center' ? 'text-center' : ''}`}>
        {children}
      </div>
    </section>
  )
}

function SectionHeading({
  tone,
  eyebrow,
  title,
  variant = 'full',
  titleMargin = 'mb-8',
}: {
  tone: Tone
  eyebrow?: string
  title?: string
  variant?: 'full' | 'title-only'
  titleMargin?: string
}) {
  const { eyebrow: eyebrowColor, title: titleColor } = toneClasses(tone)
  const showEyebrow = variant === 'full'

  return (
    <Reveal>
      {showEyebrow && eyebrow && (
        <p className={`font-sans text-[10px] tracking-[0.4em] uppercase ${eyebrowColor} mb-4`}>
          {eyebrow}
        </p>
      )}
      {title && (
        <h2 className={`font-display text-[clamp(1.5rem,3vw,2rem)] font-[450] ${titleColor} tracking-tight ${titleMargin} [text-wrap:balance]`}>
          {title}
        </h2>
      )}
    </Reveal>
  )
}

/* ── Seção padrão: texto, fundo claro ── */
function PadraoSection({ section }: { section: StylistSection }) {
  return (
    <SectionShell tone="paper" ariaLabel={section.eyebrow ?? section.title}>
      <SectionHeading tone="paper" eyebrow={section.eyebrow} title={section.title} titleMargin="mb-10" />
      {section.body && (
        <div className="[&_p]:font-sans [&_p]:text-sm [&_p]:text-ink-soft [&_p]:tracking-wide [&_p]:leading-relaxed [&_p]:mb-4 [&_blockquote]:font-display [&_blockquote]:text-xl md:[&_blockquote]:text-2xl [&_blockquote]:font-light [&_blockquote]:italic [&_blockquote]:text-ink-soft [&_blockquote]:leading-relaxed [&_blockquote]:my-6">
          <PortableText value={section.body} />
        </div>
      )}
    </SectionShell>
  )
}

/* ── Foto + texto: cor composicional (bloco bordô atrás da foto), PhotoParallax ── */
function FotoLadoSection({ section, reverse }: { section: StylistSection; reverse: boolean }) {
  const imageUrl = section.image?.asset
    ? urlFor(section.image).width(700).height(933).fit('crop').auto('format').url()
    : null

  return (
    <SectionShell tone="paper-deep" maxWidth="max-w-6xl" padding="py-24 md:py-32" topHairline ariaLabel={section.eyebrow ?? section.title}>
      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <div className={`order-2 ${reverse ? 'md:order-1' : 'md:order-2'}`}>
          <SectionHeading tone="paper" eyebrow={section.eyebrow} title={section.title} titleMargin="mb-9" />
          {section.body && (
            <div className="[&_p]:font-sans [&_p]:text-[15px] [&_p]:text-ink [&_p]:leading-relaxed [&_p]:mb-8 [&_blockquote]:font-sans [&_blockquote]:text-[15px] [&_blockquote]:text-ink [&_blockquote]:leading-relaxed [&_blockquote]:mb-8">
              <PortableText value={section.body} />
            </div>
          )}
          {/* Sem WaButton aqui (Fase 5b, feedback do dono: "Agendar horário"
              repetia ~4x na página). O hero já abre com o CTA e a seção de
              destaque fecha a página com ele — meio de página fica só a
              narrativa, sem repetir a cada bloco foto+texto. */}
        </div>

        <div className={`order-1 ${reverse ? 'md:order-2' : 'md:order-1'}`}>
          <Reveal>
            <div className="relative max-w-[420px] mx-auto md:mx-0">
              <div
                aria-hidden
                className={`absolute top-[6%] bottom-[-6%] w-[86%] bg-gradient-to-br from-bordo to-[#4A1123] ${
                  reverse ? 'right-0 md:-right-[6vw]' : 'left-0 md:-left-[6vw]'
                }`}
              />
              <div className={`relative ${reverse ? 'mr-[14%]' : 'ml-[14%]'}`}>
                {imageUrl ? (
                  <PhotoParallax src={imageUrl} alt={section.image?.alt ?? section.title ?? ''} />
                ) : (
                  <div className="w-full aspect-[3/4] bg-ink/10 flex items-center justify-center">
                    <span className="font-sans text-[10px] tracking-widest uppercase text-ink-soft text-center px-4">
                      Foto em breve
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  )
}

/* ── Etapas numeradas ── */
function EtapasSection({ section }: { section: StylistSection }) {
  const components = {
    list: {
      number: ({ children }: { children: React.ReactNode }) => (
        <ol className="space-y-8 list-none p-0 m-0">{children}</ol>
      ),
    },
    listItem: {
      number: ({ children, index }: { children: React.ReactNode; index: number }) => (
        <li className="flex gap-6 items-start text-left">
          <span aria-hidden className="font-sans text-sm tracking-[0.2em] text-ink-soft w-8 shrink-0 pt-2 select-none">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="font-sans text-sm text-ink-soft tracking-wide leading-relaxed flex-1 pt-2">
            {children}
          </div>
        </li>
      ),
    },
  }

  return (
    <SectionShell tone="paper" maxWidth="max-w-3xl" padding="py-20 md:py-28" ariaLabel={section.eyebrow ?? section.title}>
      <SectionHeading tone="paper" title={section.title} variant="title-only" titleMargin="mb-10" />
      {section.body && (
        <div className="space-y-8">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <PortableText value={section.body} components={components as any} />
        </div>
      )}
    </SectionShell>
  )
}

/* ── Destaque claro — citação itálica, fundo areia, CTA fechando ── */
function DestaqueClaroSection({ section, waHref }: { section: StylistSection; waHref: string | null }) {
  return (
    <SectionShell tone="paper-deep" padding="py-24 md:py-36" align="center" ariaLabel={section.eyebrow ?? section.title}>
      {section.body && (
        <Reveal>
          <div className="[&_p]:font-display [&_p]:text-3xl md:[&_p]:text-4xl [&_p]:font-light [&_p]:italic [&_p]:text-ink-soft [&_p]:leading-snug [&_p]:mb-6 [&_blockquote]:font-display [&_blockquote]:text-3xl md:[&_blockquote]:text-4xl [&_blockquote]:font-light [&_blockquote]:italic [&_blockquote]:text-ink-soft [&_blockquote]:leading-snug [&_blockquote]:mb-6 mb-10">
            <PortableText value={section.body} />
          </div>
        </Reveal>
      )}
      <WaButton waHref={waHref} large />
    </SectionShell>
  )
}

/* ── Transformação escura — clímax da página, fundo espresso ── */
function TransformacaoEscuraSection({ section }: { section: StylistSection }) {
  return (
    <SectionShell tone="dark" padding="py-28 md:py-40" align="center" ariaLabel={section.eyebrow ?? section.title}>
      <SectionHeading tone="dark" eyebrow={section.eyebrow} title={section.title} titleMargin="mb-10" />
      {section.body && (
        <div className="text-cream-text [&_p]:font-display [&_p]:text-xl md:[&_p]:text-2xl [&_p]:font-light [&_p]:italic [&_p]:leading-snug [&_p]:mb-4 [&_blockquote]:font-display [&_blockquote]:text-xl md:[&_blockquote]:text-2xl [&_blockquote]:font-light [&_blockquote]:italic [&_blockquote]:leading-snug [&_blockquote]:mb-4 [&_li]:font-sans [&_li]:text-sm [&_li]:leading-relaxed [&_li]:mb-2">
          <PortableText value={section.body} />
        </div>
      )}
    </SectionShell>
  )
}

/* ── Cards — grade de itens, fundo areia claro ── */
function CardsSection({ section }: { section: StylistSection }) {
  return (
    <SectionShell tone="paper" maxWidth="max-w-4xl" padding="py-20 md:py-28" ariaLabel={section.eyebrow ?? section.title}>
      <SectionHeading tone="paper" title={section.title} variant="title-only" titleMargin="mb-10" />
      {section.items && section.items.length > 0 && (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 list-none p-0 m-0">
          {section.items.map(item => (
            <li key={item._key} className="bg-sand-50 px-7 py-6">
              <h3 className="font-display text-lg font-light text-ink tracking-wide mb-2">{item.titulo}</h3>
              <p className="font-sans text-sm text-ink-soft tracking-wide leading-relaxed">{item.subtitulo}</p>
            </li>
          ))}
        </ul>
      )}
    </SectionShell>
  )
}
