/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        night: {
          950: '#0b0814',
          900: '#140f24',
          800: '#1c1530',
          ink: '#211936',
          700: '#2d2249',
          600: '#3c2f61',
        },
        magic: {
          light: '#bda6f7',
          DEFAULT: '#9274D8',
          dark: '#6e4ec0',
          glow: '#caa6ff',
        },
        spellPink: {
          light: '#fcd3ea',
          DEFAULT: '#F3A9D4',
          glow: '#ff8fd0',
          dark: '#cf6fa6',
        },
        manaMint: {
          light: '#dbf6ef',
          DEFAULT: '#B8E8DC',
          glow: '#68edd1',
          dark: '#58bfa9',
        },
        moonCream: {
          light: '#fffbf3',
          DEFAULT: '#FFF2D8',
          gold: '#fed894',
          dark: '#d6b876',
        },
        runeAmber: '#FFB347',
        cursedRed: '#FF5964',
        astralCyan: '#56E2D8',
      },
      fontFamily: {
        fantasy: ['Cinzel', 'MedievalSharp', 'Georgia', 'serif'],
        pixel: ['"Press Start 2P"', 'monospace'],
        pixelify: ['"Pixelify Sans"', 'sans-serif'],
        code: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        body: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'float': 'float 3s infinite ease-in-out',
        'sparkle': 'sparkle 1.8s infinite ease-in-out',
        'shimmer': 'shimmer 2s infinite linear',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 8px rgba(146, 116, 216, 0.6))' },
          '50%': { filter: 'drop-shadow(0 0 20px rgba(243, 169, 212, 0.9))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.95)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
      },
      boxShadow: {
        'magic': '0 0 25px rgba(146, 116, 216, 0.35)',
        'magic-lg': '0 0 40px rgba(146, 116, 216, 0.55), 0 0 80px rgba(243, 169, 212, 0.25)',
        'mana': '0 0 20px rgba(184, 232, 220, 0.4)',
        'gold': '0 0 25px rgba(255, 242, 216, 0.45)',
        'cursed': '0 0 30px rgba(255, 89, 100, 0.6)',
      }
    },
  },
  plugins: [],
}

