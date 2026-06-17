export default function Home() {
  return (
    <main className="min-h-screen bg-sand-200 flex flex-col items-center justify-center gap-10 p-8">

      {/* Prova: fundo areia + texto tinta */}
      <section className="text-center space-y-4">
        <h1 className="font-display text-6xl font-light text-ink tracking-wide">
          Estilista
        </h1>
        <p className="font-sans text-ink/70 text-base tracking-widest uppercase">
          Moda Feminina · Personal Styling
        </p>
      </section>

      {/* Prova: tokens de acento */}
      <section className="flex flex-col sm:flex-row gap-4 items-center">
        {/* CTA principal — bordô */}
        <button className="bg-bordo text-cream-text px-8 py-3 font-sans text-xs tracking-widest uppercase hover:opacity-90 transition-opacity">
          Quero esta peça
        </button>
        {/* CTA secundário — esmeralda */}
        <button className="bg-esmeralda text-cream-text px-8 py-3 font-sans text-xs tracking-widest uppercase hover:opacity-90 transition-opacity">
          Agendar horário
        </button>
      </section>

      {/* Prova: faixa espresso */}
      <footer className="w-full max-w-md bg-espresso text-cream-text text-center py-4 font-sans text-xs tracking-widest uppercase">
        Faixa header · footer · espresso
      </footer>

      {/* Prova: linha dourada */}
      <div className="w-24 border-t-2 border-dourado" />

    </main>
  )
}
