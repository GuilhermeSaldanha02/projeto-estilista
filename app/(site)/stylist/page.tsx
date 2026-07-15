import type { Metadata } from 'next'
import Image from 'next/image'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { WhatsAppIcon } from '@/components/icons'
import { FadeInSection } from '@/components/FadeInSection'
import { PhotoParallax } from '@/components/motion/PhotoParallax'

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
              <p className="font-display text-xl md:text-2xl font-light italic text-ink-soft leading-snug">
                {profile.tagline}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ═══ SEÇÕES DINÂMICAS ═══ */}
      {profile?.sections?.map((section) => {
        const layout = section.layout ?? 'padrao'
        switch (layout) {
          case 'foto-esquerda':
            return <FotoLadoSection key={section._key} section={section} reverse={false} waHref={waHref} />
          case 'foto-direita':
            return <FotoLadoSection key={section._key} section={section} reverse={true} waHref={waHref} />
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

type Tone = 'paper' | 'paper-deep' | 'dark'

/*
 * Fase 3 do redesign (13/07): as 7 seções do /stylist repetiam byte a byte o
 * mesmo andaime "eyebrow + linha dourada + H2" (achado do Crítico — ~10x no
 * site, 5x só nesta página). SectionShell/SectionHeading extraem essa casca
 * comum (tom, padding, aria-label, eyebrow/linha/título) uma única vez; cada
 * seção só declara o corpo que de fato varia (prosa, foto, etapas, cards,
 * citação). `scaffold="title-only"` é a válvula de escape para as seções
 * "utilitárias" (grade/lista) que não precisam repetir o rótulo eyebrow+linha
 * — ver "A Regra do Andaime Único" em DESIGN.md.
 */
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
  align = 'left',
  titleMargin = 'mb-8',
  lineMargin = 'mb-8',
  lineWidth = 'w-8',
}: {
  tone: Tone
  eyebrow?: string
  title?: string
  variant?: 'full' | 'title-only'
  align?: 'left' | 'center'
  titleMargin?: string
  lineMargin?: string
  lineWidth?: string
}) {
  const { eyebrow: eyebrowColor, title: titleColor } = toneClasses(tone)
  const showEyebrowAndLine = variant === 'full'

  return (
    <>
      <FadeInSection>
        {showEyebrowAndLine && eyebrow && (
          <p className={`font-sans text-[10px] tracking-[0.4em] uppercase ${eyebrowColor} mb-4`}>
            {eyebrow}
          </p>
        )}
        {title && (
          <h2 className={`font-display text-[clamp(1.5rem,3vw,2rem)] font-[450] ${titleColor} tracking-tight ${titleMargin} [text-wrap:balance]`}>
            {title}
          </h2>
        )}
      </FadeInSection>
      {showEyebrowAndLine && (
        <div className={`${lineWidth} h-px bg-dourado/40 ${align === 'center' ? 'mx-auto' : ''} ${lineMargin}`} />
      )}
    </>
  )
}

/* ── Seção padrão: texto, fundo claro ── */
function PadraoSection({ section }: { section: StylistSection }) {
  return (
    <SectionShell tone="paper" ariaLabel={section.eyebrow ?? section.title}>
      <SectionHeading tone="paper" eyebrow={section.eyebrow} title={section.title} titleMargin="mb-8" lineMargin="mb-8" />
      {section.body && (
        <div className="[&_p]:font-sans [&_p]:text-sm [&_p]:text-ink-soft [&_p]:tracking-wide [&_p]:leading-relaxed [&_p]:mb-4 [&_blockquote]:font-display [&_blockquote]:text-xl md:[&_blockquote]:text-2xl [&_blockquote]:font-light [&_blockquote]:italic [&_blockquote]:text-ink-soft [&_blockquote]:leading-relaxed [&_blockquote]:my-6">
          <PortableText value={section.body} />
        </div>
      )}
    </SectionShell>
  )
}

/*
 * Fase 3.1 do redesign (14/07) -- "A História" repensada com 2 rodadas de
 * agentes (Explorador de varejo ousado + Crítico + Diretor, ver PROGRESS.md).
 * Substitui o antigo foto+texto plano em fundo claro por: cor composicional
 * (bloco bordô atrás da foto, não lavagem full-screen atrás do texto --
 * achado do Explorador: nenhuma loja ousada usa bloco de tinta chapado, a
 * cor vem sempre da foto/produto), movimento real de scroll via
 * PhotoParallax (sem sticky), tipografia no tier H2 já estabelecido (não um
 * recorde de 144px), e CTA de agendamento fechando a seção -- a âncora
 * comercial que faltava para não ler como portfólio de agência.
 *
 * Hairline dourada no topo + eyebrow + a linha do próprio SectionHeading =
 * 3 pontos do orçamento de dourado (máx. 3/tela, DESIGN.md) -- no teto,
 * sem margem. Achado do code review do PR #38: o comentário original desta
 * seção contava só 2, esquecendo a linha que o SectionHeading já desenha
 * (variant="full"). Conferir visualmente que não há sobreposição perceptível
 * com o dourado de seções vizinhas durante a transição de scroll. Sem
 * pull-quote itálico: o Diretor previu esse momento como
 * a "voz da stylist", mas não existe campo de citação no schema do Sanity
 * hoje -- fabricar uma frase seria conteúdo inventado. Fica registrado como
 * possível próximo passo se/quando a Luiza fornecer uma frase real.
 */
function FotoLadoSection({ section, reverse, waHref }: { section: StylistSection; reverse: boolean; waHref: string | null }) {
  const imageUrl = section.image?.asset
    ? urlFor(section.image).width(700).height(933).fit('crop').auto('format').url()
    : null

  return (
    <SectionShell tone="paper-deep" maxWidth="max-w-6xl" padding="py-24 md:py-32" topHairline ariaLabel={section.eyebrow ?? section.title}>
      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Texto */}
        <div className={`order-2 ${reverse ? 'md:order-1' : 'md:order-2'}`}>
          <SectionHeading tone="paper" eyebrow={section.eyebrow} title={section.title} titleMargin="mb-7" lineMargin="mb-7" />
          {section.body && (
            <div className="[&_p]:font-sans [&_p]:text-[15px] [&_p]:text-ink [&_p]:leading-relaxed [&_p]:mb-8 [&_blockquote]:font-sans [&_blockquote]:text-[15px] [&_blockquote]:text-ink [&_blockquote]:leading-relaxed [&_blockquote]:mb-8">
              <PortableText value={section.body} />
            </div>
          )}
          <WaButton waHref={waHref} />
        </div>

        {/* Cor + foto */}
        <div className={`order-1 ${reverse ? 'md:order-2' : 'md:order-1'}`}>
          <FadeInSection>
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
          </FadeInSection>
        </div>
      </div>
    </SectionShell>
  )
}

/* ── Seção etapas numeradas ── */
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
            className="font-sans text-sm tracking-[0.2em] text-ink-soft w-8 shrink-0 pt-2 select-none"
          >
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

/* ── Destaque claro — citação itálica, fundo areia, botão WhatsApp (ex. "Vamos começar?") ── */
function DestaqueClaroSection({ section, waHref }: { section: StylistSection; waHref: string | null }) {
  return (
    <SectionShell tone="paper-deep" padding="py-24 md:py-36" align="center" ariaLabel={section.eyebrow ?? section.title}>
      <div className="w-6 h-px bg-dourado/40 mx-auto mb-8" />
      {section.body && (
        <FadeInSection>
          <div className="[&_p]:font-display [&_p]:text-3xl md:[&_p]:text-4xl [&_p]:font-light [&_p]:italic [&_p]:text-ink-soft [&_p]:leading-snug [&_p]:mb-6 [&_blockquote]:font-display [&_blockquote]:text-3xl md:[&_blockquote]:text-4xl [&_blockquote]:font-light [&_blockquote]:italic [&_blockquote]:text-ink-soft [&_blockquote]:leading-snug [&_blockquote]:mb-6 mb-10">
            <PortableText value={section.body} />
          </div>
        </FadeInSection>
      )}
      <WaButton waHref={waHref} large />
    </SectionShell>
  )
}

/* ── Destaque escuro — clímax da página, fundo espresso, todo texto em creme (ex. "O que muda") ── */
function TransformacaoEscuraSection({ section }: { section: StylistSection }) {
  return (
    <SectionShell tone="dark" padding="py-28 md:py-40" align="center" ariaLabel={section.eyebrow ?? section.title}>
      <SectionHeading tone="dark" eyebrow={section.eyebrow} title={section.title} align="center" titleMargin="mb-6" lineMargin="mb-8" lineWidth="w-6" />
      {section.body && (
        /* text-cream-text no wrapper garante que a COR herda para qualquer tipo de bloco.
           Tamanho/peso/itálico precisam de [&_p] E [&_blockquote] -- o corpo do Sanity às
           vezes serializa como blockquote em vez de parágrafo (achado 2026-07-14: "Como
           cheguei até aqui" e "Vamos começar?" vieram como blockquote, ficaram sem estilo
           nenhum até este fix, lidos pelo dono como "fonte desconfigurada"). */
        <div className="text-cream-text [&_p]:font-display [&_p]:text-xl md:[&_p]:text-2xl [&_p]:font-light [&_p]:italic [&_p]:leading-snug [&_p]:mb-4 [&_blockquote]:font-display [&_blockquote]:text-xl md:[&_blockquote]:text-2xl [&_blockquote]:font-light [&_blockquote]:italic [&_blockquote]:leading-snug [&_blockquote]:mb-4 [&_li]:font-sans [&_li]:text-sm [&_li]:leading-relaxed [&_li]:mb-2">
          <PortableText value={section.body} />
        </div>
      )}
    </SectionShell>
  )
}

/* ── Cards — grade de itens, fundo areia claro (ex. "Pra quem é") ── */
function CardsSection({ section }: { section: StylistSection }) {
  return (
    <SectionShell tone="paper" maxWidth="max-w-4xl" padding="py-20 md:py-28" ariaLabel={section.eyebrow ?? section.title}>
      <SectionHeading tone="paper" title={section.title} variant="title-only" titleMargin="mb-10" />
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
    </SectionShell>
  )
}
