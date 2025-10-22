import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

export default {
  content: [
    './app/**/*.{js,vue,ts}',
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.{js,vue,ts}',
    './pages/**/*.{js,vue,ts}',
    './plugins/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        // Override amber with our gold colors so NuxtUI recognizes it
        amber: {
          50: '#fefaf0',
          100: '#fef3d9',
          200: '#fde6b3',
          300: '#fbd687',
          400: '#f8c05a',
          500: '#d4af37',
          600: '#b8962e',
          700: '#9c7d26',
          800: '#7d651f',
          900: '#5f4d18',
          950: '#3d3110'
        },
        // Override zinc grays to use lighter background
        zinc: {
          ...colors.zinc,
          50: '#FCFCFC',  // Lighter background
        }
      },
      backgroundColor: {
        'DEFAULT': '#FCFCFC',  // Set default background to lighter color
      }
    }
  }
} satisfies Config

