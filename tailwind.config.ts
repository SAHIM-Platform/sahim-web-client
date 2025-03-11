import type { Config } from "tailwindcss";


export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2688F9",
        secondary: "var(--secondary-color)",
      },
      borderColor: {
        DEFAULT: "var(--border-color)",
      },
      fontFamily: {
        sans: ["var(--font-family-ar)", "sans-serif"]
      },
    },
  },
  plugins: [],
} satisfies Config;
