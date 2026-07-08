// Espelha app/globals.css — usado por SeamTransition (precisa de valor CSS literal, não classe Tailwind)
export const EDGE = {
  sand50: '#F4EFE6',
  sand100: '#EDE3D2',
  sand200: '#E7DBC8',
  espresso: '#241C17',
} as const

// Cor de fundo na borda inferior de cada variante de seção do /stylist —
// usado para calcular a costura (SeamTransition) entre seções vizinhas,
// já que a ordem das seções é definida dinamicamente pela dona no Sanity.
export const STYLIST_SECTION_BOTTOM_EDGE: Record<string, string> = {
  padrao: EDGE.sand100,
  'foto-esquerda': EDGE.sand100,
  'foto-direita': EDGE.sand100,
  cards: EDGE.sand100,
  etapas: EDGE.espresso,
  'transformacao-escura': EDGE.espresso,
  'destaque-claro': EDGE.sand200,
  'destaque-escuro': EDGE.sand200,
}
