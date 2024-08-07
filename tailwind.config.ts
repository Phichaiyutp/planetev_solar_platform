import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light",
      {
        mytheme: {
          "primary": "#3880d5", 
          "secondary": "#23b00a",       
          "accent": "#ffffff",       
          "neutral": "#ffffff",      
          "base-100": "#ffffff",    
          "info": "#ffffff",    
          "success": "#1ec4ba",     
          "warning": "#ffffff",      
          "error": "#ffffff",
          
        }
      },
    ],
  },
};
export default config;
