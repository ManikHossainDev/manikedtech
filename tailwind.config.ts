import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "375px",
      md: "768px",
      lg: "1024px",
      xl: "1336px",
      xxl: "1620px",
      "3xl": "1920px", 
      "4xl": "2560px", 
      "5xl": "3840px", 
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        md: "2rem",
        xl: "3rem",
      },
      screens: {
        sm: "375px",
        md: "768px",
        lg: "1024px",
        xl: "1336px",
        xxl: "1536px",
        "3xl": "1720px",
        "4xl": "1720px",
        "5xl": "1720px",
      },
    },
    extend: {
      colors: {
        primary: "#3FB249",
        secondary: "#E6D031",
        primaryBg: "#EBF6FE",
        hoverText: "#dcbb87",
      },
      boxShadow: {
        top: "0 -4px 10px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};
export default config;
