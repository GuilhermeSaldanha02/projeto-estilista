/*
 * Fase 5 (Reconstrução, Etapa 0) — vocabulário único de motion do site.
 * O blueprint define 4 gestos (entrada escalonada, reveal de cortina,
 * parallax de camadas, fila com snap); os tokens abaixo são a base de todos.
 * Nunca duplicar EASE_OUT_EXPO/variants em componente — importar daqui.
 */

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

// Entrada escalonada (gesto 1): container nos pais, item nos filhos.
export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT_EXPO } },
}
