import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette - calm, trustworthy, high-contrast for older readers.
        brand: {
          ink: '#0B2838',        // primary text / headings
          deep: '#123A53',       // links, nav
          teal: '#0F766E',       // CTAs, highlights
          sand: '#F5EFE3',       // warm surface
          cream: '#FAF7F0',      // page bg
          border: '#D8D2C2',
          muted: '#4A5A66',      // secondary text (still AA on white)
        },
        warn: '#8B3A1A',
        ok: '#1F6A3D',
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // 18px floor for body text per accessibility spec.
        base: ['1.125rem', { lineHeight: '1.7' }],
        lg: ['1.25rem', { lineHeight: '1.65' }],
        xl: ['1.375rem', { lineHeight: '1.55' }],
        '2xl': ['1.75rem', { lineHeight: '1.4' }],
        '3xl': ['2.25rem', { lineHeight: '1.3' }],
        '4xl': ['2.875rem', { lineHeight: '1.2' }],
      },
      maxWidth: {
        prose: '68ch',
        content: '44rem',
        wide: '72rem',
      },
      spacing: {
        tap: '2.75rem', // 44px min tap target
      },
    },
  },
  plugins: [],
};

export default config;
