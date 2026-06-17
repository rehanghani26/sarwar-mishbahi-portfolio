/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'brown-dark':  'var(--color-brown-dark)',
        'brown-mid':   'var(--color-brown-mid)',
        'brown-light': 'var(--color-brown-light)',
        'cream':       'var(--color-cream)',
        'cream-light': 'var(--color-cream-light)',
        'site-bg':     'var(--color-site-bg)',
        'card-bg':     'var(--color-card-bg)',
        'text-primary':'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted':  'var(--color-text-muted)',
        'site-border': 'var(--color-site-border)',
        'footer-bg':   'var(--color-footer-bg)',
        'section-hdr': 'var(--color-section-hdr)',
        'gold':        'var(--color-gold)',
      },
      fontFamily: {
        urdu: ["'Noto Nastaliq Urdu'", 'serif'],
      },
    },
  },
  plugins: [],
}
