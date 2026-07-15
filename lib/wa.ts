/*
 * Fase 5 (Reconstrução, Etapa 0) — fonte única de links de WhatsApp.
 * Antes desta etapa a string `https://wa.me/...` estava montada à mão em 6
 * arquivos diferentes (Nav, home, produto, stylist, ...). Toda montagem nova
 * passa por aqui; os call sites antigos migram conforme cada página é
 * reconstruída nas Etapas 2–5.
 */

export const WA_MESSAGES = {
  agendar: 'Oi! Gostaria de agendar um horário de personal styling.',
  peca: (title: string) => `Oi! Tenho interesse na peça ${title}.`,
  consultoriaSobrePeca: (title: string) =>
    `Oi, Luiza! Vi a peça ${title} e queria uma opinião sua antes de decidir.`,
} as const

export function buildWaHref(
  number: string | null | undefined,
  message?: string
): string | null {
  if (!number) return null
  const base = `https://wa.me/${number}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
