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
        PrimaryColor: "#2688F9",
        BackgroundColor: "#FFFFFF",
        TextColor: "#111111",
        BorderColor: "#D7D7D7",
      },
      fontFamily:{
        fontIbmPlexSansArabic:['var(--font-ibm-plex-sans-arabic)' , 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
