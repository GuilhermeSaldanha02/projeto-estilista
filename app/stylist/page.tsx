import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Stylist — Estilista',
  description: 'Conheça a personal stylist por trás da Estilista e agende seu atendimento.',
}

const settingsQuery = `*[_type == "siteSettings"][0]{ whatsappNumber }`

export default async function StylistPage() {
  const settings = await client.fetch<{ whatsappNumber?: string } | null>(settingsQuery)

  const whatsappNumber = settings?.whatsappNumber
  const waMessage = 'Oi! Gostaria de agendar um horário de personal styling.'
  const waHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`
    : null

  return (
    <main>

      {/* ═══════════════════════════════════════
          1. ABERTURA — foto + nome + definição + CTA
      ═══════════════════════════════════════ */}
      <section className="bg-sand-100 py-16 px-5" aria-label="Apresentação">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">

          {/* Placeholder de foto */}
          <div className="w-full max-w-xs md:w-72 md:max-w-none shrink-0">
            <div className="w-full aspect-[3/4] bg-ink/10 flex items-center justify-center">
              <span className="font-sans text-[10px] tracking-widest uppercase text-ink/40 text-center px-4">
                [FOTO DA STYLIST]
              </span>
            </div>
          </div>

          {/* Texto */}
          <div className="flex-1 text-center md:text-left">
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-esmeralda mb-4">
              Personal Stylist
            </p>

            <h1 className="font-display text-4xl md:text-5xl font-light text-ink tracking-wide mb-4">
              [NOME DA STYLIST]
            </h1>

            {/* Q1 — frase de definição, Cormorant italic */}
            <p className="font-display text-xl md:text-2xl font-light italic text-ink/70 leading-snug mb-8">
              [DEFINIÇÃO — Q1]
            </p>

            <div className="w-10 h-px bg-dourado mx-auto md:mx-0 mb-8" />

            {waHref ? (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-esmeralda text-cream-text font-sans text-[11px] tracking-widest uppercase px-10 py-4 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-esmeralda focus-visible:outline-offset-4 transition-opacity"
              >
                Agendar horário
              </a>
            ) : (
              <span className="inline-flex items-center justify-center bg-esmeralda text-cream-text font-sans text-[11px] tracking-widest uppercase px-10 py-4 opacity-50 cursor-not-allowed select-none">
                Agendar horário
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          2. PRA QUEM É — Q2
      ═══════════════════════════════════════ */}
      <section className="py-16 px-5" aria-label="Pra quem é">
        <div className="max-w-2xl mx-auto">
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-dourado mb-4">
            Pra quem é
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-light text-ink tracking-wide mb-8">
            Isso é pra você?
          </h2>
          <div className="w-8 h-px bg-dourado/40 mb-8" />

          {/* Q2 */}
          <p className="font-sans text-sm text-ink/50 tracking-wide leading-relaxed border border-dashed border-ink/20 p-6">
            [PRA QUEM É — Q2]
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          3. A HISTÓRIA — Q5 + foto opcional
      ═══════════════════════════════════════ */}
      <section className="bg-sand-100 py-16 px-5" aria-label="A história">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row-reverse items-start gap-10 md:gap-16">

          {/* Placeholder de foto secundária (opcional) */}
          <div className="w-full max-w-xs md:w-64 md:max-w-none shrink-0 self-center">
            <div className="w-full aspect-[3/4] bg-ink/10 flex items-center justify-center">
              <span className="font-sans text-[10px] tracking-widest uppercase text-ink/40 text-center px-4">
                [FOTO DA STYLIST — 2ª foto, opcional]
              </span>
            </div>
          </div>

          {/* Texto */}
          <div className="flex-1">
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-dourado mb-4">
              A história
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-light text-ink tracking-wide mb-8">
              Como cheguei até aqui
            </h2>
            <div className="w-8 h-px bg-dourado/40 mb-8" />

            {/* Q5 */}
            <p className="font-sans text-sm text-ink/50 tracking-wide leading-relaxed border border-dashed border-ink/20 p-6">
              [HISTÓRIA — Q5]
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4. COMO FUNCIONA — Q4 (4 etapas numeradas)
      ═══════════════════════════════════════ */}
      <section className="bg-espresso py-16 px-5" aria-label="Como funciona">
        <div className="max-w-3xl mx-auto">
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-dourado mb-4">
            O processo
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-light text-cream-text tracking-wide mb-4">
            Como funciona
          </h2>
          <div className="w-8 h-px bg-dourado/40 mb-10" />

          <ol className="space-y-8">
            {([1, 2, 3, 4] as const).map(n => (
              <li key={n} className="flex gap-6 items-start">
                <span className="font-display text-3xl font-light text-dourado/60 leading-none w-8 shrink-0 select-none">
                  {n}
                </span>
                <p className="font-sans text-sm text-cream-text/50 tracking-wide leading-relaxed border border-dashed border-cream-text/15 p-5 flex-1">
                  [ETAPA {n} — Q4]
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          5. O QUE MUDA + SENSAÇÃO — Q3 + Q7
      ═══════════════════════════════════════ */}
      <section className="py-16 px-5" aria-label="O que muda">
        <div className="max-w-2xl mx-auto">
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-dourado mb-4">
            A transformação
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-light text-ink tracking-wide mb-8">
            O que muda
          </h2>
          <div className="w-8 h-px bg-dourado/40 mb-8" />

          {/* Q3 */}
          <p className="font-sans text-sm text-ink/50 tracking-wide leading-relaxed border border-dashed border-ink/20 p-6 mb-6">
            [O QUE MUDA — Q3]
          </p>

          {/* Q7 */}
          <p className="font-display text-xl md:text-2xl font-light italic text-ink/60 leading-relaxed border-l-2 border-dourado pl-6">
            [SENSAÇÃO — Q7]
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          6. CONVITE FINAL — chamada + CTA
      ═══════════════════════════════════════ */}
      <section className="bg-sand-200 py-16 px-5" aria-label="Convite final">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-6 h-px bg-dourado/40 mx-auto mb-8" />

          {/* Chamada final */}
          <p className="font-display text-2xl md:text-3xl font-light italic text-ink/60 leading-snug mb-10 border border-dashed border-ink/20 p-6">
            [CHAMADA FINAL]
          </p>

          {waHref ? (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-esmeralda text-cream-text font-sans text-[11px] tracking-widest uppercase px-12 py-4 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-esmeralda focus-visible:outline-offset-4 transition-opacity"
            >
              <WhatsAppIcon />
              Agendar horário
            </a>
          ) : (
            <span className="inline-flex items-center justify-center gap-3 bg-esmeralda text-cream-text font-sans text-[11px] tracking-widest uppercase px-12 py-4 opacity-50 cursor-not-allowed select-none">
              Agendar horário
            </span>
          )}
        </div>
      </section>

    </main>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
