/**
 * Costura entre seções vizinhas — exceção aprovada à Regra do Degradê Familiar
 * (CLAUDE.md §5, 2026-07-08). Esmaece a cor da seção anterior até transparente,
 * sobre o topo da seção atual, criando uma transição suave em vez de um corte
 * seco bloco-a-bloco. NÃO usar como fundo de seção inteira — só como emenda.
 *
 * A seção que usa este componente precisa de `relative` e o conteúdo real
 * precisa estar em um wrapper com `relative z-10` (o overlay é `z-0`).
 */
export function SeamTransition({ from }: { from: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-24 md:h-36"
      style={{ backgroundImage: `linear-gradient(to bottom, ${from}, transparent)` }}
    />
  )
}
