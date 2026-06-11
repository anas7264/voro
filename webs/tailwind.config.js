module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Direct aliases for component compatibility
        primary: '#7C3AED',
        secondary: '#10B981',
        surface: '#080B14',
        card: '#0A0C14',
        danger: '#EF4444',
        border: 'rgba(255, 255, 255, 0.05)',
        voro: {
          primary: '#7C3AED',
          'primary-light': '#A78BFA',
          'primary-dark': '#5B21B6',
          secondary: '#10B981',
          'secondary-light': '#34D399',
          accent: '#F59E0B',
          danger: '#EF4444',
          info: '#3B82F6',
          pink: '#EC4899',
          orange: '#F97316',
          surface: '#080B14',
          card: '#0A0C14',
          border: 'rgba(255, 255, 255, 0.05)',
          elevated: '#111420',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'bounce-soft': 'bounceSoft 0.6s ease-out',
        'fill-bar': 'fillBar 0.8s ease-out',
        'count-up': 'countUp 1s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'kinetic-sweep': 'kineticSweep 2s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        kineticSweep: {
          '0%': { transform: 'translateX(-100%)' },
          '50%, 100%': { transform: 'translateX(100%)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 }
        },
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(12px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        slideRight: { '0%': { opacity: 0, transform: 'translateX(-12px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } },
        scaleIn: { '0%': { opacity: 0, transform: 'scale(0.95)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        bounceSoft: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        fillBar: { '0%': { width: '0%' }, '100%': { width: 'var(--target-width)' } },
        glow: { '0%,100%': { boxShadow: '0 0 5px #7C3AED' }, '50%': { boxShadow: '0 0 20px #7C3AED, 0 0 40px #7C3AED55' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-voro': 'linear-gradient(135deg, #7C3AED 0%, #10B981 100%)',
        'gradient-fire': 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
      },
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
