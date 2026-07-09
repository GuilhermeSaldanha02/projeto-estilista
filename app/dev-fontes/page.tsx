import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comparação de fontes (temporário)',
  robots: { index: false, follow: false },
}

// Página TEMPORÁRIA de comparação — Fase 1 do redesign (ver docs/PROGRESS.md).
// Não faz parte do site; remover depois que a fonte do corpo for escolhida.
// Mostra as 3 candidatas + a paleta evoluída, sobre claro (porcelana) e escuro (espresso).

const SAMPLE_LIGHT =
  'Pra mim, estilo não é acompanhar tendência — é vestir quem você já é, com mais clareza. Cada escolha começa por uma pergunta simples: como você quer se sentir quando entrar na sala?'

const SAMPLE_DARK =
  'Do consultório de moda ao look do dia a dia: encontramos juntas as peças certas para a sua vida, seu corpo e o que você quer comunicar com a roupa.'

const FONTS = [
  { label: 'Hanken Grotesk', varClass: 'font-hanken' },
  { label: 'Schibsted Grotesk', varClass: 'font-schibsted' },
  { label: 'Familjen Grotesk', varClass: 'font-familjen' },
] as const

export default function DevFontesPage() {
  return (
    <main className="min-h-screen bg-sand-200 py-16 px-6">
      <div className="max-w-3xl mx-auto mb-16">
        <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-ink/60 mb-3">
          Fase 1 — comparação temporária
        </p>
        <h1 className="text-3xl font-semibold text-ink mb-2">Fonte do corpo + paleta evoluída</h1>
        <p className="text-sm text-ink/70">
          Escolha uma das 3 fontes abaixo (aparece sobre fundo claro e escuro, com texto real do site).
          Esta página some do projeto assim que a decisão for tomada.
        </p>
      </div>

      {/* Paleta evoluída — swatches */}
      <div className="max-w-3xl mx-auto mb-16">
        <h2 className="text-sm font-semibold text-ink/70 uppercase tracking-widest mb-4">Paleta evoluída</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { name: 'porcelana', cls: 'bg-porcelana', text: 'text-ink' },
            { name: 'areia', cls: 'bg-areia', text: 'text-ink' },
            { name: 'esmeralda', cls: 'bg-esmeralda', text: 'text-cream-text' },
            { name: 'verde-profundo', cls: 'bg-verde-profundo', text: 'text-cream-text' },
            { name: 'espresso', cls: 'bg-espresso', text: 'text-cream-text' },
            { name: 'bordo', cls: 'bg-bordo', text: 'text-cream-text' },
          ].map(sw => (
            <div key={sw.name} className={`${sw.cls} ${sw.text} h-20 flex items-end p-2 text-[10px] uppercase tracking-wide`}>
              {sw.name}
            </div>
          ))}
        </div>
      </div>

      {/* Comparação de fontes */}
      {FONTS.map(font => (
        <div key={font.label} className="max-w-3xl mx-auto mb-12">
          <p className="text-[10px] tracking-[0.3em] uppercase text-ink/50 mb-3">{font.label}</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-porcelana p-8">
              <p className={`${font.varClass} text-ink text-base leading-relaxed`}>{SAMPLE_LIGHT}</p>
            </div>
            <div className="bg-espresso p-8">
              <p className={`${font.varClass} text-cream-text text-base leading-relaxed`}>{SAMPLE_DARK}</p>
            </div>
          </div>
        </div>
      ))}
    </main>
  )
}
