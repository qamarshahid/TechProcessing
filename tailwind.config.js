/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial'],
      },
      colors: {
        // Midnight Sapphire Supreme Theme
        bg1: "#0A1020",
        bg2: "#0C1428",
        fg: "#EAF2FF",
        "fg-strong": "#F7FAFF",
        muted: "#B8C4FF",
        "muted-strong": "#C4D2FF",
        accent1: "#3B82F6",
        accent2: "#60A5FA",
        accent3: "#93C5FD",
        ring: "#9CC7FF",
        outline: "rgba(255,255,255,.10)",
        surface: "#0E1628",
        surface2: "#121D38",
        
        // Keep existing emerald/green for backwards compatibility
        emerald: {
          400: '#60A5FA', // Map to sapphire accent2
          500: '#3B82F6', // Map to sapphire accent1
          600: '#3B82F6',
          700: '#2563eb',
        },
        
        // Map slate to sapphire backgrounds
        slate: {
          50: '#EAF2FF',  // fg
          100: '#B8C4FF', // muted
          300: '#93C5FD', // accent3
          400: '#60A5FA', // accent2
          600: '#3B82F6', // accent1
          700: '#121D38', // surface2
          800: '#0E1628', // surface
          900: '#0C1428', // bg2
          950: '#0A1020', // bg1
        },
        
        // Keep compatibility colors
        navy: {
          50: '#EAF2FF',
          100: '#B8C4FF',
          200: '#93C5FD',
          300: '#60A5FA',
          400: '#3B82F6',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#0E1628',
          900: '#0C1428',
          950: '#0A1020',
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      borderRadius: {
        xl: "18px",
        lg: "14px",
        md: "12px",
        sm: "8px",
      },
      boxShadow: {
        sapphire: "0 22px 60px rgba(0,0,0,.6)",
        glow: "0 0 28px color-mix(in oklab, #3B82F6 30%, transparent)",
      },
      backgroundImage: {
        'sapphire-gradient': 'radial-gradient(1400px 820px at 12% -10%, rgba(255,255,255,.05), transparent 60%), linear-gradient(180deg, #0A1020, #0C1428)',
        'accent-gradient': 'linear-gradient(90deg, #3B82F6, #60A5FA)',
        'panel-gradient': 'linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.03))',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'gradient-x': 'gradient-x 3s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
      },
    },
  },
  plugins: [],
};
