// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'logo-black': '#111111',
        'logo-orange': '#FF6633',
        'logo-white': '#FFFFFF',
        'logo-gray': '#2C2C2C',
        'logo-orange-light': '#FFA366',
      
        'musgo': '#436A4A',
        'musgo-2': '#6B8B6B',
        'bege': '#F5F0E6',
        'brand-acc': '#9DCBA6',
        'azul-ceu': '#87CEEB'
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui']
      }
    },
  },
  plugins: [],
}
