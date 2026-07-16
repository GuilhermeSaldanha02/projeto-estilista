import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/**`,
      },
    ],
  },
  // Fase 5 (Reconstrução): rotas antigas viram redirect permanente.
  // /stylist -> /consultoria (URL sempre disse "stylist", a nav já dizia
  // "Consultoria" desde 10/07 -- incoerência apontada pela auditoria).
  // /colecao/novidades -> /vitrine (a página duplicava a home byte a byte;
  // "novidades" agora é só o estado default de /vitrine).
  async redirects() {
    return [
      { source: '/stylist', destination: '/consultoria', permanent: true },
      { source: '/colecao/novidades', destination: '/vitrine', permanent: true },
    ]
  },
}

export default nextConfig
