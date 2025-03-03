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
        secondary: "#0C1823",
      },
      borderColor: {
        DEFAULT: "#D7D7D7",
      },
    },
  },
  plugins: [],
} satisfies Config;
