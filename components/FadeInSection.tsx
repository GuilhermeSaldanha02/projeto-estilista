'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Única concessão de motion do sistema (ver .impeccable/design.json — exceção documentada
 * à Regra Flat/Motion). Fade-in único ao entrar em viewport, sem repetição no scroll.
 * `prefers-reduced-motion` é tratado via CSS (.fade-in em globals.css), não aqui.
 */
export function FadeInSection({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`fade-in ${visible ? 'is-visible' : ''} ${className}`}>
      {children}
    </div>
  )
}
