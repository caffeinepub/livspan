/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        /* Green-blue helix palette (emerald → teal → cyan → sky) */
        'helix-strand': 'oklch(var(--helix-strand))',
        'helix-glow': 'oklch(var(--helix-glow))',
        'helix-accent': 'oklch(var(--helix-accent))',
        'helix-base': 'oklch(var(--helix-base))',
        teal: {
          50: 'oklch(var(--sage-50))',
          100: 'oklch(var(--sage-100))',
          200: 'oklch(var(--sage-200))',
          300: 'oklch(var(--sage-300))',
          400: 'oklch(var(--sage-400))',
          500: 'oklch(var(--sage-500))',
          600: 'oklch(var(--sage-600))',
          700: 'oklch(var(--sage-700))',
          800: 'oklch(var(--sage-800))',
          900: 'oklch(var(--sage-900))',
        },
        sage: {
          50: 'oklch(var(--sage-50))',
          100: 'oklch(var(--sage-100))',
          200: 'oklch(var(--sage-200))',
          300: 'oklch(var(--sage-300))',
          400: 'oklch(var(--sage-400))',
          500: 'oklch(var(--sage-500))',
          600: 'oklch(var(--sage-600))',
          700: 'oklch(var(--sage-700))',
          800: 'oklch(var(--sage-800))',
          900: 'oklch(var(--sage-900))',
        },
      },
      fontFamily: {
        display: [
          'Sora',
          'system-ui',
          'sans-serif',
        ],
        sans: [
          'Sora',
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Consolas',
          'Monaco',
          'Courier New',
          'monospace',
        ],
      },
      keyframes: {
        'scan-line': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '10%': { opacity: '0.6' },
          '90%': { opacity: '0.6' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
        'data-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1.0' },
        },
        'hud-flicker': {
          '0%, 100%': { opacity: '0.97' },
          '25%': { opacity: '1.0' },
          '50%': { opacity: '0.98' },
          '75%': { opacity: '1.0' },
        },
        'neon-glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(0,245,255,0.3), 0 0 20px rgba(0,255,136,0.15)' },
          '50%': { boxShadow: '0 0 16px rgba(0,245,255,0.6), 0 0 40px rgba(0,255,136,0.3)' },
        },
        'status-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.2' },
        },
        'hud-load': {
          '0%': { width: '0%', opacity: '0.6' },
          '20%': { opacity: '1' },
          '100%': { width: '100%', opacity: '1' },
        },
        'helix-bg-breathe': {
          '0%, 100%': {
            opacity: '0.35',
          },
          '50%': {
            opacity: '0.65',
          },
        },
        'helix-bg-pulse': {
          '0%, 100%': {
            opacity: '0.25',
          },
          '50%': {
            opacity: '0.45',
          },
        },
        'helix-bg-glow': {
          '0%, 100%': {
            opacity: '0.3',
            filter: 'blur(0px)',
          },
          '50%': {
            opacity: '0.5',
            filter: 'blur(1px)',
          },
        },
        'helix-breathe': {
          '0%, 100%': {
            opacity: '0.4',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '0.7',
            transform: 'scale(1.02)',
          },
        },
        'helix-pulse': {
          '0%, 100%': {
            opacity: '0.3',
          },
          '50%': {
            opacity: '0.5',
          },
        },
      },
      animation: {
        'helix-bg-breathe': 'helix-bg-breathe 6s ease-in-out infinite',
        'helix-bg-breathe-alt': 'helix-bg-breathe 6.5s ease-in-out infinite 0.5s',
        'helix-bg-pulse': 'helix-bg-pulse 8s ease-in-out infinite',
        'helix-bg-glow': 'helix-bg-glow 10s ease-in-out infinite',
        'helix-breathe': 'helix-breathe 6s ease-in-out infinite',
        'helix-breathe-alt': 'helix-breathe 6.5s ease-in-out infinite 0.5s',
        'helix-pulse': 'helix-pulse 8s ease-in-out infinite',
        'scan-line': 'scan-line 8s linear infinite',
        'data-pulse': 'data-pulse 2s ease-in-out infinite',
        'hud-flicker': 'hud-flicker 3s ease-in-out infinite',
        'neon-glow-pulse': 'neon-glow-pulse 3s ease-in-out infinite',
        'status-blink': 'status-blink 2s ease-in-out infinite',
        'hud-load': 'hud-load 2.5s ease-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
