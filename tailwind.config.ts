import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'sand-50':          'var(--sand-50)',
        'sand-100':         'var(--sand-100)',
        'sand-200':         'var(--sand-200)',
        'sand-300':         'var(--sand-300)',
        espresso:           'var(--espresso)',
        esmeralda:          'var(--esmeralda)',
        'esmeralda-light':  'var(--esmeralda-light)',
        bordo:              'var(--bordo)',
        dourado:            'var(--dourado)',
        ink:                'var(--ink)',
        'cream-text':       'var(--cream-text)',
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
