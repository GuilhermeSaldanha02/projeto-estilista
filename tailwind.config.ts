import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'sand-50':          'rgb(var(--sand-50-rgb) / <alpha-value>)',
        'sand-100':         'rgb(var(--sand-100-rgb) / <alpha-value>)',
        'sand-200':         'rgb(var(--sand-200-rgb) / <alpha-value>)',
        'sand-300':         'rgb(var(--sand-300-rgb) / <alpha-value>)',
        espresso:           'rgb(var(--espresso-rgb) / <alpha-value>)',
        esmeralda:          'rgb(var(--esmeralda-rgb) / <alpha-value>)',
        'esmeralda-light':  'rgb(var(--esmeralda-light-rgb) / <alpha-value>)',
        bordo:              'rgb(var(--bordo-rgb) / <alpha-value>)',
        dourado:            'rgb(var(--dourado-rgb) / <alpha-value>)',
        ink:                'rgb(var(--ink-rgb) / <alpha-value>)',
        'cream-text':       'rgb(var(--cream-text-rgb) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'Times New Roman', 'serif'],
        sans: [
          'var(--font-sans)',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}

export default config
