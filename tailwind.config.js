/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-lg': '0 0 30px rgba(59, 130, 246, 0.4)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-emerald-lg': '0 0 30px rgba(16, 185, 129, 0.4)',
        'deep': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        'deep-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        'colored-blue': '0 4px 14px 0 rgba(59, 130, 246, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1)',
        'colored-emerald': '0 4px 14px 0 rgba(16, 185, 129, 0.15), 0 0 0 1px rgba(16, 185, 129, 0.1)',
      },
      colors: {
        'medical': {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a5b8fc',
          400: '#818cf8',
          500: '#667eea',
          600: '#5a67d8',
          700: '#4c51bf',
          800: '#434190',
          900: '#3c366b',
        },
      },
      backgroundImage: {
        'gradient-medical': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-admin': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'gradient-doctor': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
