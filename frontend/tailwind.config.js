/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        app: '#07110D',
        surface: '#0D1A15',
        elevated: '#13221B',
        primary: '#6EE7A1',
        secondary: '#A7D7B8',
        foreground: '#F3F7F4',
        muted: '#91A49A',
        warning: '#F4C95D',
        danger: '#FF7B7B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '24px',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        fast: '120ms',
        normal: '200ms',
        medium: '300ms',
        slow: '500ms',
      },
    },
  },
  plugins: [],
};
