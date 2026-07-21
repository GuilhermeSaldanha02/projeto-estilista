import Image from 'next/image'
import { client } from '@/sanity/lib/client'
import { settingsQuery } from '@/sanity/lib/queries'
import { buildWaHref } from '@/lib/wa'

/*
 * Fase 12 — rodapé reduzido a uma faixa de uma linha.
 *
 * Antes eram 3 colunas (categorias / consultoria / nota) com 472px de altura.
 * As duas colunas de links foram removidas a pedido do dono, e a razão é
 * boa: elas DUPLICAVAM o cabeçalho inteiro — "Vitrine" e "Consultoria" já
 * são os dois únicos itens da barra de cima, e "Agendar horário" já é o
 * botão de destaque dela. O rodapé repetia tudo e não oferecia nada novo.
 *
 * O que sobra é o que só existe aqui: identidade (logo + o que a marca faz)
 * e o canal de venda real (WhatsApp). Não há mais nada legítimo pra colocar
 * — o projeto não tem Instagram, página de trocas nem dados da empresa
 * cadastrados. Encher a faixa com link inventado seria pior que deixá-la
 * pequena.
 *
 * Se um dia entrarem Instagram, política de troca ou CNPJ (obrigatório se a
 * venda sair do WhatsApp e virar checkout no site), é aqui que eles vão.
 */
export default async function Footer() {
  const settings = await client.fetch<{ whatsappNumber?: string } | null>(settingsQuery)
  const waHref = buildWaHref(settings?.whatsappNumber)

  return (
    <footer className="bg-espresso border-t border-dourado/25">
      <div className="max-w-[1440px] mx-auto px-[6vw] py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <Image
            src="/logo-lt.png"
            alt="LT Studio"
            width={52}
            height={28}
            className="opacity-80"
          />
          <span className="font-sans text-[10px] tracking-[0.18em] uppercase text-cream-text/55">
            Moda feminina · Consultoria de estilo
          </span>
        </div>

        {waHref && (
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[10px] tracking-[0.18em] uppercase text-cream-text/70 hover:text-dourado transition-colors"
          >
            Falar no WhatsApp
          </a>
        )}
      </div>
    </footer>
  )
}
