/*
 * Padrão de cabeçalho de seção do site (decidido com o dono a partir da
 * variação "A3"): nome em maiúsculas espaçadas + um losango dourado +
 * um meta curto, centralizados. Substitui o serif preto grande (lido como
 * "marcadão pesado") por um rótulo leve e refinado onde a FOTO da peça é
 * que domina a tela. O losango é o motivo-assinatura no lugar de qualquer
 * traço reto full-width.
 *
 * Uma fonte de verdade: toda seção que quiser esse cabeçalho importa daqui,
 * não recria a marcação.
 */
export default function SectionHeading({
  title,
  meta,
  as = 'h2',
  className = '',
}: {
  title: string
  /** texto curto à direita do losango (ex.: "02 peças"). Sem meta, mostra
   *  só o nome com o losango como fecho à direita. */
  meta?: string
  /** o heading semântico real (h1 na página de categoria, h2 nas seções). */
  as?: 'h1' | 'h2'
  className?: string
}) {
  const Tag = as
  return (
    <div className={`flex items-center justify-center gap-4 text-center ${className}`}>
      <Tag className="font-sans text-[13px] md:text-sm tracking-[0.28em] uppercase text-espresso font-normal">
        {title}
      </Tag>
      <span
        aria-hidden="true"
        className="w-[5px] h-[5px] bg-dourado rotate-45 shrink-0"
      />
      {meta ? (
        <span
          aria-live="polite"
          className="font-sans text-[11px] tracking-[0.15em] uppercase text-ink-soft"
        >
          {meta}
        </span>
      ) : null}
    </div>
  )
}
