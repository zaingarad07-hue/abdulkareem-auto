/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom automotive theme colors
        cyan: {
          DEFAULT: '#35B8FF',
          glow: 'rgba(53, 184, 255, 0.35)',
          intense: 'rgba(53, 184, 255, 0.6)',
        },
        dark: {
          bg: '#05060B',
          'bg-secondary': '#0B0E1A',
        },
        text: {
          primary: '#F4F6FF',
          secondary: '#A7A9B5',
        },
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        arabic: ['Tajawal', 'sans-serif'],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
        '2xl': '18px',
        '3xl': '999px',
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        'neon': '0 0 20px rgba(53, 184, 255, 0.3), 0 0 40px rgba(53, 184, 255, 0.15)',
        'neon-intense': '0 0 30px rgba(53, 184, 255, 0.5), 0 0 60px rgba(53, 184, 255, 0.25)',
        'card': '0 18px 60px rgba(0, 0, 0, 0.55)',
        'glow-cyan': '0 0 30px rgba(53, 184, 255, 0.22)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(53, 184, 255, 0.3), 0 0 40px rgba(53, 184, 255, 0.15)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(53, 184, 255, 0.5), 0 0 60px rgba(53, 184, 255, 0.25)",
          },
        },
        "whatsapp-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(37, 211, 102, 0.3), 0 0 40px rgba(37, 211, 102, 0.15)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(37, 211, 102, 0.5), 0 0 60px rgba(37, 211, 102, 0.25)",
          },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "glow-pulse": "glow-pulse 2.5s ease-in-out infinite",
        "whatsapp-pulse": "whatsapp-pulse 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
