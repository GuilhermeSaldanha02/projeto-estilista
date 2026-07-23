'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { ExpandIcon, CloseIcon } from '@/components/ui/icons'

/*
 * Fase 12 — galeria da página de produto, dentro do CARD DEITADO, com
 * lightbox de tela cheia.
 *
 * Decisão do dono (2026-07-23): o card no mobile tem altura limitada, e o
 * botão "Quero esta peça" ficava cortado na dobra (P0 do critique). A
 * correção NÃO é encolher a foto -- "o site é uma loja de roupa, ficar
 * muito pequeno não é interessante pois o cliente perde a opção de ver o
 * produto". A correção certa: a foto do card continua no tamanho normal
 * (aspect-[3/4], igual ao card da vitrine), e um toque nela abre a peça em
 * tela cheia -- a cliente vê o produto em detalhe sob demanda, sem que o
 * card precise crescer pra caber tudo.
 *
 * Virou componente client (era server) só por causa do estado do lightbox
 * -- continua sem nenhuma chamada de rede própria, a URL da imagem já vem
 * pronta do `urlFor`.
 *
 * O componente não define tamanho próprio pro card em si: preenche o
 * container que a página dá (h-full/w-full). Quem manda na proporção do
 * card é a página — 3/4, a mesma do ProductCard da vitrine.
 *
 * object-cover é seguro nesta proporção: as fotos do acervo são 4/5
 * (896x1200 = 0,747) e a caixa é 3/4 (0,75) -- o corte é de menos de 1%, a
 * peça não perde nada. Por isso NÃO se usa aqui o productCardImageUrl (o
 * corte fechado da vitrine, que puxa a peça pra fora do fundo de estúdio):
 * na página da peça a cliente quer ver o conjunto inteiro -- e agora, com o
 * lightbox, pode ver ainda mais perto.
 */
export type GalleryImage = {
  asset: { _ref: string; _type: string }
  crop?: { top: number; bottom: number; left: number; right: number } | null
  hotspot?: { x: number; y: number; width: number; height: number } | null
  alt?: string
}

export default function ProductGallery({
  images,
  title,
}: {
  images: GalleryImage[]
  title: string
}) {
  const valid = images.filter(img => img?.asset)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (valid.length === 0) {
    return (
      <div className="h-full w-full bg-espresso flex items-center justify-center">
        <span className="font-sans text-[10px] tracking-widest uppercase text-cream-text/55">
          Foto em breve
        </span>
      </div>
    )
  }

  return (
    <>
      <div
        className="h-full w-full overflow-y-auto snap-y snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        role={valid.length > 1 ? 'list' : undefined}
        aria-label={valid.length > 1 ? `Fotos de ${title}` : undefined}
      >
        {valid.map((img, i) => (
          <div
            key={i}
            role={valid.length > 1 ? 'listitem' : undefined}
            className="relative h-full w-full snap-start"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="absolute inset-0 w-full h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-dourado focus-visible:outline-offset-[-4px]"
              aria-label={`Ampliar foto de ${title}${valid.length > 1 ? ` (${i + 1} de ${valid.length})` : ''}`}
            >
              <Image
                src={urlFor(img).width(840).height(1120).fit('crop').auto('format').url()}
                alt={img.alt ?? `${title} — foto ${i + 1}`}
                fill
                priority={i === 0}
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover"
              />
            </button>
            {/* Convite discreto pra ampliar -- sem isso, nada no card sinaliza
                que a foto é clicável (nem hover existe no celular). */}
            <span
              aria-hidden="true"
              className="absolute bottom-3 right-3 flex items-center justify-center w-8 h-8 bg-espresso/60 text-dourado pointer-events-none"
            >
              <ExpandIcon size={14} />
            </span>
          </div>
        ))}
      </div>

      {openIndex !== null && (
        <PhotoLightbox
          images={valid}
          title={title}
          initialIndex={openIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  )
}

function PhotoLightbox({
  images,
  title,
  initialIndex,
  onClose,
}: {
  images: GalleryImage[]
  title: string
  initialIndex: number
  onClose: () => void
}) {
  const [index, setIndex] = useState(initialIndex)
  const hasMultiple = images.length > 1

  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && hasMultiple) setIndex(i => (i + 1) % images.length)
      if (e.key === 'ArrowLeft' && hasMultiple) setIndex(i => (i - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, hasMultiple, images.length])

  const img = images[index]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Foto ampliada de ${title}`}
      className="fixed inset-0 z-[60] bg-espresso/97 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center justify-center w-11 h-11 text-cream-text/80 hover:text-cream-text transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-dourado focus-visible:outline-offset-2"
      >
        <CloseIcon size={22} />
      </button>

      <div
        className="relative w-full h-full max-w-4xl"
        onClick={e => e.stopPropagation()}
      >
        <Image
          src={urlFor(img).width(1400).fit('max').auto('format').url()}
          alt={img.alt ?? `${title} — foto ${index + 1} ampliada`}
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
      </div>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation()
              setIndex(i => (i - 1 + images.length) % images.length)
            }}
            aria-label="Foto anterior"
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 text-cream-text/70 hover:text-cream-text transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-dourado focus-visible:outline-offset-2"
          >
            <span aria-hidden="true" className="text-2xl">‹</span>
          </button>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation()
              setIndex(i => (i + 1) % images.length)
            }}
            aria-label="Próxima foto"
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 text-cream-text/70 hover:text-cream-text transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-dourado focus-visible:outline-offset-2"
          >
            <span aria-hidden="true" className="text-2xl">›</span>
          </button>
          <span
            aria-hidden="true"
            className="absolute bottom-4 left-1/2 -translate-x-1/2 font-sans text-[11px] tracking-widest uppercase text-cream-text/60"
          >
            {index + 1} / {images.length}
          </span>
        </>
      )}
    </div>
  )
}
